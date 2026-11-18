# Prompts for building 3D interactions

Three prompts. Paste one into another AI and fill in the parts in `<angle brackets>`.

For the closest match to the existing lessons, also attach these files from this project:
`docs/3D_BOOK_STANDARD.md`, `js/stage.js`, `js/kit.js`, and one finished lesson such as
`lessons/3-3b-components.js`. The prompts still work without them, but the look will drift.

---

## Prompt 1: An explainer model (take something apart, see how it works)

Use for: parts of a computer, how a router passes data, layers of software.

```text
Build one interactive 3D model for a high-school IB Digital Society lesson.

TOPIC: <e.g. the parts of a home network and what each one does>
SOURCE: <attached chapter pages>. Use them only as a list of topics and terms. Write every
explanation in your own words. Do not copy the text, figures or questions.
STUDENTS: Grade 11, school Chromebooks, Chrome browser, trackpad.

WHAT IT MUST DO
- Show the real objects in 3D so a student recognises them before reading a label.
- Let the student rotate and zoom, and select each part to read what it does, why it matters,
  and one everyday comparison.
- Include an "exploded" view: a slider slides each part straight out of the place it plugs
  into, with a dashed line back to where it belongs. The camera reframes as the slider moves.
- Include one action that shows the mechanism working: data moving step by step from one part
  to the next, with each step described in a list and the current step in bold.
- Include 4 or 5 short challenges: a real-life problem is described and the student selects
  the part responsible. A wrong choice explains what that part actually does.
- Ask one prediction question before the student touches anything.

HOW IT MUST LOOK
- Plain HTML, CSS and JavaScript with Three.js. No build step, no installs, no accounts.
- Build every object in code from simple shapes (boxes, rounded boxes, cylinders, tubes).
  No downloaded models or images.
- Each object needs its two or three signature features: a fan has a ring and blades, memory
  has a gold contact edge, a drive has a label, a circuit board has copper tracks.
- Draw labels, circuit tracks and stickers onto canvas textures in code.
- Metal parts must look like metal: use physically based materials with a reflection map
  baked at start-up from a small "photo studio" of bright panels.
- One warm key light with soft shadows, one cool fill light, a dark radial-gradient background,
  and a round floor that fades out at its edge.
- Name tags are HTML labels with a thin leader line to the part, not text inside the 3D scene.
  Hide them while parts overlap; show them once the parts are separated.
- One small continuous motion at most, such as fans turning.

LAYOUT
- Left: the 3D view, then an information panel, then the controls. This column stays on screen.
- Right, scrolling: title, driving question, what students will be able to do, the prediction,
  the explanation, key terms, three check questions with a specific hint for each wrong answer,
  and one question about impacts on people and communities.

MUST ALSO
- Work with keyboard only: every selectable part also has a real button; sliders are real
  range inputs; arrow keys rotate; plus and minus zoom.
- Have a "Motion: off" switch that stops all animation.
- Have a written text version of everything the model shows.
- Say on screen what the model simplifies, and label any invented figures as examples.
- Stay smooth on a Chromebook: under 200 objects, redraw only when something changes.

BEFORE YOU SAY IT IS DONE
Open it in a browser at 1366 by 768. Use every control. Read the console for errors. Take a
screenshot of each main state and look at it. Tell me what you tested and what you could not.
```

---

## Prompt 2: A scenario simulation (the student has a job to do)

Use for: the computer shop, a technician setting up a home or school network.

