/* 3.3 Pinnacle task: The computer shop.
   The student works the counter of a computer shop. Five customers each want a computer for a
   purpose and have a budget. The student chooses the parts, watches the machine come together,
   tests it against what the customer will do with it, and then justifies the build in writing.
   Prices and part names are classroom figures, not real products. */
(function () {
  'use strict';

  var BASE = 150; // case, motherboard and CPU cooler
  var CATALOGUE = {
    cpu: { name: 'Processor (CPU)', short: 'CPU', options: [
      { label: '4-core', price: 120, tier: 1, watts: 65 },
      { label: '6-core', price: 220, tier: 2, watts: 95 },
      { label: '12-core', price: 420, tier: 3, watts: 150 }] },
    ram: { name: 'Memory (RAM)', short: 'RAM', options: [
      { label: '8 GB', price: 40, tier: 1 },
      { label: '16 GB', price: 75, tier: 2 },
      { label: '32 GB', price: 140, tier: 3 }] },
    storage: { name: 'Storage drive', short: 'Storage', options: [
      { label: '256 GB', price: 45, tier: 1 },
      { label: '1 TB', price: 95, tier: 2 },
      { label: '2 TB', price: 180, tier: 3 }] },
    gpu: { name: 'Graphics', short: 'Graphics', options: [
      { label: 'Built-in', price: 0, tier: 0, watts: 0 },
      { label: 'Mid card', price: 280, tier: 2, watts: 200 },
      { label: 'High card', price: 650, tier: 3, watts: 350 }] },
    psu: { name: 'Power supply', short: 'Power', options: [
      { label: '300 W', price: 50, tier: 300 },
      { label: '550 W', price: 80, tier: 550 },
      { label: '850 W', price: 140, tier: 850 }] }
  };
  var KEYS = ['cpu', 'ram', 'storage', 'gpu', 'psu'];

  var CUSTOMERS = [
    { name: 'Mrs. Arsenault', wants: 'Email, video calls with her grandchildren, and looking at family photos.', budget: 550,
      need: { cpu: 1, ram: 1, storage: 1, gpu: 0 },
      why: { cpu: 'Email and video calls are light work for any processor.', ram: 'A few programs at once fit in a small amount of memory.', storage: 'Photos and documents need little space.', gpu: 'Built-in graphics are enough for video calls and photos.' } },
    { name: 'Jamal, a Grade 11 student', wants: 'Schoolwork with thirty browser tabs open, video lessons, and a few simple games.', budget: 800,
      need: { cpu: 2, ram: 2, storage: 1, gpu: 0 },
      why: { cpu: 'Many things running at once need several cores.', ram: 'Every open tab sits in memory. Thirty tabs overflow 8 GB.', storage: 'Schoolwork is small, and most of it lives online.', gpu: 'Simple games run on built-in graphics.' } },
    { name: 'Priya, a keen gamer', wants: 'The newest 3D games at high detail, and a few large games installed at once.', budget: 1700,
      need: { cpu: 2, ram: 2, storage: 2, gpu: 3 },
      why: { cpu: 'Games need a capable processor, but not the biggest one.', ram: 'Modern games expect 16 GB.', storage: 'Large games fill a small drive after two or three installs.', gpu: 'Drawing detailed 3D scenes many times a second is the graphics card’s job.' } },
    { name: 'Tomas, a video editor', wants: 'Editing 4K video for his small business, with many large files kept on the machine.', budget: 1900,
      need: { cpu: 3, ram: 3, storage: 3, gpu: 2 },
      why: { cpu: 'Turning edited video into a finished file uses every core.', ram: '4K video held in memory while editing needs a great deal of it.', storage: '4K video files are huge.', gpu: 'A graphics card speeds up previews and effects.' } },
    { name: 'Bayside Accounting, a four-person office', wants: 'Large spreadsheets and several programs open all day, and years of client files stored on the machine.', budget: 700,
      need: { cpu: 2, ram: 2, storage: 2, gpu: 0 },
      why: { cpu: 'Big spreadsheets and several programs together need a mid-range processor.', ram: 'Several programs open all day need 16 GB.', storage: 'Years of client files need room to grow.', gpu: 'Spreadsheets draw nothing demanding.' } }
  ];

  function total(build) {
    return KEYS.reduce(function (a, k) { return a + (build[k] === null ? 0 : CATALOGUE[k].options[build[k]].price); }, BASE);
  }
  function watts(build) {
    return 60 + CATALOGUE.cpu.options[build.cpu].watts + CATALOGUE.gpu.options[build.gpu].watts;
  }
  /* Judges a finished build against one customer. Returns the lines of a test report. */
  function judge(build, c) {
    var lines = [], works = true;
    ['cpu', 'ram', 'storage', 'gpu'].forEach(function (k) {
      var opt = CATALOGUE[k].options[build[k]];
      if (opt.tier >= c.need[k]) lines.push({ ok: true, text: CATALOGUE[k].name + ' (' + opt.label + '): enough. ' + c.why[k] });
      else { works = false; lines.push({ ok: false, text: CATALOGUE[k].name + ' (' + opt.label + '): not enough. ' + c.why[k] }); }
    });
    var need = watts(build), have = CATALOGUE.psu.options[build.psu].tier;
    if (have >= need) lines.push({ ok: true, text: 'Power supply (' + have + ' W): enough for the ' + need + ' W these parts can draw.' });
    else { works = false; lines.push({ ok: false, text: 'Power supply (' + have + ' W): too small. These parts can draw ' + need + ' W, so the computer cuts out when it works hard.' }); }
    var cost = total(build), over = cost > c.budget;
    return { lines: lines, works: works, cost: cost, over: over, wasteful: works && !over && cost > cheapest(c) * 1.3 };
  }
  /* The lowest price of any build that works for this customer (243 combinations). */
  function cheapest(c) {
    if (c.best) return c.best;
    var best = Infinity, b = {};
    (function walk(i) {
      if (i === KEYS.length) {
        var ok = ['cpu', 'ram', 'storage', 'gpu'].every(function (k) { return CATALOGUE[k].options[b[k]].tier >= c.need[k]; }) &&
          CATALOGUE.psu.options[b.psu].tier >= watts(b);
        if (ok) best = Math.min(best, total(b));
        return;
      }
      for (var o = 0; o < 3; o++) { b[KEYS[i]] = o; walk(i + 1); }
    })(0);
    c.best = best;
    return best;
  }

  function build(stage, K) {
    var T = THREE, g = stage.root, V = T.Vector3;
    stage.setView({ target: [0.1, 0.2, 0.2], radius: 12.5, theta: 0.42, phi: 1.22, minR: 4, maxR: 26, shadow: 10, exposure: 1.3 });
    g.add(K.floor(14, -2.47));
    var steel = K.metal(0xb9c0c7, 0.3), alu = K.metal(0x9aa3ab, 0.38), gold = K.metal(0xd9a930, 0.28), dark = 0x15181c;
    var rotors = [];
    function fan(r, c) { var f = K.fan(r, c); rotors.push(f.userData.rotor); return f; }
    function tag(title, line, bg, fg) {
      return K.tex(256, 160, function (c, w, h) {
        c.fillStyle = bg; c.fillRect(0, 0, w, h);
        c.fillStyle = fg; c.font = '800 46px system-ui, sans-serif'; c.fillText(title, 16, 62);
        c.font = '600 24px ui-monospace, Menlo, monospace'; c.fillText(line, 16, 104);
      });
    }

    /* ---- the case, motherboard and cooler come with every computer ---- */
    var paint = { metalness: 0.55, roughness: 0.42 };
    K.put(K.box(4.5, 4.7, 0.08, 0x2b323a, paint), 0, 0, -1.04, g);
    K.put(K.box(4.3, 4.5, 0.03, 0x181c21, { roughness: 0.8 }), 0, 0, -0.985, g);
    K.put(K.box(4.5, 0.1, 2.1, 0x2b323a, paint), 0, 2.3, 0, g);
    K.put(K.box(4.5, 0.1, 2.1, 0x2b323a, paint), 0, -2.3, 0, g);
    K.put(K.box(0.1, 4.7, 2.1, 0x2b323a, paint), -2.2, 0, 0, g);
    K.put(K.box(0.3, 4.7, 2.1, 0x1a1e24, { metalness: 0.3, roughness: 0.5 }), 2.3, 0, 0, g);
    K.put(K.box(0.02, 3.3, 0.07, 0x2dd4bf, { emissive: 0x2dd4bf, emissiveIntensity: 1.6 }), 2.46, 0.1, 0.62, g);
    K.put(K.box(1.3, 0.05, 0.95, 0x48515b, paint), 1.45, 1.62, 0.25, g);
    var mb = K.group();
    mb.add(K.box(3.0, 3.4, 0.08, 0x0e3b29, { roughness: 0.7 }));
    K.put(K.box(0.88, 0.88, 0.06, 0xb9c0c7, steel), -0.1, 0.6, 0.07, mb);
    [0.48, 0.7, 0.92, 1.14].forEach(function (x) { K.put(K.box(0.09, 1.55, 0.1, dark), x, 0.6, 0.09, mb); });
    K.put(K.box(2.3, 0.1, 0.1, dark), -0.25, -0.7, 0.09, mb);
    K.put(K.box(1.15, 0.3, 0.34, 0x9aa3ab, alu), -0.1, 1.38, 0.21, mb);
    K.put(mb, -0.5, 0.3, -0.92, g);

    /* ---- parts: one model per option, shown when chosen ---- */
    var slots = {};
    function slot(key, makers, home) {
      slots[key] = makers.map(function (make) {
        var m = make();
        m.visible = false;
        m.userData.home = new V(home[0], home[1], home[2]);
        m.position.copy(m.userData.home);
        g.add(m);
        return m;
      });
    }
    slot('cpu', [1, 2, 3].map(function (tier) {
      return function () {
        var cpu = K.group();
        cpu.add(K.box(0.62, 0.62, 0.04, 0x14532d));
        K.put(K.rbox(0.5, 0.5, 0.07, 0.05, 0xcfd4d9, K.metal(0xcfd4d9, 0.3)), 0, 0, 0.055, cpu);
        // the cooler sits on top of whichever processor is chosen
        for (var f = 0; f < 9; f++) K.put(K.box(0.045, 0.9, 0.4, 0xaab2ba, alu), -0.36 + f * 0.09, 0, 0.32, cpu);
        K.put(K.rbox(0.95, 0.95, 0.05, 0.12, 0x101317), 0, 0, 0.55, cpu);
        var cf = fan(0.4, [0x38bdf8, 0x4ade80, 0xf97316][tier - 1]);
        cf.rotation.x = Math.PI / 2;
        K.put(cf, 0, 0, 0.63, cpu);
        return cpu;
      };
    }), [-0.6, 0.9, -0.77]);
    slot('ram', [1, 2, 4].map(function (n) {
      return function () {
        var ram = K.group();
        for (var i = 0; i < n; i++) {
          var x = [0.2, 0.42, -0.02, 0.64][i] - 0.31;
          K.put(K.box(0.035, 1.45, 0.46, 0x14532d), x, 0, 0, ram);
          K.put(K.box(0.075, 1.45, 0.36, 0x2f6fe0, K.metal(0x2f6fe0, 0.35)), x, 0, 0.05, ram);
        }
        return ram;
      };
    }), [0.31, 0.9, -0.55]);
    slot('storage', ['256 GB', '1 TB', '2 TB'].map(function (size) {
      return function () {
        var ssd = K.group();
        var body = K.rbox(1.0, 0.7, 0.1, 0.05, 0x16191d, { metalness: 0.5, roughness: 0.4 });
        body.rotation.x = -Math.PI / 2;
        ssd.add(body);
        var st = K.plate(0.84, 0.52, tag('SSD', size, '#f8fafc', '#0f172a'));
        st.rotation.x = -Math.PI / 2;
        K.put(st, 0, 0.052, 0, ssd);
        return ssd;
      };
    }), [1.45, 1.7, 0.25]);
    slot('gpu', [0, 1, 2].map(function (fans) {
      return function () {
        var gpu = K.group();
        if (!fans) return gpu; // built-in graphics: nothing to add
        var len = fans === 1 ? 1.5 : 2.3;
        gpu.add(K.box(len, 0.05, 0.95, 0x0f1317));
        K.put(K.box(len, 0.03, 0.95, 0x343b43, K.metal(0x343b43, 0.4)), 0, 0.04, 0, gpu);
        K.put(K.box(len - 0.05, 0.3, 0.9, 0x1c2026, { roughness: 0.5, metalness: 0.25 }), 0, -0.18, 0, gpu);
        K.put(K.box(len - 0.05, 0.06, 0.03, 0xf97316, { emissive: 0xf97316, emissiveIntensity: 0.9 }), 0, -0.12, 0.455, gpu);
        (fans === 1 ? [0] : [-0.55, 0.55]).forEach(function (x) {
          var gf = fan(0.37, 0x4b5563);
          gf.rotation.x = Math.PI;
          K.put(gf, x, -0.335, 0, gpu);
        });
        gpu.position.x = fans === 1 ? -0.4 : 0;
        var wrap = K.group();
        wrap.add(gpu);
        return wrap;
      };
    }), [-0.75, -0.4, -0.3]);
    slot('psu', [300, 550, 850].map(function (w) {
      return function () {
        var psu = K.group();
        psu.add(K.box(1.7, 0.92, 1.75, 0x16191d, { roughness: 0.5, metalness: 0.45 }));
        var pf = fan(0.38, 0x374151);
        pf.rotation.x = Math.PI / 2;
        K.put(pf, -0.36, 0, 0.9, psu);
        K.put(K.plate(0.66, 0.42, tag(w + ' W', 'AC to DC', '#facc15', '#111827')), 0.46, 0, 0.8765, psu);
        return psu;
      };
    }), [-1.3, -1.78, 0]);

    /* ---- order ticket and test screen ---- */
    var ticket = K.text([''], { w: 4.4, h: 3.0, px: 640, size: 30, bg: '#fffdf8', fg: '#1d2730', title: 'ORDER' });
    K.put(K.rbox(4.6, 3.2, 0.1, 0.1, 0x8a6a4a, { roughness: 0.7 }), -5.6, 0.9, -0.6, g).rotation.y = 0.35;
    ticket.rotation.y = 0.35;
    K.put(ticket, -5.58, 0.9, -0.54, g);
    var screen = K.text([''], { w: 3.3, h: 2.0, size: 40, bg: '#0b1620', fg: '#e8f1f5', align: 'center', pad: 40, title: 'TEST BENCH' });
    var mon = K.group();
    K.put(K.rbox(3.5, 2.2, 0.12, 0.08, 0x0b0d10, { roughness: 0.3, metalness: 0.4 }), 0, 1.7, 0, mon);
    K.put(screen, 0, 1.7, 0.07, mon);
    K.put(K.box(0.2, 0.9, 0.1, 0xb9c0c7, steel), 0, 0.5, -0.1, mon);
    K.put(K.box(1.3, 0.08, 0.8, 0xb9c0c7, steel), 0, 0.04, 0, mon);
    mon.rotation.y = -0.4;
    K.put(mon, 5.4, -2.47, 0.2, g);
    var priceTag = stage.label('', new V(0, 2.75, 0.4), { cls: 'big' });

    stage.onFrame = function (dt) { rotors.forEach(function (r) { r.rotation.y += dt * 5; }); };
    stage.animating = true;

    stage.els.controls.classList.add('dense');
    stage.els.info.classList.add('dense');
    var st = { c: 0, build: {}, done: [] }, pickers = {};
    function wrap(text, n) {
      var words = text.split(' '), lines = [], cur = '';
      words.forEach(function (w) { if ((cur + ' ' + w).length > n) { lines.push(cur); cur = w; } else cur = cur ? cur + ' ' + w : w; });
      lines.push(cur);
      return lines;
    }
    function chosen() { return KEYS.every(function (k) { return st.build[k] !== null; }); }

    function showCustomer() {
      var c = CUSTOMERS[st.c];
      KEYS.forEach(function (k) { st.build[k] = null; pickers[k].select('', true); slots[k].forEach(function (m) { m.visible = false; }); });
      ticket.setText(['Customer ' + (st.c + 1) + ' of ' + CUSTOMERS.length, c.name, ''].concat(wrap(c.wants, 36)).concat(['', 'Budget: $' + c.budget]));
      screen.setText(['', 'Waiting for', 'a computer']);
      refresh();
      stage.info('<h3>' + c.name + '</h3><p><strong>Wants it for:</strong> ' + c.wants + '</p><p><strong>Budget:</strong> $' + c.budget +
        '. The case, motherboard and cooler cost $' + BASE + ' and are already on the bench.</p>' +
        '<p><strong>Before you choose:</strong> which one part matters most for this customer? Decide, then build.</p>');
    }
    function refresh() {
      var c = CUSTOMERS[st.c], cost = total(st.build);
      priceTag.set('$' + cost + ' of $' + c.budget + (cost > c.budget ? '  OVER' : ''));
      stage.invalidate();
    }
    function choose(key, index) {
      st.build[key] = index;
      slots[key].forEach(function (m, i) {
        m.visible = i === index;
        if (i === index) {
          var home = m.userData.home, from = home.clone().add(new V(0, 0, 3.5));
          stage.tween(450, function (k) { m.position.lerpVectors(from, home, k); });
        }
      });
      var opt = CATALOGUE[key].options[index];
      refresh();
      stage.info('<h3>' + CATALOGUE[key].name + ': ' + opt.label + ', $' + opt.price + '</h3>' +
        '<p>Running total $' + total(st.build) + ' of $' + CUSTOMERS[st.c].budget + '.' +
        (chosen() ? ' Every part is chosen. These parts can draw up to ' + watts(st.build) + ' W. Press <strong>Test the build</strong>.' : ' Keep choosing: every row needs one part.') + '</p>');
    }

    KEYS.forEach(function (k) {
      pickers[k] = stage.ui.choices(CATALOGUE[k].short, CATALOGUE[k].options.map(function (o, i) {
        return { id: i, label: o.label + ' $' + o.price };
      }), function (i) { choose(k, +i); });
    });
    var row = stage.ui.row();
    stage.ui.button('Test the build', function () {
      var c = CUSTOMERS[st.c];
      if (!chosen()) { stage.info('<h3>Not finished</h3><p>Choose one part in every row first. A computer with a part missing will not start.</p>'); return; }
      var r = judge(st.build, c), verdict, shown;
      if (!r.works) { verdict = 'It does not do the job'; shown = ['', 'FAILED', 'the test']; }
      else if (r.over) { verdict = 'It works, but it is $' + (r.cost - c.budget) + ' over budget'; shown = ['', 'WORKS', 'but over budget']; }
      else if (r.wasteful) { verdict = 'It works, but the customer paid for power they will never use'; shown = ['', 'WORKS', 'but wasteful']; }
      else { verdict = 'Sold: it does the job, within budget'; shown = ['', 'SOLD', '$' + r.cost]; if (st.done.indexOf(st.c) < 0) st.done.push(st.c); }
      screen.setText(shown);
      stage.info('<h3>' + verdict + '</h3><ul style="margin:0;padding-left:20px">' + r.lines.map(function (l) {
        return '<li>' + (l.ok ? '' : '<strong>Problem: </strong>') + l.text + '</li>';
      }).join('') + '</ul><p>Price $' + r.cost + ' against a budget of $' + c.budget + '.' +
        (r.wasteful ? ' A build that does this job can cost as little as $' + cheapest(c) + '. What would you tell a customer who asked why yours costs more?' : '') +
        '</p><p class="note">Customers served well: ' + st.done.length + ' of ' + CUSTOMERS.length + '. Change a part and test again, or move to the next customer.</p>');
    }, row).classList.add('primary');
    stage.ui.button('Next customer', function () { st.c = (st.c + 1) % CUSTOMERS.length; showCustomer(); }, row);
    stage.ui.button('Start again', function () { showCustomer(); }, row);

    showCustomer();
  }

  var catalogueTable = '<table><tr><th>Part</th><th>Option 1</th><th>Option 2</th><th>Option 3</th></tr>' +
    KEYS.map(function (k) {
      return '<tr><td><strong>' + CATALOGUE[k].name + '</strong></td>' + CATALOGUE[k].options.map(function (o) {
        return '<td>' + o.label + ', $' + o.price + (o.watts ? ', ' + o.watts + ' W' : '') + '</td>';
      }).join('') + '</tr>';
    }).join('') + '</table>';

  window.DSBook.defineLesson({
    id: '3.3p',
    title: 'Pinnacle task: The computer shop',
    question: 'A customer walks in knowing what they want to do, not what they need to buy. Can you build it for them?',
    intro: 'You are working the counter of a small computer shop. Five customers will come in. For each one, choose the parts, watch the computer come together, test it, and then explain your choices the way you would to the customer.',
    targets: [
      'Choose a processor, memory, storage, graphics and power supply to match what a person will do with a computer.',
      'Explain each choice using the correct terms, and say what you left out and why.',
      'Stay within a budget, and recognise when a build is more than the customer needs.',
      'Discuss who gains and who loses when shops sell more computer than people need.'
    ],
    predict: {
      q: 'A grandmother wants a computer for email and video calls. A shop sells her its most powerful model. Is that good service?',
      options: ['Yes: more powerful is always better', 'Yes, as long as she can afford it', 'No: she is paying for power she will never use', 'It depends on what she plans to do with it later'],
      after: 'Prediction recorded. Serve the first customer, and try building her the most expensive computer. Read what the test bench says.'
    },
    scenes: [{
      id: 'shop', title: 'The shop bench', build: build,
      hint: 'Choose one part in each row below, then press Test the build. Drag to look around the computer.',
      textVersion: '<p>Every computer starts with a case, motherboard and cooler costing $' + BASE + '. Choose one option in each row. Prices are classroom figures, not real products.</p>' + catalogueTable +
        '<p><strong>Power rule:</strong> add 60 W to the processor’s and the graphics card’s figures. The power supply must be at least that large.</p>' +
        '<table><tr><th>Customer</th><th>Wants it for</th><th>Budget</th></tr>' +
        CUSTOMERS.map(function (c) { return '<tr><td><strong>' + c.name + '</strong></td><td>' + c.wants + '</td><td>$' + c.budget + '</td></tr>'; }).join('') + '</table>' +
        '<p>A build is sold when it does the job, is within budget, and does not cost far more than the job needs.</p>'
    }],
    sections: [
      {
        heading: 'How the shop works',
        html: '<ul><li>Read the order ticket. Decide which part matters most <em>before</em> you choose anything.</li>' +
          '<li>Choose one part in every row. Each part slides into the place it plugs into.</li>' +
          '<li>Press <strong>Test the build</strong>. The test bench tells you what works, what does not, and why.</li>' +
          '<li>Change parts and test again until it is sold, then take the next customer.</li></ul>' +
          '<p>There is more than one build that works for each customer. The best one does the job for the least money.</p>'
      },
      {
        heading: 'Write it up',
        html: '<p>For <strong>two</strong> of your five customers, write to the customer explaining the computer you built. Each answer should:</p>' +
          '<ul><li>name each part and say what it does for <em>their</em> use;</li><li>say what you chose not to include, and why;</li><li>give the price and how it fits the budget;</li><li>use at least five terms from the unit correctly.</li></ul>' +
          '<p>Then answer one of these in full:</p>' +
          '<ul><li><strong>[4]</strong> Explain two reasons why a computer with a powerful processor may still be slow.</li>' +
          '<li><strong>[8]</strong> To what extent should a shop sell a customer the most powerful computer they can afford?</li>' +
          '<li><strong>[8]</strong> Discuss whether customers should be able to upgrade and repair the computers they buy.</li></ul>'
      },
      {
        heading: 'What the model leaves out',
        html: '<p>Real parts must also fit each other physically and electrically, prices change every week, and a real shop would ask the customer many more questions. The model keeps one idea: the right computer is the one that fits the job.</p>'
      }
    ],
    terms: [
      ['Specification', 'The list of parts and their sizes or speeds that describes a computer.'],
      ['Budget', 'The most the customer is willing to spend.'],
      ['Bottleneck', 'The one part that holds back everything else, such as too little memory with a fast processor.'],
      ['Over-specified', 'More powerful, and more expensive, than the job needs.']
    ],
    questions: [
      {
        q: 'Jamal keeps thirty browser tabs open. Which part matters most for him?',
        options: [['The graphics card', 'Tabs are held in memory. A graphics card draws 3D scenes.'], 'Memory (RAM)', ['The power supply', 'It feeds the parts but does not hold open programs.'], ['A larger storage drive', 'Storage keeps saved files. Open tabs live in memory.']],
        answer: 1, why: 'Every open tab sits in memory, so too little of it is his bottleneck.'
      },
      {
        q: 'You fit a high-end graphics card and a 300 W power supply. What happens?',
        options: [['The games run faster than expected', 'The parts can draw more power than the supply can give.'], ['Nothing: any power supply works', 'Every part depends on the power supply delivering enough.'], 'The computer cuts out when it works hard', ['The storage drive fills up', 'Power and storage are unrelated.']],
        answer: 2, why: 'The parts can draw more than 300 W, so the supply cannot keep up under load.'
      },
      {
        q: 'A build works and is within budget, but the test bench calls it wasteful. Why?',
        options: ['It costs far more than a build that would do the same job', ['It uses too little memory', 'Then it would not have worked.'], ['The customer chose it', 'You chose it for them.'], ['It has no graphics card', 'Many jobs need none.']],
        answer: 0, why: 'The customer is paying for capability their work will never use.'
      }
    ],
    inquiry: {
      prompt: 'Most people cannot judge what computer they need, and the person selling it earns more from a bigger sale. Who should be responsible for making sure people buy only what they need?',
      consider: [
        'Think about the customer, the salesperson, the shop owner, the manufacturer, and people who can barely afford a computer at all.',
        'What follows when millions of people own more computer than they need: for their money, for waste, for the companies?',
        'Would clearer labels, independent advice, or rules for shops make the most difference?'
      ]
    }
  });
})();
