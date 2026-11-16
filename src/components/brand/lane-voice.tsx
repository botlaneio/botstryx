'use client';

import {useEffect, useRef, useState} from 'react';
import {usePathname, useRouter} from 'next/navigation';
import {useConversation} from '@elevenlabs/react';

import {fillBrief} from '@/lib/brief-fill';
import {isNeed} from '@/lib/contact';

// Talking to Lane: a voice call with the ElevenLabs agent botpro used ("Lane – botlane.io guide (orb)"), in its
// custom voice. The agent is public but only accepts calls from botlane.io and www.botlane.io (its allowlist in
// ElevenLabs), so voice works on the live site and not on localhost or workers.dev.
//
// Its client tools run here in the browser:
//   show_section     scrolls the homepage to a section and lights it up for a moment
//   open_page        goes to another page while the call carries on (Lane lives in the root layout, so it stays)
//   fill_brief       fills in the contact form from the conversation; the visitor checks it and sends it
//   find_call_times  open intro-call times from the studio's calendar, said in the visitor's own time zone
//   book_intro_call  books a time the visitor has confirmed, with a Meet link and an emailed invite
export const LANE_AGENT_ID = 'agent_7301m6k3hy5bfrmbtnbnr8q64760';

// The visitor's own time zone, for saying call times the way they'd read them.
const zone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
const say = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', {timeZone: zone(), weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit', hour12: true});

async function api<T>(path: string, init?: RequestInit): Promise<T & {error?: string}> {
  const res = await fetch(path, init);
  return (await res.json().catch(() => ({error: 'No answer from the server.'}))) as T & {error?: string};
}

// The agent's section names, and where each one is on this homepage.
const SECTIONS: Record<string, string> = {
  top: '',
  brief: 'hm-brief',
  build: 'hm-build',
  stack: 'hm-tools',
  products: 'hm-products',
  process: 'hm-process',
  start: 'hm-close',
};

// Pages the agent knows from botpro that this site doesn't have yet go to the nearest page that does exist.
const PAGE_FALLBACK: Record<string, string> = {
  '/custom-solutions/workflow-automation': '/custom-solutions',
  '/custom-solutions/document-processing': '/custom-solutions',
  '/products/syncc': '/products/slotlane',
  '/products/scriblane': '/products/slotlane',
  '/products/flowlane': '/products/slotlane',
};

type Line = {id: number; who: 'me' | 'lane'; text: string};

