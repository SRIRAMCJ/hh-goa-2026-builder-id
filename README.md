# HH Goa 2026 — Builder ID Card Generator

A lightweight, mobile-first Builder ID generator for the HH Goa 2026 shortlisting task.

## Features

- Upload JPG, PNG, WEBP or HEIC/HEIF photos
- Crop-to-fill handling for portrait and landscape images
- Name, stack/role and builder title fields
- Generates a **1600 × 1000 PNG (16:10)**
- Download PNG
- Web Share API support with X fallback
- No login/signup
- Photo processing happens in the browser

## Visual direction

- Warm off-white paper background
- Black typography and structure
- Acid yellow accent
- Monospace labels
- Oversized editorial typography
- Restrained borders
- Simple ID-card composition

## Run locally

```bash
python -m http.server 5500
```

Open `http://localhost:5500`.

## Deploy

Static-site compatible with GitHub Pages, Vercel, Netlify and Cloudflare Pages.
