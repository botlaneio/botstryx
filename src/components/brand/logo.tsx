import {BotMark} from './bot-mark';

/**
 * The botLane logo: the bot mark beside the name. The mark is the animated bot (see bot-mark.tsx): it blinks
 * and glances by itself, and winks when the link around it is hovered. Pass animated={false} for a still one.
 */
export function Logo({size = 28, animated = true}: {size?: number; animated?: boolean}) {
  return (
    <span className="logo" style={{fontSize: Math.round(size * 0.82)}}>
      <BotMark size={Math.round(size * 1.12)} animated={animated} />
      <span>botLane</span>
    </span>
  );
}
