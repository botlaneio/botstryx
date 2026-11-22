# India launch review checklist (botlane.in)

Status: **DRAFT — not approved for production**. This document is a review aid, not legal or tax advice. Keep PRs #39 and #40 unmerged until build verification and explicit launch approval.

## Legal and accounting review
- [ ] Confirm Vedanta Ventures' exact registered legal name, business form, principal/registered address, and contact details; replace draft placeholders on India Terms and Privacy pages.
- [ ] Lawyer reviews India Terms and Privacy, dispute jurisdiction, liability, data processing, consent/grievance requirements, and cross-border transfers under applicable law.
- [ ] Verify the actual production providers, cookies, analytics, voice recordings, retention and deletion practices against the Privacy draft.
- [ ] Accountant confirms GST registration status, GSTIN if applicable, invoice fields, tax treatment, place of supply, HSN/SAC if relevant, and whether prices are displayed before or after tax.
- [ ] Confirm cancellation, refund, milestone and intellectual-property clauses in the separate signed client services agreement.

## Razorpay readiness (currently blocked by merchant review)
- [ ] Wait for Razorpay merchant approval following MSME documentation review. No live checkout until approved.
- [ ] Confirm Razorpay merchant entity, settlement account, supported payment methods and activation restrictions.
- [ ] Store API key ID, secret and webhook secret only in approved server-side deployment configuration; never commit credentials.
- [ ] Implement server-created orders from trusted, accepted invoice amounts (INR paise), not client-supplied prices.
- [ ] Verify checkout payment signatures and webhook signatures on the server, with replay/idempotency protection and reliable payment-state storage.
- [ ] Test success, failure, duplicate webhook, delayed capture, refund, reconciliation and invoice workflows in test mode before live activation.
- [ ] Keep India checkout disabled until activation and explicit authorization; current website uses contact/proposal/invoice workflow.

## Engineering gates
- [ ] Review hostname routing for botlane.io, www.botlane.io, botlane.in, and www.botlane.in.
- [ ] Audit all page pricing, offers, FAQ text, metadata, JSON-LD, sitemap, robots and footer identity for both regions.
- [ ] Verify US Founding Ten offer never appears on India pages.
- [ ] Run dependency install, TypeScript check, lint, regional-pricing tests and production build; fix all failures.
- [ ] Confirm contact submissions and notifications still work and do not mix regional customer data unexpectedly.
- [ ] Verify payment checkout stays disabled until merchant approval.
- [ ] Obtain lawyer/accountant sign-off, then separately request authorization for merge, deployment, DNS and cutover.

**Current verification note (2026-11-22):** GitHub Actions shows no workflow runs for the PR #40 branch; no passing build has been confirmed. No deployment or DNS cutover is authorized.
