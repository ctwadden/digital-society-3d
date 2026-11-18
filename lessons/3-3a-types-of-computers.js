/* 3.3A Types of computers. One model: eight kinds of computer in one room at true scale. */
(function () {
  'use strict';

  var DEVICES = [
    {
      id: 'embedded', name: 'Embedded computer', size: 'A circuit board a few centimetres across, hidden inside another product.',
      what: 'Hardware and software built into a machine to do one job: run the microwave timer, control a washing cycle, manage a car engine.',
      trade: 'Cheap, tiny and reliable in its own environment (heat, vibration, damp). It cannot be given a different job.',
      users: 'No direct users. People use the appliance, not the computer.'
    },
    {
      id: 'wearable', name: 'Wearable computer', size: 'About 4 cm across, worn on the body.',
      what: 'A computer packed with sensors that stays on you: smartwatches, fitness bands, smart glasses, medical monitors.',
      trade: 'Always with you and always measuring. Tiny screen, small battery, and it collects very personal data such as heart rate and location.',
      users: 'One person, continuously.'
    },
    {
      id: 'phone', name: 'Smartphone (mobile device)', size: 'About 15 cm tall, fits in a pocket.',
      what: 'A general-purpose computer with a touchscreen, cameras, location services and a mobile network connection.',
      trade: 'Goes everywhere and connects anywhere. Limited by battery life, screen size and less processing power than larger machines.',
      users: 'One person. For many people worldwide it is their only computer.'
    },
    {
      id: 'tablet', name: 'Tablet', size: 'About 25 cm tall, the size of a thin book.',
      what: 'A touchscreen computer that sits between a phone and a laptop. Good for reading, drawing, video and forms.',
      trade: 'Bigger screen than a phone and lighter than a laptop. Long typing and demanding software are harder without a keyboard.',
      users: 'One person, or shared in a classroom, shop or clinic.'
    },
    {
      id: 'laptop', name: 'Laptop (notebook)', size: 'About 33 cm wide, carried in a bag.',
      what: 'A personal computer with screen, keyboard, trackpad and battery in one folding case.',
      trade: 'Close to desktop power and still portable. Hard to upgrade or repair, and easy to lose or steal along with its data.',
      users: 'One person. The usual choice for students and office workers.'
    },
    {
      id: 'desktop', name: 'Desktop computer', size: 'A tower about 45 cm tall plus a separate monitor, keyboard and mouse.',
      what: 'The original personal computer: a system unit that stays on or under a desk.',
      trade: 'Most power for the price, easy to upgrade and repair, and data stays in the building. It cannot go anywhere.',
      users: 'One person at a time. Common in offices, labs and gaming.'
    },
    {
      id: 'server', name: 'Server', size: 'A rack about 2 m tall holding many flat server units.',
      what: 'A computer whose job is to provide a service to other computers over a network: web pages, email, files, printing, databases.',
      trade: 'Runs all day for many people at once. Needs power, cooling, security and specialist staff. Thousands together form a data centre.',
      users: 'Hundreds to millions, none of them sitting at it.'
    },
    {
      id: 'mainframe', name: 'Mainframe', size: 'Cabinets about 2 m tall in a secure, cooled room.',
      what: 'The largest kind of commercial server, built for huge numbers of transactions with almost no downtime: banking, airline booking, government records.',
      trade: 'Extremely reliable and secure at very high volume. Very expensive, and only large organisations can run one.',
      users: 'Thousands of users and applications at the same moment.'
    }
  ];

  var CHALLENGES = [
    { text: 'A bank must record every card payment in the country, thousands each second, without ever stopping.', answer: 'mainframe', why: 'Mainframes are built for huge volumes of transactions with almost no downtime.' },
    { text: 'A dishwasher needs to run the same few wash programmes for fifteen years in heat and steam.', answer: 'embedded', why: 'One fixed job in a harsh environment is exactly what an embedded computer is designed for.' },
    { text: 'A runner with diabetes wants their blood-sugar readings checked all day without stopping what they are doing.', answer: 'wearable', why: 'A wearable stays on the body and measures continuously through its sensors.' },
    { text: 'A school wants one place that stores every student’s files so they can be reached from any classroom.', answer: 'server', why: 'A file server provides one service to many other computers across the network.' },
    { text: 'A video editor wants the most power for the money and plans to add a better graphics card next year.', answer: 'desktop', why: 'Desktops give the most performance for the price and are the easiest to upgrade.' }
  ];

  function build(stage, K) {
    var T = THREE, g = stage.root, V = T.Vector3;
    var ROOM = { target: [1.4, 0.95, 0], radius: 8.6, theta: 0.28, phi: 1.3 };
    stage.setView({ target: ROOM.target, radius: ROOM.radius, theta: ROOM.theta, phi: ROOM.phi, minR: 0.25, maxR: 14, shadow: 6, exposure: 0.95 });
    g.add(K.floor(10, 0));

    var steel = K.metal(0xb9c0c7, 0.3), alu = K.metal(0xc3c9cf, 0.35), body = 0x15181c;

    function screen(w, h, kind) {
      return K.tex(256, Math.round(256 * h / w), function (c, cw, ch) {
        var gr = c.createLinearGradient(0, 0, cw, ch);
        gr.addColorStop(0, '#1d4ed8'); gr.addColorStop(1, '#0f766e');
        c.fillStyle = gr; c.fillRect(0, 0, cw, ch);
        c.fillStyle = 'rgba(255,255,255,.9)';
        if (kind === 'time') {
          c.textAlign = 'center'; c.font = '800 ' + Math.round(ch * 0.34) + 'px system-ui, sans-serif';
          c.fillText('10:31', cw / 2, ch * 0.52);
          c.font = '600 ' + Math.round(ch * 0.14) + 'px system-ui, sans-serif'; c.fillText('72 bpm', cw / 2, ch * 0.78);
        } else if (kind === 'icons') {
          var n = 4, s = cw / (n * 1.6);
          for (var r = 0; r < Math.floor(ch / (s * 1.6)) - 1; r++) for (var i = 0; i < n; i++) {
            c.fillStyle = ['#fde68a', '#fca5a5', '#bbf7d0', '#e9d5ff'][(i + r) % 4];
            c.fillRect(s * 0.5 + i * s * 1.5, s * 0.6 + r * s * 1.6, s, s);
          }
        } else {
          c.fillStyle = 'rgba(255,255,255,.92)'; c.fillRect(cw * 0.08, ch * 0.12, cw * 0.56, ch * 0.7);
          c.fillStyle = 'rgba(15,23,42,.75)';
          for (var l = 0; l < 6; l++) c.fillRect(cw * 0.12, ch * (0.2 + l * 0.09), cw * (0.3 + (l % 3) * 0.08), ch * 0.03);
          c.fillStyle = 'rgba(255,255,255,.8)'; c.fillRect(cw * 0.68, ch * 0.12, cw * 0.24, ch * 0.32);
        }
      });
    }
    function lit(w, h, kind) {
      var p = K.plate(w, h, screen(w, h, kind), { emissive: 0xffffff, emissiveIntensity: 0.6, roughness: 0.2 });
      p.material.emissiveMap = p.material.map; // the screen glows with its own picture
      return p;
    }

    /* ---- furniture and a person for scale ---- */
    K.put(K.box(3.0, 0.04, 0.8, 0x8a6a4a, { roughness: 0.75 }), 0, 0.73, 0, g);
    [[-1.42, -0.34], [-1.42, 0.34], [1.42, -0.34], [1.42, 0.34]].forEach(function (p) {
      K.put(K.box(0.05, 0.71, 0.05, 0x2b323a, K.metal(0x2b323a, 0.4)), p[0], 0.355, p[1], g);
    });
    K.put(K.box(0.9, 0.86, 0.6, 0xe7e5e4, { roughness: 0.6 }), -2.6, 0.43, 0, g);
    K.put(K.box(0.94, 0.04, 0.64, 0x3f3f46, { roughness: 0.4 }), -2.6, 0.88, 0, g);

    var person = K.group(), skin = 0x9fb4c0;
    [-0.1, 0.1].forEach(function (x) { K.put(K.cyl(0.075, 0.065, 0.85, 0x334155, 14), x, 0.425, 0, person); });
    K.put(K.rbox(0.42, 0.62, 0.22, 0.08, 0x0f766e, { roughness: 0.7 }), 0, 1.17, 0, person);
    [-0.27, 0.27].forEach(function (x) { K.put(K.cyl(0.05, 0.045, 0.6, 0x0f766e, 12), x, 1.15, 0, person); });
    K.put(K.cyl(0.05, 0.05, 0.08, skin, 12), 0, 1.51, 0, person);
    K.put(K.sphere(0.115, skin, 20), 0, 1.6, 0, person);
    K.put(person, 2.15, 0, 0.35, g);
    stage.label('Person, 1.7 m', new V(2.15, 1.75, 0.35), { cls: 'quiet', offset: [0, -16] });

    var models = {};

    /* ---- embedded: a controller board shown lifted out of a microwave ---- */
    var emb = K.group();
    K.put(K.box(0.5, 0.3, 0.36, 0xcfd4d9, K.metal(0xcfd4d9, 0.45)), 0, 0.15, 0, emb);
    K.put(K.box(0.33, 0.22, 0.01, 0x0b0d10, { roughness: 0.15 }), -0.065, 0.15, 0.181, emb);
    K.put(K.box(0.11, 0.24, 0.012, 0x23282e), 0.18, 0.15, 0.181, emb);
    K.put(K.box(0.08, 0.035, 0.004, 0x22c55e, { emissive: 0x22c55e, emissiveIntensity: 1.2 }), 0.18, 0.235, 0.188, emb);
    for (var b = 0; b < 6; b++) K.put(K.box(0.025, 0.02, 0.004, 0x9aa3ab), 0.155 + (b % 2) * 0.05, 0.18 - Math.floor(b / 2) * 0.035, 0.188, emb);
    var board = K.group();
    board.add(K.box(0.1, 0.006, 0.07, 0x0e3b29));
    K.put(K.box(0.03, 0.006, 0.03, 0x15181c), -0.01, 0.006, 0, board);
    K.put(K.box(0.012, 0.01, 0.02, 0xb9c0c7, steel), 0.03, 0.007, 0.015, board);
    K.put(K.box(0.012, 0.012, 0.012, 0xd9a930, K.metal(0xd9a930, 0.3)), 0.032, 0.008, -0.018, board);
    board.rotation.x = 0.9;
    K.put(board, 0.18, 0.45, 0.12, emb);
    emb.add(K.line([new V(0.18, 0.4, 0.14), new V(0.18, 0.27, 0.19)], 0x7fd3c8));
    models.embedded = { obj: emb, pos: [-2.6, 0.9, 0], focus: [0.18, 0.4, 0.1], r: 1.4, at: [0.18, 0.5, 0.12], offset: [-24, -26] };

    /* ---- wearable ---- */
    var watch = K.group();
    var band = new T.Mesh(new T.TorusGeometry(0.028, 0.006, 8, 32), K.mat(0x334155, { roughness: 0.8 }));
    band.castShadow = true;
    K.put(band, 0, 0.034, 0, watch);
    var face = K.group();
    face.add(K.rbox(0.038, 0.044, 0.011, 0.009, body, { metalness: 0.7, roughness: 0.3 }));
    K.put(lit(0.03, 0.036, 'time'), 0, 0, 0.0062, face);
    face.rotation.x = -Math.PI / 2;
    K.put(face, 0, 0.066, 0, watch);
    models.wearable = { obj: watch, pos: [-1.2, 0.75, 0.15], focus: [0, 0.04, 0], r: 0.3, at: [0, 0.08, 0], offset: [-30, -112] };

    /* ---- phone and tablet, propped up ---- */
    function slab(w, h, kind) {
      var s = K.group(), inner = K.group();
      inner.add(K.rbox(w, h, 0.008, w * 0.12, body, { metalness: 0.7, roughness: 0.3 }));
      K.put(lit(w * 0.92, h * 0.94, kind), 0, 0, 0.0046, inner);
      inner.rotation.x = -0.3;
      K.put(inner, 0, h / 2 * Math.cos(0.3), 0, s);
      return s;
    }
    models.phone = { obj: slab(0.072, 0.15, 'icons'), pos: [-0.95, 0.75, 0.12], focus: [0, 0.08, 0], r: 0.5, at: [0, 0.16, 0], offset: [-10, -86] };
    models.tablet = { obj: slab(0.18, 0.25, 'icons'), pos: [-0.62, 0.75, 0.05], focus: [0, 0.12, 0], r: 0.75, at: [0, 0.26, 0], offset: [12, -60] };

    /* ---- laptop ---- */
    var lap = K.group(), base = K.rbox(0.33, 0.23, 0.014, 0.015, 0xc3c9cf, alu);
    base.rotation.x = -Math.PI / 2;
    K.put(base, 0, 0.007, 0, lap);
    K.put(K.box(0.28, 0.002, 0.11, 0x23282e), 0, 0.015, -0.03, lap);
    K.put(K.box(0.09, 0.002, 0.06, 0xaab2ba), 0, 0.015, 0.07, lap);
    var lid = K.group();
    K.put(K.rbox(0.33, 0.22, 0.006, 0.015, 0xc3c9cf, alu), 0, 0.11, 0, lid);
    K.put(lit(0.31, 0.2, 'window'), 0, 0.11, 0.0035, lid);
    lid.rotation.x = -0.28;
    K.put(lid, 0, 0.014, -0.112, lap);
    models.laptop = { obj: lap, pos: [-0.12, 0.75, 0.05], focus: [0, 0.1, 0], r: 0.95, at: [0, 0.24, -0.1], offset: [34, -36] };

    /* ---- desktop ---- */
    var desk = K.group();
    K.put(K.rbox(0.56, 0.34, 0.02, 0.012, body, { roughness: 0.3, metalness: 0.4 }), 0, 0.3, -0.15, desk);
    K.put(lit(0.53, 0.31, 'window'), 0, 0.3, -0.139, desk);
    K.put(K.box(0.04, 0.14, 0.03, 0xb9c0c7, steel), 0, 0.07, -0.17, desk);
    K.put(K.box(0.22, 0.012, 0.15, 0xb9c0c7, steel), 0, 0.006, -0.15, desk);
    K.put(K.box(0.4, 0.016, 0.13, 0x23282e, { metalness: 0.5, roughness: 0.4 }), 0, 0.008, 0.16, desk);
    for (var r = 0; r < 4; r++) for (var c = 0; c < 12; c++) K.put(K.box(0.026, 0.006, 0.022, 0xd7dde2), -0.176 + c * 0.032, 0.019, 0.115 + r * 0.03, desk);
    K.put(K.rbox(0.06, 0.035, 0.1, 0.015, 0x23282e), 0.3, 0.017, 0.16, desk);
    var tower = K.group();
    tower.add(K.box(0.2, 0.44, 0.42, 0x2b323a, { metalness: 0.55, roughness: 0.42 }));
    K.put(K.box(0.012, 0.3, 0.004, 0x2dd4bf, { emissive: 0x2dd4bf, emissiveIntensity: 1.5 }), 0.05, 0, 0.212, tower);
    K.put(tower, 0.52, 0.22, -0.05, desk);
    models.desktop = { obj: desk, pos: [0.72, 0.75, 0.05], focus: [0.15, 0.22, 0], r: 1.7, at: [0, 0.5, -0.15], offset: [50, -18] };

    /* ---- server rack ---- */
    var rack = K.group();
    K.put(K.box(0.6, 2.0, 1.0, 0x1a1e24, { metalness: 0.5, roughness: 0.45 }), 0, 1.0, 0, rack);
    for (var u = 0; u < 12; u++) {
      K.put(K.box(0.52, 0.13, 0.02, 0x343b43, K.metal(0x343b43, 0.4)), 0, 0.2 + u * 0.15, 0.505, rack);
      K.put(K.box(0.012, 0.012, 0.004, 0x22c55e, { emissive: 0x22c55e, emissiveIntensity: 1.6 }), -0.22, 0.2 + u * 0.15, 0.517, rack);
      K.put(K.box(0.012, 0.012, 0.004, u % 4 === 1 ? 0xf59e0b : 0x22c55e, { emissive: u % 4 === 1 ? 0xf59e0b : 0x22c55e, emissiveIntensity: 1.6 }), -0.19, 0.2 + u * 0.15, 0.517, rack);
      for (var d = 0; d < 4; d++) K.put(K.box(0.07, 0.09, 0.004, 0x15181c), -0.05 + d * 0.085, 0.2 + u * 0.15, 0.517, rack);
    }
    models.server = { obj: rack, pos: [3.2, 0, -0.2], focus: [0, 1.0, 0.3], r: 3.4, at: [0, 2.0, 0.3], offset: [0, -22] };

    /* ---- mainframe ---- */
    var main = K.group();
    [-0.42, 0.42].forEach(function (x, i) {
      K.put(K.box(0.8, 1.9, 0.9, 0x0f141a, { metalness: 0.6, roughness: 0.35 }), x, 0.95, 0, main);
      K.put(K.box(0.7, 1.7, 0.02, 0x1c232b, { metalness: 0.7, roughness: 0.3 }), x, 0.95, 0.455, main);
      K.put(K.box(0.03, 1.7, 0.012, 0x38bdf8, { emissive: 0x38bdf8, emissiveIntensity: 1.4 }), x + (i ? 0.3 : -0.3), 0.95, 0.467, main);
      for (var v = 0; v < 9; v++) K.put(K.box(0.44, 0.02, 0.006, 0x0b0d10), x, 0.35 + v * 0.07, 0.468, main);
    });
    models.mainframe = { obj: main, pos: [4.75, 0, -0.2], focus: [0, 0.95, 0.3], r: 3.8, at: [0, 1.9, 0.3], offset: [0, -22] };

    DEVICES.forEach(function (d) {
      var m = models[d.id];
      m.obj.position.fromArray(m.pos);
      g.add(m.obj);
      stage.pickable(m.obj, d.id);
      var anchor = new T.Object3D();
      anchor.position.fromArray(m.at);
      m.obj.add(anchor);
      stage.label(d.name.replace(/ \(.*| computer$/g, ''), anchor, { offset: m.offset });
    });

    var challenge = null;
    function select(id) {
      var d = DEVICES.filter(function (x) { return x.id === id; })[0], m = models[id];
      stage.highlight(m.obj);
      picker.select(id, true);
      stage.flyTo({ target: [m.pos[0] + m.focus[0], m.pos[1] + m.focus[1], m.pos[2] + m.focus[2]], radius: m.r, theta: 0.45, phi: 1.2 }, 900);
      if (challenge === null) {
        stage.info('<h3>' + d.name + '</h3><p><strong>Size:</strong> ' + d.size + '</p><p>' + d.what + '</p><p><strong>Trade-off:</strong> ' + d.trade +
          '</p><p class="note"><strong>Who uses it at once:</strong> ' + d.users + '</p>');
        return;
      }
      var c = CHALLENGES[challenge];
      if (id === c.answer) {
        stage.info('<h3>Yes: ' + d.name + '</h3><p>' + c.why + '</p><p class="note">Choose <strong>Next challenge</strong>, or select any computer to keep exploring.</p>');
        challenge = null;
      } else {
        stage.info('<h3>Challenge</h3><p>' + c.text + '</p><p><strong>Not this one.</strong> ' + d.trade + ' Which computer fits better?</p>');
      }
    }

    var picker = stage.ui.choices('Computers', DEVICES.map(function (d) {
      return { id: d.id, label: d.name.replace(/ \(.*| computer$/g, '') };
    }), select);
    var row = stage.ui.row();
    stage.ui.button('Whole room', function () {
      stage.highlight(null); picker.select('', true); stage.flyTo(ROOM, 900);
    }, row);
    var next = 0;
    var chBtn = stage.ui.button('Start a challenge', function () {
      challenge = next; next = (next + 1) % CHALLENGES.length;
      stage.highlight(null); picker.select('', true); stage.flyTo(ROOM, 700);
      chBtn.textContent = 'Next challenge';
      stage.info('<h3>Challenge ' + (challenge + 1) + ' of ' + CHALLENGES.length + '</h3><p>' + CHALLENGES[challenge].text +
        '</p><p><strong>Select the computer that fits best.</strong></p>');
    }, row);
    chBtn.classList.add('primary');

    stage.onPick = select;
    stage.info('<h3>Eight computers, one room, true scale</h3><p>Everything here is drawn at its real size next to a 1.7 m person. ' +
      'Select a computer to fly to it. The smallest is easy to miss: that is the point.</p>' +
      '<p class="note">Simplified: one example of each type. Real devices vary, and the embedded board is shown lifted out of the microwave so you can see it.</p>');
  }

  window.DSBook.defineLesson({
    id: '3.3a',
    title: 'Types of computers',
    question: 'How many computers have you used today, and how many did you notice?',
    intro: 'A computer is not only the thing with a screen and a keyboard. Most of the computers around you are hidden inside other objects.',
    targets: [
      'Define a computer by what it does: input, process, store, output.',
      'Describe embedded, wearable, mobile, tablet, laptop, desktop, server and mainframe computers.',
      'Explain the trade-off each type makes between size, power, cost and the number of people it serves.',
      'Discuss who benefits and who is left out as computers become part of everyday objects.'
    ],
    predict: {
      q: 'Which of these do you think there are the most of in the world right now?',
      options: ['Smartphones', 'Laptops and desktops', 'Embedded computers', 'Servers'],
      after: 'Prediction recorded. Explore the room, then read “Computers you do not see” below. What does your answer suggest about which computers people notice?'
    },
    scenes: [{
      id: 'range', title: 'Computers at true scale', build: build,
      hint: 'Drag to rotate. Pinch or use + and − to zoom. Click a computer, or use the buttons, to fly to it.',
      textVersion: '<table><tr><th>Type</th><th>Size</th><th>What it is</th><th>Trade-off</th><th>Users at once</th></tr>' +
        DEVICES.map(function (d) { return '<tr><td><strong>' + d.name + '</strong></td><td>' + d.size + '</td><td>' + d.what + '</td><td>' + d.trade + '</td><td>' + d.users + '</td></tr>'; }).join('') +
        '</table><p><strong>Challenges.</strong> Choose the best computer:</p><ol>' +
        CHALLENGES.map(function (c) { return '<li>' + c.text + ' <details><summary>Answer</summary>' + c.why + '</details></li>'; }).join('') + '</ol>'
    }],
    sections: [
      {
        heading: 'What makes something a computer?',
        html: '<p>A <strong>computer</strong> is a machine that follows stored instructions to take data in, process it, store it and give a result out. ' +
          'Size and shape are not part of the definition. A watch and a room-sized mainframe both qualify, and a calculator that can only do one fixed sum does not.</p>'
      },
      {
        heading: 'Computers you do not see',
        html: '<p>An <strong>embedded computer</strong> is built into another product to do one task. There is one in a microwave, several in a washing machine and dozens in a modern car. ' +
          'They are designed for their surroundings: an engine controller has to survive heat and vibration for years.</p>' +
          '<p>Embedded computers are made in far greater numbers than any computer with a screen, which is why they are easy to overlook and worth noticing.</p>'
      },
      {
        heading: 'Personal computers, from desk to wrist',
        html: '<p>A <strong>personal computer</strong> is a general-purpose machine for one person. It began as the <strong>desktop</strong>, then shrank:</p>' +
          '<ul><li><strong>Laptops</strong> added a battery and folded the screen onto the keyboard.</li>' +
          '<li><strong>Tablets</strong> removed the keyboard and filled the gap between laptop and phone.</li>' +
          '<li><strong>Smartphones</strong> added a mobile connection, cameras and location services.</li>' +
          '<li><strong>Wearables</strong> put sensors on the body.</li></ul>' +
          '<p>Each step gains portability and loses something: screen size, battery life, processing power, or the ability to open the case and fix it. ' +
          'Desktops survive in offices partly because they are easy to upgrade and because the data stays in the building.</p>'
      },
      {
        heading: 'Computers that serve other computers',
        html: '<p>A <strong>server</strong> provides a service to other computers over a network. An organisation may run separate web, email, file, print and database servers. ' +
          'A <strong>mainframe</strong> is the largest kind, used where enormous numbers of transactions must never fail, such as banking.</p>' +
          '<p>Large collections of servers are housed in <strong>data centres</strong>. They need constant power and cooling, which is why some are built in cold places, and why their energy use is a public issue.</p>'
      },
      {
        heading: 'In the real world: what your school runs on',
        html: '<p>Your Chromebook looks like the whole computer, but most of the work happens elsewhere. Your documents are stored on servers in a data centre you will never see, ' +
          'and the school network depends on local servers and embedded computers in every access point, projector and door lock.</p>'
      }
    ],
    terms: [
      ['Computer', 'A machine that follows stored instructions to input, process, store and output data.'],
      ['Embedded computer', 'Hardware and software built into a larger product to carry out one specific task.'],
      ['Personal computer (PC)', 'A general-purpose computer designed for one person to use.'],
      ['Desktop / laptop (notebook)', 'A personal computer that stays on a desk, or a portable one with a built-in screen, keyboard and battery.'],
      ['Tablet', 'A portable touchscreen computer between a phone and a laptop in size.'],
      ['Smart / mobile device', 'A pocket-sized computer with a mobile connection and sensors such as GPS.'],
      ['Wearable computer', 'A small computer worn on the body, usually to sense and record what the wearer is doing.'],
      ['Server', 'A computer that provides a service or resource to other computers on a network.'],
      ['Mainframe', 'A very large, highly reliable server used for huge volumes of transactions.'],
      ['Data centre / server farm', 'A building or site housing many servers, with the power and cooling they need.']
    ],
    questions: [
      {
        q: 'Which of these is the best example of an embedded computer?',
        options: [
          ['A laptop used only for email', 'A laptop is still a general-purpose computer, whatever its owner chooses to do with it.'],
          'The controller inside a washing machine',
          ['A smartphone', 'A phone can run any app you install, so it is general purpose, not built for one task.'],
          ['A file server in a school', 'A server provides a service to many computers. It is not built into another product.']
        ],
        answer: 1,
        why: 'It is built into another product and does one job. That is what makes a computer embedded.'
      },
      {
        q: 'A company keeps desktop computers in its offices even though laptops are just as fast for most work. Which reason is most convincing?',
        options: [
          ['Desktops use less electricity than laptops.', 'It is usually the other way round: laptops are designed to sip power from a battery.'],
          ['Desktops cannot connect to a network.', 'Desktops connect to networks perfectly well. Look for a reason about control or upkeep.'],
          'They are easy to repair and upgrade, and the data stays in the building.',
          ['Desktops are the newest type of computer.', 'The desktop is the oldest form of personal computer.']
        ],
        answer: 2,
        why: 'Fixed machines are cheaper to maintain and harder to lose, which matters to an organisation responsible for its data.'
      },
      {
        q: 'What is the main difference between a server and a personal computer?',
        options: [
          'A server exists to provide a service to other computers; a personal computer is used directly by one person.',
          ['A server is always bigger than a personal computer.', 'Size is not the definition. An ordinary computer can act as a server if it runs the right software.'],
          ['A server has no processor or memory.', 'A server has the same kinds of component as any computer, usually more of them.'],
          ['A server can only store files.', 'Storing files is one possible role. Others include web pages, email, printing and databases.']
        ],
        answer: 0,
        why: 'The difference is the role, not the hardware: a server answers requests from other computers.'
      }
    ],
    inquiry: {
      prompt: 'Wearable computers now track sleep, heart rate, location and blood sugar. Who benefits from that constant stream of body data, and who carries the risk?',
      consider: [
        'Think about at least three groups: the wearer, the company that makes the device, an employer or insurer, a doctor, and people who cannot afford one.',
        'Separate what happens now (an alert, a reminder, a discount) from what could follow later (who holds years of someone’s health data, and what they might do with it).',
        'What would have to be true for you to judge a workplace wearable scheme acceptable?'
      ]
    }
  });
})();
