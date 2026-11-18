# Interactive 3D Book Standard

Version 1.0 · 10 November 2026 · Reference implementation: lesson 3.3B "Components of a computer"
(`lessons/3-3b-components.js`, model "Inside the box").

This file does two jobs:

1. **Part A** is a prompt you can paste into another LLM to get the same page layout, 3D look and
   interaction quality.
2. **Part B** is the detailed standard that prompt refers to. Attach this whole file with the prompt.

If the other LLM has access to this project folder, tell it to reuse `js/stage.js`, `js/kit.js`,
`js/shell.js` and `css/book.css` unchanged and only write a new file in `lessons/`. That is the
surest way to stay consistent. The standard below exists for when it does not have the code.

---

## Part A. Prompt to paste

```text
You are building one lesson of an interactive 3D "book" for IB Digital Society (high school).
Follow the attached Interactive 3D Book Standard exactly. Where the standard gives a number
(light intensity, colour, font size, budget), use that number.

LESSON TO BUILD
- Lesson id and title: <e.g. 3.4a Types of networks>
- Source for topics and key terms: <attached chapter pages>. Use it only as a topic and
  vocabulary list. Write every explanation, definition, question and example in your own words.
  Do not copy its text, figures, tables or exam questions.
- Devices: school Chromebooks in Chrome. No install, no build step, no accounts, no student data.

WHAT TO PRODUCE
1. One lesson file that calls DSBook.defineLesson({...}) using the schema in section B7.
2. Two or three 3D models ("scenes") for the lesson. Each scene must make one mechanism visible:
   what goes in, what acts on it, what comes out, and where it can fail.
3. For each scene: a prediction asked before interaction, a meaningful thing to manipulate, an
   observable result, an explanation, and a changed-scenario question. Label what the model
   simplifies and any made-up figures.

HOW IT MUST LOOK (section B3 to B5)
- Build every object in code from primitives. No downloaded models, no image files.
- Objects must be recognisable as the real thing, not coloured boxes: correct proportions,
  5 to 30 sub-shapes per object, metal where the real thing is metal, text and circuit detail
  drawn onto canvas textures.
- Use the studio lighting, shadow, tone-mapping and material settings in B3 without changes.
- Labels are HTML name tags with leader lines, never text baked into the 3D scene.
- Exploded views move each part in a straight line out of the place it plugs into and draw a
  dashed guide back to that place.

HOW IT MUST BEHAVE (section B6)
- Drag rotates, pinch or +/- zooms, plain two-finger scroll still scrolls the page.
- Every clickable part also has a real button under the model. Sliders are real range inputs.
- Arrow keys rotate, + and - zoom, 0 resets. A "Motion: on/off" switch stops all animation.
- Each scene has a written text version of the same content.

BEFORE YOU SAY IT IS DONE (section B8)
Open it in a browser at 1366x768, exercise every control, read the console, take a screenshot
of each scene in each main state and look at it. Fix what is wrong. Report what you tested and
what you could not test. Do not describe untested behaviour as working.
```

---

## Part B. The standard

### B1. Technology

| Item | Requirement |
| --- | --- |
| Rendering | Three.js r149, loaded as a classic `<script>` from jsDelivr with a local copy as fallback. No ES modules, no bundler, so the folder also works from a static host with no build step. |
| Code style | Plain ES5-style JavaScript in IIFEs. No frameworks. |
| Files | `index.html` (contents), `lesson.html?id=…` (one shell for every lesson), `css/book.css`, `js/book.js` (table of contents), `js/shell.js` (page builder), `js/stage.js` (3D stage), `js/kit.js` (shape helpers), `lessons/*.js`. |
| Adding a lesson | One new file in `lessons/` plus one entry in `js/book.js`. The shell is never edited. |
| Data | Nothing leaves the browser. Self-check scores go to `localStorage` only. |

### B2. Page layout

- **Top bar:** 52 px, dark (`#14232e`), sticky. "← Contents" link, then a breadcrumb.
- **Two columns** below it, CSS grid `minmax(0,1.3fr) minmax(0,1fr)`:
  - **Left, sticky, full viewport height:** scene tabs → 3D stage (fills the spare height,
    rounded 10 px) → info panel (white card, 4 px teal left border, 76–148 px tall, scrolls) →
    controls (rows of buttons and sliders).
  - **Right, scrolls:** kicker, title, driving question (teal), intro, "By the end you can" card,
    "Predict first" card (coral tint), explanation sections, text versions of the models
    (`<details>`), key terms, "Check yourself" questions, inquiry card (dark), pager.
