# Wijzigingshistorie

Alle belangrijke wijzigingen aan de Moodle Embed Generator worden in dit bestand bijgehouden.

## [1.3.0] - 2026-09-25

### Toegevoegd

- Een eigen favicon in de bestaande blauw-magenta huisstijl.
- Een herkenbaar beeldmerk met codehaken en invoegpijl, geoptimaliseerd voor kleine weergaveformaten.

### Gewijzigd

- De standaard Vite-favicon vervangen door het nieuwe beeldmerk.
- README bijgewerkt met de nieuwe favicon.

## [1.2.0] - 2026-08-27

### Toegevoegd

- Canva als dertiende contenttype.
- Ondersteuning voor gepubliceerde Canva-insluitlinks en volledige Canva-embedcode.
- Responsive Canva-weergave met behoud van de oorspronkelijke beeldverhouding.
- Geautomatiseerde tests voor de Canva-parser en HTML-generator.

### Beveiliging

- Vite bijgewerkt van versie 5 naar 8.2.2.
- `@vitejs/plugin-react` bijgewerkt naar 6.1.0.
- Kwetsbare indirecte versies van esbuild, nanoid en PostCSS verwijderd.
- `npm audit` rapporteert geen bekende kwetsbaarheden meer.

### Gewijzigd

- README bijgewerkt naar dertien ondersteunde contenttypen.
- Testcommando `npm test` toegevoegd.

[1.3.0]: https://github.com/dennizg/moodle-embedcode-generator/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/dennizg/moodle-embedcode-generator/releases/tag/v1.2.0
