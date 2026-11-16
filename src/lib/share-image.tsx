import {ImageResponse} from 'next/og';

/**
 * A share card drawn at build time (these routes are statically generated). OpenNext serves the PNG;
 * the Worker does not run Satori on the request.
 */
export function shareImage(title: string, eyebrow: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0b0c0e',
          color: '#f2f3f5',
          padding: '72px 80px 64px 92px',
        }}
      >
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div style={{width: 22, height: 22, backgroundColor: '#2f55f0', marginRight: 16}} />
          <div style={{fontSize: 28, letterSpacing: 1.4, color: '#c5c8ce'}}>{eyebrow}</div>
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: title.length > 52 ? 56 : 68,
            fontWeight: 600,
            letterSpacing: -1.6,
            lineHeight: 1.08,
            maxWidth: 980,
          }}
        >
          {title}
        </div>
        <div style={{display: 'flex', fontSize: 24, color: '#9aa0a8'}}>botlane.io</div>
      </div>
    ),
    {width: 1200, height: 630},
  );
}