- **Under 860 px wide:** one column, stage 56 % of viewport height, no sticky.
- **Stage overlay:** zoom +, zoom −, Reset and Motion buttons top right; a one-line hint bottom left.
- **Palette:** paper `#f5f1e8`, card `#fffdf8`, ink `#1d2730`, muted `#5b6770`, teal `#0f766e`,
  coral `#c2410c`, night `#14232e`. Correct `#dcf5e3`/`#166534`, incorrect `#fdeadf`/`#9a3412`.
- **Type:** system UI font. Body 16 px / 1.55. Title 32 px. Section heads 21 px. Info panel 14.5 px.
- **Focus:** 3 px amber (`#f59e0b`) outline on every focusable element.

### B3. Lighting and rendering (do not vary between lessons)

| Setting | Value |
| --- | --- |
| Renderer | `antialias: true`, pixel ratio `min(devicePixelRatio, 1.5)`, sRGB output |
| Tone mapping | ACES Filmic. Exposure is set per scene: about **1.3** for dark objects (hardware), **0.6–0.75** for scenes made of light or saturated blocks. |
| Camera | Perspective, 40° field of view |
| Background | Radial gradient texture: `#2b4a5c` centre → `#152632` → `#0a1319` edge |
| Reflections | A reflection map baked once at start-up from a tiny "photo studio": a dark box with four bright panels (white overhead, cool left, warm right, white front), via `PMREMGenerator.fromScene`. Assigned to `scene.environment`. This is what makes metal look like metal. |
| Key light | Directional, `#fff3e2`, intensity 1.25, from upper right front. Casts shadows. |
| Fill light | Directional, `#a9c8ff`, intensity 0.35, from the left. No shadows. |
| Ambient | Hemisphere, sky `#dfeaf5`, ground `#2a3540`, intensity 0.5 |
| Shadows | PCF soft, 1024 map, radius 3, bias −0.0006, normal bias 0.03. `autoUpdate` off: the shadow map is redrawn only when the model changes, not when the camera moves or a fan spins. |
| Floor | A circle with a radial-gradient alpha texture that fades to nothing at its edge, receiving shadows. Never a hard-edged slab. |
| Redraw | Render on demand. The loop runs but only draws when something changed. |

### B4. Modelling rules

1. **Recognisable first.** A student should name the object before reading the label. Get the
   proportions and the two or three signature features right (a fan has blades and a ring; RAM
   has a gold contact edge; a drive has a label).
2. **Units and scale.** Keep one scale within a scene. State when sizes are not to scale.
3. **Materials.** `MeshStandardMaterial` everywhere.
   - Painted or plastic: roughness 0.5–0.65, metalness 0–0.3.
   - Bare metal (steel, aluminium, gold contacts, copper): metalness 1, roughness 0.28–0.4.
   - Glowing accents (LED strip, status light): emissive colour, intensity 0.9–1.6. Use sparingly.
   - Hardware palette: case `#2b323a`, dark plastic `#15181c`, steel `#b9c0c7`,
     aluminium `#9aa3ab`, gold `#d9a930`, copper `#b87333`, circuit board `#0e3b29`,
     accent blue `#2f6fe0`, accent orange `#f97316`, accent teal `#2dd4bf`.
4. **Detail budget.** 5–30 primitives per object. Use rounded boxes for anything a hand would
   hold. Add small parts that explain function (sockets, slots, contacts, vents, cables).
5. **Textures are drawn in code** on a 2D canvas: circuit tracks with 45° bends and solder dots,
   silkscreen text, product-style labels, brushed metal. Placed on a thin plane 0.001–0.002 above
   the surface. Any printed specification must be an example and be labelled as such.
6. **No stock assets.** No downloaded models, HDRIs or images.
7. **Life.** One small continuous motion per scene at most (fans turning). It must stop when
   Motion is off and must not trigger shadow redraws.
8. **Shadows.** Every solid mesh casts and receives.

### B5. Labels, selection and exploded views

- **Labels** are HTML elements positioned each frame from a projected 3D anchor. Style: 12.5 px,
  weight 600, white on `rgba(8,18,25,.9)`, 1 px light border, 6 px radius. A label has a pixel
  offset from its anchor and a 1.2 px white leader line ending in a small dot on the part.
- **Declutter.** When parts overlap (an assembled object), hide part labels and show them once
  the parts are separated. Never let two labels sit on top of each other in the main views.
- **Selection.** The chosen part gets an emissive tint (`#0f4a52`); nothing else changes colour.
  The same selection is always available from a button under the model.
