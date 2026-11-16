// The site's public address: canonical links, social previews, robots.txt and the sitemap all build on it.
export const SITE_URL = 'https://botlane.io';

export const SITE_NAME = 'botLane';

export const SITE_TITLE = 'botLane · Custom websites and web apps, built properly';

export const SITE_DESCRIPTION = 'Design that looks right. Engineering that stays right. Custom design and engineering, from first idea to life after launch.';

/** Share-card size. Social networks expect 1200×630. */
export const SHARE_IMAGE = {width: 1200, height: 630, alt: SITE_TITLE} as const;

// Who runs the site, for the privacy policy and the terms (botpro src/lib/site.ts). One Wyoming LLC trades as botLane.
export const COMPANY = 'BotLane LLC';
export const COMPANY_FORM = 'a limited liability company registered in Wyoming, USA';
export const CONTACT_EMAIL = 'admin@botlane.io';
