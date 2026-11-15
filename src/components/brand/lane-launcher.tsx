'use client';

import {Fragment, useEffect, useRef, useState} from 'react';
import Link from 'next/link';

import {ArrowUp} from '@/components/icons';
import {LANE_GREETING, LANE_LIMITS, LANE_STARTERS} from '@/lib/lane';
import {LANE_OPEN} from '@/lib/lane-open';
import {ConversationProvider} from '@elevenlabs/react';

import {LaneVoice} from './lane-voice';

import {BotMark} from './bot-mark';

type Turn = {role: 'user' | 'assistant'; content: string; error?: boolean};

const STORE = 'lane-chat';

/** Turns /paths in Lane's replies into links, and keeps line breaks. */
function Rich({text}: {text: string}) {
  return text.split('\n').map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {/* A path stands on its own: not the "/7" in "24/7", the "/or" in "and/or" or the path of a full URL. */}
      {line.split(/((?<![\w:/.])\/[a-z][a-z0-9\-/]*(?:\?[a-z0-9=&\-]+)?)/gi).map((part, j) =>
        j % 2 ? <Link key={j} href={part}>{part}</Link> : part,
      )}
    </Fragment>
  ));
}

/**
 * Lane, in the bottom corner: a button that opens a chat with agentLane. Lane leans in from the corner of a
 * paper-coloured disc, tilts its head and blinks; pointing at it shows its name. The conversation lasts for the
 * visit (kept in this tab's session storage) and streams from /api/lane.
 */