/** Waits for an element to exist (after a page change), then scrolls to its section and lights it up. */
async function reveal(id: string) {
  if (!id) {
    window.scrollTo({top: 0, behavior: 'smooth'});
    return true;
  }
  for (let i = 0; i < 30; i++) {
    const el = document.getElementById(id);
    if (el) {
      const target = el.closest('section') ?? el;
      target.scrollIntoView({behavior: 'smooth', block: id === 'hm-brief' ? 'center' : 'start'});
      target.classList.add('lane-spot');
      setTimeout(() => target.classList.remove('lane-spot'), 2600);
      return true;
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  return false;
}

/** The voice side of Lane's panel: start a call, see who's speaking, read along, mute or hang up. */
export function LaneVoice() {
  const router = useRouter();
  const pathname = usePathname();
  const here = useRef(pathname);
  useEffect(() => { here.current = pathname; }, [pathname]);

  const [lines, setLines] = useState<Line[]>([]);
  const [problem, setProblem] = useState('');
  const orb = useRef<HTMLDivElement>(null);
  const log = useRef<HTMLDivElement>(null);

  const conversation = useConversation({
    clientTools: {
      show_section: async ({section}: {section?: string}) => {
        const id = SECTIONS[String(section)];
        if (id === undefined) return `There is no "${section}" section.`;
        if (here.current !== '/') router.push('/');
        return (await reveal(id)) ? `Showing the ${section} section.` : 'That section could not be found on the page.';
      },
      open_page: async ({page}: {page?: string}) => {
        const asked = String(page || '/');
        const to = PAGE_FALLBACK[asked] ?? asked;
        router.push(to);
        return to === asked ? `Opened ${to}.` : `That page isn't on the site yet, so I opened ${to} instead.`;
      },
      fill_brief: async (p: {brief?: string; need?: string; name?: string; email?: string; company?: string}) => {
        const values = {
          brief: p.brief ?? '', name: p.name ?? '', email: p.email ?? '', company: p.company ?? '',
          need: p.need && isNeed(p.need) ? p.need : '',
        };
        if (here.current !== '/contact') router.push('/contact');
        fillBrief(values);
        const filled = Object.entries(values).filter(([, v]) => v).map(([k]) => k);
        return `The brief form is filled in (${filled.join(', ') || 'nothing yet'}). Ask them to check it and press Send brief. You can't send it for them.`;
      },
      find_call_times: async ({day}: {day?: string}) => {
        const q = day && /^\d{4}-\d{2}-\d{2}$/.test(day) ? `?day=${day}` : '';
        const r = await api<{slots: string[]; minutes: number}>(`/api/lane/slots${q}`);
        if (r.error) return r.error;
        if (!r.slots.length) return day ? 'No open times that day. Offer to look at other days.' : 'No open times in the next two weeks. Suggest sending a brief instead.';
        // Times in the visitor's waking hours (7:00-21:00 their time) first; the rest after, in case they ask.
        const hour = (iso: string) => Number(new Date(iso).toLocaleString('en-GB', {timeZone: zone(), hour: '2-digit', hour12: false}));
        const awake = r.slots.filter((iso) => hour(iso) >= 7 && hour(iso) < 21);
        const late = r.slots.filter((iso) => !awake.includes(iso));
        const list = (xs: string[]) => xs.map((iso) => `${say(iso)} (start: ${iso})`).join('\n');
        return `Open ${r.minutes}-minute intro calls, in the visitor's time zone (${zone()}). Offer two or three from the first list, then book the one they pick by passing its start value exactly.\n` +
          (awake.length ? `Good times for them:\n${list(awake)}` : 'None fall in their usual waking hours; check whether early or late suits them.') +
          (late.length ? `\nOutside their usual hours (only if they ask):\n${list(late)}` : '');
      },
      book_intro_call: async (p: {start?: string; name?: string; email?: string; note?: string}) => {
        const r = await api<{booked: string; meet: string | null}>('/api/lane/book', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(p),
        });
        if (r.error) return r.error;
        return `Booked for ${say(r.booked)} their time. Google is emailing the invite to ${p.email}${r.meet ? `, with the Meet link ${r.meet}` : ''}.`;
      },
    },
    onMessage: ({message, role}) => {
      if (!message.trim()) return;
      setLines((all) => [...all, {id: all.length + 1, who: role === 'user' ? 'me' : 'lane', text: message}]);
    },
    onError: (message) => setProblem(typeof message === 'string' ? message : 'The call dropped.'),
  });
  const {status, isSpeaking, isMuted, setMuted, startSession, endSession, getInputVolume, getOutputVolume} = conversation;
  const live = status === 'connected';

  // The orb breathes with whoever is talking.
  useEffect(() => {
    if (!live) return;
    let raf = 0;
    const tick = () => {
      const level = Math.min(1, (isSpeaking ? getOutputVolume() : getInputVolume()) * 2.2);
      orb.current?.style.setProperty('--level', level.toFixed(3));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [live, isSpeaking, getInputVolume, getOutputVolume]);

  useEffect(() => { log.current?.scrollTo({top: log.current.scrollHeight, behavior: 'smooth'}); }, [lines]);

  // Hang up when the panel closes or the visitor switches back to typing.
  const end = useRef(endSession);
  useEffect(() => { end.current = endSession; });
  useEffect(() => () => end.current(), []);

  async function start() {
    setProblem('');
    setLines([]);
    if (!/(^|\.)botlane\.io$/.test(location.hostname)) {
      setProblem('Voice calls work on botlane.io. Here you can still type to Lane.');
      return;
    }
    // Ask for the microphone first, so a refusal gets a plain answer; the call opens its own stream.
    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio: true});
      stream.getTracks().forEach((t) => t.stop());
    } catch {
      setProblem('Lane needs your microphone to talk. Allow it in your browser, then try again.');
      return;
    }
    startSession({agentId: LANE_AGENT_ID, connectionType: 'webrtc'});
  }

  const state = status === 'connecting' ? 'Connecting…' : live ? (isSpeaking ? 'Lane is speaking' : isMuted ? 'You’re muted' : 'Listening…') : 'Talk to Lane';

  return (
    <div className="lane-voice" data-status={status} data-speaking={isSpeaking || undefined}>
      <div className="lane-voice-stage">
        <div ref={orb} className="lane-orb" aria-hidden><i /><i /><i /></div>
        <p className="lane-voice-state" aria-live="polite">{state}</p>
        {!live && status !== 'connecting' && (
          <p className="lane-voice-hint">Ask about websites, web apps, prices or how a project runs. Lane can show you around the site while you talk.</p>
        )}
      </div>

      {lines.length > 0 && (
        <div className="lane-voice-log" ref={log} aria-label="Transcript">
          {lines.map((l) => <p key={l.id} className={`lane-msg ${l.who === 'me' ? 'me' : 'bot'}`}>{l.text}</p>)}
        </div>
      )}

      {problem && <p className="lane-voice-problem" role="alert">{problem}</p>}

      <div className="lane-voice-bar">
        {live || status === 'connecting' ? (
          <>
            <button type="button" className="lane-voice-mute" aria-pressed={isMuted} onClick={() => setMuted(!isMuted)} disabled={!live}>
              {isMuted ? 'Unmute' : 'Mute'}
            </button>
            <button type="button" className="lane-voice-end" onClick={() => endSession()}>End call</button>
          </>
        ) : (
          <button type="button" className="lane-voice-start" onClick={start}>
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden><rect x="5.5" y="1.5" width="5" height="8.5" rx="2.5" /><path d="M3 8a5 5 0 0 0 10 0M8 13v2" /></svg>
            {lines.length ? 'Talk again' : 'Start talking'}
          </button>
        )}
      </div>
    </div>
  );
}
