type Props = {
  /** Whether the menu it controls is open: three bars when closed, a cross when open. */
  isOpen: boolean;
  onClick: () => void;
  /** What the button does, for screen readers: "Open menu" or "Close menu". */
  label: string;
  /** The id of the menu it opens, when that menu is in the page. */
  controls?: string;
  className?: string;
};

/**
 * A menu button that turns from three bars into a cross and back. Opening, the outer bars close in on the
 * middle one and then turn; closing, they turn back first and then part. The motion is all in CSS (.burger).
 */
export function Hamburger({isOpen, onClick, label, controls, className}: Props) {
  return (
    <button
      type="button"
      className={className ? `burger ${className}` : 'burger'}
      aria-label={label}
      aria-expanded={isOpen}
      aria-controls={controls}
      onClick={onClick}
    >
      <i />
      <i />
      <i />
    </button>
  );
}
