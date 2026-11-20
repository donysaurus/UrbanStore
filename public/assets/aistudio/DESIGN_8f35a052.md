---
name: Urban Editorial
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5e5f5a'
  on-secondary: '#ffffff'
  secondary-container: '#deddd7'
  on-secondary-container: '#61615c'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#3e0500'
  on-tertiary-container: '#dd5a3e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#e4e2dc'
  secondary-fixed-dim: '#c8c7c0'
  on-secondary-fixed: '#1b1c18'
  on-secondary-fixed-variant: '#474743'
  tertiary-fixed: '#ffdad3'
  tertiary-fixed-dim: '#ffb4a4'
  on-tertiary-fixed: '#3e0500'
  on-tertiary-fixed-variant: '#891e07'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
  canvas: '#FFFFFF'
  ink: '#111111'
  studio-gray: '#EFEFEF'
  surface-alt: '#F7F7F5'
  hairline: '#E5E5E5'
  muted-slate: '#6B6B66'
  terracotta: '#C84B31'
typography:
  display-hero:
    fontFamily: Bodoni Moda
    fontSize: 72px
    fontWeight: '400'
    lineHeight: 76px
    letterSpacing: 0.04em
  display-hero-mobile:
    fontFamily: Bodoni Moda
    fontSize: 36px
    fontWeight: '400'
    lineHeight: 40px
    letterSpacing: 0.03em
  headline-lg:
    fontFamily: Bodoni Moda
    fontSize: 36px
    fontWeight: '500'
    lineHeight: 44px
    letterSpacing: 0.06em
  headline-lg-mobile:
    fontFamily: Bodoni Moda
    fontSize: 26px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: 0.05em
  headline-md:
    fontFamily: Bodoni Moda
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: 0.04em
  headline-sm:
    fontFamily: Bodoni Moda
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: 0.03em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: 0em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.06em
  currency-price:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: -0.02em
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
  space-2xl: 4rem
---

## Brand & Style

This design system embodies the intersection of high-fashion print editorial and high-velocity contemporary e-commerce. Tailored for design-literate, style-conscious consumers, it evokes the restrained sophistication of an independent lookbook paired with absolute transactional clarity. 

The aesthetic is rooted in **Minimalism** with sharp, architectural editorial cues:
- Monochromatic discipline where photography is the sole primary protagonist.
- Pure planar geometry marked by strict 90-degree corners and zero border-radius.
- Layered editorial typography combining dramatic high-contrast serif headlines with utilitarian, modern sans-serif functional copy.
- Structural white space that treats negative space as an intentional framing element rather than empty margin.

## Colors

The color system operates on rigorous restraint. Color is never decorative; it exists purely to establish spatial order or convey functional urgency.

- **Canvas (`#FFFFFF`) & Studio Gray (`#EFEFEF`)**: Pure white acts as the spatial field, while Studio Gray provides backdrop neutral grounding for photography and media placeholders, eliminating visual friction between model imagery and canvas.
- **Ink (`#111111`)**: The near-black foundation for editorial display headers, high-priority interactive buttons, and primary data. It provides sharp contrast against the canvas without the digital harshness of `#000000`.
- **Muted Slate (`#6B6B66`) & Hairline (`#E5E5E5`)**: Muted Slate serves secondary metadata, breadcrumbs, and strikethrough comparison prices. Hairline delivers razor-thin 1px structural framing and dividers without visually fragmenting the viewport.
- **Terracotta (`#C84B31`)**: The sole functional chromatic accent. It is strictly reserved for actionable or critical retail signals: discount badges, promotional markdowns, validation alerts, and destructive cart removals.

## Typography

The typographic hierarchy relies on a dual-engine architecture:

- **Display & Headline Levels**: Typeset in `Bodoni Moda` with uppercase transformation (`text-transform: uppercase`) and wide tracking (`0.03em` to `0.06em`). This introduces high-contrast, editorial gravitas reminiscent of independent physical publications.
- **Body, UI & Currency**: Managed by `Plus Jakarta Sans`. Kept strictly in natural sentence-case or title-case to ensure maximum scannability across dense lists, size selectors, checkout inputs, and Indonesian Rupiah (`Rp125.000`) price formatting.
- **Labels & Micro-actions**: High-emphasis action triggers, category tags, and navigation headers use tracked uppercase sans-serif at reduced point sizes to preserve structural balance against large serif titles.

