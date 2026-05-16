CRM Artisan — Consistency Guide

  ---
  Colors

  ┌───────────────┬──────────────┬─────────┬──────────────────────────────────────────┐
  │     Role      │     Name     │   Hex   │                  Usage                   │
  ├───────────────┼──────────────┼─────────┼──────────────────────────────────────────┤
  │ Primary       │ Amber        │ #E07B00 │ Main buttons, active tab, key highlights │
  ├───────────────┼──────────────┼─────────┼──────────────────────────────────────────┤
  │ Primary dark  │ Amber Dark   │ #B85F00 │ Button pressed state, hover              │
  ├───────────────┼──────────────┼─────────┼──────────────────────────────────────────┤
  │ Primary light │ Amber Tint   │ #FFF3E0 │ Chip backgrounds, badge fills            │
  ├───────────────┼──────────────┼─────────┼──────────────────────────────────────────┤
  │ Success       │ Green        │ #2E7D32 │ Accepted, Completed, positive values     │
  ├───────────────┼──────────────┼─────────┼──────────────────────────────────────────┤
  │ Warning       │ Yellow       │ #F9A825 │ Draft, On Hold                           │
  ├───────────────┼──────────────┼─────────┼──────────────────────────────────────────┤
  │ Danger        │ Red          │ #C62828 │ Rejected, delete actions, overdue        │
  ├───────────────┼──────────────┼─────────┼──────────────────────────────────────────┤
  │ Info          │ Blue         │ #1565C0 │ In Progress, sent status                 │
  ├───────────────┼──────────────┼─────────┼──────────────────────────────────────────┤
  │ Neutral 900   │ Near Black   │ #1A1A1A │ Body text, headings                      │
  ├───────────────┼──────────────┼─────────┼──────────────────────────────────────────┤
  │ Neutral 500   │ Mid Gray     │ #737373 │ Secondary text, labels                   │
  ├───────────────┼──────────────┼─────────┼──────────────────────────────────────────┤
  │ Neutral 200   │ Light Gray   │ #E5E5E5 │ Dividers, borders                        │
  ├───────────────┼──────────────┼─────────┼──────────────────────────────────────────┤
  │ Neutral 100   │ Surface Gray │ #F5F5F5 │ Page background                          │
  ├───────────────┼──────────────┼─────────┼──────────────────────────────────────────┤
  │ White         │ White        │ #FFFFFF │ Cards, modals, inputs                    │
  └───────────────┴──────────────┴─────────┴──────────────────────────────────────────┘

  Rule: amber appears on white or #F5F5F5 only — never on colored backgrounds.

  ---
  Typography

  Font: Inter (Google Fonts). Fallback: system-ui, sans-serif.

  ┌───────────────────┬──────┬────────┬────────────────────────┐
  │       Role        │ Size │ Weight │         Color          │
  ├───────────────────┼──────┼────────┼────────────────────────┤
  │ Screen title      │ 20px │ 700    │ Neutral 900            │
  ├───────────────────┼──────┼────────┼────────────────────────┤
  │ Section header    │ 13px │ 600    │ Neutral 500 — ALL CAPS │
  ├───────────────────┼──────┼────────┼────────────────────────┤
  │ Card title        │ 16px │ 600    │ Neutral 900            │
  ├───────────────────┼──────┼────────┼────────────────────────┤
  │ Body              │ 15px │ 400    │ Neutral 900            │
  ├───────────────────┼──────┼────────┼────────────────────────┤
  │ Secondary text    │ 13px │ 400    │ Neutral 500            │
  ├───────────────────┼──────┼────────┼────────────────────────┤
  │ Button label      │ 15px │ 600    │ — (see buttons)        │
  ├───────────────────┼──────┼────────┼────────────────────────┤
  │ Input label       │ 13px │ 500    │ Neutral 500            │
  ├───────────────────┼──────┼────────┼────────────────────────┤
  │ Micro / timestamp │ 12px │ 400    │ Neutral 500            │
  └───────────────────┴──────┴────────┴────────────────────────┘

  Rules:
  - Never go below 12px
  - Section headers always uppercase with 0.05em letter-spacing
  - Line height: 1.5 for body, 1.2 for headings

  ---
  Spacing

  Base unit: 8px

  ┌───────┬───────┬──────────────────────────────────────────────┐
  │ Token │ Value │                    Usage                     │
  ├───────┼───────┼──────────────────────────────────────────────┤
  │ xs    │ 4px   │ Icon gap, tight inline spacing               │
  ├───────┼───────┼──────────────────────────────────────────────┤
  │ sm    │ 8px   │ Padding inside chips, between icon and label │
  ├───────┼───────┼──────────────────────────────────────────────┤
  │ md    │ 16px  │ Card padding, form field padding             │
  ├───────┼───────┼──────────────────────────────────────────────┤
  │ lg    │ 24px  │ Between sections on a screen                 │
  ├───────┼───────┼──────────────────────────────────────────────┤
  │ xl    │ 32px  │ Top of screen below header                   │
  └───────┴───────┴──────────────────────────────────────────────┘

  Rules:
  - All card padding: md (16px) on all sides
  - Vertical gap between list items: sm (8px)
  - Vertical gap between sections: lg (24px)
  - Bottom safe area (above tab bar): always 80px minimum padding so content isn't hidden

  ---
  Buttons

  Primary — main action on a screen (one per screen max)
  Background: #E07B00  |  Text: #FFFFFF  |  Weight: 600
  Border radius: 12px  |  Height: 52px  |  Full width
  Pressed: background #B85F00

  Secondary — supporting action
  Background: #FFFFFF  |  Border: 1.5px #E07B00  |  Text: #E07B00
  Border radius: 12px  |  Height: 52px  |  Full width

  Ghost — low-emphasis (e.g. "Cancel", "Skip")
  Background: transparent  |  Text: #737373  |  No border
  Height: 44px

  Destructive — delete, reject
  Background: #C62828  |  Text: #FFFFFF
  Border radius: 12px  |  Height: 52px
  Only appears in confirmation sheets, never as a first action

  Icon button (FAB)
  Background: #E07B00  |  Icon: white  |  Size: 56×56px
  Border radius: 16px  |  Shadow: 0 4px 12px rgba(224,123,0,0.35)
  Position: fixed bottom-right, 16px from edge, 80px from bottom

  Disabled state (all button types): opacity: 0.4, not clickable.

  ---
  Cards

  Background: #FFFFFF
  Border radius: 16px
  Padding: 16px
  Shadow: 0 1px 4px rgba(0,0,0,0.08)
  No visible border

  Tappable cards get a pressed state: background: #F5F5F5, no shadow shift.

  ---
  Form Inputs

  Background: #F5F5F5
  Border: 1.5px transparent (focused: 1.5px #E07B00)
  Border radius: 12px
  Height: 52px
  Padding: 0 16px
  Font: 15px / 400 / Neutral 900
  Label: 13px / 500 / Neutral 500, 6px above field

  Error state: border #C62828, error message in red 12px below field.

  ---
  Status Chips

  Pill shape, border-radius: 999px, padding: 3px 10px, font-size: 12px, font-weight: 600.

  ┌─────────────┬────────────┬─────────┐
  │   Status    │ Background │  Text   │
  ├─────────────┼────────────┼─────────┤
  │ In Progress │ #EBF2FC    │ #1565C0 │
  ├─────────────┼────────────┼─────────┤
  │ Draft       │ #FFFDE7    │ #F9A825 │
  ├─────────────┼────────────┼─────────┤
  │ Sent        │ #EBF2FC    │ #1565C0 │
  ├─────────────┼────────────┼─────────┤
  │ Accepted    │ #E8F5E9    │ #2E7D32 │
  ├─────────────┼────────────┼─────────┤
  │ Rejected    │ #FFEBEE    │ #C62828 │
  ├─────────────┼────────────┼─────────┤
  │ Completed   │ #E8F5E9    │ #2E7D32 │
  ├─────────────┼────────────┼─────────┤
  │ On Hold     │ #FFFDE7    │ #F9A825 │
  ├─────────────┼────────────┼─────────┤
  │ Scheduled   │ #F3E5F5    │ #6A1B9A │
  └─────────────┴────────────┴─────────┘

  ---
  Navigation & Header

  Bottom tab bar:
  Background: #FFFFFF
  Border top: 1px #E5E5E5
  Height: 64px + device safe area
  Active icon + label: #E07B00
  Inactive: #737373
  Label: 11px / 500
  Icon size: 24px

  Screen header:
  Background: #FFFFFF
  Border bottom: 1px #E5E5E5
  Height: 56px
  Title: 20px / 700 / centered or left-aligned
  Back arrow: left side, 24px, Neutral 900
  Action icon (Edit, etc.): right side, Neutral 900

  ---
  Icons

  Use a single icon library throughout — Lucide (MIT, React-ready, clean stroke style).
  - Stroke width: 1.75px consistently
  - Size in nav: 24px. Size in cards/lists: 20px. Size in buttons: 18px.
  - Never mix filled and outline styles.

  ---
  Dividers & Separators

  - Between list items: 1px #E5E5E5, full width, no horizontal inset
  - Between card sections: 1px #E5E5E5, inset 16px from both sides
  - Between page sections: use spacing (lg = 24px gap) — no line needed

  ---
  Motion

  - Tap feedback: 100ms — no delay, instant
  - Sheet / modal slide up: 250ms ease-out
  - Screen transitions: native (let the framework handle it)
  - No decorative animations — this is a work tool

  ---
  Do / Don't

  ┌─────────────────────────────────────────────┬───────────────────────────────────────────┐
  │                     Do                      │                   Don't                   │
  ├─────────────────────────────────────────────┼───────────────────────────────────────────┤
  │ One primary button per screen               │ Two amber buttons side by side            │
  ├─────────────────────────────────────────────┼───────────────────────────────────────────┤
  │ Status always shown as a chip               │ Status as plain text                      │
  ├─────────────────────────────────────────────┼───────────────────────────────────────────┤
  │ Destructive actions in a confirmation sheet │ Delete on first tap                       │
  ├─────────────────────────────────────────────┼───────────────────────────────────────────┤
  │ Left-align text in lists                    │ Center-align body content                 │
  ├─────────────────────────────────────────────┼───────────────────────────────────────────┤
  │ Section headers in ALL CAPS gray            │ Section headers styled like screen titles │
  ├─────────────────────────────────────────────┼───────────────────────────────────────────┤
  │ Card shadow for elevation                   │ Colored card backgrounds                  │
  └─────────────────────────────────────────────┴───────────────────────────────────────────┘

  ---
  This guide is self-contained enough to hand to a developer or paste into a Tailwind config. Want me to translate this
  into a tailwind.config.ts and a shared globals.css to lock in the tokens?
