/**
 * slotLane documentation, as typed data. No MDX pipeline: the page renders this.
 *
 * Adapted from botlaneio/botlane-docs `content/docs/syncc/` (the product's old name, Syncc,
 * is written slotLane here). Order follows that folder's meta.json files.
 * botpro wins where they differ: `src/lib/lanes.ts` (name, status, host, tagline) and
 * `src/lib/products.ts` (features and prices). Sentences the docs repo marks with
 * TODO(confirm) or a <Todo> block are left out, not rewritten as fact.
 */

/** A string is prose. An object is an in-page link. */
export type Inline = string | {text: string; href: string};

export type DocsBlock =
  | {type: 'p'; text: Inline[]}
  | {type: 'ul'; items: Inline[][]}
  | {type: 'ol'; items: Inline[][]}
  | {type: 'h3'; id: string; title: string; toc?: string}
  | {type: 'label'; text: string}
  | {type: 'steps'; items: {id: string; title: string; text: Inline[]}[]}
  | {type: 'rows'; rows: {term: string; detail: string}[]}
  | {type: 'faq'; items: {q: string; a: Inline[]}[]};

export type DocsSection = {
  id: string;
  title: string;
  blocks: DocsBlock[];
};

export type TocItem = {id: string; title: string; children?: {id: string; title: string}[]};

/** botpro src/lib/lanes.ts: name slotLane, status soon, host slotlane.cloud, tagline. */
export const DOCS_INTRO = {
  kicker: 'Documentation',
  title: 'slotLane',
  badge: 'Coming soon',
  tagline: 'Share one link. People pick a time, and it lands in your calendar.',
  status: 'slotLane is not launched yet. Its address is slotlane.cloud.',
} as const;

const seeAlso = (links: {text: string; href: string}[]): Inline[] => {
  const text: Inline[] = ['See also: '];
  links.forEach((link, i) => {
    if (i > 0) text.push(i === links.length - 1 ? ' and ' : ', ');
    text.push(link);
  });
  text.push('.');
  return text;
};

/**
 * content/docs/syncc/overview.mdx
 * Status, host and the opening line: botpro src/lib/lanes.ts.
 * Feature lines and the price sentence: botpro src/lib/products.ts (PRODUCT_PAGES.slotlane).
 * Yearly and month-to-month figures: botpro src/lib/products.ts compare rows.
 */
const overview: DocsSection = {
  id: 'overview',
  title: 'Overview',
  blocks: [
    {
      type: 'p',
      text: [
        'slotLane is scheduling software, and it is not launched yet. You share one link. Your guest picks a time that suits them. The booking lands in your Google Calendar with a Meet or Zoom link.',
      ],
    },
    {
      type: 'p',
      text: [
        'It is built for one owner: one admin account and one set of availability. Teams and round-robin are not supported yet.',
      ],
    },
    {type: 'label', text: 'What you get'},
    {
      type: 'ul',
      items: [
        ['Your booking page on your own domain, for example book.yourcompany.com, with your brand name and colour, and no vendor branding on any plan.'],
        ['Google Calendar sync, with Meet or Zoom links made for every booking. slotLane checks busy times across the calendars you choose, writes each booking, and updates or removes it when plans change.'],
        ['Email confirmations, with a calendar invite (.ics) that opens in Google, Outlook and Apple Calendar. Guests reschedule or cancel from a signed link. They do not need an account.'],
        ['Double booking is impossible, even when two people click at once. The final check runs inside a database transaction with a unique index. The second person sees a friendly "just taken" message.'],
        ['Paid bookings by UPI, card or netbanking through Razorpay.'],
        ['WhatsApp confirmations and reminders.'],
        ['Move over from Calendly in one import: event types and weekly hours.'],
        ['Unlimited event types and bookings on every plan.'],
      ],
    },
    {type: 'label', text: 'Price'},
    {
      type: 'p',
      text: ['One flat price per booking page, never per seat. Billed yearly, $7 a month. Month to month, $9 a month.'],
    },
    {type: 'label', text: 'Two ways to run it'},
    {
      type: 'p',
      text: [
        'Cloud is hosted for you. Self-host runs on your server as one small app with one SQLite file. One command makes a consistent backup. Both include the same features.',
      ],
    },
  ],
};

/**
 * content/docs/syncc/quickstart.mdx
 */
