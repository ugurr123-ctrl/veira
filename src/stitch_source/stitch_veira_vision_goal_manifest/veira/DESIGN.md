---
name: Veira
colors:
  surface: '#0e1228'
  surface-dim: '#0e1228'
  surface-bright: '#343850'
  surface-container-lowest: '#080c22'
  surface-container-low: '#161a30'
  surface-container: '#1a1e35'
  surface-container-high: '#252840'
  surface-container-highest: '#2f334b'
  on-surface: '#dee0ff'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#dee0ff'
  inverse-on-surface: '#2b2f46'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#e7c355'
  on-secondary: '#3d2f00'
  secondary-container: '#8e7100'
  on-secondary-container: '#fffbff'
  tertiary: '#7bd0ff'
  on-tertiary: '#00354a'
  tertiary-container: '#009bd1'
  on-tertiary-container: '#002d40'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#ffe089'
  secondary-fixed-dim: '#e7c355'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#c4e7ff'
  tertiary-fixed-dim: '#7bd0ff'
  on-tertiary-fixed: '#001e2c'
  on-tertiary-fixed-variant: '#004c69'
  background: '#0e1228'
  on-background: '#dee0ff'
  surface-variant: '#2f334b'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-sm:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  title-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.75rem
  margin: 1.25rem
  margin-lg: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes an atmospheric, nocturnal sanctuary dedicated to mindful intentionality, deep reflection, and deliberate action. The aesthetic balances deep-space tranquility with high-editorial sophistication. Designed primarily for mobile-first contemplative productivity, it merges ethereal glassmorphism with classic publishing elegance.

### Emotional Landscape
- **Serene & Introspective:** Rich midnight tones create an expansive, low-distraction canvas that calms the senses during dawn planning or midnight journaling.
- **Luminous & Celestial:** Subtle prismatic refractions, soft aurora glows, and delicate champagne accents evoke cosmic wonder without feeling synthetic or abrasive.
- **Refined Authority:** High-contrast editorial typography grounds ephemeral visual effects in timeless literary structure.

### Design Archetype: Nocturnal Glassmorphic Editorial
The interface relies on translucent, tinted glass tiers layered over deep astronomical backgrounds. Frosted planes catch delicate light along their boundaries, producing tactile depth while keeping visual noise low. Restraint governs every interaction: surfaces glow softly upon engagement, mimicking radiant celestial bodies.

## Colors

The color architecture is built for nocturnal immersion, employing deep void tones as the foundation, energetic indigo as the cognitive anchor, and warm celestial gold for achievement and mindful realization.

### Palette Architecture
- **Canvas & Base Tiers:**
  - `Surface Void` (`#080A16`): The boundless absolute base layer.
  - `Surface Container` (`#0D1127`): Layered panels and resting surfaces.
  - `Surface Elevated` (`#141936`): Interactive cards, modular sheets, and floating dialogues.
- **Primary Celestial Tones:**
  - `Primary Indigo` (`#6366F1`): Primary focus indicators, active states, key CTAs, and progress markers.
  - `Primary Ethereal` (`#818CF8`): Delicate glowing text accents, icon highlights, and soft focus states.
- **Secondary Starlight Accents:**
  - `Starlight Champagne` (`#F5D061`): Mindful streaks, completed milestones, and premium reflective moments.
  - `Deep Gold` (`#E5B842`): Warm secondary interactive states and trophy accents.
  - `Champagne Glow` (`#FDF4DC`): Luminous high-contrast text accents and star-flare center points.
- **Aurora Auxiliaries:**
  - `Aurora Cyan` (`#38BDF8`): Clarity, morning rhythms, and intuitive pathways.
  - `Dawn Rose` (`#EC4899`): Flame badges, active habit streaks, and heart-centered affirmations.

### Contrast & State Guidance
- All white or off-white copy on translucent layers must maintain a minimum contrast ratio of 4.5:1 against `#0D1127`.
- Hover and touch responses leverage light emission rather than darkening: increase opacity or introduce radial light bleeds around the touch center.

## Typography

The typography pairs the editorial elegance of Playfair Display with the clean readability of Inter. This combination balances contemplative literary expression with data clarity. Full Turkish character set support (`ğ`, `ü`, `ş`, `ı`, `ö`, `ç`, `İ`, `Ğ`, `Ü`, `Ş`, `Ö`, `Ç`) is natively accounted for across all weights and styles.

### Type Hierarchy & Roles
- **Headlines (Playfair Display):** Conveys intentionality, chapter headings, mindful quotes, and reflective queries. It introduces editorial warmth, counterbalancing the dark digital space.
- **Body & Functional Labels (Inter):** Delivers clear readability for action items, tracking parameters, metrics, and interactive triggers.

### Typesetting Rules
- Never pair Playfair Display with all-caps styling; reserve capitalization strictly for `label-sm` or category tracking badges rendered in Inter.
- Titles rendered in Playfair Display should retain tighter line heights to maintain a composed, literary appearance.

## Layout & Spacing

The layout model optimizes for focused handheld interactions using a fluid column structure with adaptive gutters.

