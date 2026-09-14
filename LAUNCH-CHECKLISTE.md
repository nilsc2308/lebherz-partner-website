# Launch-Checkliste – Lebherz & Partner GmbH (neue Website, Apple-Stil)

Stand: 14. September 2026 · Projekt: `Documents/website 1/lebherz-partner-web`
Vorlage/Inhaltsquelle: https://ib-lup.de (bestehende Website). Die alte Website bleibt unangetastet.

Legende: **✅ erledigt** · **⚠️ offen, braucht eine Angabe oder Entscheidung vom Kunden** · **⏳ erst nach dem Livegang möglich**

## Offene Kundenangaben (bitte durchgeben)

| | Punkt | Wo |
|---|---|---|
| ⚠️ | **Fotorechte** – Die Team-Porträts, Baustellen- und Drohnenfotos stammen von ib-lup.de (Fotograf: Stephan Wieland Photografie). Bitte bestätigen, dass die Lizenz auch die neue Website abdeckt, und dass alle abgebildeten Personen einverstanden sind (13 Porträts, Montage-Teams) | `img/k-*.webp`, `img/p-*.webp`, `img/BILDNACHWEIS.md` |
| ⚠️ | **Domain** – Canonical, Sitemap, robots.txt, OG-Tags und JSON-LD zeigen auf `https://www.ib-lup.de`. Wenn die neue Seite unter `lebherz-und-partner.de` oder woanders laufen soll: in allen HTML-Dateien, `sitemap.xml` und `robots.txt` ersetzen (Suchen & Ersetzen) | überall |
| ⚠️ | **Hoster in der Datenschutzerklärung** – Platzhalter `[Hoster eintragen …]` durch den tatsächlichen Anbieter ersetzen (GitHub Pages = GitHub, Inc.; Netlify = Netlify, Inc.; oder wie bisher futris.net) | `datenschutz.html`, Abschnitt „Externes Hosting“ |
| ⚠️ | **Formular-Versand** – Das Kontaktformular ist für **Netlify Forms** vorbereitet (Honeypot, Weiterleitung auf `danke.html`). Auf **GitHub Pages funktioniert der Versand nicht** (statisches Hosting ohne Formular-Backend). Entscheidung: Netlify hosten oder anderen Formulardienst (z. B. Formspree) eintragen; danach Platzhalter `[Formular-Dienst eintragen …]` in der Datenschutzerklärung ersetzen | `kontakt.html`, `datenschutz.html` |
| ⚠️ | **Instagram-Adresse** – Auf ib-lup.de steht nur „Triff uns auf Instagram“ ohne erkennbare URL. Eingetragen ist `https://www.instagram.com/lebherzundpartner/` (Annahme!). Bitte richtigen Profilnamen nennen | Fußzeile, `kontakt.html`, JSON-LD |
| ⚠️ | **Öffnungszeiten** – nirgends angegeben, daher weggelassen (auch nicht im JSON-LD). Wenn gewünscht: durchgeben | `kontakt.html` |
| ⚠️ | **Ertragsrechner (Photovoltaik-Seite)** – Richtwerte: 5 m² je kWp, 950 kWh je kWp und Jahr, Strompreis 0,35 €/kWh, Einspeisevergütung 0,08 €/kWh, Eigenverbrauch 30 % ohne / 60 % mit Speicher, CO₂-Faktor 0,38 kg/kWh. Bitte vom Fachteam plausibilisieren oder anpassen | `main.js`, Block „Ertragsrechner“ |
| ⚠️ | **Beispiel-Ablauf Großanlage** – fiktives Beispielprojekt (480 kWp, 1.100 Module, 16 Wochen) – so gekennzeichnet. Gern durch ein echtes anonymisiertes Referenzprojekt ersetzen | `grossanlagen.html`, `main.js`, Block „Beispiel-Ablauf“ |
| ⚠️ | **Wärmepumpen-Schnell-Check (3 Fragen)** – die Ergebnistexte sind allgemein gehalten. Bitte fachlich gegenlesen | `heizsysteme.html` |
| ⚠️ | **Ratgeber-Artikel** – drei allgemein gehaltene Artikel (Speicher, Messkonzept 8, PV anmelden). Bitte fachlich gegenlesen, insbesondere steuerliche Aussagen (Nullsteuersatz, Einkommensteuerbefreiung bis 30 kWp) | `ratgeber-*.html` |
| ⚠️ | **FAQ** – 11 Fragen, Antworten ausschließlich aus Inhalten von ib-lup.de abgeleitet. Bitte gegenlesen | `faq.html` |
| ⚠️ | **Stellenanzeige** – „Anlagenmechaniker SHK (m/w/d)“ von ib-lup.de übernommen. Noch aktuell? Weitere Stellen? | `ueber-uns.html#karriere` |
| ⚠️ | **Antwortzeit** – Kontakt- und Danke-Seite versprechen „Rückruf innerhalb weniger Tage“ (wie auf ib-lup.de). Passt das? | `kontakt.html`, `danke.html` |
| ⚠️ | **Solarrechner Eturnity** – wird nur verlinkt (neues Fenster), nicht mehr eingebettet – dadurch kein Cookie-Banner nötig. Wenn die Einbettung gewünscht ist, braucht die Seite wieder eine Einwilligungslösung | `index.html`, `photovoltaik.html` |
| ⚠️ | **Unsplash-Fotos von Herstellerkonten** – `hz-wp*.webp` und `03-waerme.webp` stammen vom Unsplash-Konto „alpha innotec“, `rg-3.webp` von „Sungrow EMEA“ (Unsplash-Lizenz, frei nutzbar). Falls keine fremden Marken gezeigt werden sollen: austauschen | `img/`, `heizsysteme.html`, `index.html` |

