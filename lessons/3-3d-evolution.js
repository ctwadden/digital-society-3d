/* 3.3D Evolution of computing.
   Three models: the key component of each generation, Moore's Law on a slider, and a qubit to measure. */
(function () {
  'use strict';

  /* Date ranges for the generations differ between sources. These are approximate. */
  var GENS = [
    {
      id: 'g1', name: '1st generation: vacuum tubes', when: 'roughly the 1940s and 1950s',
      tech: 'Glass vacuum tubes acted as the switches. Thousands were needed, they ran hot and they burned out often.',
      machine: 'A computer filled a room, used as much electricity as a street of houses and did one job at a time.',
      people: 'Programmed in machine code by specialists. Owned by governments, armies and a few universities.'
    },
    {
      id: 'g2', name: '2nd generation: transistors', when: 'roughly the late 1950s and early 1960s',
      tech: 'The transistor did the same switching job as a tube in a fraction of the size, with far less heat and power.',
      machine: 'Computers became smaller, faster and much more reliable. Input was punched cards; output was a printout.',
      people: 'Assembly language and the first high-level languages (FORTRAN, COBOL) appeared. Large businesses could now afford one.'
    },
    {
      id: 'g3', name: '3rd generation: integrated circuits', when: 'roughly the mid 1960s to early 1970s',
      tech: 'Many transistors were made together on one piece of silicon: the integrated circuit, or chip.',
      machine: 'Keyboards, screens and operating systems arrived, and one computer could run several programs at once.',
      people: 'High-level languages became normal. Schools, hospitals and medium-sized firms began to use computers.'
    },
    {
      id: 'g4', name: '4th generation: microprocessors', when: 'from the early 1970s',
      tech: 'An entire processor was placed on a single chip: the microprocessor.',
      machine: 'This made the personal computer possible, then the graphical interface, the laptop and the phone.',
      people: 'Ordinary people owned computers for the first time. Languages such as C, Java, Python and JavaScript spread.'
    },
    {
      id: 'g5', name: '5th generation: AI and beyond', when: 'roughly 2010 to the present',
      tech: 'Many processor cores working in parallel, chips specialised for artificial intelligence, and early quantum machines.',
      machine: 'Computers that recognise speech and images and learn from data, mostly running in large data centres.',
      people: 'People increasingly talk to computers in everyday language. A handful of companies own most of the computing power.'
    }
  ];

  function buildGens(stage, K) {
    var T = THREE, g = stage.root;
    var ALL = { target: [0, 1.3, 0], radius: 15.5, theta: 0.0, phi: 1.28 };
    stage.setView({ target: ALL.target, radius: ALL.radius, theta: ALL.theta, phi: ALL.phi, minR: 2.5, maxR: 26, shadow: 10, exposure: 1.15 });
    g.add(K.floor(14, 0));

    var steel = K.metal(0xb9c0c7, 0.3), gold = K.metal(0xd9a930, 0.28), dark = 0x15181c;
    var models = {};

    // 1. Vacuum tube
    var tube = K.group();
    K.put(K.cyl(0.5, 0.55, 0.35, 0x3b2f2a, 28, { roughness: 0.5 }), 0, 0.175, 0, tube);
    for (var p = 0; p < 6; p++) K.put(K.cyl(0.035, 0.035, 0.2, 0xb9c0c7, 8, steel), Math.cos(p) * 0.3, -0.08, Math.sin(p) * 0.3, tube);
    var glassMat = { transparent: true, opacity: 0.28, roughness: 0.05, metalness: 0, depthWrite: false };
    var glass = K.cyl(0.46, 0.46, 1.3, 0xdff3ff, 28, glassMat); glass.castShadow = false;
    K.put(glass, 0, 1.0, 0, tube);
    var dome = K.sphere(0.46, 0xdff3ff, 24, glassMat); dome.castShadow = false;
    K.put(dome, 0, 1.65, 0, tube);
    K.put(K.cyl(0.22, 0.22, 0.8, 0x6b7280, 20, K.metal(0x6b7280, 0.45)), 0, 0.95, 0, tube);
    K.put(K.cyl(0.03, 0.03, 1.0, 0xfb923c, 8, { emissive: 0xf97316, emissiveIntensity: 2.2 }), 0, 0.95, 0, tube);
    [-0.3, 0.3].forEach(function (x) { K.put(K.cyl(0.015, 0.015, 1.0, 0xb9c0c7, 6, steel), x, 0.9, 0, tube); });
    models.g1 = tube;

    // 2. Transistor
    var tr = K.group();
    K.put(K.cyl(0.42, 0.42, 0.5, 0xb9c0c7, 28, steel), 0, 1.25, 0, tr);
    K.put(K.cyl(0.5, 0.5, 0.06, 0xb9c0c7, 28, steel), 0, 1.0, 0, tr);
    K.put(K.box(0.12, 0.06, 0.12, 0xb9c0c7, steel), 0.52, 1.0, 0, tr);
    [-0.22, 0, 0.22].forEach(function (x) { K.put(K.cyl(0.03, 0.03, 1.0, 0xd9a930, 8, gold), x, 0.5, x === 0 ? 0.15 : -0.08, tr); });
    models.g2 = tr;

    // 3. Integrated circuit (a chip in a plastic package with two rows of legs)
    var ic = K.group(), pack = K.group();
    pack.add(K.box(2.0, 0.34, 0.7, dark, { roughness: 0.55 }));
    var notch = K.cyl(0.1, 0.1, 0.02, 0x2b323a, 16); K.put(notch, -0.85, 0.172, 0, pack);
    K.put(K.plate(1.2, 0.36, K.tex(256, 76, function (c, w, h) {
      c.fillStyle = '#15181c'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#cbd5e1'; c.font = '700 30px ui-monospace, Menlo, monospace'; c.fillText('IC  14-PIN', 14, 34);
      c.font = '500 20px ui-monospace, Menlo, monospace'; c.fillText('example chip', 14, 62);
    })), 0.1, 0.1715, 0, pack).rotation.x = -Math.PI / 2;
    for (var l = 0; l < 7; l++) [-1, 1].forEach(function (s) {
      K.put(K.box(0.1, 0.05, 0.16, 0xb9c0c7, steel), -0.84 + l * 0.28, 0, s * 0.42, pack);
      K.put(K.box(0.08, 0.36, 0.04, 0xb9c0c7, steel), -0.84 + l * 0.28, -0.17, s * 0.5, pack);
    });
    pack.rotation.x = 0.5;
    K.put(pack, 0, 0.9, 0, ic);
    models.g3 = ic;

    // 4. Microprocessor
    var mp = K.group(), mchip = K.group();
    mchip.add(K.box(1.5, 1.5, 0.08, 0x14532d));
    K.put(K.box(1.4, 1.4, 0.02, 0xd9a930, gold), 0, 0, -0.05, mchip);
    K.put(K.rbox(1.15, 1.15, 0.14, 0.1, 0xcfd4d9, K.metal(0xcfd4d9, 0.3)), 0, 0, 0.11, mchip);
    K.put(K.plate(1.0, 1.0, K.tex(256, 256, function (c, w, h) {
      c.fillStyle = '#cfd4d9'; c.fillRect(0, 0, w, h);
      for (var y = 0; y < h; y += 2) { c.fillStyle = 'rgba(0,0,0,' + (0.02 + (y % 7) * 0.006) + ')'; c.fillRect(0, y, w, 1); }
      c.fillStyle = '#3b4249'; c.textAlign = 'center';
      c.font = '800 54px system-ui, sans-serif'; c.fillText('MICRO', w / 2, 112); c.fillText('PROCESSOR', w / 2, 166);
    }), { metalness: 0.7, roughness: 0.35 }), 0, 0, 0.1815, mchip);
    mchip.rotation.x = -0.75;
    K.put(mchip, 0, 0.95, 0, mp);
    models.g4 = mp;

    // 5. Many cores in parallel
    var ai = K.group(), brd = K.group();
    brd.add(K.box(1.8, 1.8, 0.08, 0x0b1620, { roughness: 0.5 }));
    for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) {
      K.put(K.rbox(0.3, 0.3, 0.08, 0.04, 0x1f2937, { metalness: 0.6, roughness: 0.35 }), -0.6 + c * 0.4, -0.6 + r * 0.4, 0.07, brd);
      K.put(K.box(0.14, 0.14, 0.01, 0x2dd4bf, { emissive: 0x2dd4bf, emissiveIntensity: 1.2 + ((r + c) % 3) * 0.5 }), -0.6 + c * 0.4, -0.6 + r * 0.4, 0.115, brd);
    }
    for (var t = 0; t < 3; t++) {
      K.put(K.box(1.6, 0.02, 0.006, 0x38bdf8, { emissive: 0x38bdf8, emissiveIntensity: 1.2 }), 0, -0.4 + t * 0.4, 0.045, brd);
      K.put(K.box(0.02, 1.6, 0.006, 0x38bdf8, { emissive: 0x38bdf8, emissiveIntensity: 1.2 }), -0.4 + t * 0.4, 0, 0.045, brd);
    }
    brd.rotation.x = -0.75;
    K.put(brd, 0, 1.0, 0, ai);
    models.g5 = ai;

    GENS.forEach(function (gen, i) {
      var x = (i - 2) * 3.4, m = models[gen.id];
      K.put(K.cyl(1.15, 1.25, 0.3, 0x2b323a, 40, { metalness: 0.5, roughness: 0.45 }), x, 0.15, 0, g);
      var holder = K.group();
      holder.add(m);
      K.put(holder, x, 0.3, 0, g);
      stage.pickable(holder, gen.id);
      models[gen.id] = holder;
      var top = new T.Object3D();
      top.position.set(0, 2.3, 0);
      holder.add(top);
      stage.label(gen.name.replace(/ generation:/, ':').replace('AI and beyond', 'parallel and AI chips'), top, { offset: [0, -14 - (i % 2) * 26] });
    });

    function select(id) {
      var gen = GENS.filter(function (x) { return x.id === id; })[0], i = GENS.indexOf(gen);
      stage.highlight(models[id]);
      picker.select(id, true);
      stage.flyTo({ target: [(i - 2) * 3.4, 1.3, 0], radius: 5.6, theta: 0.35, phi: 1.2 }, 900);
      stage.info('<h3>' + gen.name + '</h3><p class="note">' + gen.when.charAt(0).toUpperCase() + gen.when.slice(1) + '. Dates are approximate and vary between sources.</p>' +
        '<p><strong>Key technology:</strong> ' + gen.tech + '</p><p><strong>The computers:</strong> ' + gen.machine + '</p><p><strong>The people:</strong> ' + gen.people + '</p>');
    }

    var picker = stage.ui.choices('Generation', GENS.map(function (gen, i) { return { id: gen.id, label: (i + 1) + ': ' + gen.name.split(': ')[1] }; }), select);
    stage.ui.button('See all five', function () { stage.highlight(null); picker.select('', true); stage.flyTo(ALL, 900); });

    stage.onPick = select;
    stage.info('<h3>One switch, five generations</h3><p>Each generation of computing is named after the component that did the switching. ' +
      'Select one to see what changed for the machines and for the people using them.</p>' +
      '<p class="note">Simplified: the components are drawn large and not to scale. A real vacuum tube is the size of a light bulb; a modern transistor is far too small to see.</p>');
  }

  /* ================= Moore's Law ================= */

  function buildMoore(stage, K) {
    var T = THREE, g = stage.root;
    stage.setView({ target: [-1.5, 2.7, 0], radius: 16, theta: 0.1, phi: 1.3, minR: 6, maxR: 30, shadow: 11, exposure: 1.0 });
    g.add(K.floor(15, 0));

    var N = 26, START = 1971, FIRST = 2300, MAXH = 5.8;
    var bars = [], k = 0, linear = false;
    K.put(K.box(12.4, 0.12, 1.2, 0x2b323a, { metalness: 0.5, roughness: 0.45 }), 0.9, 0.06, 0, g);
    for (var i = 0; i < N; i++) {
      var bar = K.box(0.32, 1, 0.5, 0x0f766e, { metalness: 0.3, roughness: 0.45, emissive: 0xf97316, emissiveIntensity: 0 });
      K.put(bar, -4.9 + i * 0.464, 0.5, 0, g);
      bars.push(bar);
      if (i % 5 === 0) {
        var foot = new T.Object3D();
        foot.position.set(-4.9 + i * 0.464, 0.05, 0.9);
        g.add(foot);
        stage.label(String(START + i * 2), foot, { cls: 'quiet' });
      }
    }
    var tip = new T.Object3D();
    g.add(tip);
    var tipLabel = stage.label('', tip, { cls: 'big', offset: [0, -20] });

    // A square of chip, redrawn with more transistors as the years pass.
    var chip = K.group();
    chip.add(K.rbox(3.4, 3.4, 0.14, 0.12, 0x14532d, { roughness: 0.6 }));
    K.put(K.box(3.0, 3.0, 0.02, 0x0b1620), 0, 0, 0.08, chip);
    var dots = new T.InstancedMesh(new T.BoxGeometry(1, 1, 0.04), K.mat(0xd9a930, K.metal(0xd9a930, 0.3)), 1600);
    dots.position.z = 0.11;
    chip.add(dots);
    chip.rotation.x = -0.35;
    K.put(chip, -7.9, 2.9, 0.4, g);
    stage.label('The same area of chip (drawing only)', chip, { dy: 2.0, cls: 'quiet' });

    function count(i) { return FIRST * Math.pow(2, i); }
    function words(n) {
      if (n >= 1e9) return (n / 1e9).toFixed(n >= 1e10 ? 0 : 1) + ' billion';
      if (n >= 1e6) return (n / 1e6).toFixed(n >= 1e7 ? 0 : 1) + ' million';
      if (n >= 1e3) return Math.round(n / 1e3) + ' thousand';
      return String(Math.round(n));
    }

    var M = new T.Matrix4();
    function refresh() {
      bars.forEach(function (bar, i) {
        var h = i > k ? 0 : (linear ? Math.max(0.012, MAXH * Math.pow(2, i - k)) : MAXH * (i + 1) / N);
        bar.visible = i <= k;
        bar.scale.y = Math.max(h, 0.012);
        bar.position.y = 0.12 + Math.max(h, 0.012) / 2;
        bar.material.emissiveIntensity = i === k ? 0.9 : 0;
        bar.material.color.setHex(i === k ? 0xf97316 : 0x0f766e);
      });
      tip.position.set(bars[k].position.x, 0.12 + bars[k].scale.y, 0);
      tipLabel.set(words(count(k)));

      var n = Math.min(40, Math.round(3 + k * 1.48)), cell = 2.8 / n;
      for (var a = 0; a < n * n; a++) {
        M.makeScale(cell * 0.7, cell * 0.7, 1);
        M.setPosition(-1.4 + cell * (a % n + 0.5), -1.4 + cell * (Math.floor(a / n) + 0.5), 0);
        dots.setMatrixAt(a, M);
      }
      dots.count = n * n;
      dots.instanceMatrix.needsUpdate = true;

      var year = START + k * 2;
      stage.info('<h3>' + year + ': about ' + words(count(k)) + ' transistors on one chip</h3>' +
        '<p>That is ' + (k === 0 ? 'the starting point: a chip with about 2,300 transistors' : k + ' doubling' + (k > 1 ? 's' : '') + ' since 1971, or about ' + words(Math.pow(2, k)) + ' times as many') + '.</p>' +
        '<p>' + (linear
          ? '<strong>True proportions:</strong> each bar is drawn to scale against ' + year + '. Earlier years shrink to almost nothing, because half of all the growth happened in the last two years.'
          : '<strong>Doubling steps:</strong> each bar is one step taller than the last, and each step means twice as many. This hides how extreme the growth is. Switch to true proportions to see it.') + '</p>' +
        '<p class="note">Simplified: this is the idealised rule, doubling every two years from 1971. Real chips followed it roughly, not exactly, and the pace has slowed. The chip drawing cannot show real densities.</p>');
      stage.invalidate();
    }

    stage.ui.slider('Year', { min: 0, max: N - 1, value: 0, format: function (v) { return START + v * 2; } }, function (v) { k = v; refresh(); });
    stage.ui.choices('Bar heights', [{ id: 'log', label: 'Doubling steps' }, { id: 'lin', label: 'True proportions' }], function (id) {
      linear = id === 'lin'; refresh();
    }, 'log');
    refresh();
  }

  /* ================= Qubit ================= */

  function buildQubit(stage, K) {
    var T = THREE, g = stage.root, V = T.Vector3;
    stage.setView({ target: [-1.2, 2.1, 0], radius: 10, theta: 0.2, phi: 1.25, minR: 5, maxR: 24, shadow: 8, exposure: 1.0 });
    g.add(K.floor(11, 0));

    // Classical bit: a switch that is either down (0) or up (1).
    var sw = K.group();
    sw.add(K.rbox(1.6, 2.2, 0.5, 0.15, 0x2b323a, { metalness: 0.5, roughness: 0.45 }));
    K.put(K.box(0.5, 1.2, 0.06, 0x0b0d10), 0, 0, 0.26, sw);
    var lever = K.group();
    K.put(K.cyl(0.12, 0.14, 0.9, 0xb9c0c7, 16, K.metal(0xb9c0c7, 0.3)), 0, 0, 0.45, lever).rotation.x = Math.PI / 2;
    K.put(K.sphere(0.2, 0xf97316, 20, { roughness: 0.4 }), 0, 0, 0.95, lever);
    K.put(lever, 0, 0, 0.25, sw);
    K.put(sw, -4.2, 1.9, 0, g);
    K.put(K.box(0.3, 0.8, 0.3, 0x7b8794, K.metal(0x7b8794, 0.4)), -4.2, 0.4, 0, g);
    var bitLabel = stage.label('', sw, { dy: 1.45, cls: 'big' });

    // Qubit: an arrow that can point anywhere on a sphere.
    var R = 1.7, C = new V(1.6, 2.2, 0), q = K.group();
    var ball = K.sphere(R, 0x7dd3fc, 40, { transparent: true, opacity: 0.16, roughness: 0.05, depthWrite: false });
    ball.castShadow = false;
    q.add(ball);
    function ring(rx, ry) {
      var m = new T.Mesh(new T.TorusGeometry(R, 0.018, 8, 80), K.mat(0x7fd3c8, { emissive: 0x7fd3c8, emissiveIntensity: 0.6 }));
      m.rotation.set(rx, ry, 0);
      q.add(m);
    }
    ring(Math.PI / 2, 0); ring(0, 0); ring(0, Math.PI / 2);
    K.put(K.cyl(0.015, 0.015, R * 2.3, 0x9fb4c0, 8), 0, 0, 0, q);
    var arrow = K.group();
    K.put(K.cyl(0.05, 0.05, R - 0.3, 0xf97316, 12, { emissive: 0xf97316, emissiveIntensity: 0.6 }), 0, (R - 0.3) / 2, 0, arrow);
    K.put(K.cyl(0, 0.14, 0.34, 0xf97316, 16, { emissive: 0xf97316, emissiveIntensity: 0.6 }), 0, R - 0.17, 0, arrow);
    q.add(arrow);
    q.add(K.sphere(0.09, 0xe2e8f0, 16));
    q.position.copy(C);
    g.add(q);
    K.put(K.cyl(0.5, 0.7, 0.4, 0x2b323a, 32, { metalness: 0.5, roughness: 0.45 }), C.x, 0.2, 0, g);
    stage.label('0', new V(C.x, C.y + R + 0.15, 0), { cls: 'big' });
    stage.label('1', new V(C.x, C.y - R - 0.5, 0), { cls: 'big' });
    stage.label('Classical bit', new V(-4.2, 0.9, 0.6), { cls: 'quiet' });
    stage.label('Qubit', new V(C.x + 1.9, 2.2, 0), { cls: 'quiet', offset: [40, 0] });

    var st = { bit: 0, tilt: 90, turn: 0, zeros: 0, ones: 0, last: '' };
    var UP = new V(0, 1, 0), dir = new V();

    function aim(tilt, turn) {
      var a = tilt * Math.PI / 180, b = turn * Math.PI / 180;
      dir.set(Math.sin(a) * Math.cos(b), Math.cos(a), Math.sin(a) * Math.sin(b));
      arrow.quaternion.setFromUnitVectors(UP, dir);
    }
    function chance() { return Math.pow(Math.sin(st.tilt * Math.PI / 360), 2); }

    function refresh() {
      lever.rotation.x = st.bit ? -0.6 : 0.6;
      bitLabel.set('Bit = ' + st.bit);
      aim(st.tilt, st.turn);
      var p1 = Math.round(chance() * 100), total = st.zeros + st.ones;
      stage.info('<h3>Chance of measuring 1: ' + p1 + '%. Chance of 0: ' + (100 - p1) + '%</h3>' +
        '<p>' + (st.last ? st.last + ' ' : '') + 'Tally so far: <strong>' + st.zeros + '</strong> zeros and <strong>' + st.ones + '</strong> ones' +
        (total ? ' (' + Math.round(st.ones / total * 100) + '% ones)' : '') + '.</p>' +
        '<p>The bit on the left is always exactly 0 or 1. The qubit’s arrow can point anywhere. Pointing between the poles is <strong>superposition</strong>: ' +
        'it is not secretly 0 or 1, but when you measure it you only ever get a 0 or a 1, with the chances shown.</p>' +
        '<p class="note">Simplified: this is a picture of one qubit. The power of a quantum computer comes from many qubits linked together, which this model does not show. Turning the arrow sideways changes its phase, which matters when qubits interact but does not change these chances.</p>');
      stage.invalidate();
    }

    stage.ui.button('Flip the classical bit', function () { st.bit = st.bit ? 0 : 1; refresh(); });
    var tiltS = stage.ui.slider('Tilt the qubit', { min: 0, max: 180, step: 5, value: 90, format: function (v) { return v + '°'; } }, function (v) { st.tilt = v; st.last = ''; refresh(); });
    stage.ui.slider('Turn it sideways', { min: 0, max: 360, step: 10, value: 0, format: function (v) { return v + '°'; } }, function (v) { st.turn = v; refresh(); });
    var row = stage.ui.row('Measure');
    stage.ui.button('Once', function () {
      var one = Math.random() < chance(), from = st.tilt, to = one ? 180 : 0;
      if (one) st.ones++; else st.zeros++;
      st.last = 'You measured <strong>' + (one ? 1 : 0) + '</strong>, and the arrow snapped to that pole: measuring changes the qubit.';
      stage.tween(450, function (k) { aim(from + (to - from) * k, st.turn); }, function () {
        st.tilt = to; tiltS.set(to, true); refresh();
      });
    }, row).classList.add('primary');
    stage.ui.button('100 fresh qubits', function () {
      var p = chance(), ones = 0;
      for (var i = 0; i < 100; i++) if (Math.random() < p) ones++;
      st.ones += ones; st.zeros += 100 - ones;
      st.last = 'You prepared 100 qubits at this tilt and measured each once: <strong>' + (100 - ones) + '</strong> zeros and <strong>' + ones + '</strong> ones.';
      refresh();
    }, row);
    stage.ui.button('Clear tally', function () { st.zeros = st.ones = 0; st.last = ''; refresh(); }, row);

    refresh();
  }

  window.DSBook.defineLesson({
    id: '3.3d',
    title: 'Evolution of computing',
    question: 'How did a machine that filled a room become something you wear, and what comes next?',
    intro: 'The story of computing is the story of one component, the switch, getting smaller, cheaper and more numerous, until the change in quantity became a change in who could use a computer at all.',
    targets: [
      'Describe the five generations of computing and the key technology of each.',
      'State Moore’s Law and explain why doubling leads to such extreme growth.',
      'Describe a qubit and superposition at a simple level, and say why quantum computing is still mostly a promise.',
      'Analyse a change in computing: why it happened, who gained, who lost, and whether it could have gone differently.'
    ],
    predict: {
      q: 'A chip in 1971 held about 2,300 transistors. If that number doubles every two years, roughly how many is it 50 years later?',
      options: ['About 115,000', 'About 60 million', 'About 2 billion', 'About 77 billion'],
      after: 'Prediction recorded. Open “Moore’s Law”, drag the year to 2021 and compare. Then switch to true proportions.'
    },
    scenes: [
      {
        id: 'gens', title: 'Five generations', build: buildGens,
        hint: 'Drag to rotate. Pinch or use + and − to zoom. Click a component, or use the buttons, to fly to it.',
        textVersion: '<table><tr><th>Generation</th><th>When (approximate)</th><th>Key technology</th><th>The computers</th><th>The people</th></tr>' +
          GENS.map(function (x) { return '<tr><td><strong>' + x.name + '</strong></td><td>' + x.when + '</td><td>' + x.tech + '</td><td>' + x.machine + '</td><td>' + x.people + '</td></tr>'; }).join('') + '</table>'
      },
      {
        id: 'moore', title: 'Moore’s Law', build: buildMoore,
        hint: 'Drag the Year slider below. Then switch the bar heights to true proportions.',
        textVersion: '<p>Starting from about 2,300 transistors in 1971 and doubling every two years:</p>' +
          '<table><tr><th>Year</th><th>Doublings</th><th>Transistors (idealised)</th></tr>' +
          [0, 5, 10, 15, 20, 25].map(function (i) {
            var n = 2300 * Math.pow(2, i);
            return '<tr><td>' + (1971 + i * 2) + '</td><td>' + i + '</td><td>about ' + (n >= 1e9 ? (n / 1e9).toFixed(1) + ' billion' : n >= 1e6 ? (n / 1e6).toFixed(1) + ' million' : Math.round(n / 1000) + ' thousand') + '</td></tr>';
          }).join('') + '</table><p>Drawn to true scale, every earlier year is tiny beside the latest, because each two-year step adds as much as all previous years combined. Real chips followed this rule roughly, and the pace has slowed.</p>'
      },
      {
        id: 'qubit', title: 'Measure a qubit', build: buildQubit,
        hint: 'Use the sliders and buttons below. Drag to rotate the model.',
        textVersion: '<p>A classical bit is always 0 or 1. A qubit can be pictured as an arrow on a sphere: straight up is 0, straight down is 1, and anywhere between is a superposition. ' +
          'Measuring always gives 0 or 1. Pointing straight up gives 0 every time; level with the equator gives 0 and 1 about equally; tilted three-quarters of the way down gives 1 about 85% of the time. ' +
          'After a measurement the arrow sits at the pole that was measured, so measuring changes the qubit.</p>'
      }
    ],
    sections: [
      {
        heading: 'Five generations',
        html: '<p>Historians group computers into <strong>generations</strong>, each named for the technology that did the switching: vacuum tubes, transistors, integrated circuits, microprocessors, and now parallel processing and artificial intelligence. ' +
          'The exact dates differ from book to book, so treat them as approximate.</p>' +
          '<p>Each step made computers smaller, cheaper, cooler and more reliable. More important for this course, each step changed <em>who</em> could use one: from a few governments, to large companies, to schools and offices, to individuals.</p>'
      },
      {
        heading: 'Moore’s Law',
        html: '<p>In 1965 Gordon Moore, who went on to co-found Intel, noticed that the number of components on a chip was doubling at a regular rate. The version usually quoted today is that the number of transistors on a chip doubles about every two years.</p>' +
          '<p>It is an observation about an industry, not a law of nature. It held roughly for decades because companies planned around it, and it is now slowing as transistors approach the size of atoms.</p>' +
          '<p>Doubling is hard to picture. In the model, switch to true proportions: the early decades vanish, because every step adds as much as everything before it.</p>'
      },
      {
        heading: 'Quantum computing',
        html: '<p>Ordinary computers store <strong>bits</strong>, each 0 or 1. A quantum computer uses <strong>qubits</strong>, which can be in a <strong>superposition</strong>: a blend of 0 and 1 until measured.</p>' +
          '<p>Linked together, qubits can represent many possibilities at once, which could make some kinds of problem far quicker to solve: simulating molecules for new batteries and medicines, optimising routes, and breaking some of today’s encryption.</p>' +
          '<p>These are mostly proposed uses. Today’s quantum machines are small, error-prone and kept in laboratories. Be careful with sources that describe the promise as if it had already arrived.</p>'
      },
      {
        heading: 'Why this matters for society',
        html: '<p>Cheaper, smaller switches are the reason a phone outperforms the computers that guided early space flights. The same trend explains throwaway electronics, the demand for rare minerals, and the huge data centres behind artificial intelligence. ' +
          'Change in computing is never only technical: someone pays for it, someone profits from it and someone lives beside the factory.</p>'
      }
    ],
    terms: [
      ['Generation (of computing)', 'A period of computer history defined by its main switching technology.'],
      ['Vacuum tube', 'A sealed glass device used as an electronic switch in the first computers.'],
      ['Transistor', 'A tiny solid switch that replaced the vacuum tube. The basic building block of all modern chips.'],
      ['Integrated circuit (chip)', 'Many transistors and their connections made together on one piece of silicon.'],
      ['Microprocessor', 'A complete processor on a single chip.'],
      ['Moore’s Law', 'The observation that the number of transistors on a chip doubles about every two years.'],
      ['Parallel processing', 'Using several processors or cores at the same time on one task.'],
      ['Quantum computing', 'Computing that uses the behaviour of matter at atomic scale to tackle certain problems far faster than ordinary computers.'],
      ['Qubit', 'The basic unit of quantum information, which can be 0, 1 or a superposition of both.'],
      ['Superposition', 'A state in which a qubit is a blend of 0 and 1 until it is measured.']
    ],
    questions: [
      {
        q: 'Which development made the personal computer possible?',
        options: [
          ['The vacuum tube', 'Tube computers filled rooms and ran hot. Look at what happened two generations later.'],
          ['Punched cards', 'Punched cards were a way of getting data in, not the reason computers shrank.'],
          'The microprocessor: a whole processor on one chip',
          ['Quantum computing', 'Quantum machines are recent and still experimental. Personal computers came decades earlier.']
        ],
        answer: 2,
        why: 'Putting the processor on one cheap chip made a computer small and affordable enough for one person.'
      },
      {
        q: 'In the Moore’s Law model, why do the early bars almost disappear when you switch to true proportions?',
        options: [
          ['Early chips had no transistors.', 'The 1971 chip in the model has about 2,300. They are still there, only tiny by comparison.'],
          'With doubling, each step adds as much as all the earlier steps put together, so the latest years dwarf the rest.',
          ['The model deletes old data to save memory.', 'Nothing is deleted. Slide back to an earlier year and the bars return at that year’s scale.'],
          ['Transistors got bigger over time.', 'They got far smaller, which is how more of them fit on a chip.']
        ],
        answer: 1,
        why: 'That is what exponential growth means, and why it keeps surprising people.'
      },
      {
        q: 'Which statement about a qubit is correct?',
        options: [
          ['It stores two ordinary bits.', 'A qubit is not two bits glued together. Try the tilt slider and measure repeatedly.'],
          ['When measured, it gives a value between 0 and 1, such as 0.5.', 'Measure once in the model: the result is only ever 0 or 1.'],
          'Before measurement it can be in a blend of 0 and 1, but a measurement always gives either 0 or 1.',
          ['It works exactly like a classical bit but faster.', 'A classical bit is never in a blend. That difference is the whole point.']
        ],
        answer: 2,
        why: 'Superposition describes the state before measurement. The outcome is a definite 0 or 1 with certain chances.'
      }
    ],
    inquiry: {
      prompt: 'For fifty years the computer industry has assumed that next year’s chips will be twice as good, and that older devices will be replaced. Has that expectation been good for people and the planet?',
      consider: [
        'Who has gained from rapid improvement (users, companies, science, medicine) and who has borne the costs (miners, factory communities, people near e-waste sites, anyone who cannot afford to keep up)?',
        'Was the pace forced by physics and markets, or chosen? Could devices have been designed to last longer?',
        'As Moore’s Law slows, what might change, and for whom would that be a good thing?'
      ]
    }
  });
})();
