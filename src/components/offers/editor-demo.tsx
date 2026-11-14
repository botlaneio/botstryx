'use client';

import {useState} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {TextInput} from '@astryxdesign/core/TextInput';
import {useToast} from '@astryxdesign/core/Toast';

// The sample firm and its words are botpro's (the Ascend page's example and search result).
const START = {headline: 'Advice for what comes next.', line: 'Accounting, tax and planning for companies on the move.'};

/**
 * A content editor beside the page it edits. Typing changes the draft, which the preview shows at once;
 * Publish makes the draft the live page. Nothing leaves the browser.
 */
export function EditorDemo() {
  const [draft, setDraft] = useState(START);
  const [live, setLive] = useState(START);
  const toast = useToast();
  const changed = draft.headline !== live.headline || draft.line !== live.line;

  const publish = () => {
    setLive(draft);
    toast({body: 'Published. The page is live.', uniqueID: 'editor-demo'});
  };

  return (
    <div className="editor">
      <div className="editor-panel">
        <div className="editor-top">
          <span className="mono">Pages / Home</span>
          <span className="editor-state" data-changed={changed}>{changed ? 'Draft saved' : 'Live'}</span>
        </div>
        <TextInput label="Headline" size="lg" width="100%" value={draft.headline} onChange={(v) => setDraft({...draft, headline: v})} />
        <TextInput label="Introduction" width="100%" value={draft.line} onChange={(v) => setDraft({...draft, line: v})} />
        <div className="editor-actions">
          <Button label="Publish" variant="primary" isDisabled={!changed} onClick={publish} />
          {changed && <Button label="Discard" variant="ghost" onClick={() => setDraft(live)} />}
        </div>
        <p className="editor-note">Try it: change the headline, then publish.</p>
      </div>

      <figure className="editor-preview" aria-label="Preview of the home page">
        <div className="frame-chrome"><i /><i /><i /><span className="mono">northline.example</span></div>
        <div className="np">
          <div className="np-nav"><b>Northline</b><span>Services</span><span>Team</span><span>Insights</span></div>
          {/* The key replays a short highlight whenever the published words change. */}
          <div className="np-hero" key={`${live.headline}|${live.line}`} data-draft={changed}>
            <h3>{(changed ? draft : live).headline || ' '}</h3>
            <p>{(changed ? draft : live).line || ' '}</p>
            <span className="np-btn">Book a call</span>
          </div>
          {changed && <span className="np-flag mono">Draft · only you can see this</span>}
        </div>
      </figure>
    </div>
  );
}