const quickstart: DocsSection = {
  id: 'quickstart',
  title: 'Quickstart',
  blocks: [
    {
      type: 'p',
      text: ['A working booking page your guests can book you on, in about 10 minutes. These are the steps once slotLane is open.'],
    },
    {
      type: 'p',
      text: ['You need a Google account with the calendar bookings should be written to, and a slotLane account on Cloud, or a running Self-host installation.'],
    },
    {
      type: 'steps',
      items: [
        {
          id: 'create-your-account',
          title: 'Create your account',
          text: ['Sign up for slotLane Cloud, or install slotLane on your own server (Self-host).'],
        },
        {
          id: 'connect-calendar',
          title: 'Connect Google Calendar',
          text: ['Connect your Google account, pick the calendars slotLane checks for busy times, and pick the one it writes bookings to. Calendar tokens are stored encrypted (AES-256-GCM).'],
        },
        {
          id: 'set-your-availability',
          title: 'Set your availability',
          text: ['Set your weekly hours. Several ranges per day are fine. Add a buffer between meetings, a minimum notice, and how far ahead guests can book.'],
        },
        {
          id: 'create-an-event-type',
          title: 'Create an event type',
          text: ['Give it a name, a length and a location. Pick Google Meet or Zoom and the meeting link is created for every booking.'],
        },
        {
          id: 'share-your-link',
          title: 'Share your link',
          text: [
            'Your booking page is live. Send the link to a guest, or point your own domain at it. On Cloud, custom domains are handled for you. On Self-host, the included Caddy setup fetches and renews the HTTPS certificate. See ',
            {text: 'Custom domain', href: '#custom-domain'},
            '.',
          ],
        },
      ],
    },
    {type: 'label', text: 'Check it worked'},
    {
      type: 'p',
      text: ['Open your booking page in a private window and book yourself. You should get an email with a calendar invite. The event should appear in your Google Calendar with the Meet or Zoom link. The booking should show in your slotLane dashboard.'],
    },
    {
      type: 'p',
      text: seeAlso([
        {text: 'Booking page', href: '#booking-page'},
        {text: 'Google Calendar', href: '#google-calendar'},
        {text: 'Limits', href: '#limits'},
      ]),
    },
  ],
};

/**
 * content/docs/syncc/guides/meta.json order:
 * booking-page, custom-domain, google-calendar, payments-razorpay,
 * whatsapp-notifications, import-from-calendly, embedding.
 * Payments, WhatsApp and Calendly import keep botpro's feature lines.
 * Their guides are drafts whose steps sit inside unconfirmed callouts and Todo blocks, so the steps are omitted.
 * embedding.mdx is only a Todo, so no embed steps are included.
 */
