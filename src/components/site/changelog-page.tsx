import Link from 'next/link';

import {ArrowRight} from '@/components/icons';

import {SiteFooter} from './site-footer';
import {SiteHeader} from './site-header';

// What changed on botlane.io, newest first. Each entry is a merged pull request on botlaneio/botstryx, written
// for visitors rather than for us; purely internal changes (build settings, logs) are left out. Add an entry in
// the same pull request as the change it describes.
type Entry = {title: string; body: string; href?: string; tag: 'New' | 'Improved' | 'Fixed'};
type Day = {date: string; entries: Entry[]};

const DAYS: Day[] = [
  {
    date: '2026-11-16',
    entries: [
      {tag: 'New', title: 'Websites, slotLane and Custom Solutions pages', body: 'The three packages side by side with every difference row by row, slotLane’s own page with its one per-person plan, and the AI Assistant with how a custom project runs.', href: '/websites'},
      {tag: 'New', title: 'Knowledge base, privacy policy and terms', body: 'The questions people ask before they hire us, gathered by topic, and plain-language terms and privacy pages.', href: '/help'},
      {tag: 'New', title: 'slotLane documentation', body: 'How slotLane works: share a link, guests pick a time, and the booking lands in Google Calendar.', href: '/docs'},
      {tag: 'Improved', title: 'Intro calls in two time zones', body: 'Book a 20-minute intro call on a weekday morning, US Central time, or around midday in India.'},
      {tag: 'Improved', title: 'A new homepage headline', body: 'The headline now types out what we build, one phrase at a time, and the chat button steps aside while you write in the brief box.', href: '/'},
      {tag: 'Improved', title: 'A simpler Solutions menu', body: 'Websites and Web Apps now head their packages in the menu, so each package is one click away.'},
    ],
  },
  {
    date: '2026-11-15',
    entries: [
      {tag: 'New', title: 'Talk to Lane', body: 'Lane, the guide in the corner of every page, now answers by voice too. It can fill in your brief for you to send, and book an intro call.'},
      {tag: 'New', title: 'The AI Assistant page', body: 'What the assistant answers, what it learns from and when it hands over, with Lane as a real one to try.', href: '/custom-solutions/ai-assistant'},
      {tag: 'New', title: 'Web Apps, stage by stage', body: 'Pages for the scoping sprint, MVP development and full product builds, each with its fixed price and timeline.', href: '/web-apps'},
      {tag: 'New', title: 'Care', body: 'Care and Care Plus side by side: hosting, updates, backups and small edits each month.', href: '/care'},
      {tag: 'Improved', title: 'Briefs that never get lost', body: 'Every brief is saved the moment you send it, then emailed to us, so none goes missing if an email fails.'},
      {tag: 'Improved', title: 'The new site on botlane.io', body: 'The rebuilt site now serves botlane.io, with a sitemap and proper links for search engines.'},
      {tag: 'Fixed', title: 'Headers on Care and Web Apps', body: 'Closed an empty band that sat under the header on those pages.'},
    ],
  },
  {
    date: '2026-11-14',
    entries: [
      {tag: 'New', title: 'A rebuilt botlane.io', body: 'A new homepage, the Core, Ascend and Apex website pages, pricing, contact and Insights, designed from scratch.', href: '/'},
      {tag: 'New', title: 'Chat with Lane', body: 'Ask Lane about our services and prices by text, from any page.'},
      {tag: 'New', title: 'The pricing page', body: 'Every price on one page: websites, web apps and the care after launch.', href: '/solutions'},
    ],
  },
];

const fmt = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'});

/** The changelog: one block a day, newest first, each change tagged and linked to where it lives. */
export function ChangelogPage() {
  return (
    <div className="apx hub">
      <div className="apx-open">
        <SiteHeader />
        <main className="wrap apx-hero">
          <p className="mono apx-tag fade-up">Resources<span aria-hidden>/</span>Changelog<i aria-hidden />Updated {fmt(DAYS[0].date)}</p>
          <h1 className="apx-title hub-title">
            <span className="line"><span className="rise" style={{'--i': 0} as React.CSSProperties}>What’s <em>new.</em></span></span>
          </h1>
          <div className="apx-lead fade-up" style={{'--i': 1} as React.CSSProperties}>
            <div className="apx-say">
              <p>Every change to botlane.io worth knowing about, newest first.</p>
            </div>
          </div>
        </main>
      </div>

      <div className="wrap cl">
        {DAYS.map((d) => (
          <section key={d.date} aria-labelledby={`d-${d.date}`} className="cl-day">
            <h2 id={`d-${d.date}`} className="mono"><time dateTime={d.date}>{fmt(d.date)}</time></h2>
            <ol>
              {d.entries.map((e) => (
                <li key={e.title}>
                  <span className="mono cl-tag" data-tag={e.tag}>{e.tag}</span>
                  <div>
                    <h3>{e.title}</h3>
                    <p>{e.body}</p>
                    {e.href && <Link href={e.href} className="apx-more">Have a look <ArrowRight size={14} /></Link>}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      <SiteFooter />
    </div>
  );
}