export function LaneLauncher() {
  const [open, setOpen] = useState(false);
  // Pick the conversation back up after a page change or reload in the same tab. The turns only render once the
  // chat is open, so reading storage here can't make the server and browser markup differ.
  const [turns, setTurns] = useState<Turn[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORE) ?? '[]');
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });
  const [draft, setDraft] = useState('');
  // Type to Lane (Gemini, through /api/lane) or talk to it (the ElevenLabs voice agent, in lane-voice.tsx).
  const [mode, setMode] = useState<'type' | 'talk'>('type');
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLTextAreaElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    try { sessionStorage.setItem(STORE, JSON.stringify(turns.filter((t) => !t.error))); } catch {}
  }, [turns]);

  // Newest message in view, focus in the box on open, Escape to close.
  useEffect(() => { log.current?.scrollTo({top: log.current.scrollHeight}); }, [turns, open]);
  useEffect(() => {
    if (!open) return;
    if (mode === 'type') input.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); launcher.current?.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, mode]);
  useEffect(() => () => abort.current?.abort(), []);

  async function send(text: string) {
    const content = text.trim().slice(0, LANE_LIMITS.chars);
    if (!content || busy) return;
    // The server takes strictly alternating turns. Failed or empty replies are left out, and of two visitor messages
    // in a row (the first never answered) only the later is kept.
    const history: Turn[] = [];
    for (const t of [...turns, {role: 'user' as const, content}]) {
      if (t.error || !t.content.trim()) continue;
      if (history.at(-1)?.role === t.role) history.pop();
      history.push({role: t.role, content: t.content.slice(0, LANE_LIMITS.chars * (t.role === 'assistant' ? 4 : 1))});
    }
    history.splice(0, Math.max(0, history.length - LANE_LIMITS.messages));
    // The conversation sent must start with the visitor.
    while (history.length && history[0].role !== 'user') history.shift();
    setTurns([...history, {role: 'assistant', content: ''}]);
    setDraft('');
    setBusy(true);
    const ctrl = new AbortController();
    abort.current = ctrl;
    const reply = (content: string, error = false) =>
      setTurns((all) => [...all.slice(0, -1), {role: 'assistant', content, error}]);

    try {
      const res = await fetch('/api/lane', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({messages: history.map(({role, content}) => ({role, content}))}),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) {
        const {error} = (await res.json().catch(() => ({}))) as {error?: string};
        reply(error || 'Lane is offline right now. Send us a brief at /contact and we’ll reply ourselves.', true);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = '';
      for (;;) {
        const {done, value} = await reader.read();
        if (done) break;
        text += decoder.decode(value, {stream: true});
        // A marked line means the reply failed partway: show the message instead.
        const cut = text.indexOf('\u0000');
        if (cut >= 0) { reply(text.slice(cut + 1), true); return; }
        reply(text);
      }
      if (!text.trim()) reply('Sorry, I lost my train of thought. Try asking again.', true);
    } catch (e) {
      if ((e as Error).name !== 'AbortError') reply('Couldn’t reach Lane. Check your connection and try again.', true);
    } finally {
      setBusy(false);
      abort.current = null;
    }
  }

  // Other parts of the page can open the chat, and ask a question with it (src/lib/lane-open.ts).
  const sendLatest = useRef(send);
  useEffect(() => { sendLatest.current = send; });
  useEffect(() => {
    const onOpen = (e: Event) => {
      setOpen(true);
      setMode('type');
      const ask = (e as CustomEvent<{ask?: string}>).detail?.ask;
      if (ask) sendLatest.current(ask);
    };
    window.addEventListener(LANE_OPEN, onOpen);
    return () => window.removeEventListener(LANE_OPEN, onOpen);
  }, []);

  const empty = turns.length === 0;

  return (
    <ConversationProvider>
      {open && (
        <section className="lane-chat" role="dialog" aria-modal="false" aria-labelledby="lane-chat-title">
          <header className="lane-chat-head">
            <BotMark size={30} mood={busy ? 'thinking' : 'idle'} />
            <div>
              <h2 id="lane-chat-title">agentLane</h2>
              <p>{busy ? 'Typing…' : 'Answers about botLane, day and night'}</p>
            </div>
            <div className="lane-mode" role="radiogroup" aria-label="Type or talk to Lane">
              <button type="button" role="radio" aria-checked={mode === 'type'} onClick={() => setMode('type')}>Type</button>
              <button type="button" role="radio" aria-checked={mode === 'talk'} onClick={() => setMode('talk')}>Talk</button>
            </div>
            {!empty && mode === 'type' && (
              <button type="button" className="lane-chat-new" onClick={() => { abort.current?.abort(); setTurns([]); input.current?.focus(); }}>
                New chat
              </button>
            )}
            <button type="button" className="lane-chat-x" aria-label="Close chat" onClick={() => { setOpen(false); launcher.current?.focus(); }}>
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
          </header>

          {mode === 'talk' ? <LaneVoice /> : (<>
          <div className="lane-chat-log" ref={log} aria-live="polite">
            <p className="lane-msg bot">{LANE_GREETING}</p>
            {empty && (
              <div className="lane-starters">
                {LANE_STARTERS.map((q) => <button key={q} type="button" onClick={() => send(q)}>{q}</button>)}
              </div>
            )}
            {turns.map((t, i) => (
              <p key={i} className={`lane-msg ${t.role === 'user' ? 'me' : 'bot'}`} data-error={t.error || undefined}>
                {t.content ? <Rich text={t.content} /> : <span className="lane-typing" aria-label="Lane is typing"><i /><i /><i /></span>}
              </p>
            ))}
          </div>

          <form className="lane-chat-box" onSubmit={(e) => { e.preventDefault(); send(draft); }}>
            <textarea
              ref={input}
              rows={1}
              value={draft}
              maxLength={LANE_LIMITS.chars}
              placeholder="Ask Lane anything about your project"
              aria-label="Message agentLane"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(draft); }
              }}
            />
            <button type="submit" aria-label="Send" disabled={!draft.trim() || busy}><ArrowUp size={16} /></button>
          </form>
          </>)}
          <p className="lane-chat-note">Lane is an AI assistant and can make mistakes. For a quote, <Link href="/contact">send a brief</Link>.</p>
        </section>
      )}

      <button
        ref={launcher}
        type="button"
        className="lane"
        data-open={open}
        aria-label={open ? 'Close chat with Lane' : 'Ask Lane'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="lane-say" aria-hidden>Ask Lane</span>
        <span className="lane-disc">
          <svg viewBox="0 0 64 64" aria-hidden>
            <g className="lane-lean">
              <g className="lane-bot">
                <rect className="lane-head" x="12" y="16" width="46" height="36" rx="11" />
                <rect className="lane-eye" x="21" y="29" width="8" height="8" rx="2" />
                <rect className="lane-eye blue" x="33" y="29" width="8" height="8" rx="2" />
              </g>
            </g>
          </svg>
        </span>
      </button>
    </ConversationProvider>
  );
}
