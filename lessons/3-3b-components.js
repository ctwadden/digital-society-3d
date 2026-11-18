/* 3.3B Components of a computer.
   Three models: an exploded desktop, data flowing through input/process/store/output,
   and the layers of software on top of hardware. */
(function () {
  'use strict';

  /* Plays a list of steps: a small cube travels from step.from to step.to while the
     info panel shows the whole list with the current step in bold.
     step: { from: Vector3, to: Vector3, color, msg, after() } */
  function runSteps(stage, K, title, steps, done) {
    var cube = K.box(0.28, 0.28, 0.28, 0xffffff, { emissive: 0x555555 });
    stage.root.add(cube);
    function show(current) {
      stage.info('<h3>' + title + '</h3><ol style="margin:0;padding-left:20px">' + steps.map(function (s, i) {
        return '<li>' + (i === current ? '<strong>' + s.msg + '</strong>' : s.msg) + '</li>';
      }).join('') + '</ol>');
    }
    var i = 0;
    (function next() {
      if (i >= steps.length) {
        stage.root.remove(cube);
        show(-1);
        if (done) done();
        return;
      }
      var s = steps[i];
      show(i);
      cube.material.color.setHex(s.color);
      cube.material.emissive.setHex(s.color);
      cube.material.emissiveIntensity = 0.45;
      stage.tween(650, function (k) { cube.position.lerpVectors(s.from, s.to, k); }, function () {
        if (s.after) s.after();
        i++;
        next();
      });
    })();
  }

  var C = { input: 0xf97316, process: 0xfacc15, store: 0x60a5fa, output: 0x4ade80 };

  /* ================= Model 1: inside the box ================= */

  var PARTS = [
    {
      id: 'motherboard', name: 'Motherboard',
      role: 'The main circuit board. Every other part plugs into it, and its copper tracks carry data and power between them.',
      matters: 'It decides what you can connect or upgrade later: how much RAM, which processors, how many drives.',
      like: 'Like the road network of a town: it does none of the work itself, but nothing reaches anything else without it.'
    },
    {
      id: 'cpu', name: 'CPU (processor)',
      role: 'Carries out the instructions in every program, one tiny step at a time, and tells the other parts what to do.',
      matters: 'Three things shape how much it gets done: clock speed (steps per second, in gigahertz), the number of cores (how many tasks at once) and cache (a small, very fast memory inside the chip).',
      like: 'Like a cook following recipes: faster hands, more cooks and ingredients within reach all get meals out sooner.'
    },
    {
      id: 'cooler', name: 'CPU cooler',
      role: 'A metal heatsink and fan that sit on top of the CPU and carry its heat away. It handles no data at all.',
      matters: 'A busy CPU gets hot enough to damage itself. If it cannot shed heat it slows itself down, so cooling limits how hard a computer can work. Thin devices such as phones have no fan and rely on the case to spread heat.',
      like: 'Like the extractor fan over the stove: it cooks nothing, but the kitchen cannot run flat out without it.'
    },
    {
      id: 'ram', name: 'RAM (memory)',
      role: 'Holds the programs and data you are using right now so the CPU can reach them almost instantly.',
      matters: 'It is volatile: it empties when the power goes off. Too little RAM and the computer slows down when many things are open.',
      like: 'Like the kitchen counter: only what is on it can be worked on, and it is cleared at closing time.'
    },
    {
      id: 'storage', name: 'Storage drive (SSD or hard disk)',
      role: 'Keeps the operating system, apps and your files for the long term, even with the power off. This is secondary storage.',
      matters: 'Much larger than RAM but slower to reach. A solid-state drive (SSD) has no moving parts and is faster than a spinning hard disk (HDD).',
      like: 'Like the pantry and fridge: lots of room, things stay put overnight, but it takes a trip to fetch them.'
    },
    {
      id: 'gpu', name: 'Graphics card (GPU)',
      role: 'A processor built for drawing: it works out the colour of millions of pixels many times a second.',
      matters: 'Takes that load off the CPU. Games, video editing and 3D models like this one lean on it. Many computers have graphics and sound built into the motherboard or CPU instead of a separate card.',
      like: 'Like a specialist decorator in the kitchen who only plates the food, very fast.'
    },
    {
      id: 'psu', name: 'Power supply',
      role: 'Turns mains electricity from the wall (alternating current) into the steady low-voltage direct current the parts need.',
      matters: 'Every part depends on it. Laptops and phones do the same job with a charger and a lithium-ion battery, which stores energy chemically.',
      like: 'Like the gas and electricity coming into the kitchen: unnoticed until it stops.'
    }
  ];

  var CHALLENGES = [
    { text: 'A student has 30 browser tabs open and the laptop crawls every time they switch tab.', answer: 'ram', why: 'Each open tab sits in RAM. When RAM is full the computer has to shuffle data out to the much slower storage drive.' },
    { text: 'A video editor waits a long time for effects and 3D previews to be drawn.', answer: 'gpu', why: 'Drawing images is the GPU’s specialism. A stronger one renders video and 3D far faster than the CPU alone.' },
    { text: 'The computer runs well, but there is no room left to save a new project.', answer: 'storage', why: 'Saved files live on the storage drive. It is full, so it needs clearing or replacing with a bigger one.' },
    { text: 'A huge spreadsheet takes minutes to recalculate, with nothing else open.', answer: 'cpu', why: 'Calculation is the CPU’s job. A faster clock, more cores or more cache would shorten the wait.' },
    { text: 'The computer switches itself off whenever it works hard, and the software is fine.', answer: 'psu', why: 'Parts draw more power under load. If the power supply cannot deliver enough, the whole machine cuts out.' }
  ];

  function buildInside(stage, K) {
    var T = THREE, g = stage.root, V = T.Vector3;
    var HOME = { target: [0, 0, 0.1], radius: 8.6, theta: 0.5, phi: 1.2 };
    var OPEN = { target: [-0.4, 0.4, 1.65], radius: 13, theta: 0.78, phi: 1.2 };
    stage.setView({ target: HOME.target, radius: HOME.radius, theta: HOME.theta, phi: HOME.phi, minR: 3, maxR: 28, shadow: 11, exposure: 1.3 });
    g.add(K.floor(14, -2.47));

    var steel = K.metal(0xb9c0c7, 0.3), alu = K.metal(0x9aa3ab, 0.38), gold = K.metal(0xd9a930, 0.28), dark = 0x15181c;
    var rotors = [];
    function fan(radius, color) { var f = K.fan(radius, color); rotors.push(f.userData.rotor); return f; }

    /* ---- textures drawn in code ---- */
    var seed = 7;
    function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }

    var pcbTex = K.tex(512, 580, function (c, w, h) {
      c.fillStyle = '#0e3b29'; c.fillRect(0, 0, w, h);
      c.lineWidth = 2; c.lineCap = 'round';
      for (var i = 0; i < 120; i++) {           // copper tracks with 45-degree bends
        var x = Math.round(rnd() * 50) * 10 + 6, y = Math.round(rnd() * 56) * 10 + 6;
        var a = (rnd() * 12 + 3) * 10, b = (rnd() * 6 + 1) * 10, dx = rnd() < 0.5 ? 1 : -1, dy = rnd() < 0.5 ? 1 : -1;
        c.strokeStyle = rnd() < 0.5 ? '#1c6a47' : '#237a54';
        c.beginPath(); c.moveTo(x, y); c.lineTo(x + a * dx, y); c.lineTo(x + (a + b) * dx, y + b * dy); c.lineTo(x + (a + b) * dx, y + (b + a * 0.6) * dy); c.stroke();
        c.fillStyle = '#d9b84a';
        c.beginPath(); c.arc(x, y, 3, 0, 7); c.fill();
        c.beginPath(); c.arc(x + (a + b) * dx, y + (b + a * 0.6) * dy, 3, 0, 7); c.fill();
      }
      c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 1.5;
      c.strokeRect(160, 100, 170, 170);          // silkscreen outlines
      c.fillStyle = 'rgba(255,255,255,.8)'; c.font = '600 13px ui-monospace, Menlo, monospace';
      c.fillText('CPU SOCKET', 168, 94); c.fillText('DIMM_A1  DIMM_B1', 345, 60);
      c.fillText('PCIE_X16', 60, 432); c.fillText('SATA', 462, 330); c.fillText('ATX_PWR', 440, 96);
      c.font = '700 20px system-ui, sans-serif'; c.fillText('MAINBOARD  DS-33B', 150, 548);
    });

    var cpuTex = K.tex(256, 256, function (c, w, h) {
      c.fillStyle = '#cfd4d9'; c.fillRect(0, 0, w, h);
      for (var y = 0; y < h; y += 2) { c.fillStyle = 'rgba(0,0,0,' + (rnd() * 0.05) + ')'; c.fillRect(0, y, w, 1); }
      c.fillStyle = '#3b4249'; c.textAlign = 'center';
      c.font = '800 70px system-ui, sans-serif'; c.fillText('CPU', w / 2, 118);
      c.font = '600 22px ui-monospace, Menlo, monospace'; c.fillText('8 cores  3.6 GHz', w / 2, 160); c.fillText('16 MB cache', w / 2, 190);
      c.beginPath(); c.moveTo(14, h - 14); c.lineTo(44, h - 14); c.lineTo(14, h - 44); c.fill();
    });

    function sticker(title, lines, bg, fg) {
      return K.tex(256, 160, function (c, w, h) {
        c.fillStyle = bg; c.fillRect(0, 0, w, h);
        c.fillStyle = fg; c.font = '800 46px system-ui, sans-serif'; c.fillText(title, 16, 58);
        c.font = '600 22px ui-monospace, Menlo, monospace';
        lines.forEach(function (l, i) { c.fillText(l, 16, 94 + i * 28); });
        for (var x = 150; x < 240; x += 5) c.fillRect(x, 118, rnd() < 0.5 ? 1 : 3, 28);
      });
    }

    /* ---- case ---- */
    var shell = K.group(), paint = { metalness: 0.55, roughness: 0.42 };
    K.put(K.box(4.5, 4.7, 0.08, 0x2b323a, paint), 0, 0, -1.04, shell);            // far side panel
    K.put(K.box(4.3, 4.5, 0.03, 0x181c21, { roughness: 0.8 }), 0, 0, -0.985, shell); // motherboard tray
    K.put(K.box(4.5, 0.1, 2.1, 0x2b323a, paint), 0, 2.3, 0, shell);
    K.put(K.box(4.5, 0.1, 2.1, 0x2b323a, paint), 0, -2.3, 0, shell);
    K.put(K.box(0.1, 4.7, 2.1, 0x2b323a, paint), -2.2, 0, 0, shell);              // back
    K.put(K.box(0.3, 4.7, 2.1, 0x1a1e24, { metalness: 0.3, roughness: 0.5 }), 2.3, 0, 0, shell); // front fascia
    K.put(K.box(0.02, 3.3, 0.07, 0x2dd4bf, { emissive: 0x2dd4bf, emissiveIntensity: 1.6 }), 2.46, 0.1, 0.62, shell);
    var button = K.cyl(0.09, 0.09, 0.03, 0xdfe5ea, 20, K.metal(0xdfe5ea, 0.25));
    button.rotation.z = Math.PI / 2;
    K.put(button, 2.46, 1.95, -0.45, shell);
    [[-1.8, -0.75], [-1.8, 0.75], [1.9, -0.75], [1.9, 0.75]].forEach(function (p) {
      K.put(K.cyl(0.16, 0.16, 0.12, 0x0b0d10, 18, { roughness: 0.9 }), p[0], -2.41, p[1], shell);
    });
    K.put(K.box(1.3, 0.05, 0.95, 0x48515b, paint), 1.45, 1.62, 0.25, shell);      // drive shelf
    g.add(shell);
    stage.label('Case', new V(2.46, -1.7, 1.05), { cls: 'quiet', offset: [44, 18] });

    var models = {};

    /* ---- motherboard ---- */
    var mb = K.group();
    mb.add(K.box(3.0, 3.4, 0.08, 0x0e3b29, { roughness: 0.7 }));
    K.put(K.plate(3.0, 3.4, pcbTex, { roughness: 0.55 }), 0, 0, 0.0415, mb);
    K.put(K.box(0.88, 0.88, 0.06, 0xb9c0c7, steel), -0.1, 0.6, 0.07, mb);         // CPU socket frame
    K.put(K.box(0.68, 0.68, 0.065, 0x23282e), -0.1, 0.6, 0.072, mb);
    [0.7, 0.92].forEach(function (x) {                                             // memory slots
      K.put(K.box(0.09, 1.55, 0.1, dark), x, 0.6, 0.09, mb);
      K.put(K.box(0.12, 0.1, 0.16, 0xe5e7eb), x, 1.4, 0.12, mb);
      K.put(K.box(0.12, 0.1, 0.16, 0xe5e7eb), x, -0.2, 0.12, mb);
    });
    K.put(K.box(2.3, 0.1, 0.1, dark), -0.25, -0.7, 0.09, mb);                      // graphics slot
    K.put(K.box(1.2, 0.1, 0.1, dark), -0.8, -1.25, 0.09, mb);
    K.put(K.box(1.15, 0.3, 0.34, 0x9aa3ab, alu), -0.1, 1.38, 0.21, mb);            // heatsinks
    K.put(K.box(0.3, 1.05, 0.34, 0x9aa3ab, alu), -0.95, 0.62, 0.21, mb);
    for (var s = 0; s < 6; s++) K.put(K.box(0.03, 0.31, 0.2, 0x4b535b, alu), -0.55 + s * 0.18, 1.38, 0.3, mb);
    [[0.42, 1.12], [0.42, 0.88], [0.42, 0.3], [0.42, 0.08], [-0.52, 0], [-0.28, 0], [0.12, 0]].forEach(function (p) {
      var cap = K.cyl(0.055, 0.055, 0.17, 0x1a1d22, 14);
      cap.rotation.x = Math.PI / 2;
      K.put(cap, p[0], p[1], 0.125, mb);
      var top = K.cyl(0.05, 0.05, 0.01, 0xcfd4d9, 14, steel);
      top.rotation.x = Math.PI / 2;
      K.put(top, p[0], p[1], 0.213, mb);
    });
    K.put(K.rbox(0.62, 0.62, 0.12, 0.07, 0x3b4350, K.metal(0x3b4350, 0.4)), 0.72, -1.15, 0.1, mb); // chipset
    K.put(K.box(0.34, 1.3, 0.56, 0xb9c0c7, steel), -1.3, 0.95, 0.32, mb);          // rear ports block
    var coin = K.cyl(0.13, 0.13, 0.04, 0xdfe5ea, 24, steel);
    coin.rotation.x = Math.PI / 2;
    K.put(coin, -0.95, -0.35, 0.065, mb);
    K.put(K.box(0.14, 0.3, 0.14, dark), 1.36, -0.5, 0.11, mb);
    K.put(K.box(0.14, 0.3, 0.14, dark), 1.36, -0.9, 0.11, mb);
    K.put(K.box(0.14, 0.75, 0.2, 0xf1f1ef), 1.36, 0.75, 0.14, mb);                 // power socket
    models.motherboard = { obj: mb, home: new V(-0.5, 0.3, -0.92), out: new V(-0.5, 0.3, 1.8), at: [1.5, -1.3, 0], offset: [56, 22] };

    /* ---- CPU ---- */
    var cpu = K.group();
    cpu.add(K.box(0.62, 0.62, 0.04, 0x14532d));
    K.put(K.box(0.52, 0.52, 0.012, 0xd9a930, gold), 0, 0, -0.026, cpu);
    K.put(K.rbox(0.5, 0.5, 0.07, 0.05, 0xcfd4d9, K.metal(0xcfd4d9, 0.3)), 0, 0, 0.055, cpu);
    K.put(K.plate(0.44, 0.44, cpuTex, { metalness: 0.7, roughness: 0.35 }), 0, 0, 0.0915, cpu);
    models.cpu = { obj: cpu, home: new V(-0.6, 0.9, -0.77), out: new V(-0.6, 0.9, 3.4), dy: -0.36, offset: [10, 30] };

    /* ---- CPU cooler ---- */
    var cooler = K.group();
    K.put(K.box(0.62, 0.62, 0.07, 0xb87333, K.metal(0xb87333, 0.35)), 0, 0, -0.27, cooler);
    for (var f = 0; f < 11; f++) K.put(K.box(0.045, 0.96, 0.46, 0xaab2ba, alu), -0.45 + f * 0.09, 0, 0, cooler);
    K.put(K.rbox(1.0, 1.0, 0.05, 0.12, 0x101317), 0, 0, 0.27, cooler);
    var cf = fan(0.44, 0x38bdf8);
    cf.rotation.x = Math.PI / 2;
    K.put(cf, 0, 0, 0.36, cooler);
    models.cooler = { obj: cooler, home: new V(-0.6, 0.9, -0.42), out: new V(-0.6, 0.9, 5.0), dy: 0.55, offset: [0, -30] };

    /* ---- RAM ---- */
    var ram = K.group(), ramTex = sticker('8 GB', ['DDR4 RAM'], '#f8fafc', '#0f172a');
    [-0.11, 0.11].forEach(function (x) {
      K.put(K.box(0.035, 1.45, 0.46, 0x14532d), x, 0, 0, ram);
      K.put(K.box(0.04, 1.36, 0.05, 0xd9a930, gold), x, 0, -0.21, ram);           // contacts
      K.put(K.box(0.075, 1.45, 0.36, 0x2563eb, K.metal(0x2f6fe0, 0.35)), x, 0, 0.05, ram); // heat spreader
      var st = K.plate(0.5, 0.2, ramTex);
      st.rotation.y = Math.PI / 2;
      st.rotation.x = Math.PI / 2;
      K.put(st, x + 0.039, 0, 0.06, ram);
    });
    models.ram = { obj: ram, home: new V(0.31, 0.9, -0.55), out: new V(0.9, 2.9, 2.9), dy: 0.78, offset: [0, -28] };

    /* ---- graphics card ---- */
    var gpu = K.group();
    gpu.add(K.box(2.3, 0.05, 0.95, 0x0f1317));
    K.put(K.box(2.3, 0.03, 0.95, 0x343b43, K.metal(0x343b43, 0.4)), 0, 0.04, 0, gpu);        // backplate
    K.put(K.box(2.25, 0.3, 0.9, 0x1c2026, { roughness: 0.5, metalness: 0.25 }), 0, -0.18, 0, gpu);
    K.put(K.box(2.25, 0.06, 0.03, 0xf97316, { emissive: 0xf97316, emissiveIntensity: 0.9 }), 0, -0.12, 0.455, gpu);
    [-0.55, 0.55].forEach(function (x) {
      var gf = fan(0.37, 0x4b5563);
      gf.rotation.x = Math.PI;
      K.put(gf, x, -0.335, 0, gpu);
    });
    K.put(K.box(0.04, 0.56, 1.0, 0xb9c0c7, steel), -1.17, -0.1, 0, gpu);                     // bracket
    K.put(K.box(0.95, 0.02, 0.1, 0xd9a930, gold), -0.2, 0, -0.5, gpu);                       // contacts
    models.gpu = { obj: gpu, home: new V(-0.75, -0.4, -0.3), out: new V(-0.75, -0.9, 5.6), at: [-1.0, 0, 0.5], offset: [-10, -34], tilt: -Math.PI / 2 };

    /* ---- storage drive ---- */
    var ssd = K.group(), flat = K.group();
    flat.add(K.rbox(1.0, 0.7, 0.1, 0.05, 0x16191d, { metalness: 0.5, roughness: 0.4 }));
    K.put(K.plate(0.84, 0.52, sticker('SSD', ['512 GB', 'SATA'], '#f8fafc', '#0f172a')), 0, 0, 0.0515, flat);
    flat.rotation.x = -Math.PI / 2;
    ssd.add(flat);
    models.storage = { obj: ssd, home: new V(1.45, 1.7, 0.25), out: new V(2.4, 2.75, 1.3), dy: 0.4, offset: [0, -26], flat: flat };

    /* ---- power supply ---- */
    var psu = K.group();
    psu.add(K.box(1.7, 0.92, 1.75, 0x16191d, { roughness: 0.5, metalness: 0.45 }));
    K.put(K.box(0.86, 0.86, 0.02, 0x0c0e11), -0.36, 0, 0.88, psu);
    var pf = fan(0.38, 0x374151);
    pf.rotation.x = Math.PI / 2;
    K.put(pf, -0.36, 0, 0.9, psu);
    K.put(K.plate(0.66, 0.42, sticker('650 W', ['AC in', 'DC out'], '#facc15', '#111827')), 0.46, 0, 0.8765, psu);
    [[0.1, 0x111827], [0.0, 0xfacc15], [-0.1, 0xdc2626]].forEach(function (c) {
      psu.add(K.tube([[0.8, 0.2, 0.3 + c[0]], [1.2, 0.3, 0.3 + c[0]], [1.45, 0.75, 0.2 + c[0]], [1.5, 1.25, 0.1 + c[0]]], 0.035, c[1], { roughness: 0.7 }));
    });
    K.put(K.box(0.2, 0.14, 0.4, 0xf1f1ef), 1.5, 1.3, 0.1, psu);
    models.psu = { obj: psu, home: new V(-1.3, -1.78, 0), out: new V(-1.3, -1.78, 3.0), at: [0.85, -0.3, 0.9], offset: [40, 26] };

    /* ---- add parts, labels and dashed guides back to where each part belongs ---- */
    var guides = [];
    PARTS.forEach(function (p) {
      var m = models[p.id];
      m.obj.position.copy(m.home);
      g.add(m.obj);
      stage.pickable(m.obj, p.id);
      var anchor = new T.Object3D();
      if (m.at) anchor.position.fromArray(m.at); else anchor.position.set(0, m.dy, 0);
      m.obj.add(anchor);
      m.label = stage.label(p.name.replace(/ \(.*/, ''), anchor, { offset: m.offset });
      m.label.show(false);
      var line = new T.Line(new T.BufferGeometry().setFromPoints([m.home, m.home.clone()]),
        new T.LineDashedMaterial({ color: 0x7fd3c8, dashSize: 0.12, gapSize: 0.1, transparent: true, opacity: 0.8 }));
      line.visible = false;
      g.add(line);
      guides.push({ line: line, m: m });
    });

    var amount = 0;
    function apply(e, moveCamera) {
      amount = e;
      PARTS.forEach(function (p) {
        var m = models[p.id];
        m.obj.position.lerpVectors(m.home, m.out, e);
        if (m.tilt) m.obj.rotation.x = m.tilt * e;                // graphics card turns its fans to face you
        if (m.flat) m.flat.rotation.x = -Math.PI / 2 * (1 - e);   // drive stands up to show its label
        m.label.show(e > 0.45);                                    // name tags appear once parts are clear of each other
      });
      guides.forEach(function (gd) {
        var pos = gd.line.geometry.attributes.position;
        pos.setXYZ(1, gd.m.obj.position.x, gd.m.obj.position.y, gd.m.obj.position.z);
        pos.needsUpdate = true;
        gd.line.computeLineDistances();
        gd.line.visible = e > 0.04;
      });
      if (moveCamera) {
        var mix = function (a, b) { return a + (b - a) * e; };
        stage.setView({
          target: [mix(HOME.target[0], OPEN.target[0]), mix(HOME.target[1], OPEN.target[1]), mix(HOME.target[2], OPEN.target[2])],
          radius: mix(HOME.radius, OPEN.radius), theta: mix(HOME.theta, OPEN.theta), phi: mix(HOME.phi, OPEN.phi)
        }, false);
      }
    }

    // Fans turn slowly so the model feels alive. Motion: off stops them.
    stage.onFrame = function (dt) { rotors.forEach(function (r) { r.rotation.y += dt * 5; }); };
    stage.animating = true;

    var challenge = null; // index into CHALLENGES while a challenge is running

    function describe(p) {
      stage.info('<h3>' + p.name + '</h3><p>' + p.role + '</p><p>' + p.matters + '</p><p class="note">' + p.like + '</p>');
    }

    function select(id) {
      var p = PARTS.filter(function (x) { return x.id === id; })[0];
      stage.highlight(models[id].obj);
      picker.select(id, true);
      if (challenge === null) { describe(p); return; }
      var c = CHALLENGES[challenge];
      if (id === c.answer) {
        stage.info('<h3>Yes: ' + p.name + '</h3><p>' + c.why + '</p><p class="note">Choose <strong>Next challenge</strong> for another, or select any part to keep exploring.</p>');
        challenge = null;
      } else {
        stage.info('<h3>Challenge</h3><p>' + c.text + '</p><p><strong>Not the ' +
          p.name.replace(/ \(.*/, '').replace(/^[A-Z][a-z]/, function (m) { return m.toLowerCase(); }) +
          '.</strong> ' + p.role + ' Which part fits the problem better?</p>');
      }
    }

    var slider = stage.ui.slider('Pull apart', { min: 0, max: 100, value: 0, format: function (v) { return v + '%'; } }, function (v) {
      apply(v / 100, true);
    });
    function openUp() {
      var from = amount;
      if (from > 0.95) return;
      stage.tween(1100, function (k) {
        var e = from + (1 - from) * k;
        slider.set(Math.round(e * 100), true);
        apply(e, true);
      });
    }
    var picker = stage.ui.choices('Parts', PARTS.map(function (p) {
      return { id: p.id, label: p.name.replace(/ \(.*/, '') };
    }), select);

    var row = stage.ui.row();
    stage.ui.button('Pull it apart for me', openUp, row);
    var next = 0;
    var chBtn = stage.ui.button('Start a challenge', function () {
      challenge = next;
      next = (next + 1) % CHALLENGES.length;
      stage.highlight(null);
      picker.select('', true);
      openUp();
      chBtn.textContent = 'Next challenge';
      stage.info('<h3>Challenge ' + (challenge + 1) + ' of ' + CHALLENGES.length + '</h3><p>' + CHALLENGES[challenge].text +
        '</p><p><strong>Select the part you would check or upgrade.</strong></p>');
    }, row);
    chBtn.classList.add('primary');

    if (stage.demo) slider.set(100);
    stage.onPick = select;
    stage.info('<h3>A desktop computer with its side panel off</h3>' +
      '<p>Use <strong>Pull apart</strong> to slide each part straight out of the place it plugs into, then select a part to see what it does.</p>' +
      '<p class="note">Simplified: real computers also have many cables and small chips. Laptops, tablets and phones contain the same kinds of part, shrunk and often soldered together. Printed figures such as “8 cores” are examples, not a real product.</p>');
  }

  /* ================= Model 2: follow the data ================= */

  function buildFlow(stage, K) {
    var g = stage.root, V = THREE.Vector3;
    stage.setView({ target: [0, 0.7, 0], radius: 13, theta: 0.3, phi: 0.98, minR: 5, maxR: 26, shadow: 8, exposure: 0.72 });

    g.add(K.floor(12, 0));

    var P = {
      kb: new V(-4.6, 0.5, 0.6), cpu: new V(0, 0.75, 0), ram: new V(0, 0.9, -2.9),
      disk: new V(0, 0.6, 2.9), mon: new V(4.6, 1.7, 0)
    };
    function wire(a, b) {
      g.add(K.line([new V(a.x, 0.03, a.z), new V(b.x, 0.03, b.z)], 0x5f7684));
    }
    wire(P.kb, P.cpu); wire(P.cpu, P.ram); wire(P.cpu, P.disk); wire(P.cpu, P.mon);

    // Keyboard (input)
    var kb = K.group();
    kb.add(K.box(2.4, 0.16, 1.0, 0x23282e, { metalness: 0.6, roughness: 0.4 }));
    for (var r = 0; r < 3; r++) for (var c = 0; c < 8; c++) K.put(K.box(0.22, 0.06, 0.22, 0xd7dde2), -0.98 + c * 0.28, 0.11, -0.3 + r * 0.3, kb);
    K.put(kb, -4.6, 0.08, 0.6, g);
    stage.label('Keyboard: INPUT', kb, { dy: 0.5 });

    // CPU on its board (process)
    K.put(K.box(2.6, 0.1, 2.6, 0x0e3b29, { roughness: 0.6 }), 0, 0.05, 0, g);
    K.put(K.box(1.3, 0.04, 1.3, 0xb9c0c7, K.metal(0xb9c0c7, 0.3)), 0, 0.11, 0, g);
    var cpu = K.box(1.0, 0.2, 1.0, 0xcfd4d9, K.metal(0xcfd4d9, 0.28));
    K.put(cpu, 0, 0.21, 0, g);
    stage.label('CPU: PROCESS', cpu, { dy: 0.55 });

    // RAM (short-term store)
    var ram = K.group();
    ram.add(K.box(2.6, 0.7, 0.1, 0x2f6fe0, K.metal(0x2f6fe0, 0.35)));
    K.put(K.box(2.4, 0.08, 0.06, 0xd9a930, K.metal(0xd9a930, 0.28)), 0, -0.37, 0, ram);
    [-0.9, -0.3, 0.3, 0.9].forEach(function (x) { K.put(K.box(0.42, 0.34, 0.06, 0x111827), x, 0.05, 0.07, ram); });
    K.put(ram, 0, 0.45, -2.9, g);
    var ramLabel = stage.label('', ram, { dy: 0.65 });

    // Storage drive (long-term store)
    var disk = K.group();
    disk.add(K.box(1.8, 0.3, 1.2, 0x1b2026, { metalness: 0.6, roughness: 0.35 }));
    K.put(K.box(1.1, 0.02, 0.7, 0xe2e8f0), 0, 0.16, 0, disk);
    K.put(disk, 0, 0.15, 2.9, g);
    var diskLabel = stage.label('', disk, { dy: 0.5 });

    // Monitor (output)
    var mon = K.group();
    K.put(K.box(1.2, 0.08, 0.8, 0xb9c0c7, K.metal(0xb9c0c7, 0.3)), 0, 0.04, 0, mon);
    K.put(K.box(0.2, 0.7, 0.1, 0xb9c0c7, K.metal(0xb9c0c7, 0.3)), 0, 0.4, -0.1, mon);
    K.put(K.rbox(3.1, 2.0, 0.12, 0.08, 0x0b0d10, { roughness: 0.3, metalness: 0.4 }), 0, 1.7, 0, mon);
    var screen = K.text([''], { w: 2.9, h: 1.8, size: 64, bg: '#f8fafc', fg: '#0f172a', title: 'essay.txt' });
    K.put(screen, 0, 1.7, 0.07, mon);
    K.put(mon, 4.6, 0, 0, g);
    mon.rotation.y = -0.35;
    stage.label('Monitor: OUTPUT', mon, { dy: 2.9 });

    var WORD = 'DIGITAL SOCIETY ';
    var st = { power: true, ram: '', disk: '', typed: 0, busy: false };

    function refresh() {
      ramLabel.set('RAM: SHORT-TERM STORE — ' + (st.ram ? '“' + st.ram + '”' : 'empty'));
      diskLabel.set('Storage: LONG-TERM STORE — ' + (st.disk ? '“' + st.disk + '”' : 'empty'));
      screen.material.color.setHex(st.power ? 0xffffff : 0x1a1f24);
      screen.setText(st.power ? [st.ram + '|'] : ['']);
      stage.invalidate();
    }

    function act(title, steps, finish) {
      if (st.busy) return;
      st.busy = true;
      runSteps(stage, K, title, steps, function () { st.busy = false; if (finish) finish(); refresh(); });
    }

    var row = stage.ui.row('Try');
    stage.ui.button('Type a letter', function () {
      if (!st.power) { stage.info('<h3>No power</h3><p>Nothing can be input, processed or shown. Switch the computer back on.</p>'); return; }
      var ch = WORD[st.typed % WORD.length];
      var shown = ch === ' ' ? 'space' : ch;
      act('You press “' + shown + '”', [
        { from: P.kb, to: P.cpu, color: C.input, msg: 'Input: the keyboard sends a code for the key to the CPU.' },
        { from: P.cpu, to: P.ram, color: C.process, msg: 'Process: the CPU works out what the key means and adds it to the document held in RAM.', after: function () { st.ram += ch; st.typed++; refresh(); } },
        { from: P.ram, to: P.cpu, color: C.store, msg: 'The CPU reads the updated document back from RAM.' },
        { from: P.cpu, to: P.mon, color: C.output, msg: 'Output: the new text is sent to the monitor.' }
      ]);
    }, row);
    stage.ui.button('Save', function () {
      if (!st.power) { stage.info('<h3>No power</h3><p>Switch the computer back on first.</p>'); return; }
      if (!st.ram) { stage.info('<h3>Nothing to save</h3><p>RAM is empty. Type a few letters first.</p>'); return; }
      act('You choose Save', [
        { from: P.ram, to: P.cpu, color: C.store, msg: 'The CPU reads the document from RAM.' },
        { from: P.cpu, to: P.disk, color: C.store, msg: 'Store: a copy is written to the storage drive, where it stays without power.', after: function () { st.disk = st.ram; refresh(); } }
      ]);
    }, row);
    stage.ui.button('Cut the power', function () {
      if (st.busy) return;
      var lost = st.ram && st.ram !== st.disk;
      st.power = false; st.ram = '';
      refresh();
      stage.info('<h3>The power is cut</h3><p>RAM is volatile, so everything in it is gone.' +
        (lost ? ' <strong>The unsaved typing is lost.</strong>' : '') +
        ' The storage drive is non-volatile: ' + (st.disk ? 'it still holds “' + st.disk + '”.' : 'but nothing had been saved to it.') + '</p>');
    }, row);
    stage.ui.button('Switch on and open the file', function () {
      if (st.busy) return;
      st.power = true;
      refresh();
      if (!st.disk) { stage.info('<h3>Switched on</h3><p>There is no saved file to open, so you start with a blank document.</p>'); return; }
      act('You open the saved file', [
        { from: P.disk, to: P.cpu, color: C.store, msg: 'The CPU asks the storage drive for the file.' },
        { from: P.cpu, to: P.ram, color: C.process, msg: 'The file is copied into RAM so it can be worked on quickly.', after: function () { st.ram = st.disk; refresh(); } },
        { from: P.ram, to: P.cpu, color: C.store, msg: 'The CPU reads the document from RAM.' },
        { from: P.cpu, to: P.mon, color: C.output, msg: 'Output: the document appears on the monitor.' }
      ]);
    }, row);

    refresh();
    stage.info('<h3>Input, process, store, output</h3><p>Type a few letters and watch the route each one takes. ' +
      'Then test your prediction: cut the power <em>before</em> saving, and again <em>after</em> saving.</p>' +
      '<p class="note">Simplified: one cube stands for millions of electrical signals, and real data also passes through the motherboard and operating system on the way.</p>');
  }

  /* ================= Model 3: software layers ================= */

  var LAYERS = {
    hardware: ['Hardware', 'The physical parts from the first model. On its own, hardware does nothing: it needs software to tell it what to do.'],
    os: ['Operating system', 'Software that manages the hardware, the memory and the other software, and gives you a user interface. Examples: ChromeOS, Windows, macOS, Linux, Android, iOS. It shares RAM between running programs and talks to each device through a small piece of software called a driver.'],
    utility: ['Utility software', 'Tools that analyse, configure or maintain the computer itself: antivirus, backup, file compression, disk clean-up. Some come with the operating system and some are installed separately.'],
    apps: ['Application software', 'Programs that do a job for the user: a word processor, a browser, a video editor, a game. Applications never touch the hardware directly. They ask the operating system.'],
    user: ['User and user interface', 'The interface is how a person and the device communicate. A graphical user interface (GUI) uses windows, icons and touch. A voice interface listens and speaks. A haptic interface uses touch and movement, such as vibration in a game controller.'],
    malware: ['Malicious software (malware)', 'Software written to steal data or damage systems: viruses, worms, spyware, adware, ransomware. It usually arrives disguised as something harmless, and it runs with whatever access the user gave it.']
  };

  function buildLayers(stage, K) {
    var g = stage.root, V = THREE.Vector3;
    stage.setView({ target: [0, 1.5, 0.3], radius: 12, theta: 0.55, phi: 1.1, minR: 4, maxR: 24, shadow: 7, exposure: 0.62 });
    g.add(K.floor(10, 0));

    var hw = K.group();
    hw.add(K.box(5.4, 0.5, 3.6, 0x7b8794, K.metal(0x7b8794, 0.6)));
    [[-1.6, -0.8], [0.2, 0.6], [1.7, -0.9]].forEach(function (p) { K.put(K.box(0.8, 0.08, 0.8, 0x1f2937), p[0], 0.29, p[1], hw); });
    var os = K.box(5.4, 0.5, 3.6, 0x1d4ed8, { roughness: 0.6 });
    var apps = K.group();
    [-1.7, 0, 1.7].forEach(function (x, i) { K.put(K.rbox(1.2, 0.8, 1.1, 0.12, [0xc2410c, 0xea580c, 0xf97316][i], { roughness: 0.6 }), x, 0, -0.9, apps); });
    var util = K.group();
    [-1.7, -0.4].forEach(function (x) { K.put(K.rbox(0.9, 0.5, 0.9, 0.1, 0x0f766e, { roughness: 0.6 }), x, -0.15, 0.9, util); });
    var mal = K.group();
    mal.add(K.box(1.2, 0.8, 1.1, 0xf97316, { transparent: true, opacity: 0.45 }));
    mal.add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.36, 0), K.mat(0xdc2626, { flatShading: true })));
    mal.visible = false;
    var user = K.group();
    K.put(K.cyl(0.28, 0.34, 1.3, 0xe2e8f0, 16), 0, 0.65, 0, user);
    K.put(K.sphere(0.27, 0xe2e8f0), 0, 1.6, 0, user);
    K.put(user, -3.9, 0, 1.6, g);

    g.add(hw, os, apps, util, mal);
    var objs = { hardware: hw, os: os, apps: apps, utility: util, malware: mal, user: user };
    Object.keys(objs).forEach(function (k) { stage.pickable(objs[k], k); });

    var hwTag = new THREE.Object3D(), osTag = new THREE.Object3D();
    K.put(hwTag, 3.4, 0, 1.2, hw);
    K.put(osTag, 3.4, 0, 1.2, os);
    stage.label('Hardware', hwTag, { dy: 0.1 });
    stage.label('Operating system', osTag, { dy: 0.1 });
    stage.label('Applications', apps, { dy: 0.75 });
    stage.label('Utilities', util, { dy: 0.45 });
    stage.label('User', user, { dy: 2.1 });
    var malLabel = stage.label('“Free game”', mal, { dy: 0.75 });

    var gap = 0;
    function place() {
      hw.position.set(0, 0.25, 0);
      os.position.set(0, 0.75 + gap * 0.9, 0);
      apps.position.set(0, 1.4 + gap * 1.9, 0);
      util.position.set(0, 1.4 + gap * 1.9, 0);
      mal.position.x = 1.5; mal.position.z = 0.9;
      if (mal.visible && !mal.userData.falling) mal.position.y = 1.4 + gap * 1.9;
    }
    place();

    function select(id) {
      if (id === 'malware' && !mal.visible) return;
      stage.highlight(objs[id]);
      picker.select(id, true);
      stage.info('<h3>' + LAYERS[id][0] + '</h3><p>' + LAYERS[id][1] + '</p>');
    }

    stage.ui.slider('Separate the layers', { min: 0, max: 100, value: 0, format: function (v) { return v + '%'; } }, function (v) {
      gap = v / 100; place();
    });
    var picker = stage.ui.choices('Layers', [
      { id: 'user', label: 'User' }, { id: 'apps', label: 'Applications' }, { id: 'utility', label: 'Utilities' },
      { id: 'os', label: 'Operating system' }, { id: 'hardware', label: 'Hardware' }
    ], select);

    var busy = false;
    var row = stage.ui.row('Try');
    stage.ui.button('Print a document', function () {
      if (busy) return;
      busy = true;
      var top = apps.position.y, mid = os.position.y;
      runSteps(stage, K, 'You choose Print in the word processor', [
        { from: new V(-3.9, 2.0, 1.6), to: new V(0, top + 0.6, -0.9), color: C.input, msg: 'The user clicks Print in the application’s interface.' },
        { from: new V(0, top + 0.6, -0.9), to: new V(0.8, mid + 0.4, 0), color: C.process, msg: 'The application cannot reach the printer itself, so it asks the operating system.' },
        { from: new V(0.8, mid + 0.4, 0), to: new V(1.7, mid + 0.4, -0.9), color: C.process, msg: 'The operating system passes the job to the printer’s driver, which knows that exact device.' },
        { from: new V(1.7, mid + 0.4, -0.9), to: new V(1.7, 0.6, -0.9), color: C.output, msg: 'The driver sends signals the hardware understands, and the page prints.' }
      ], function () { busy = false; });
    }, row);

    var malBtn = stage.ui.button('Install a “free game” from an unknown site', function () {
      if (busy) return;
      if (!mal.visible) {
        mal.visible = true;
        mal.userData.falling = true;
        var y1 = 1.4 + gap * 1.9;
        stage.tween(700, function (k) { mal.position.y = y1 + 4 * (1 - k); }, function () { mal.userData.falling = false; place(); });
        malBtn.textContent = 'Run antivirus (a utility)';
        stage.highlight(mal);
        picker.select('', true);
        stage.info('<h3>It looked like a game</h3><p>' + LAYERS.malware[1] + '</p><p class="note">Turn the model to look inside the block. Then run the antivirus utility.</p>');
      } else {
        mal.visible = false;
        malBtn.textContent = 'Install a “free game” from an unknown site';
        stage.highlight(util);
        stage.info('<h3>Removed by a utility</h3><p>Antivirus is utility software: it scans files for known malware and removes it. It cannot catch everything, so where software comes from still matters.</p>');
      }
      malLabel.show(mal.visible);
    }, row);

    stage.onPick = select;
    stage.info('<h3>Software is stacked on hardware</h3><p>Each layer only talks to the one below it. Separate the layers, select one, then send a print job through the stack.</p>' +
      '<p class="note">Simplified: real systems have more layers, and the boundaries between them are less tidy.</p>');
  }

  /* ================= The lesson ================= */

  window.DSBook.defineLesson({
    id: '3.3b',
    title: 'Components of a computer',
    question: 'What is inside a computer, and what does each part actually do?',
    intro: 'A phone, a Chromebook and a games console look nothing alike, yet inside they are built from the same few kinds of part doing the same four jobs.',
    targets: [
      'Describe the input, process, store, output model and place a component in it.',
      'Explain the role of the motherboard, CPU, RAM, storage, graphics card and power supply.',
      'Distinguish operating system, utility and application software, and say what malware is.',
      'Discuss how hardware and software choices affect who can use, repair and afford a device.'
    ],

    predict: {
      q: 'You are typing an essay and the power cuts out before you save. Which part was holding your unsaved words?',
      options: ['The CPU', 'The RAM', 'The storage drive', 'The monitor'],
      after: 'Prediction recorded. Now open the model “Follow the data”, type a few letters and cut the power. Was your choice right, and why does that part lose its contents?'
    },

    scenes: [
      {
        id: 'inside', title: 'Inside the box', build: buildInside,
        textVersion: '<table><tr><th>Part</th><th>What it does</th><th>Why it matters</th></tr>' +
          PARTS.map(function (p) { return '<tr><td><strong>' + p.name + '</strong></td><td>' + p.role + '</td><td>' + p.matters + '</td></tr>'; }).join('') +
          '</table><p><strong>Challenges.</strong> Decide which part you would check or upgrade:</p><ol>' +
          CHALLENGES.map(function (c) { return '<li>' + c.text + ' <details><summary>Answer</summary>' + c.why + '</details></li>'; }).join('') + '</ol>'
      },
      {
        id: 'flow', title: 'Follow the data', build: buildFlow,
        hint: 'Drag to rotate. Pinch or use + and − to zoom. Use the buttons below to send data through the computer.',
        textVersion: '<p><strong>Typing a letter.</strong></p><ol><li>Input: the keyboard sends a code for the key to the CPU.</li>' +
          '<li>Process: the CPU works out what it means and adds it to the document held in RAM.</li>' +
          '<li>The CPU reads the updated document back from RAM.</li><li>Output: the new text is sent to the monitor.</li></ol>' +
          '<p><strong>Saving.</strong> The CPU reads the document from RAM and writes a copy to the storage drive.</p>' +
          '<p><strong>Cutting the power.</strong> RAM is volatile, so it empties and unsaved work is lost. The storage drive is non-volatile, so saved files remain.</p>' +
          '<p><strong>Opening a file.</strong> The file is copied from the storage drive into RAM, then shown on the monitor.</p>'
      },
      {
        id: 'layers', title: 'Software layers', build: buildLayers,
        textVersion: '<table><tr><th>Layer (top to bottom)</th><th>What it is</th></tr>' +
          ['user', 'apps', 'utility', 'os', 'hardware', 'malware'].map(function (k) {
            return '<tr><td><strong>' + LAYERS[k][0] + '</strong></td><td>' + LAYERS[k][1] + '</td></tr>';
          }).join('') + '</table>' +
          '<p><strong>Printing a document.</strong> The user clicks Print in an application. The application asks the operating system. ' +
          'The operating system hands the job to the printer’s driver. The driver sends signals the printer hardware understands.</p>'
      }
    ],

    sections: [
      {
        heading: 'Four jobs every computer does',
        html: '<p>Whatever its size, a computer takes data in (<strong>input</strong>), works on it by following instructions (<strong>process</strong>), ' +
          'keeps data for now or for later (<strong>store</strong>) and gives a result back (<strong>output</strong>).</p>' +
          '<ul><li><strong>Input devices</strong>: keyboard, mouse, touchscreen, microphone, camera, sensors.</li>' +
          '<li><strong>Output devices</strong>: screen, speakers, printer, lights, motors.</li></ul>' +
          '<p>A touchscreen is both at once. Open <em>Follow the data</em> to watch one key press pass through all four jobs.</p>'
      },
      {
        heading: 'The hardware inside',
        html: '<p><strong>Hardware</strong> means the physical parts. In <em>Inside the box</em>, pull the desktop apart and select each one.</p>' +
          '<ul><li>The <strong>motherboard</strong> connects everything.</li>' +
          '<li>The <strong>CPU</strong> carries out instructions. More clock speed, more cores and more cache each let it do more work per second.</li>' +
          '<li><strong>RAM</strong> is fast, short-term memory that empties when the power goes off.</li>' +
          '<li><strong>Secondary storage</strong> (an SSD or hard disk) keeps files and programs with the power off.</li>' +
          '<li>A <strong>graphics card (GPU)</strong> draws images so the CPU does not have to. Sound is handled in a similar way by a sound chip or card.</li>' +
          '<li>The <strong>power supply</strong>, or a charger and lithium-ion battery in portable devices, feeds every part.</li></ul>' +
          '<p>Performance is a team effort. A fast CPU with too little RAM still feels slow, which is why the challenges ask you to match a problem to a part.</p>'
      },
      {
        heading: 'Software makes the hardware useful',
        html: '<p><strong>Software</strong> is the instructions. Open <em>Software layers</em> to see how it is stacked.</p>' +
          '<ul><li>The <strong>operating system</strong> manages hardware, memory and other software, and provides the user interface.</li>' +
          '<li><strong>Utility software</strong> looks after the computer itself.</li>' +
          '<li><strong>Application software</strong> does the jobs people actually bought the device for.</li></ul>' +
          '<p>Software also differs in who controls it. <strong>Open-source</strong> software publishes its source code, so anyone may inspect, change and share it, usually at no cost. ' +
          '<strong>Proprietary</strong> software is owned by a company that keeps the code private and licenses the right to use it, often with paid support and updates.</p>' +
          '<p>Not all software is written to help. <strong>Malware</strong> is designed to steal data or cause damage and usually arrives disguised as something useful.</p>'
      },
      {
        heading: 'In the real world: your school Chromebook',
        html: '<p>A school Chromebook has a modest CPU, a small amount of RAM and very little storage. That is a deliberate design choice, not a flaw: ' +
          'most of the processing and storage happens on servers reached over the internet, so the device itself can be cheap, light and long-lasting on battery.</p>' +
          '<p>The trade-off is dependence. Without a connection, or once the maker stops sending software updates, a device whose hardware still works can become much less useful.</p>'
      }
    ],

    terms: [
      ['Hardware', 'The physical parts of a computer system.'],
      ['Software', 'The instructions (programs) that tell hardware what to do.'],
      ['Input device / output device', 'Equipment that sends data into a computer, or presents results from it.'],
      ['Motherboard', 'The main circuit board that links all the other components.'],
      ['Central processing unit (CPU)', 'The component that carries out program instructions and directs the other parts.'],
      ['Clock speed, cores, cache', 'Three features of a CPU: steps per second, number of independent processing units, and a small fast memory inside the chip.'],
      ['RAM (random access memory)', 'Fast, temporary memory for the programs and data in use. It is lost when power is removed (volatile).'],
      ['Secondary storage', 'Long-term, non-volatile storage for programs and files, such as an SSD or hard disk.'],
      ['Graphics processing unit (GPU)', 'A processor specialised for producing images and video.'],
      ['Operating system', 'Software that manages hardware, memory and other software and provides a user interface.'],
      ['User interface', 'The means by which a person interacts with a device: graphical, voice or haptic.'],
      ['Utility software', 'Software that analyses, configures or maintains the computer.'],
      ['Application software', 'Software that performs a task for the user.'],
      ['Open-source / proprietary software', 'Software whose source code is published for anyone to use and change, versus software owned and licensed by a company that keeps the code private.'],
      ['Malware', 'Software designed to steal data or to damage computers and systems.']
    ],

    questions: [
      {
        q: 'A power cut hits while you are working. Which statement is correct?',
        options: [
          ['Everything on the storage drive is erased, but RAM keeps your open document.', 'That is the wrong way round. Try cutting the power in the “Follow the data” model and read the two labels.'],
          'Unsaved work in RAM is lost, but files already saved to the storage drive remain.',
          ['The CPU keeps a copy of your document until the power returns.', 'The CPU processes data but does not keep your files. Its cache is tiny and also needs power.'],
          ['Nothing is lost, because the monitor was displaying the document.', 'The monitor only shows what it is sent. It stores nothing.']
        ],
        answer: 1,
        why: 'RAM is volatile and empties without power. Secondary storage is non-volatile, so saved files survive.'
      },
      {
        q: 'Which change would most help a computer that slows down badly when many programs are open at once?',
        options: [
          ['A larger monitor', 'A monitor is an output device. It changes what you see, not how much the computer can hold in use.'],
          ['A more powerful power supply', 'More available power does not create more working memory. The symptom points to another part.'],
          'More RAM',
          ['A newer keyboard', 'A keyboard is an input device and has no effect on how many programs can stay open.']
        ],
        answer: 2,
        why: 'Every open program occupies RAM. With more of it, the computer no longer has to keep swapping data out to slower storage.'
      },
      {
        q: 'You tap Print in a word processor. What is the operating system’s part in what happens next?',
        options: [
          ['None. The application controls the printer directly.', 'Applications do not drive hardware themselves. Run “Print a document” in the “Software layers” model.'],
          'It takes the application’s request and passes it, through a driver, to the printer hardware.',
          ['It scans the document for malware and deletes it if needed.', 'That describes a utility such as antivirus, not the operating system’s role in printing.'],
          ['It is the printer’s power supply.', 'An operating system is software. It manages hardware but supplies no electricity.']
        ],
        answer: 1,
        why: 'The operating system sits between applications and hardware, using drivers to talk to each device.'
      }
    ],

    inquiry: {
      prompt: 'Many phones, tablets and laptops are now built with the RAM, storage and battery glued or soldered in place, so they cannot be upgraded or easily repaired. Who gains and who loses from that design choice?',
      consider: [
        'Think about at least three groups: for example the manufacturer, a family on a tight budget, a school buying 500 devices, a repair shop, and people living near e-waste sites.',
        'What are the impacts now (price, weight, battery life) and the longer-term implications (device lifespan, waste, who controls repair)?',
        'What evidence would you need before recommending a “right to repair” rule for your province or country?'
      ]
    }
  });
})();