### Mobile Grid Architecture
- **Column System:** 4 fluid columns on mobile devices, expanding to 8 on tablets and 12 on wider screens.
- **Outer Canvas Margins:** 20px (`1.25rem`) padding on standard screens, expanding to 24px (`1.5rem`) on larger devices.
- **Rhythmic Stacking:** Spacing between disparate contemplation blocks follows a 4px/8px modular base scale (`space-md` for grouped nodes, `space-xl` between modular sections).

### Flow & Adaptation
- Vertical breathing room takes priority over dense information packing.
- Safe-area insets must always incorporate a frosted atmospheric dissipation gradient, ensuring content glides beneath translucent home bars and camera cutouts without abrupt boundaries.

## Elevation & Depth

Depth is defined through light dispersion, backdrop blurs, and luminous boundaries rather than opaque shadows.

### Glassmorphism & Tonal Layering
1. **Base Layer (Ground Zero):** Absolute `#080A16` with ambient, non-uniform background radial gradients in celestial indigo and dawn magenta (opacity 15-25%, blur 80-120px).
2. **Surface Layer 1 (Standard Frosted Card):**
   - Background: `rgba(13, 17, 39, 0.65)`
   - Backdrop filter: `blur(20px)`
   - Border: `1px solid rgba(255, 255, 255, 0.12)`
   - Shadow: `0 8px 32px 0 rgba(0, 0, 0, 0.37)`
3. **Surface Layer 2 (Raised Floating Modules & Drawers):**
   - Background: `rgba(20, 25, 54, 0.75)`
   - Backdrop filter: `blur(28px)`
   - Border: `1px solid rgba(129, 140, 248, 0.25)` (delicate indigo perimeter catch-light)
   - Shadow: `0 12px 40px 0 rgba(8, 10, 22, 0.6), 0 0 1px 1px rgba(255, 255, 255, 0.08) inset`

### Luminous Edge Highlights
All translucent panels utilize a subtle top-to-bottom border gradient: starting at `rgba(255, 255, 255, 0.2)` at the top edge, tapering to `rgba(255, 255, 255, 0.04)` at the bottom edge. This simulates overhead ambient starlight catching physical glass.

## Shapes

The design system employs a rounded shape language (`roundedness: 2`) that brings soft geometry to modular cards, input surfaces, and dialogs.

### Curvature Taxonomy
- **Standard Surfaces & Cards:** `0.5rem` (8px) for compact tiles; `1rem` (16px) for standard cards; `1.5rem` (24px) for prominent hero modules and sliding sheets.
- **Pills & Circular Motifs:** Interactive buttons, category markers, habit badges, and circular progress nodes override the base geometry to form fully circular or pill ends (`rounded-full` / 9999px).

## Components

### Buttons & Interactive Controls
- **Primary Glowing Pill Button:**
  - Shape: Fully pill-shaped (`9999px`).
  - Background: Gradient fill from `#6366F1` to `#818CF8`.
  - Box Shadow: `0 0 20px rgba(99, 102, 241, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.3)`.
  - Label: Inter `label-lg`, white, medium weight.
  - Active Press: Downward scale to `0.98`, shadow intensity softens to 10px blur.
- **Secondary Ghost Glass Pill:**
  - Shape: Fully pill-shaped (`9999px`).
  - Background: `rgba(255, 255, 255, 0.06)`, `backdrop-blur(12px)`.
  - Border: `1px solid rgba(255, 255, 255, 0.15)`.
  - Text: `#FDF4DC` or `#818CF8`.

### Category Tags & Badges
- **Radiant Category Pill:**
  - Background: `rgba(99, 102, 241, 0.12)`.
  - Border: `1px solid rgba(99, 102, 241, 0.3)`.
  - Typography: `label-sm` in `#818CF8`, tracked slightly wide.
  - Optional soft glowing dot indicator anchored to the left.

### Streak & Mindful Habit Badges
- **Flame Streak Badge:**
  - Background: Linear tint from `rgba(236, 72, 153, 0.15)` to `rgba(245, 208, 97, 0.15)`.
  - Perimeter: `1px solid rgba(245, 208, 97, 0.35)`.
  - Icon: Dual-tone vector flame utilizing Dawn Rose (`#EC4899`) core with Champagne Gold (`#F5D061`) crown.
  - Number display: Inter `label-md` bold in `#FDF4DC`.

### Circular Progress Indicators
- **Astral Progress Ring:**
  - Track: `rgba(255, 255, 255, 0.08)` unclosed or closed track.
  - Progress Arc: Linear gradient stroke (`#6366F1` to `#38BDF8`), terminating in a soft rounded cap with a 4px blurred starlight endpoint marker.
  - Interior: Displays milestone completion count or percentages in Playfair Display (`headline-md`).

### Cards & Modules
- **Glassmorphic Journal/Action Card:**
  - Padding: `space-lg` (24px).
  - Background: Translucent frosted glass with 15% opacity perimeter highlight.
  - Typography Hierarchy: Editorial serif headline on top (`headline-md`), paired with `body-md` Inter notes beneath.

### Input Fields & Selectors
- **Ethereal Field:**
  - Background: `rgba(13, 17, 39, 0.5)`.
  - Border: `1px solid rgba(255, 255, 255, 0.1)`.
  - Active/Focused: Border shifts to `#6366F1` with an outer diffuse halo (`0 0 12px rgba(99, 102, 241, 0.3)`).
  - Placeholder: Inter `body-md`, rendered in muted slate (`rgba(255, 255, 255, 0.4)`).