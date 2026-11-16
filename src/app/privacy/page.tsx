import type {Metadata} from 'next';
import Link from 'next/link';

import {LegalPage, type LegalSection} from '@/components/site/legal-page';
import {COMPANY, COMPANY_FORM, CONTACT_EMAIL} from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy policy · botLane',
  description: 'What botlane.io collects, why, who handles it for us, and how to have it changed or deleted.',
};

/*
 * DRAFT, NOT YET REVIEWED BY THE OWNER OR A LAWYER. Adapted from botpro's privacy policy (src/app/privacy/page.tsx,
 * 9 Nov 2026) and rewritten against what this site actually does (16 Nov 2026). When a form, a provider or
 * anything the browser keeps changes, change this page in the same pull request, and its "updated" date.
 *   Contact form  -> saved in Cloudflare D1 (table `briefs`), then emailed to the team through Resend
 *   Lane (text)   -> each message goes to Google's Gemini API to write the reply
 *   Lane (voice)  -> ElevenLabs, only after the visitor chooses to talk
 *   Intro calls   -> a Google Calendar event with a Meet link; Google emails the invite
 *   Every request -> Cloudflare (hosting, request logs, rate limits keyed on the visitor's IP)
 *   Account page  -> a preview only: nothing is sent or saved
 *   Browser       -> sessionStorage only: the Lane chat for this visit, and a brief Lane filled in
 */
const sections: LegalSection[] = [
  {
    id: 'who',
    title: 'Who we are',
    body: (
      <>
        <p>botlane.io is run by {COMPANY}, {COMPANY_FORM}, trading as botLane. We decide what happens to the information described here.</p>
        <p>For anything about your information, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. A person reads it.</p>
      </>
    ),
  },
  {
    id: 'collect',
    title: 'What we collect',
    body: (
      <>
        <p>Only what you choose to send us, and what any website receives when you visit it.</p>
        <ul>
          <li><strong>When you send a brief</strong> through the <Link href="/contact">contact form</Link>: what you’re building, what you need from us, your name, your email address and, if you add it, your company.</li>
          <li><strong>When you write to Lane</strong>, the guide in the corner of the page: the messages you type and Lane’s replies.</li>
          <li><strong>When you talk to Lane</strong>: what you say during the call, and a transcript of it. Your microphone turns on only after you choose to talk, and turns off when the call ends.</li>
          <li><strong>When you book an intro call</strong> through Lane: your name, your email address, the time you chose and any note you add.</li>
          <li><strong>When you visit any page</strong>: the technical details every browser sends, such as your IP address, browser type, the page you asked for and when. We don’t use them to identify you.</li>
        </ul>
        <p>The sign-in and sign-up page is a preview: nothing typed there is sent or saved. We don’t ask for payment details, passwords or anything sensitive. Please don’t include them in a brief or a message to Lane.</p>
      </>
    ),
  },
  {
    id: 'use',
    title: 'How we use it',
    body: (
      <ul>
        <li>To reply to your brief, and to talk about the work with you.</li>
        <li>To let Lane answer you, fill in the brief form for you to send, and book the intro call you ask for.</li>
        <li>To keep the site running, secure and quick, including limiting how often one visitor can send briefs or messages.</li>
      </ul>
    ),
  },
  {
    id: 'dont',
    title: 'What we don’t do',
    body: (
      <ul>
        <li>We don’t sell your information or share it for advertising.</li>
        <li>We don’t add you to a mailing list.</li>
        <li>We don’t use advertising trackers, and we don’t build a profile of you.</li>
      </ul>
    ),
  },
  {
    id: 'providers',
    title: 'Who handles it for us',
    body: (
      <>
        <p>A few companies run parts of the site for us. Each receives only what its job needs.</p>
        <ul>
          <li><strong>Cloudflare</strong> hosts the site, keeps short-lived request logs to run and protect it, and stores each brief in a database, so none is lost if an email fails.</li>
          <li><strong>Resend</strong> delivers the email that tells us a new brief has arrived.</li>
          <li><strong>Google</strong> runs our inbox and calendar (Google Workspace). Its Gemini service writes Lane’s typed replies, so it receives what you type to Lane. When you book an intro call, Google Calendar holds the event and emails you the invite with a Meet link.</li>
          <li><strong>ElevenLabs</strong> runs Lane’s voice: it hears what you say during a call and keeps a recording and transcript.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'where',
    title: 'Where it’s handled',
    body: (
      <p>We work from India, and the companies above process information in the United States and other countries. Wherever it’s handled, it’s used only for the purposes on this page.</p>
    ),
  },
  {
    id: 'keep',
    title: 'How long we keep it',
    body: (
      <>
        <p>We keep briefs and our emails with you for as long as we need them to reply, to do any work we agree, and to keep business records. Lane’s voice recordings and transcripts are kept by ElevenLabs. Request logs are kept by Cloudflare for a short time.</p>
        <p>Ask us to delete anything you’ve sent, including a Lane conversation, and we will, unless the law requires us to keep it.</p>
      </>
    ),
  },
  {
    id: 'rights',
    title: 'Your choices',
    body: (
      <>
        <p>You can ask us what we hold about you, to correct it, to delete it, or to stop using it. Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> from the address you used, or tell us how to confirm it’s you. We’ll answer within 30 days.</p>
        <p>If you’re unhappy with our answer, you can complain to the data protection authority where you live.</p>
      </>
    ),
  },
  {
    id: 'browser',
    title: 'Cookies and your browser',
    body: (
      <>
        <p>botlane.io doesn’t set cookies, and nothing on it tracks you across other sites. For the current visit only, your browser keeps:</p>
        <ul>
          <li>your typed conversation with Lane, so it’s still there when you move to another page;</li>
          <li>a brief Lane filled in for you, until the contact form picks it up.</li>
        </ul>
        <p>Both stay on your device and are cleared when you close the tab.</p>
      </>
    ),
  },
  {
    id: 'children',
    title: 'Children',
    body: <p>botlane.io is for businesses. It isn’t meant for children, and we don’t knowingly collect their information.</p>,
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: (
      <p>When the site starts collecting something new or uses a new provider, we update this page first and change the date at the top. See also our <Link href="/terms">terms of use</Link>.</p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      kicker="Privacy"
      title="Privacy policy"
      updated="2026-11-16"
      summary={<p>The short version: we only collect what you send us, we use it to reply and to do the work, and we don’t sell it or track you.</p>}
      sections={sections}
    />
  );
}