## Layout & Spacing

The layout employs an asymmetric, fluid editorial grid designed to highlight studio imagery.

- **Grid System**: 
  - **Desktop (1024px+)**: 12-column grid with 24px (`1.5rem`) gutters and 48px (`3rem`) framing canvas margins. Product listings leverage alternating cadences—combining uniform 3- or 4-column product grids with prominent 2-column wide "Spotlight" editorial tiles.
  - **Mobile (320px–480px)**: 4-column layout with 16px (`1rem`) gutters and 16px margins, presenting product lists in either 1-column featured or 2-column condensed formats.
- **Editorial Asymmetry**: Hero viewports pair large display typography with overlapping, intentionally rotated studio photo cards that break baseline boundaries without sacrificing layout alignment.
- **Spatial Rhythm**: Component interiors remain compact (using `space-xs` to `space-md`), while macro layout regions maintain breathing room (`space-xl` to `space-2xl`) to evoke an open exhibition floor.

## Elevation & Depth

This design system prohibits soft drop shadows, blurred ambient glows, and skeuomorphic lighting. Depth is articulated purely through surface juxtaposition and geometric precision:

- **Hairline Framing**: Structural separation between navigation bars, cards, form inputs, and accordions is handled strictly by `1px solid #E5E5E5` hairline borders.
- **Tonal Stepping**: Subtle surface transitions provide spatial elevation without shadows. Baseline canvases rest on `#FFFFFF`, media panels sit on `#EFEFEF`, and drawer sidebars or checkout summaries utilize `#F7F7F5`.
- **Physical Overlap**: The visual dimension is created through layer stacking (z-index ordering)—such as photography cards overlapping uppercase headlines or fly-out cart drawers masking the viewport with flat backdrop dims.

## Shapes

The design system is strictly sharp:
- Every border-radius token is set to `0px`.
- Primary CTAs, input fields, image frames, size swatches, badges, and modals maintain crisp 90-degree corners.
- Color swatches appear as precise `20px × 20px` squares with hairline outlines, reinforcing the architectural, print-editorial aesthetic.

## Components

### Buttons & Action Affordances
- **Primary CTA**: Solid `#111111` background, `#FFFFFF` text, `0px` radius, minimum 48px height, padded with `1rem 2rem`. Text is uppercase sans-serif with expanded letter-spacing. On hover, background shifts to `#2A2A2A`.
- **Secondary CTA / Outlined**: Transparent background, `1px solid #111111` border, `#111111` text, `0px` radius. On hover, inverts to solid `#111111` fill with `#FFFFFF` text.
- **Editorial Text Links**: Minimal inline links styled with an arrow glyph (`View all ↗`, `Go to Checkout →`), featuring an animated 1px bottom rule on hover.

### Product Cards & Media Blocks
- **Card Container**: `0px` radius, no drop shadow. Clean edge-to-edge photography resting on a `#EFEFEF` backdrop.
- **Metadata Stack**: Placed flush beneath the image. Product name in sentence-case sans-serif, price displayed cleanly in Indonesian Rupiah (`Rp125.000`), with original prices marked in strikethrough `#6B6B66`.
- **Sale Badges**: Square or rectangular tag positioned top-left of the media frame. Styled with `#C84B31` text or `#FFFFFF` on `#C84B31` fill, uppercase `label-md`.

### Form Inputs & Size Selectors
- **Input Fields**: Flat surface `#FFFFFF`, `1px solid #E5E5E5` outline, `0px` radius, 44px min height. On focus, outline deepens to `1px solid #111111` without focus rings or glows.
- **Variant & Size Selectors**: Square box format (`44px × 44px` touch targets). Inactive sizes feature `1px solid #E5E5E5` borders; active selection is marked by a solid `#111111` border and fill with white text. Sold-out options display a single diagonal hairline slash.

### Lists & Accordions
- **Editorial Accordion**: Used for product details, material provenance, and shipping policies. Divided by horizontal `1px solid #E5E5E5` lines.
- **Toggles**: Minimalist `+` and `−` symbols rendered in `#111111` without circular container encasements.

### Navigation & Header
- **Minimal Top Bar**: Clean `#FFFFFF` bar bounded on the bottom by a `1px solid #E5E5E5` hairline. Features clean typographic wordmark, search trigger, cart bag with numerical superscript indicator, and a hamburger menu.