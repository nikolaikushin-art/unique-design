# UNIQUE Visual Studio — React / Three.js prototype

A separate client-facing 3D configurator for UNIQUE Detailing, built with
React + TypeScript + React Three Fiber. Visual tokens (colors, fonts, logo,
button/card/modal styles) are ported 1:1 from the CRM archive you provided.
The existing CRM/website projects were not modified.

## Run it
```
npm install
npm run dev       # http://localhost:5173
npm run build     # production build to dist/
npm run preview   # serve the production build
```

## What's real vs. placeholder — please read this
- **No licensed 3D vehicle model is bundled.** Real branded car meshes
  (Porsche 911, BMW M3, etc.) are copyrighted assets — I can't extract them
  from paid third-party software (e.g. 3D Changer) or generate them from
  nothing, and this build environment has no internet access to download
  files even where licensing would allow it. Until real files are sourced,
  the studio renders a stylised, brand-neutral **procedural body** so the
  materials can still be demoed truthfully.
- **The GLB loader is now real and wired up** (`three/CarModel.tsx`): set
  `modelUrl` on any vehicle in `src/data/vehicles.ts` and drop the matching
  file in `public/models/` — the studio will render that mesh instead of the
  placeholder, auto-centred/scaled, with paint/tint/wheel materials applied
  to any mesh named `body_*` / `glass_*` / `wheel_*` inside the file. No
  other code changes needed. See **"Adding real car models"** below.
- What *is* real and fully working regardless of geometry: the material/
  configuration engine. Every treatment (PPF Clear/Satin/Matte, colour
  palette with finishes, ceramic, wheel finish, glass tint, optics) actually
  changes the 3D material in real time — that's the hard part of a
  configurator, and it already works against real GLTF meshes, not just the
  placeholder.
- The 3D environment is fully procedural (drei `Lightformer`s) — no external
  HDRI fetch, so it works fully offline and won't silently fail in a
  restricted network.
- Prices shown are the ones actually published on the UNIQUE site; anything
  not published renders as "по расчёту" / "после осмотра" — never invented.
- The request form is still a demo: it stores the submission in
  `localStorage` only. Nothing is emailed and there is no admin/staff
  inbox yet — see "Client-form-to-email flow" below for what that needs.

## Adding real car models
1. Get a GLB with commercial-use rights — either:
   - Buy per-model licenses from **Sketchfab Store**, **CGTrader**, or
     **TurboSquid** (typically $30–150/model; check "commercial use" and
     "no attribution required" explicitly), or
   - Commission a 3D artist for your exact fleet (Fiverr/Upwork, ~$80–250/car
     for a game-res exterior), or
   - Buy 3D Changer itself if their license permits exporting/reusing the
     underlying meshes outside their app (check with them — by default a
     visualization tool's asset library isn't licensed for reuse elsewhere).
2. In Blender (free), rename the body panels' material slots/mesh names to
   start with `body_`, glass to `glass_`, wheels to `wheel_` (case-
   insensitive prefix match — exact names don't matter beyond the prefix).
   Leave chrome/trim/interior meshes named anything else so they render as
   authored.
3. Export as `.glb`, drop it in `public/models/`, e.g. `porsche-911.glb`.
4. In `src/data/vehicles.ts` add `modelUrl: "/models/porsche-911.glb"` to
   that vehicle's entry. Done — no other file needs to change.

## Client-form-to-email flow (what you described, not yet built)
"Client fills a form on unique-detailing.ru → it lands with the studio →
staff configures the car → client gets an email with the result" is a real
feature but it's a backend, not a frontend tweak — this zip is a static
front-end only, it has nowhere to send or receive data from. Building it
needs a few decisions I can't make for you:
- Where does the form live — embedded on unique-detailing.ru itself, or a
  link to this studio app with a "?leadId=…" query param?
- Where do submissions get stored/reviewed — a simple admin inbox in this
  app (needs hosting + a database), or into a CRM/Bitrix/Google Sheet you
  already use?
- Who sends the client email and from what address — a transactional email
  provider (e.g. Resend, Postmark, SMTP via Yandex 360) needs an API key and
  a verified sending domain.
Once you tell me which of these you already have (or want me to set up),
this can be wired in — the request-summary screen (`ui/RequestFlow.tsx`) and
the CRM-shaped payload (`VisualConfiguration` in `domain/types.ts`) already
exist and are ready to be the input to that pipeline.

## Architecture
- `src/domain/types.ts` — shared types, incl. a CRM-ready `VisualConfiguration` payload
- `src/data/treatments.ts` — single source of truth for the service catalogue (meant to be shared with the CRM later)
- `src/data/vehicles.ts` — controlled prototype vehicle set (6 cars, brief §10)
- `src/store/useStudioStore.ts` — Zustand store; 3D/config/UI state kept separate
- `src/three/` — CarModel (real GLB loader + procedural fallback) + StudioCanvas (camera presets, lighting, environment)
- `src/screens/` — Welcome, Vehicles/garage, Studio (the hero screen), Saved Configurations, Profile
- `src/ui/` — shared components: option cards, modals/sheets, request flow, before/after compare

## Honest scope
This implements the **core experience** the actual goal is: select →
visualise → configure → compare → save → request. This build is internal-
use only — the client-facing "Club" loyalty screen has been removed;
Profile is a light stub for staff, ready to be filled in as needed.

## Next real steps, in order
1. Source 1–2 real licensed GLB models (see "Adding real car models" above)
   and confirm the mesh-naming convention renders correctly end to end.
2. Decide the form/hosting/email approach (see "Client-form-to-email flow"
   above) so the request flow can actually reach a client's inbox instead of
   `localStorage`.
