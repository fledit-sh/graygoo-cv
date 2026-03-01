## CV safe customization surface

Für Layout- oder Branding-Varianten des Lebenslaufs dürfen **nur** die folgenden Tokens in `src/styles/cv-tokens.css` angepasst werden.

### Erlaubte Token-Gruppen

- **Seite & Raster**
  - `--cv-page-width`
  - `--cv-page-min-height`
  - `--cv-shell-padding-*`
  - `--cv-summary-padding-y`
  - `--cv-column-padding`
  - `--cv-left-column-width`
  - `--cv-summary-max-width`

- **Spacing**
  - `--cv-section-gap-*`
  - `--cv-item-gap-*`
  - `--cv-rule-width`

- **Typografie**
  - `--cv-font-size-h1`, `--cv-line-height-h1`
  - `--cv-font-size-section-title`, `--cv-line-height-section-title`
  - `--cv-font-size-body`, `--cv-line-height-body`
  - `--cv-font-size-meta`, `--cv-line-height-meta`
  - `--cv-letter-spacing-title`, `--cv-letter-spacing-section`

- **Farben**
  - `--cv-color-bg-page`
  - `--cv-color-bg-sidebar`
  - `--cv-color-text-primary`
  - `--cv-color-text-secondary`
  - `--cv-color-text-muted`
  - `--cv-color-text-subtle`
  - `--cv-color-line-strong`
  - `--cv-color-line-soft`

### Varianten

- Standard-Variante läuft über `data-theme="default"`.
- Kompakte Variante läuft über `data-theme="compact"`.
- Varianten dürfen nur Token-Werte überschreiben, **nicht** die HTML-Struktur in `src/app/App.tsx`.

### Nicht Teil der Safe Surface

- Reihenfolge oder Semantik der CV-Abschnitte.
- Datenmodell in `src/cv/content/defaultCv.ts`.
- Inhaltsstruktur (z. B. Bullet-Listen, Headings, Kontaktblöcke).