- **Exploded view.**
  - Each part travels in a straight line from its home to its "out" position. Parts leave in the
    direction they would physically be unplugged.
  - A dashed teal guide line connects each part to its home whenever it is displaced.
  - Out positions are chosen so no two parts overlap from the default exploded camera.
  - The camera target, distance and angle interpolate with the slider so the whole set stays framed.
  - Flat parts may turn to face the viewer as they come out.
  - Offer both a slider and a one-press "Pull it apart for me" button.

### B6. Interaction, accessibility and performance

- **Orbit:** drag rotates; two-pointer pinch and ctrl+wheel (trackpad pinch) zoom; plain wheel is
  left alone so the page scrolls. Vertical angle is clamped so the camera never goes under the floor.
- **Keyboard:** canvas is focusable; arrows rotate, `+`/`-` zoom, `0` resets. All other controls
  are native buttons, radio inputs and range inputs in DOM order.
- **Reduced motion:** follows the system setting and has a visible toggle. When off, tweens
  complete instantly and continuous motion stops. Step-by-step sequences show the full list of
  steps as text, with the current one in bold, so nothing depends on watching movement.
- **Text equivalent:** every scene has a written version with the same facts and tasks.
- **Colour** is never the only signal: selections also change button state and panel text.
- **Budgets per scene:** under 200 draw calls, under 20,000 triangles, one 1024 shadow map, no
  post-processing. (Reference scene: 139 draw calls, about 7,800 triangles.)
- **Learning sequence:** predict → manipulate → observe → explain → transfer. Clicking through is
  not evidence of learning; feedback explains the mechanism and wrong answers get specific hints.

### B7. Lesson schema

```js
DSBook.defineLesson({
  id: '3.3b',
  title: '…', question: '…', intro: '…',
  targets: ['…'],
  predict: { q: '…', options: ['…'], after: '…' },          // asked before interacting
  scenes: [{
    id: 'inside', title: 'Inside the box', hint: '…',
    build: function (stage, K) { /* add models, controls */ },
    textVersion: '<table>…</table>'                         // non-3D equivalent
  }],
  sections: [{ heading: '…', html: '…' }],
  terms: [['Term', 'Definition']],
  questions: [{ q: '…', options: ['right', ['wrong', 'why it is wrong']], answer: 0, why: '…' }],
  inquiry: { prompt: '…', consider: ['…'] }                 // people and communities
});
```

Stage API used inside `build`: `stage.root` (add objects here), `stage.setView({target, radius,
theta, phi, shadow, exposure})`, `stage.label(text, object, {offset})`, `stage.pickable(obj, id)`,
`stage.onPick`, `stage.highlight(obj)`, `stage.tween(ms, fn, done)`, `stage.onFrame` with
`stage.animating`, `stage.info(html)`, `stage.ui.button / choices / slider / row`.

Kit helpers: `K.box`, `K.rbox`, `K.cyl`, `K.sphere`, `K.tube`, `K.fan`, `K.plate`, `K.tex`,
`K.text`, `K.line`, `K.floor`, `K.put`, `K.metal(colour, roughness)`.

### B8. Acceptance checks

Record Pass, Fail or Not tested for each. Screenshots are required for the visual rows.

| Check | Pass means |
| --- | --- |
| Recognition | Someone who has not read the labels can name the main objects |
| Framing | Model fills at least half the stage height in every main state; nothing hides behind the overlay buttons |
| Labels | No overlapping labels in the default views; leader lines land on the right part |
| Lighting | Metal shows reflections; shadows fall on the floor; nothing is blown out or murky |
| Controls | Every button, slider and tab does what its label says; Reset returns the view |
| Picking | Clicking a part and pressing its button give the same result |
| Keyboard | Whole lesson usable with Tab, Space, Enter and arrow keys |
| Motion off | No movement; sequences still readable |
| Feedback | Each wrong answer gives its own explanation; the prediction is asked before the reveal |
| Honesty | Simplifications and invented figures are labelled where students see them |
| Console | No errors on load or during use |
| Size | Works at 1366×768 and stacks without sideways scroll at 700 px |
| Device | Tested on an actual school Chromebook, or reported as not tested |

### B9. What is and is not captured as a "skill"

No installed skill exists yet. Consistency currently comes from three things:

1. `js/stage.js`: all lighting, shadows, camera, labels and controls. Lessons cannot change the look by accident.
2. `js/kit.js`: the material presets and shape builders.
3. This document: the modelling rules and acceptance checks that code cannot enforce.

A sensible next step is to package Part B as a reusable skill ("ds-3d-scene") with the two code
files as bundled resources, so any future session loads the same rules automatically.