const guides: DocsSection = {
  id: 'guides',
  title: 'Guides',
  blocks: [
    {type: 'p', text: ['The booking page, the domain, the calendar, and the pieces around them.']},

    // content/docs/syncc/guides/booking-page.mdx
    {type: 'h3', id: 'booking-page', title: 'Booking page'},
    {
      type: 'p',
      text: ['Your booking page shows guests only the times you are actually free, after your buffers, notice and Google Calendar busy times.'],
    },
    {type: 'label', text: 'Before you start'},
    {
      type: 'ul',
      items: [
        [{text: 'Google Calendar connected', href: '#google-calendar'}, '.'],
        ['A rough idea of your weekly rhythm: when you take meetings, and when you never do.'],
      ],
    },
    {type: 'label', text: 'Settings'},
    {
      type: 'rows',
      rows: [
        {term: 'Weekly hours', detail: 'The recurring times you can be booked, per day. Several ranges per day are supported, for example 09:00–12:00 and 14:00–17:00.'},
        {term: 'Slot length', detail: 'The size of the bookable steps guests see.'},
        {term: 'Buffer', detail: 'Protected time before and after each booking, so meetings do not run into each other.'},
        {term: 'Minimum notice', detail: 'How far ahead a guest must book. No surprise meetings in an hour.'},
        {term: 'Booking window', detail: 'How far into the future guests can book.'},
      ],
    },
    {type: 'label', text: 'Event types'},
    {
      type: 'p',
      text: ['Create as many event types as you need: intro calls, demos, strategy sessions. Each has its own link, length, description and location. Google Meet or Zoom, with the link created for you.'],
    },
    {type: 'label', text: 'Common mistakes'},
    {
      type: 'ul',
      items: [
        ['Forgetting the buffer. Back-to-back bookings with no gap is the top regret. Start with 10–15 minutes.'],
        ['A booking window that is too short. If guests regularly book two or three weeks out, give them room.'],
        ['Checking the wrong calendars. If you keep personal appointments on a second calendar, include it in the busy check, or those times will look free.'],
      ],
    },
    {
      type: 'p',
      text: seeAlso([
        {text: 'Google Calendar', href: '#google-calendar'},
        {text: 'Time zones', href: '#time-zones'},
        {text: 'Custom domain', href: '#custom-domain'},
      ]),
    },

    // content/docs/syncc/guides/custom-domain.mdx
    {type: 'h3', id: 'custom-domain', title: 'Custom domain'},
    {
      type: 'p',
      text: ['Your booking page can live on your own domain, for example book.yourcompany.com, on both Cloud and Self-host, with no vendor branding.'],
    },
    {type: 'label', text: 'How it works per plan'},
    {
      type: 'ul',
      items: [
        ['Cloud: the custom-domain setup is done for you. You point the domain. The certificate and hosting are handled.'],
        ['Self-host: the included Caddy setup fetches and renews the HTTPS certificate once your DNS points at your server.'],
      ],
    },
    {type: 'label', text: 'Steps'},
    {
      type: 'ol',
      items: [
        ['Decide the hostname, for example book.yourcompany.com.'],
        ['Add the DNS record at your DNS provider.'],
        ['Set the domain in slotLane and wait for the certificate.'],
        ['Open the domain and book a test slot.'],
      ],
    },
    {type: 'label', text: 'Common mistakes'},
    {
      type: 'ul',
      items: [
        ['Testing too early. DNS can take a while. A failing certificate fetch usually just needs time.'],
      ],
    },
    {
      type: 'p',
      text: seeAlso([
        {text: 'Quickstart', href: '#quickstart'},
        {text: 'Troubleshooting', href: '#troubleshooting'},
      ]),
    },

    // content/docs/syncc/guides/google-calendar.mdx
    {type: 'h3', id: 'google-calendar', title: 'Google Calendar'},
    {
      type: 'p',
      text: ['Google Calendar is the calendar slotLane syncs with. The connection checks your busy times, writes each booking, and updates or removes the event when plans change.'],
    },
    {type: 'label', text: 'Before you start'},
    {
      type: 'ul',
      items: [
        ['The Google account that owns the calendar you take meetings on.'],
        ['If you use Zoom, your Zoom account details for that integration.'],
      ],
    },
    {type: 'label', text: 'Steps'},
    {
      type: 'ol',
      items: [
        ['Connect your Google account and grant the permissions slotLane asks for.'],
        ['Choose the calendars slotLane checks for busy times. Include every calendar that can make you unavailable.'],
        ['Choose the calendar slotLane writes bookings to.'],
        ['On each event type, pick Google Meet or Zoom. The meeting link is created for each booking.'],
      ],
    },
    {type: 'label', text: 'Good to know'},
    {
      type: 'ul',
      items: [
        ['Calendar tokens are stored encrypted (AES-256-GCM).'],
        ['Disconnecting a calendar stops sync. Existing bookings stay on the books.'],
      ],
    },
    {type: 'label', text: 'Common mistakes'},
    {
      type: 'ul',
      items: [
        ['Not checking a second calendar. Personal appointments block your time only if that calendar is in the busy check.'],
        ['Writing to a shared calendar you do not control. Bookings are updated and removed as plans change. Pick a calendar you own.'],
      ],
    },
    {
      type: 'p',
      text: seeAlso([
        {text: 'Booking page', href: '#booking-page'},
        {text: 'Double booking', href: '#double-booking'},
      ]),
    },

    // content/docs/syncc/guides/payments-razorpay.mdx
    // Feature line: botpro src/lib/products.ts. Setup steps in that guide are unconfirmed and omitted.
    {type: 'h3', id: 'payments', title: 'Payments with Razorpay', toc: 'Payments'},
    {type: 'p', text: ['Paid bookings by UPI, card or netbanking through Razorpay.']},

    // content/docs/syncc/guides/whatsapp-notifications.mdx
    // Feature line: botpro src/lib/products.ts. Setup steps in that guide are unconfirmed and omitted.
    {type: 'h3', id: 'whatsapp', title: 'WhatsApp notifications', toc: 'WhatsApp'},
    {type: 'p', text: ['WhatsApp confirmations and reminders.']},

    // content/docs/syncc/guides/import-from-calendly.mdx
    // Feature line: botpro src/lib/products.ts. Setup steps in that guide are unconfirmed and omitted.
    {type: 'h3', id: 'import-from-calendly', title: 'Importing from Calendly', toc: 'Calendly import'},
    {type: 'p', text: ['Move over from Calendly in one import: event types and weekly hours.']},

    // content/docs/syncc/guides/embedding.mdx
    // The source page is a single Todo. No embed method is stated here.
    {type: 'h3', id: 'embedding', title: 'Embedding'},
    {type: 'p', text: ['Embedding a booking page in another site is not covered here yet.']},
  ],
};

