import {headers} from 'next/headers';
import {regionForHostname} from '@/lib/regional-pricing';
import type {Metadata} from 'next';
import Link from 'next/link';

import {LegalPage, type LegalSection} from '@/components/site/legal-page';
import {FOUNDING} from '@/lib/pricing';
import {COMPANY, COMPANY_FORM, CONTACT_EMAIL} from '@/lib/site';

const usMetadata: Metadata = {
  title: 'Terms of use · botLane',
  description: 'The terms for using botlane.io: what its prices and offers mean, what Lane is, and what’s ours.',
};

/*
 * DRAFT, NOT YET REVIEWED BY THE OWNER OR A LAWYER. Adapted from botpro's terms (src/app/terms/page.tsx,
 * 9 Nov 2026) for this site: prices in US dollars only, slotLane as the one product, and Lane by text and voice.
 * Terms for using the website, not for a project. Client work runs on a written scope and agreement signed
 * before it starts; nothing here replaces that. Keep the offer and product sections in step with the site.
 */
const sections: LegalSection[] = [
  {
    id: 'about',
    title: 'About these terms',
    body: (
      <>
        <p>botlane.io is run by {COMPANY}, {COMPANY_FORM}, trading as botLane. By using the site you agree to these terms. If you don’t agree, please don’t use it.</p>
        <p>These terms cover the website. Any project we take on is governed by the written scope and agreement we both sign before it starts, and that agreement wins wherever the two differ.</p>
      </>
    ),
  },
  {
    id: 'prices',
    title: 'Prices and quotes',
    body: (
      <>
        <p>Prices on the site show what our packages usually cost, in US dollars. They aren’t an offer you can accept by contacting us. Your price is fixed in your written scope, after we’ve talked about what you need.</p>
        <p>Taxes, and third-party costs you choose, such as domains, paid plugins or stock images, are extra unless your scope says otherwise.</p>
      </>
    ),
  },
  {
    id: 'offers',
    title: 'Offers',
    body: (
      <p>Offers such as the Founding Ten apply only while the site shows them as open, for as many places as they state ({FOUNDING.places} for the Founding Ten), and until their end date. They apply only to the services they name and can’t be combined with another offer. We may end an offer early; any project already agreed at the offer price keeps it.</p>
    ),
  },
  {
    id: 'products',
    title: 'slotLane',
    body: (
      <p>slotLane, our booking and scheduling app, runs at slotlane.cloud. Its page here describes it and its prices, which may change. Using slotLane itself is covered by the terms and privacy policy on slotlane.cloud, not by these.</p>
    ),
  },
  {
    id: 'lane',
    title: 'Lane, our guide',
    body: (
      <p>Lane is an AI that answers questions about botLane, by text or by voice. It can be wrong, so treat what it says as a guide, not a promise. Prices, scope and timelines are agreed only in writing. Lane can fill in the brief form for you to check and send, and book a free intro call when you ask it to. Please don’t use Lane to share sensitive information. Our <Link href="/privacy">privacy policy</Link> explains what happens to a conversation.</p>
    ),
  },
  {
    id: 'use',
    title: 'Using the site',
    body: (
      <>
        <p>Please don’t:</p>
        <ul>
          <li>use the site for anything unlawful, or to mislead or harm anyone;</li>
          <li>try to get into parts of it that aren’t public, or interfere with how it runs;</li>
          <li>send us spam or automated submissions, book calls you don’t mean to keep, or use Lane to run up conversations;</li>
          <li>copy the site’s content or design to pass it off as your own.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'ours',
    title: 'What’s ours',
    body: (
      <p>The site’s text, design, code, graphics and the botLane name and logo belong to us or to the people who license them to us. You can read, link to and share pages; anything more needs our written permission. Other companies’ names and logos on the site, such as the tools we work with, belong to their owners and don’t mean they endorse us.</p>
    ),
  },
  {
    id: 'links',
    title: 'Other sites',
    body: <p>We link to other websites for your convenience. We don’t control them and aren’t responsible for what they contain or do.</p>,
  },
  {
    id: 'liability',
    title: 'Our responsibility',
    body: (
      <>
        <p>We work to keep the site accurate and available, but we provide it as it is. We don’t promise it will always be available, free of errors or complete, and the articles on it are general information, not advice for your situation.</p>
        <p>As far as the law allows, we aren’t liable for indirect or consequential loss, or for loss of profit, data or business, arising from using the site. Nothing in these terms limits liability that the law doesn’t allow us to limit.</p>
      </>
    ),
  },
  {
    id: 'law',
    title: 'The law that applies',
    body: (
      <p>These terms are governed by the laws of the State of Wyoming, USA, and disputes about them go to its courts, unless the law where you live gives you the right to bring them there.</p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes and contact',
    body: (
      <p>We may update these terms; the date at the top shows when they last changed, and the version on the site when you use it is the one that applies. Questions? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
    ),
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const region = regionForHostname((await headers()).get('host')?.split(':')[0] ?? 'botlane.io');
  return region === 'in' ? {...usMetadata, description: 'Draft website terms for botlane.in operated under the Vedanta Ventures name, pending legal review.'} : usMetadata;
}

const indiaSections: LegalSection[] = [
  {id: 'operator', title: 'Website operator', body: <p>botlane.in is operated under the Vedanta Ventures name as botLane India. The precise legal constitution, registered address, GST registration details and official contact particulars must be confirmed before publication. For enquiries, contact <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>},
  {id: 'scope', title: 'Website terms and project agreements', body: <p>These terms govern use of the website. A service enquiry does not create a contract. Each project requires a separate written proposal, scope, payment schedule and agreement accepted by both parties. The signed project agreement controls if its terms differ.</p>},
  {id: 'quotes', title: 'Prices, taxes and payment', body: <p>Prices displayed on botlane.in are in Indian rupees (INR), are indicative and may change before acceptance. GST is additional where applicable, subject to the final invoice and applicable law. Any third-party costs and payment milestones will be identified in the written proposal. Do not make a payment unless you have received an agreed invoice and verified payment instructions through an official contact channel.</p>},
  {id: 'services', title: 'Delivery and changes', body: <p>Deliverables, timelines, revisions, acceptance, support, cancellation and any refund arrangements are governed by the project agreement. Website descriptions do not guarantee a particular business result or delivery date.</p>},
  {id: 'use', title: 'Acceptable use and intellectual property', body: <p>Do not misuse the website, attempt unauthorized access, send unlawful content or interfere with its operation. Site content and trademarks belong to their respective owners. Ownership and licensing of commissioned work are determined by the signed project agreement.</p>},
  {id: 'third-party', title: 'External services and AI', body: <p>The website may link to third-party services and offer an AI assistant. AI responses may be inaccurate and do not constitute binding quotations or professional advice. Do not submit sensitive information through the assistant. Third-party services may have their own terms and privacy policies.</p>},
  {id: 'liability', title: 'Availability and liability', body: <p>We aim to keep the website accurate and available but cannot guarantee uninterrupted operation. Liability is limited only to the extent permitted by applicable law; statutory consumer and other non-excludable rights are unaffected.</p>},
  {id: 'law', title: 'Applicable law and disputes', body: <p>Indian law applies to these website terms, subject to any mandatory protections and jurisdictional rules. The appropriate dispute-resolution process and court jurisdiction should be confirmed by legal counsel before publication.</p>},
  {id: 'changes', title: 'Changes and contact', body: <p>These terms may be updated. Questions can be sent to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. This India version is a draft pending legal and accounting review.</p>},
];

export default async function TermsPage() {
  const region = regionForHostname((await headers()).get('host')?.split(':')[0] ?? 'botlane.io');
  return (
    <LegalPage
      kicker="Terms"
      title="Terms of use"
      updated={region === 'in' ? "2026-11-22" : "2026-11-16"}
      summary={region === 'in' ? <p>Draft terms for botlane.in, pending review by your lawyer and accountant. Projects require a separate written agreement.</p> : <p>The terms for using botlane.io. Any project we do together runs on its own written scope and agreement, signed before work starts.</p>}
      sections={region === 'in' ? indiaSections : sections}
    />
  );
}
