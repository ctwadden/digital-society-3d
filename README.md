# Digital Society in 3D

An interactive 3D "book" for IB Digital Society. Each lesson puts 3D models the student can
turn and experiment with beside a short explanation, key terms, self-check questions and an
inquiry prompt about impacts on people and communities.

Built so far: the whole of **3.3 Computing devices**, four lessons and nine 3D models:

- 3.3A Types of computers: *Computers at true scale*
- 3.3B Components of a computer: *Inside the box*, *Follow the data*, *Software layers*
- 3.3C Uses and forms of computer coding: *Translate a program*, *Flip the bits*
- 3.3D Evolution of computing: *Five generations*, *Moore's Law*, *Measure a qubit*

Also built: **3.4 Networks and the internet**, six lessons and eight 3D models, all in
`lessons/3-4-networks.js` so they share the same network parts (laptop, router, server):

- 3.4A Types of computing networks: *Networks by size*, *Client-server or peer-to-peer*
- 3.4B Components of computing networks: *A school network*
- 3.4C Characteristics of computing networks: *Packets across the internet*, *Bandwidth*
- 3.4D/E Network services and the World Wide Web: *Using a service*
- 3.4F Evolution of the internet and the web: *Four stages of the web*
- 3.4G Internet dilemmas: *Attack and defend*

Health and Education are listed on the contents page as planned. The look and behaviour every
lesson must match is written down in `docs/3D_BOOK_STANDARD.md`.

All lesson text is original. The course textbook was used only as a list of topics and terms.

## Open it

Plain HTML, CSS and JavaScript. No build step, no install, no accounts, no data leaves the browser
(self-check scores are kept in the browser's local storage only).

- **Simplest:** double-click `index.html`. The site uses ordinary scripts, not modules, so it is
  designed to run straight from a folder. (Tested over a local web server; not yet tested from a
  double-clicked file.)
- **Local server:** in this folder run `python3 -m http.server 8790`, then open
  <http://localhost:8790>.
- **For students:** upload the whole folder to any static host (GitHub Pages, Netlify, a school
  web server) and share the link. Chromebooks need nothing installed.

Three.js loads from the jsDelivr CDN. If the school network blocks it, the copy in
`vendor/three.min.js` is used automatically.

## Controls

- Drag to rotate. Pinch on the trackpad, or use the + and − buttons, to zoom. A plain two-finger
  scroll still scrolls the page.
- Click a part to select it. Every part also has a button under the model.
- Keyboard: Tab to the model, then arrow keys rotate, + and − zoom, 0 resets. All buttons,
  sliders and questions work with Tab, Space and arrow keys.
- **Motion: on/off** turns animations off (it follows the device's reduced-motion setting by default).
- Each lesson has a "Text versions of the 3D models" section with the same content in words.

## Files

```
index.html            contents page (built from js/book.js)
lesson.html           the one lesson page; ?id=3.3b chooses the lesson
css/book.css          all styling
js/book.js            table of contents: chapters and lessons   <- edit to add a lesson
js/shell.js           turns a lesson definition into the page   (no need to edit)
js/stage.js           3D stage: camera, labels, picking, tweens, control builder
js/kit.js             helpers for building models from simple shapes
lessons/*.js          one file per lesson
vendor/three.min.js   offline copy of Three.js r149
```

## Add a lesson

1. Copy `lessons/3-3b-components.js` to a new file, e.g. `lessons/3-4a-types-of-networks.js`.
2. In `js/book.js`, add an entry to the right chapter (or give a planned entry a `file`):

   ```js
   { id: '3.4a', title: 'Types of networks', file: 'lessons/3-4a-types-of-networks.js', summary: '...' }
   ```

3. In the new file, call `DSBook.defineLesson({...})` with the same `id`. The fields:

   | Field | What it is |
   | --- | --- |
   | `title`, `question`, `intro`, `targets[]` | Heading, driving question, opening line, learning targets |
   | `predict` | `{ q, options[], after }` shown before the student interacts |
   | `scenes[]` | `{ id, title, hint, build(stage, K), textVersion }`, one tab per scene |
   | `sections[]` | `{ heading, html }` explanation |
   | `terms[]` | `[term, definition]` pairs |
   | `questions[]` | `{ q, options[], answer, why }`; a wrong option can be `[text, feedback]` |
   | `inquiry` | `{ prompt, consider[] }` |

4. Inside `build(stage, K)`:
   - add shapes to `stage.root` using `K.box`, `K.rbox` (rounded), `K.cyl`, `K.sphere`, `K.tube`, `K.fan`,
     `K.plate` + `K.tex` (a label or circuit board drawn in code), `K.text`, `K.line`, `K.floor`, `K.put`;
     pass `K.metal(colour)` as the last argument for a metal finish;
   - `stage.setView({ target, radius, theta, phi })` frames the camera;
   - `stage.label(text, object, { offset: [dx, dy] })` adds a label with a leader line to an object;
   - `stage.pickable(object, id)` and `stage.onPick = fn` make things clickable;
   - `stage.ui.button / choices / slider` add keyboard-friendly controls under the model;
   - `stage.info(html)` writes to the panel under the model;
   - `stage.tween(ms, fn, done)` animates (and respects Motion: off).

   The shell clears everything when the student switches scene, so a scene needs no clean-up code.

After changing any file, raise `version` in `js/book.js` and the `?v=` numbers in `index.html` and
`lesson.html`, so browsers do not keep showing the old copy.

Keep models to a few hundred simple shapes so they stay smooth on a Chromebook. The stage only
redraws when something changes.