## Marke

| | Punkt | Stand |
|---|---|---|
| ✅ | **Farben** | Aus Logo und CSS von ib-lup.de: Blau `#134094` (Buttons, dunkle Flächen), Gelb `#ffdd00` (Akzent, Haupt-Buttons), Logo-Hellblau `#718cbf`/`#4266a9`. Dazu Weiß / `#f5f5f7` / `#1d1d1f` |
| ✅ | **Logo** | Original-SVGs von ib-lup.de (`img/logo.svg`, `img/logo-negativ.svg`); Favicon = Haus-Bildmarke auf Blau (`favicon.svg`, `apple-touch-icon.png`) |
| ⚠️ | **Schrift** | ib-lup.de nutzt eine Adobe-Fonts-Schrift (Typekit). Hier läuft wie gewünscht **Inter lokal** (`fonts/`), kein Adobe-Aufruf mehr. Falls die Original-Schrift gewünscht ist: Lizenz-Webfont-Dateien nötig |

## Rechtliches

| | Punkt | Stand |
|---|---|---|
| ✅ | **Impressum** | Wortgleich von ib-lup.de übernommen (HRB 6464, USt-IdNr. DE/BE, Vertretung, Disclaimer), TMG-Verweise auf DDG aktualisiert, Bildnachweis ergänzt |
| ✅ | **Datenschutzerklärung** | Text von ib-lup.de übernommen. Entfernt, weil nicht mehr im Einsatz: Google Tag Manager, CCM19-Consent, Adobe Fonts, Eturnity-iFrame, Instagram-Plugin. Ergänzt: Kontaktformular, lokale Schriften, jsDelivr, OpenStreetMap erst per Klick, Cookies/sessionStorage. Zwei Platzhalter (Hoster, Formulardienst) – siehe oben |
| ✅ | **Cookie-Banner** | Nicht nötig: keine Cookies, kein Tracking, Schriften lokal, Karte erst per Klick, Solarrechner nur verlinkt |

## Technik

| | Punkt | Stand |
|---|---|---|
| ✅ | **Seiten** | 17: index, photovoltaik, heizsysteme, grossanlagen, engineering, ueber-uns, ratgeber + 3 Artikel, faq, kontakt, danke, 404, impressum, datenschutz |
| ✅ | **Startseite** | 700vh-Foto-Szene: Aachener PV-Dach (Zoom) → Kachel-Montage (Montage-Team) → Text-Maske „WÄRME“ (Wärmepumpe) → Lamellen (Solarpark) → Zoom-Dive + Lichtblitz + 3D-Karte (Aachen bei Sonnenuntergang). Danach Laufband, Zahlen (2.500 Anlagen, 20 Mio. kWh – Quelle ib-lup.de), Bento, Foto-Kacheln, Ablauf, Zitat, CTA |
| ✅ | **Interaktiv** | Ertragsrechner (Photovoltaik), 3-Fragen-Check (Heizsysteme), Beispiel-Ablauf mit Live-Zahlen (Großanlagen), klickbare Leistungsstufen (Engineering), FAQ-Suche, Themenwahl im Kontaktformular |
| ✅ | **Mobile** | Burger ab 1020 px, Vollbild-Menü, Sticky-Button. Getestet bei 390 px (iPhone) und 1400 px in Chromium und WebKit (Safari-Engine), jede Seite komplett durchgescrollt: 0 JS-Fehler, kein horizontales Scrollen |
| ✅ | **Performance** | Alle Fotos WebP in zwei Größen mit `srcset`, `width`/`height`, Lazy-Loading; Schrift lokal und vorgeladen; Cache-Header in `netlify.toml` |
| ✅ | **Accessibility** | Sprung-zum-Inhalt-Link, Fokus-Styles, Tastaturbedienung (Menü, Rechner, Quiz, Ablauf, FAQ), `aria-pressed`/`aria-expanded`/`aria-live`, Kontrast AA (Blau auf Weiß 9,7:1, Blau auf Gelb 6,4:1), `prefers-reduced-motion` schaltet Szene, Vorhang und Laufband ab |
| ✅ | **SEO** | Meta-Titel/-Beschreibungen je Seite, Canonical, OG-Tags, JSON-LD LocalBusiness (alle Seiten), FAQPage (faq), Article (Ratgeber), `sitemap.xml` (15 URLs), `robots.txt` |
| ✅ | **Sicherheit** | `netlify.toml` mit X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy; Formular mit Honeypot |
| ⏳ | **Nach Livegang** | Google Search Console: Sitemap einreichen; Formular-Testsendung; ggf. Weiterleitungen von alten URLs (`engineering-services.html` → `engineering.html`, `team.html` → `ueber-uns.html`, `datenschutzerklaerung.html` → `datenschutz.html`) einrichten |

## Sicherung & Veröffentlichung

- Backup: `lebherz-partner-web_2026-09-14.tar.gz` im Ordner `Documents/website 1`
- Git-Repository im Projektordner; Vorschau auf GitHub Pages (siehe README.md)
- Lokal ansehen: Ordner öffnen und `index.html` doppelklicken – oder im Terminal `python3 -m http.server 8765` im Projektordner und http://localhost:8765 aufrufen