```text
Build one interactive 3D scenario for a high-school IB Digital Society unit. The student plays
a role and has to make decisions using what they learned. This is the capstone task for the unit.

SCENARIO: <e.g. You are a network technician. Three clients need a network installed: a family
home, a small office and a school. For each, choose the equipment, connect it, and test it.>
UNIT CONTENT IT MUST USE: <list the terms and ideas, e.g. router, modem, switch, hub, wireless
access point, wired and wireless, client-server, bandwidth, firewall>
STUDENTS: Grade 11, school Chromebooks, Chrome browser, trackpad.

HOW THE SCENARIO WORKS
1. A client appears on an order ticket: who they are, what they want to do, and their budget.
   Write 4 or 5 clients with clearly different needs.
2. The student chooses from a catalogue: 3 options in each of 4 to 6 categories, each with a
   price. Prices are classroom figures and must be labelled as not real products.
3. As each item is chosen it appears in the 3D scene in the place it belongs, and a running
   total is shown against the budget.
4. The student presses Test. The scenario runs the client's actual use against the choices and
   reports, item by item, what works, what does not, and the reason in plain words.
5. There are four possible outcomes: it does not do the job; it works but is over budget; it
   works but costs far more than the job needs; or it is right. Work out "far more than needed"
   by comparing with the cheapest set of choices that passes.
6. The student can change choices and test again, then move to the next client.

RULES FOR THE MODEL BEHIND IT
- Write the rules down explicitly: what each client needs in each category, and any rule that
  links categories (for example, the power supply must cover what the other parts draw).
- Every client must have at least one solution inside their budget. Check this by trying all
  combinations in code, and tell me the cheapest passing price for each client.
- More than one choice must work for each client, so the student has to weigh cost, not guess.
- No reward for random clicking: a wrong test result always explains the reason.

THE WRITING THAT FOLLOWS
After the scenario, the page asks the student to:
- write to two of the clients explaining what was chosen, what was left out and why, the price,
  and using at least five terms from the unit correctly;
- answer one exam-style question in full: a 4-mark "explain" and two 8-mark "to what extent"
  or "discuss" questions about people and consequences, not only the technology.

LOOK, LAYOUT, ACCESSIBILITY, TESTING
Follow the same requirements as an explainer model: objects built in code from simple shapes
and recognisable at a glance; studio lighting, soft shadows and metal that reflects; HTML
labels; the 3D view on the left with controls beneath it and the task text on the right;
every choice available as a real button; a Motion-off switch; a written text version with the
full catalogue and client list; and a statement of what the scenario leaves out.
Keep the controls compact so the 3D view stays at least 400 pixels tall on a 768-pixel screen.

BEFORE YOU SAY IT IS DONE
Open it at 1366 by 768. For every client, test a build that fails, one that is over budget,
one that is wasteful and one that is right, and confirm each message is correct. Check the
console. Take a screenshot and look at it. Tell me what you tested and what you could not.
```

---

## Prompt 3: Fixing weak artwork

Use when a model works but looks like coloured blocks.

```text
The 3D model works but the artwork is not good enough. Improve the look without changing what
it teaches or how the controls behave.

1. Lighting. Add a reflection map baked once from a small studio of bright panels, a warm key
   light with soft shadows, a cool fill light, filmic tone mapping, a dark gradient background
   and a floor that fades at its edge.
2. Materials. Use physically based materials. Bare metal: fully metallic, fairly smooth.
   Plastic and paint: matt to semi-gloss. Glowing lights: emissive, used sparingly.
3. Detail. Rebuild each object with 5 to 30 shapes and its signature features. Use rounded
   boxes for anything a hand would hold. Add the small parts that explain function: sockets,
   contacts, vents, cables, fans with real blades.
4. Surface detail. Draw circuit tracks, silkscreen text and product-style labels on canvas
   textures in code. Any printed figure is an example and must be labelled as one.
5. Framing. The model should fill at least half the height of the view in every main state.
   Nothing may sit behind the on-screen buttons.
6. Labels. Use HTML name tags with leader lines. No overlapping labels in the default views.
7. Performance. Redraw only on change, and redraw shadows only when the model itself changes.

Then take a screenshot of each main state, look at it, and compare it with the previous
version. If someone who has not read the labels could not name the objects, keep going.
```

---

## What made the existing models work

- **The look is in two shared files**, `js/stage.js` (lighting, camera, labels) and `js/kit.js`
  (materials and shapes). A new lesson only adds its own objects, so it cannot look different.
- **Every lesson is one data file** with the same fields: question, targets, prediction, scenes,
  sections, terms, questions, inquiry.
- **Each model was checked by looking at screenshots**, not by assuming the code was right.