/**
 * content/docs/syncc/concepts/meta.json order:
 * how-double-booking-is-prevented.mdx, time-zones.mdx.
 */
const howItWorks: DocsSection = {
  id: 'how-it-works',
  title: 'How it works',
  blocks: [
    {type: 'p', text: ['Two things sit under every booking. A slot can be held once. Each person sees that moment in their own time zone.']},

    // content/docs/syncc/concepts/how-double-booking-is-prevented.mdx
    {type: 'h3', id: 'double-booking', title: 'How double booking is prevented', toc: 'Double booking'},
    {type: 'label', text: 'The problem'},
    {
      type: 'p',
      text: ['Availability is checked when a guest opens your page and picks a time. Two guests can pick the same slot in the same second. A check-then-book gap is all a double booking needs.'],
    },
    {type: 'label', text: 'How it works'},
    {
      type: 'p',
      text: ['The final check does not happen in the page, or in application code. It runs inside a database transaction guarded by a unique index. A given start time can be held exactly once. If two guests race for it, the database admits one booking and rejects the other. Every time, even on a busy day.'],
    },
    {type: 'label', text: 'A worked example'},
    {
      type: 'ol',
      items: [
        ['Asha and Dev both open your page and both see 10:30 on Monday.'],
        ['Both confirm within the same second.'],
        ['The database writes Asha’s booking. The unique index rejects Dev’s.'],
        ['Dev sees a friendly "just taken" message and picks another slot. No apology emails, and no manual cleanup.'],
      ],
    },
    {type: 'label', text: 'What it does not do'},
    {
      type: 'p',
      text: ['It does not stop you from double-booking yourself by adding events straight into Google Calendar. slotLane checks those busy times before offering slots, so they stay protected.'],
    },
    {
      type: 'p',
      text: seeAlso([
        {text: 'Google Calendar', href: '#google-calendar'},
        {text: 'Limits', href: '#limits'},
      ]),
    },

    // content/docs/syncc/concepts/time-zones.mdx
    {type: 'h3', id: 'time-zones', title: 'Time zones'},
    {type: 'label', text: 'The problem'},
    {
      type: 'p',
      text: ['Half of scheduling pain is time zone maths. "10:30 your time" goes wrong the moment one side guesses, and it goes wrong twice a year around daylight-saving changes.'],
    },
    {type: 'label', text: 'How it works'},
    {
      type: 'ul',
      items: [
        ['Your availability is set in your time zone.'],
        ['Each guest sees slots in their own time zone, detected automatically, with an easy way to change it.'],
        ['The conversion is DST-safe. A slot that crosses a daylight-saving switch still lands at the right moment for both sides.'],
      ],
    },
    {type: 'label', text: 'A worked example'},
    {
      type: 'p',
      text: ['You are in Kolkata (UTC+5:30) and offer Mondays 14:00–17:00. A guest in New York (UTC-4 in October) sees those hours as 04:30–07:30 their time. Nobody does the maths, and nobody books a 2 a.m. call by mistake.'],
    },
    {type: 'label', text: 'What it does not do'},
    {
      type: 'p',
      text: ['It does not show the guest your time zone by default. They always see their own.'],
    },
    {
      type: 'p',
      text: seeAlso([
        {text: 'Booking page', href: '#booking-page'},
        {text: 'FAQ', href: '#faq'},
      ]),
    },
  ],
};

/**
 * content/docs/syncc/limits.mdx
 * The one-owner line also follows botpro src/lib/products.ts (PRODUCT_PAGES.slotlane.limit).
 */
const limits: DocsSection = {
  id: 'limits',
  title: 'Limits',
  blocks: [
    {type: 'p', text: ['slotLane is built to do one thing well. This is what it does not do.']},
    {type: 'h3', id: 'one-owner', title: 'One owner’s calendar', toc: 'One owner'},
    {
      type: 'p',
      text: ['Built for one owner’s calendar: one admin account and one set of availability. Teams, round-robin and multi-host pages are not supported yet. The workaround is one booking page per person.'],
    },
    {type: 'h3', id: 'google-calendar-only', title: 'Google Calendar only', toc: 'Google Calendar only'},
    {
      type: 'p',
      text: ['slotLane syncs with Google Calendar. It checks busy times and writes bookings there. Syncing with Outlook, Microsoft 365 or iCloud is not supported. Invites are standard .ics files, so they open in Outlook and Apple Calendar.'],
    },
  ],
};

