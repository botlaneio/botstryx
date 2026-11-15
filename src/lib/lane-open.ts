// Opens agentLane's chat from anywhere on the page, optionally asking it something straight away. The launcher
// (src/components/brand/lane-launcher.tsx) listens for this event.
export const LANE_OPEN = 'lane:open';

export function openLane(ask?: string) {
  window.dispatchEvent(new CustomEvent(LANE_OPEN, {detail: {ask}}));
}
