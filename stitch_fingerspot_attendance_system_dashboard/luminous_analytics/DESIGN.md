---
name: Luminous Analytics
colors:
  surface: '#fbf9fa'
  surface-dim: '#dbd9db'
  surface-bright: '#fbf9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f5'
  surface-container: '#efedef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#44474c'
  inverse-surface: '#303032'
  inverse-on-surface: '#f2f0f2'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#515f74'
  primary: '#1d2b3e'
  on-primary: '#ffffff'
  primary-container: '#334155'
  on-primary-container: '#9eadc5'
  inverse-primary: '#b9c7e0'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#38270a'
  on-tertiary: '#ffffff'
  tertiary-container: '#503d1e'
  on-tertiary-container: '#c3a881'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3fd'
  primary-fixed-dim: '#b9c7e0'
  on-primary-fixed: '#0d1c2f'
  on-primary-fixed-variant: '#3a485c'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#fcdeb3'
  tertiary-fixed-dim: '#dfc299'
  on-tertiary-fixed: '#281901'
  on-tertiary-fixed-variant: '#574424'
  background: '#fbf9fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container-margin: 32px
  gutter: 20px
---

## Brand & Style
The brand personality is professional, transparent, and effortlessly organized. Targeted at modern HR departments and enterprise managers, this design system evokes a sense of clarity and "breathable" space within data-heavy attendance environments.

The visual style is **Light Glassmorphism**. It utilizes multi-layered translucency to create a sense of depth without heavy shadows. By prioritizing whitespace and subtle frosted-glass effects, the UI feels premium and lightweight, transforming mundane administrative tasks into a refined analytical experience.

## Colors
The palette is intentionally restrained and monochrome to ensure that status indicators (success, warning, danger) remain the primary focal points. 

The background is not a flat tint but a soft radial gradient that provides a luminous foundation for the glass layers. Surfaces use varying levels of white opacity—lower for standard cards to let the background bleed through, and higher for navigation and modals to ensure legibility and functional focus.

## Typography
The typography uses **Inter** for its systematic, utilitarian, and highly legible characteristics. 

- **Headlines:** Use Bold and Semi-Bold weights with slight negative letter-spacing to create a "tight," premium editorial look.
- **Body Text:** Primary information uses Dark Slate Gray (#334155), while secondary descriptions and metadata use Medium Gray (#64748B) to establish a clear hierarchy.
- **Labels:** Small caps or increased letter spacing should be applied to tiny labels to maintain readability against frosted backgrounds.

## Layout & Spacing
This design system employs a **Fluid Grid** model with a 12-column structure for desktop. 

- **Desktop:** 32px side margins with 20px gutters. Content is housed in glass "modules" that can span 3, 4, 6, or 12 columns.
- **Tablet:** Transitions to an 8-column grid with 24px margins.
- **Mobile:** A single-column flow with 16px margins. 

The spacing rhythm is based on a 4px baseline, ensuring all padding and margins are multiples of 4 (e.g., 16px, 24px, 40px) to maintain mathematical harmony and visual balance.

## Elevation & Depth
Elevation is achieved through optical physics rather than traditional heavy shadows.

- **The Glass Layer:** Every card must have a `backdrop-filter: blur(12px)` and a background opacity of 55%.
- **The Stroke:** A 1px hairline border using Dark Slate Gray at 8% opacity creates a crisp edge that prevents the glass from "melting" into the background.
- **The Shadow:** Use a "Floating Shadow" technique: `0px 10px 30px rgba(51, 65, 85, 0.05)`. This shadow is extremely soft, providing a subtle lift without appearing muddy.
- **Z-Index Hierarchy:** Modals and sidebars use a higher opacity (85%) and more significant blur (20px) to indicate they sit physically closer to the user.

## Shapes
The shape language is "Soft-Modern," using significant rounding to move away from rigid corporate structures.

- **Cards:** 16px corners provide a friendly, approachable container for data.
- **Buttons & Inputs:** A slightly tighter 12px radius ensures these interactive elements feel distinct and easy to click.
- **Pills/Badges:** Status indicators and avatars are fully rounded (pill-shaped) to provide a high-contrast shape language against the rectangular cards.
- **Modals:** Use the most generous radius (24px) to emphasize their role as the highest-level container.

## Components
- **Buttons:** Primary buttons use a solid Dark Slate Gray with white text. Secondary buttons are "ghost" glass with the hairline border. Hover states should slightly increase the backdrop blur intensity.
- **Chips & Badges:** Used for attendance status (e.g., "Present", "Late"). Use a light tint of the status color for the background (10% opacity) and the full status color for the text.
- **Input Fields:** 12px radius with a 1px hairline border. On focus, the border opacity increases to 30%, and the background opacity shifts to 75% for better contrast while typing.
- **Cards:** The primary container. Must include the 55% white opacity, 12px blur, and the soft floating shadow. Content inside should have 24px padding.
- **Attendance Timeline:** A vertical list with "fully rounded" nodes representing clock-in/out events, connected by a 2px Medium Gray line at 20% opacity.
- **Progress Rings:** For "Shift Completion" or "Overtime" analytics, use thin-stroke circular graphs with status colors to break up the text-heavy dashboard.