/**
 * content/docs/syncc/troubleshooting.mdx
 */
const troubleshooting: DocsSection = {
  id: 'troubleshooting',
  title: 'Troubleshooting',
  blocks: [
    {type: 'p', text: ['Symptoms are written the way you would type them into search. Each one gives the likely cause and the fix.']},
    {type: 'h3', id: 'bookings-missing', title: 'I connected Google Calendar but bookings are not appearing', toc: 'Bookings not appearing'},
    {type: 'p', text: ['Likely cause: the calendars slotLane checks for busy times are not the one it writes bookings to, or the Google connection was revoked.']},
    {type: 'p', text: ['Fix: reconnect Google Calendar and confirm which calendar receives bookings.']},
    {type: 'h3', id: 'confirmation-email', title: 'A guest says they never got the confirmation email', toc: 'Missing confirmation email'},
    {type: 'p', text: ['Likely cause: on Self-host, confirmations go over your own SMTP, so check those settings first. On any plan, the email may be in spam.']},
    {type: 'p', text: ['Fix: ask the guest to check spam, then review your SMTP configuration. The booking itself is safe. It lands in your dashboard either way.']},
    {type: 'h3', id: 'same-slot', title: 'Two guests booked the same slot', toc: 'Same slot twice'},
    {
      type: 'p',
      text: [
        'This should not be possible. The final check runs inside a database transaction with a unique index, and one person gets a "just taken" message. If you see a true double booking, treat it as a bug and ',
        {text: 'contact us', href: '/contact'},
        '.',
      ],
    },
  ],
};

/**
 * content/docs/syncc/faq.mdx
 * The price answer follows botpro src/lib/products.ts, not the docs link out to a price page.
 */
const faq: DocsSection = {
  id: 'faq',
  title: 'FAQ',
  blocks: [
    {
      type: 'faq',
      items: [
        {
          q: 'Do my guests need an account?',
          a: ['No. Guests pick a time and give their name and email. To reschedule or cancel they use the signed link in their confirmation email. No sign-up, and no password.'],
        },
        {
          q: 'Which calendars does slotLane work with?',
          a: ['Google Calendar. slotLane checks busy times across the calendars you choose and writes each booking to one of them. Invites go out as .ics files, which open in Google, Outlook and Apple Calendar.'],
        },
        {
          q: 'Does it create the meeting link for me?',
          a: ['Yes. Pick Google Meet or Zoom on an event type and each booking gets its own link. It goes into the emails and the calendar invite, and shows next to the booking in your dashboard.'],
        },
        {
          q: 'How are time zones handled?',
          a: [
            'Guests see times in their own time zone, detected automatically and easy to change. Your availability stays in yours. The maths is DST-safe. See ',
            {text: 'Time zones', href: '#time-zones'},
            '.',
          ],
        },
        {
          q: 'Can I use my own domain?',
          a: [
            'Yes, on Cloud and on Self-host. On Self-host, the included Caddy setup fetches and renews the HTTPS certificate. On Cloud, that part is done for you. See ',
            {text: 'Custom domain', href: '#custom-domain'},
            '.',
          ],
        },
        {
          q: 'Can my team use it?',
          a: [
            'Not today. slotLane is built for one owner’s calendar: one admin account and one set of availability. Teams and round-robin are not supported yet. See ',
            {text: 'Limits', href: '#limits'},
            '.',
          ],
        },
        {
          q: 'What does it cost?',
          a: ['One flat price per booking page, never per seat. Billed yearly, $7 a month. Month to month, $9 a month.'],
        },
      ],
    },
  ],
};

export const DOCS_SECTIONS: DocsSection[] = [overview, quickstart, guides, howItWorks, limits, troubleshooting, faq];

const tocTitle = (block: Extract<DocsBlock, {type: 'h3'}>) => block.toc ?? block.title;

export const DOCS_TOC: TocItem[] = DOCS_SECTIONS.map((section) => {
  const children = section.blocks.flatMap((block) => (block.type === 'h3' ? [{id: block.id, title: tocTitle(block)}] : []));
  return {id: section.id, title: section.title, ...(children.length > 0 ? {children} : {})};
});
