import type {ContactValues} from '@/lib/contact';

// Lets agentLane fill in the contact form while it talks to a visitor. The form (src/components/contact/
// brief-form.tsx) listens for the event; if it isn't on screen yet, the values wait in this tab's session storage
// and the form picks them up when it mounts. Lane never sends the form: the visitor checks it and presses Send.
export const BRIEF_FILL = 'brief:fill';
const PENDING = 'botstryx:brief-fill';

export type BriefFill = Partial<ContactValues>;

export function fillBrief(values: BriefFill) {
  try { sessionStorage.setItem(PENDING, JSON.stringify(values)); } catch {}
  window.dispatchEvent(new CustomEvent(BRIEF_FILL, {detail: values}));
}

/** Values Lane left for the form, if any, taken once. */
export function takePendingFill(): BriefFill | null {
  try {
    const raw = sessionStorage.getItem(PENDING);
    sessionStorage.removeItem(PENDING);
    return raw ? (JSON.parse(raw) as BriefFill) : null;
  } catch {
    return null;
  }
}

/** Forget a fill once the form has applied it, so a later visit doesn't apply it again. */
export function clearPendingFill() {
  try { sessionStorage.removeItem(PENDING); } catch {}
}
