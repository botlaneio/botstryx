type P = {size?: number; className?: string};

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
});

export const ArrowRight = ({size = 16, className}: P) => (
  <svg {...base(size)} className={className}><path d="M3 8h10M9 4l4 4-4 4" /></svg>
);

export const ArrowUp = ({size = 16, className}: P) => (
  <svg {...base(size)} className={className}><path d="M8 13V3M4 7l4-4 4 4" /></svg>
);

export const ArrowUpRight = ({size = 16, className}: P) => (
  <svg {...base(size)} className={className}><path d="M4.5 11.5l7-7M5.5 4.5h6v6" /></svg>
);

export const Sun = ({size = 16, className}: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="8" cy="8" r="2.75" />
    <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.05 1.05M11.55 11.55l1.05 1.05M3.4 12.6l1.05-1.05M11.55 4.45l1.05-1.05" />
  </svg>
);

export const Moon = ({size = 16, className}: P) => (
  <svg {...base(size)} className={className}><path d="M13.5 9.2A5.6 5.6 0 0 1 6.8 2.5a5.6 5.6 0 1 0 6.7 6.7Z" /></svg>
);

export const ChevronDown = ({size = 16, className}: P) => (
  <svg {...base(size)} className={className}><path d="M4 6l4 4 4-4" /></svg>
);

export const Mail = ({size = 16, className}: P) => (
  <svg {...base(size)} className={className}><rect x="1.75" y="3.25" width="12.5" height="9.5" rx="1.5" /><path d="M2.25 4.5L8 8.75l5.75-4.25" /></svg>
);

// Sign-in provider marks, drawn in each provider's own colours (GitHub's follows the text colour).
const mark = (size: number) => ({width: size, height: size, 'aria-hidden': true});

export const GoogleMark = ({size = 16, className}: P) => (
  <svg {...mark(size)} viewBox="0 0 48 48" className={className}>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

export const GitHubMark = ({size = 16, className}: P) => (
  <svg {...mark(size)} viewBox="0 0 16 16" fill="currentColor" className={className}>
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

export const MicrosoftMark = ({size = 16, className}: P) => (
  <svg {...mark(size)} viewBox="0 0 16 16" className={className}>
    <path fill="#F25022" d="M1 1h6.5v6.5H1z" />
    <path fill="#7FBA00" d="M8.5 1H15v6.5H8.5z" />
    <path fill="#00A4EF" d="M1 8.5h6.5V15H1z" />
    <path fill="#FFB900" d="M8.5 8.5H15V15H8.5z" />
  </svg>
);

export const ArrowDown = ({size = 16, className}: P) => (
  <svg {...base(size)} className={className}><path d="M8 3v10M4 9l4 4 4-4" /></svg>
);

export const Check = ({size = 16, className}: P) => (
  <svg {...base(size)} className={className}><path d="M3.5 8.5l3 3 6-7" /></svg>
);
