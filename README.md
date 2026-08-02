# Compass — concept demo

An interactive demo of a concept iOS app for the Compass Card, the fare card
for Metro Vancouver. It is a self-initiated design project and is **not
affiliated with or endorsed by TransLink or BC Ferries**.

The app runs at a fixed 402 × 874 — an iPhone screen — because it is shown
inside a phone frame on a case study rather than as a website.

## Stack

- Vite + React (JavaScript)
- No router: navigation is a screen stack over two tabs
- State is in memory only, so every visit starts from the same seeded data

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # builds to dist/ with relative paths, so it can be served
                 # from any sub-path
```

## Payments

Every payment flow is fake. Nothing is charged, no card details are
collected, and each payment step says so on screen.

## Fonts

Type is FF Meta, loaded from an Adobe Fonts kit at runtime. The font files
are licensed and are not part of this repository; until the kit id is filled
in, the app falls back to the system UI font.
