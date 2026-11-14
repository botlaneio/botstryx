'use client';

/**
 * The client portal: what a website or web-app client sees once their project has started. Built from
 * Astryx's "Project Status" dashboard template (`npx astryx template dashboard-progress`) inside its side-nav
 * app shell, with the launch tracker's content replaced by one client's project.
 *
 * Everything here is sample data for one imagined Core website, and the page says so. The client is Juniper
 * Physio, the concept study botpro uses for Core. The project's steps, the package's scope and price, the page
 * list and the Care offer are botpro's; the dates, names, progress and messages are invented for the sample.
 */

import {useState} from 'react';
import Link from 'next/link';
import {AppShell} from '@astryxdesign/core/AppShell';
import {Avatar} from '@astryxdesign/core/Avatar';
import {Badge} from '@astryxdesign/core/Badge';
import {Banner} from '@astryxdesign/core/Banner';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Icon} from '@astryxdesign/core/Icon';
import {List, ListItem} from '@astryxdesign/core/List';
import {NavIcon} from '@astryxdesign/core/NavIcon';
import {ProgressBar} from '@astryxdesign/core/ProgressBar';
import {SegmentedControl, SegmentedControlItem} from '@astryxdesign/core/SegmentedControl';
import {SideNav, SideNavHeading, SideNavItem, SideNavSection} from '@astryxdesign/core/SideNav';
import {Table, proportional} from '@astryxdesign/core/Table';
import type {TableColumn} from '@astryxdesign/core/Table';
import {Heading, Text} from '@astryxdesign/core/Text';
import {Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  CreditCardIcon,
  DocumentTextIcon,
  EyeIcon,
  FolderIcon,
  LifebuoyIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';

import {Logo} from '@/components/brand/logo';
import {ThemeToggle} from '@/components/site/theme-toggle';

// ============= DATA (sample) =============

type StepState = 'done' | 'current' | 'upcoming';

// The five steps are botpro's (src/lib/process.ts). Days run from the intro call; Core takes 2–3 weeks.
const STEPS: {id: string; name: string; start: number; end: number; state: StepState; dates: string}[] = [
  {id: 'intro', name: 'Intro call', start: 0, end: 1, state: 'done', dates: 'Nov 2'},
  {id: 'scope', name: 'Scope and fixed quote', start: 1, end: 4, state: 'done', dates: 'Nov 3 – Nov 6'},
  {id: 'design', name: 'Design', start: 4, end: 12, state: 'current', dates: 'Nov 6 – Nov 14'},
  {id: 'build', name: 'Build', start: 12, end: 18, state: 'upcoming', dates: 'Nov 14 – Nov 20'},
  {id: 'launch', name: 'Launch', start: 18, end: 20, state: 'upcoming', dates: 'Nov 20 – Nov 22'},
];
const DAYS = 21;
const TODAY = 11;

const STATE_LABEL: Record<StepState, string> = {done: 'Done', current: 'In progress', upcoming: 'Up next'};
const STATE_FILL: Record<StepState, string> = {
  done: 'var(--color-text-primary)',
  current: 'var(--bl-blue)',
  upcoming: 'var(--color-border-emphasized)',
};

type PageState = 'approved' | 'review' | 'draft';
interface SitePage extends Record<string, unknown> {
  id: string;
  name: string;
  title: string;
  state: PageState;
  percent: number;
  note: string;
}

// The five pages and their lines are botpro's example Core structure (src/components/catalog/core-page.tsx).
const PAGES: SitePage[] = [
  {id: 'home', name: 'Home', title: 'Make the first impression count.', state: 'approved', percent: 100, note: 'Approved Nov 12'},
  {id: 'about', name: 'About', title: 'Put people behind the business.', state: 'review', percent: 80, note: 'Waiting on team photos'},
  {id: 'services', name: 'Services', title: 'Make your offer easy to understand.', state: 'review', percent: 75, note: 'Round 1 sent Nov 13'},
  {id: 'choice', name: 'Your choice', title: 'Room for what makes you different.', state: 'draft', percent: 40, note: 'Clinic locations page'},
  {id: 'contact', name: 'Contact', title: 'Turn interest into a conversation.', state: 'draft', percent: 30, note: 'Form goes to your inbox'},
];
const PAGE_LABEL: Record<PageState, string> = {approved: 'Approved', review: 'In review', draft: 'In design'};
const PAGE_BADGE: Record<PageState, 'green' | 'blue' | 'neutral'> = {approved: 'green', review: 'blue', draft: 'neutral'};
const PAGE_FILL: Record<PageState, string> = {
  approved: 'var(--color-text-primary)',
  review: 'var(--bl-blue)',
  draft: 'var(--color-border-emphasized)',
};

const WAITING = [
  {id: 'w1', title: 'Review design round 1', detail: 'About and Services pages · due Nov 16', action: 'Open review'},
  {id: 'w2', title: 'Send your team photos', detail: 'For the About page · any format', action: 'Upload'},
  {id: 'w3', title: 'Confirm your clinic opening hours', detail: 'For the Contact page', action: 'Answer'},
];

const ACTIVITY = [
  {id: 'a1', who: 'Botlane', text: 'Sent design round 1 for About and Services.', when: 'Nov 13'},
  {id: 'a2', who: 'Botlane', text: 'Home page approved. Moving it to build.', when: 'Nov 12'},
  {id: 'a3', who: 'You', text: 'Left 4 comments on the Home page.', when: 'Nov 11'},
  {id: 'a4', who: 'Botlane', text: 'Scope and fixed quote signed.', when: 'Nov 6'},
];

// The package as botpro's price book gives it (website-core in src/lib/pricing/plans.ts).
const SCOPE: [string, string][] = [
  ['Package', 'Core'],
  ['Pages', 'Up to 5'],
  ['Design', 'Custom, no templates'],
  ['Revisions', '2 rounds'],
  ['Timeline', '2–3 weeks'],
];

const ROUNDS_USED = 1;
const ROUNDS_TOTAL = 2;

// ============= PIECES =============

const AXIS = {fontSize: 12, fill: 'var(--color-text-secondary)'};

function Legend({items}: {items: {label: string; color: string}[]}) {
  return (
    <div className="portal-legend">
      {items.map((i) => (
        <span key={i.label}><i style={{background: i.color}} />{i.label}</span>
      ))}
    </div>
  );
}

function CardHead({title, hint, end}: {title: string; hint?: string; end?: React.ReactNode}) {
  return (
    <div className="portal-card-head">
      <div>
        <Heading level={3}>{title}</Heading>
        {hint && <Text type="supporting" color="secondary">{hint}</Text>}
      </div>
      {end}
    </div>
  );
}

function StepTip({active, payload}: {active?: boolean; payload?: {payload: (typeof STEPS)[number]}[]}) {
  if (!active || !payload?.length) return null;
  const s = payload[payload.length - 1].payload;
  return (
    <Card padding={3}>
      <Text type="body" weight="semibold">{s.name}</Text>
      <Text type="supporting" color="secondary">{s.dates} · {STATE_LABEL[s.state]}</Text>
    </Card>
  );
}

/** The five steps on a time axis, with today marked. */
function Timeline() {
  const data = STEPS.map((s) => ({...s, offset: s.start, length: Math.max(0.6, s.end - s.start)}));
  return (
    <div className="portal-chart">
      <ResponsiveContainer width="100%" height={STEPS.length * 46 + 30}>
        <BarChart data={data} layout="vertical" margin={{top: 18, right: 12, left: 4, bottom: 0}} barCategoryGap={12}>
          <CartesianGrid horizontal={false} stroke="var(--color-border)" />
          <XAxis type="number" domain={[0, DAYS]} ticks={[0, 7, 14, 21]} tickFormatter={(v: number) => `Day ${v}`} tick={AXIS} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" tick={AXIS} axisLine={false} tickLine={false} width={150} />
          <Tooltip content={<StepTip />} cursor={{fill: 'var(--color-border)'}} />
          <ReferenceLine x={TODAY} stroke="var(--bl-blue)" strokeDasharray="4 4" label={{value: 'Today', position: 'top', fontSize: 11, fill: 'var(--bl-blue)'}} />
          <Bar dataKey="offset" stackId="t" fill="transparent" isAnimationActive={false} />
          <Bar dataKey="length" stackId="t" radius={4} isAnimationActive={false}>
            {data.map((s) => <Cell key={s.id} fill={STATE_FILL[s.state]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <Legend items={(['done', 'current', 'upcoming'] as StepState[]).map((s) => ({label: STATE_LABEL[s], color: STATE_FILL[s]}))} />
    </div>
  );
}

/** How far through the pages the project is, as a ring with the overall percentage in its middle. */
function PagesRing() {
  const counts = (['approved', 'review', 'draft'] as PageState[]).map((s) => ({
    key: s,
    label: PAGE_LABEL[s],
    value: PAGES.filter((p) => p.state === s).length,
    color: PAGE_FILL[s],
  }));
  const overall = Math.round(PAGES.reduce((n, p) => n + p.percent, 0) / PAGES.length);
  return (
    <div className="portal-ring">
      <div className="ring-frame">
        <PieChart width={168} height={168}>
          <Pie data={counts} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius={58} outerRadius={82} paddingAngle={3} startAngle={90} endAngle={-270} stroke="none" isAnimationActive={false}>
            {counts.map((c) => <Cell key={c.key} fill={c.color} />)}
          </Pie>
        </PieChart>
        <div className="ring-centre">
          <strong>{overall}%</strong>
          <span>complete</span>
        </div>
      </div>
      <Legend items={counts.map((c) => ({label: `${c.label} · ${c.value}`, color: c.color}))} />
    </div>
  );
}

const PAGE_COLUMNS: TableColumn<SitePage>[] = [
  {
    key: 'name',
    header: 'Page',
    width: proportional(2, {minWidth: 200}),
    renderCell: (p: SitePage) => (
      <div className="cell-stack">
        <Text type="body" weight="semibold">{p.name}</Text>
        <Text type="supporting" color="secondary">{p.title}</Text>
      </div>
    ),
  },
  {
    key: 'percent',
    header: 'Progress',
    width: proportional(1.5, {minWidth: 160}),
    renderCell: (p: SitePage) => (
      <div className="cell-stack">
        <ProgressBar value={p.percent} max={100} label={`${p.name} progress`} isLabelHidden />
        <Text type="supporting" color="secondary">{p.percent}%</Text>
      </div>
    ),
  },
  {
    key: 'note',
    header: 'Latest',
    width: proportional(1.5, {minWidth: 170}),
    renderCell: (p: SitePage) => <Text type="body" color="secondary">{p.note}</Text>,
  },
  {
    key: 'state',
    header: 'Status',
    width: proportional(1, {minWidth: 110}),
    renderCell: (p: SitePage) => <Badge variant={PAGE_BADGE[p.state]} label={PAGE_LABEL[p.state]} />,
  },
];

// ============= PAGE =============

const NAV = [
  {id: 'overview', label: 'Overview', icon: Squares2X2Icon},
  {id: 'timeline', label: 'Timeline', icon: DocumentTextIcon},
  {id: 'pages', label: 'Pages', icon: EyeIcon},
  {id: 'messages', label: 'Messages', icon: ChatBubbleLeftRightIcon},
  {id: 'files', label: 'Files', icon: FolderIcon},
  {id: 'billing', label: 'Billing', icon: CreditCardIcon},
];

export function Portal() {
  const [view, setView] = useState('all');
  const pages = view === 'all' ? PAGES : PAGES.filter((p) => (view === 'open' ? p.state !== 'approved' : p.state === 'approved'));

  return (
    <AppShell
      height="fill"
      variant="surface"
      sideNav={
        <SideNav
          header={
            <SideNavHeading
              icon={<NavIcon icon={<span className="portal-mark" />} />}
              heading="Client portal"
              headingHref="/portal"
            />
          }
          footer={
            <div className="portal-nav-foot">
              <Avatar name="Maya Collins" size="sm" />
              <div>
                <Text type="body" weight="semibold">Maya Collins</Text>
                <Text type="supporting" color="secondary">Juniper Physio</Text>
              </div>
            </div>
          }>
          <SideNavSection title="Project" isHeaderHidden>
            {NAV.map((n) => (
              <SideNavItem key={n.id} label={n.label} icon={n.icon} href={`#${n.id}`} isSelected={n.id === 'overview'} />
            ))}
          </SideNavSection>
          <SideNavSection title="After launch">
            <SideNavItem label="Care" icon={LifebuoyIcon} href="/care" />
          </SideNavSection>
        </SideNav>
      }>
      <div className="portal">
        <header className="portal-top" id="overview">
          <div className="portal-title">
            <Link href="/" aria-label="botLane, home" className="portal-logo"><Logo size={22} /></Link>
            <Heading level={1}>Juniper Physio</Heading>
            <div className="portal-meta">
              <Text type="body" color="secondary">Core website · Launch Nov 22, 2026</Text>
              <Badge variant="green" label="On track" icon={<Icon icon={CheckCircleIcon} size="sm" />} />
            </div>
          </div>
          <div className="portal-actions">
            <ThemeToggle />
            <Button label="Message the team" variant="secondary" href="#messages" />
          </div>
        </header>

        <Banner
          status="info"
          title="Sample project"
          description="This portal shows sample data for one imagined Core website. Account access is not connected yet."
        />

        {/* The headline figures. */}
        <section className="portal-tiles" aria-label="At a glance">
          <div><span className="mono">Step</span><strong>3 of 5</strong><em>Design</em></div>
          <div><span className="mono">Pages approved</span><strong>1 of 5</strong><em>2 in review</em></div>
          <div><span className="mono">Revision rounds</span><strong>{ROUNDS_USED} of {ROUNDS_TOTAL}</strong><em>Round 1 sent</em></div>
          <div><span className="mono">Waiting on you</span><strong className="due">{WAITING.length}</strong><em>Next due Nov 16</em></div>
        </section>

        <div className="portal-grid">
          <Card padding={6}>
            <section id="timeline" className="portal-card">
              <CardHead title="Timeline" hint="From the intro call to launch · dashed line marks today" />
              <Timeline />
            </section>
          </Card>

          <Card padding={6}>
            <section className="portal-card">
              <CardHead title="Waiting on you" hint="Things we need before we can carry on" />
              <List hasDividers>
                {WAITING.map((w) => (
                  <ListItem
                    key={w.id}
                    label={w.title}
                    description={w.detail}
                    endContent={<Button label={w.action} variant="secondary" size="sm" />}
                  />
                ))}
              </List>
            </section>
          </Card>
        </div>

        <div className="portal-grid three">
          <Card padding={6}>
            <section className="portal-card">
              <CardHead title="Pages" hint="Five pages, one clear story" />
              <PagesRing />
            </section>
          </Card>

          <Card padding={6}>
            <section className="portal-card">
              <CardHead title="Design review" hint="Your package includes 2 rounds" />
              <div className="rounds">
                <ProgressBar value={ROUNDS_USED} max={ROUNDS_TOTAL} label="Revision rounds used" isLabelHidden />
                <Text type="body">Round {ROUNDS_USED} of {ROUNDS_TOTAL} is with you: About and Services.</Text>
                <Text type="supporting" color="secondary">Leave comments on the designs, on real content. We’ll fold them into round 2.</Text>
                <div><Button label="Open round 1" variant="primary" /></div>
              </div>
            </section>
          </Card>

          <Card padding={6}>
            <section id="billing" className="portal-card">
              <CardHead title="Scope and price" hint="Agreed in writing before work started" />
              <p className="portal-price">$2,500 <span>one-time</span></p>
              <dl className="portal-scope">
                {SCOPE.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
              </dl>
            </section>
          </Card>
        </div>

        <Card padding={6}>
          <section id="pages" className="portal-card">
            <CardHead
              title="Pages"
              hint="Where each page stands"
              end={
                <SegmentedControl label="Show pages" size="sm" value={view} onChange={setView}>
                  <SegmentedControlItem value="all" label="All" />
                  <SegmentedControlItem value="open" label="Open" />
                  <SegmentedControlItem value="approved" label="Approved" />
                </SegmentedControl>
              }
            />
            {/* On a narrow screen the table scrolls sideways inside its card. */}
            <div className="portal-table">
              <Table<SitePage> data={pages} columns={PAGE_COLUMNS} idKey="id" density="balanced" dividers="rows" hasHover />
            </div>
          </section>
        </Card>

        <div className="portal-grid">
          <Card padding={6}>
            <section id="messages" className="portal-card">
              <CardHead title="Recent activity" />
              <List hasDividers>
                {ACTIVITY.map((a) => (
                  <ListItem
                    key={a.id}
                    startContent={<Avatar name={a.who === 'You' ? 'Maya Collins' : 'Botlane'} size="sm" />}
                    label={a.text}
                    description={`${a.who} · ${a.when}`}
                  />
                ))}
              </List>
            </section>
          </Card>

          <Card padding={6}>
            <section id="files" className="portal-card after-launch">
              <CardHead title="After launch" />
              <Text type="body">Hosting, security updates and small edits, handled.</Text>
              <p className="portal-price small">From $99<span>/month</span></p>
              <div><Button label="See Care" variant="secondary" href="/care" /></div>
            </section>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
