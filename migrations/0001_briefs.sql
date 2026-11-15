-- Briefs sent from the contact form (src/app/contact/actions.ts). One row per brief.
CREATE TABLE IF NOT EXISTS briefs (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  need       TEXT    NOT NULL,
  brief      TEXT    NOT NULL,
  name       TEXT    NOT NULL,
  email      TEXT    NOT NULL,
  company    TEXT,
  -- 'new' until someone replies; change it by hand or from a future admin page.
  status     TEXT    NOT NULL DEFAULT 'new'
);

CREATE INDEX IF NOT EXISTS briefs_created_at ON briefs (created_at DESC);
