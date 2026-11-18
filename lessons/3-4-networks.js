/* 3.4 Networks and the internet. All six lessons live in this one file so they can share
   the same network parts (laptop, router, server and so on) and look the same throughout. */
(function () {
  'use strict';

  /* ================= shared parts ================= */

  function glow(K, w, h, color) {
    var p = K.plate(w, h, K.tex(64, 40, function (c, cw, ch) {
      var g = c.createLinearGradient(0, 0, cw, ch);
      g.addColorStop(0, color || '#1d4ed8'); g.addColorStop(1, '#0f766e');
      c.fillStyle = g; c.fillRect(0, 0, cw, ch);
      c.fillStyle = 'rgba(255,255,255,.85)'; c.fillRect(6, 7, 30, 4); c.fillRect(6, 15, 40, 3); c.fillRect(6, 22, 24, 3);
    }), { emissive: 0xffffff, emissiveIntensity: 0.6, roughness: 0.2 });
    p.material.emissiveMap = p.material.map;
    return p;
  }
  function laptop(K) {
    var g = K.group(), alu = K.metal(0xc3c9cf, 0.35);
    K.put(K.box(1.0, 0.05, 0.7, 0xc3c9cf, alu), 0, 0.025, 0, g);
    K.put(K.box(0.84, 0.01, 0.34, 0x23282e), 0, 0.055, -0.08, g);
    var lid = K.group();
    K.put(K.rbox(1.0, 0.66, 0.03, 0.04, 0xc3c9cf, alu), 0, 0.33, 0, lid);
    K.put(glow(K, 0.92, 0.58), 0, 0.33, 0.017, lid);
    lid.rotation.x = -0.3;
    K.put(lid, 0, 0.05, -0.35, g);
    return g;
  }
  function desk(K, w) { return K.box(w || 1.5, 0.8, 0.95, 0x8a6a4a, { roughness: 0.75 }); }
  function server(K) {
    var g = K.group();
    K.put(K.box(0.9, 1.7, 0.9, 0x1a1e24, { metalness: 0.5, roughness: 0.45 }), 0, 0.85, 0, g);
    for (var u = 0; u < 7; u++) {
      K.put(K.box(0.78, 0.17, 0.02, 0x343b43, K.metal(0x343b43, 0.4)), 0, 0.22 + u * 0.21, 0.455, g);
      K.put(K.box(0.03, 0.03, 0.01, 0x22c55e, { emissive: 0x22c55e, emissiveIntensity: 1.6 }), -0.3, 0.22 + u * 0.21, 0.47, g);
    }
    return g;
  }
  function router(K) {
    var g = K.group();
    K.put(K.rbox(1.2, 0.8, 0.24, 0.1, 0x15181c, { metalness: 0.4, roughness: 0.45 }), 0, 0.12, 0, g).rotation.x = -Math.PI / 2;
    [-0.45, 0.45].forEach(function (x) { K.put(K.cyl(0.03, 0.04, 0.7, 0x15181c, 10), x, 0.55, -0.3, g); });
    for (var i = 0; i < 4; i++) K.put(K.box(0.05, 0.02, 0.02, 0x2dd4bf, { emissive: 0x2dd4bf, emissiveIntensity: 1.6 }), -0.3 + i * 0.2, 0.2, 0.4, g);
    return g;
  }
  function switchBox(K, color) {
    var g = K.group();
    K.put(K.box(1.7, 0.24, 0.7, color || 0x7b8794, K.metal(color || 0x7b8794, 0.4)), 0, 0.12, 0, g);
    for (var i = 0; i < 8; i++) {
      K.put(K.box(0.13, 0.11, 0.02, 0x0b0d10), -0.63 + i * 0.18, 0.11, 0.355, g);
      K.put(K.box(0.03, 0.02, 0.02, 0x22c55e, { emissive: 0x22c55e, emissiveIntensity: 1.5 }), -0.63 + i * 0.18, 0.2, 0.355, g);
    }
    return g;
  }
  function modem(K) {
    var g = K.group();
    K.put(K.rbox(0.36, 0.95, 0.7, 0.08, 0xe7e5e4, { roughness: 0.5 }), 0, 0.5, 0, g);
    for (var i = 0; i < 4; i++) K.put(K.box(0.02, 0.04, 0.04, i ? 0x22c55e : 0xf59e0b, { emissive: i ? 0x22c55e : 0xf59e0b, emissiveIntensity: 1.5 }), 0.19, 0.8 - i * 0.12, 0.2, g);
    return g;
  }
  function wap(K) {
    var g = K.group();
    K.put(K.cyl(0.04, 0.05, 2.2, 0x7b8794, 10, K.metal(0x7b8794, 0.4)), 0, 1.1, 0, g);
    K.put(K.cyl(0.4, 0.4, 0.12, 0xf1f1ef, 28, { roughness: 0.4 }), 0, 2.26, 0, g);
    var ring = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.02, 8, 32), K.mat(0x2dd4bf, { emissive: 0x2dd4bf, emissiveIntensity: 1.6 }));
    ring.rotation.x = Math.PI / 2;
    K.put(ring, 0, 2.2, 0, g);
    return g;
  }
  function printer(K) {
    var g = K.group();
    K.put(K.rbox(1.1, 0.5, 0.8, 0.08, 0xe7e5e4, { roughness: 0.5 }), 0, 0.25, 0, g);
    K.put(K.box(0.8, 0.02, 0.5, 0xffffff), 0, 0.52, -0.1, g);
    K.put(K.box(0.7, 0.04, 0.3, 0x23282e), 0, 0.2, 0.42, g);
    return g;
  }
  function cloud(K) {
    var g = K.group();
    [[0, 0, 0, 0.75], [-0.75, -0.12, 0, 0.55], [0.75, -0.12, 0, 0.58], [-0.3, 0.32, 0.1, 0.5], [0.38, 0.34, -0.1, 0.52]].forEach(function (s) {
      var m = K.sphere(s[3], 0xf1f5f9, 20, { roughness: 0.95 });
      m.castShadow = false;
      K.put(m, s[0], s[1], s[2], g);
    });
    return g;
  }
  function person(K, shirt) {
    var g = K.group(), skin = 0x9fb4c0;
    [-0.1, 0.1].forEach(function (x) { K.put(K.cyl(0.075, 0.065, 0.8, 0x334155, 12), x, 0.4, 0, g); });
    K.put(K.rbox(0.42, 0.6, 0.22, 0.08, shirt || 0x0f766e, { roughness: 0.7 }), 0, 1.1, 0, g);
    K.put(K.sphere(0.115, skin, 18), 0, 1.53, 0, g);
    return g;
  }
  function building(K, w, h, d, color) {
    var g = K.group();
    K.put(K.box(w, h, d, color || 0x334155, { roughness: 0.6 }), 0, h / 2, 0, g);
    var win = K.plate(w * 0.86, h * 0.86, K.tex(64, 96, function (c, cw, ch) {
      c.fillStyle = '#1e293b'; c.fillRect(0, 0, cw, ch);
      for (var y = 6; y < ch - 8; y += 14) for (var x = 6; x < cw - 8; x += 14) {
        c.fillStyle = (x * 7 + y * 3) % 5 ? '#fde68a' : '#334155'; c.fillRect(x, y, 8, 8);
      }
    }), { emissive: 0xffffff, emissiveIntensity: 0.45 });
    win.material.emissiveMap = win.material.map;
    K.put(win, 0, h / 2, d / 2 + 0.005, g);
    return g;
  }
  function cable(K, a, b, color, r) {
    return K.tube([[a.x, a.y, a.z], [(a.x + b.x) / 2, Math.min(a.y, b.y) * 0.4 + 0.03, (a.z + b.z) / 2], [b.x, b.y, b.z]], r || 0.035, color || 0x1f2937, { roughness: 0.7 });
  }
  function dashed(a, b, color) {
    var l = new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]),
      new THREE.LineDashedMaterial({ color: color || 0x7fd3c8, dashSize: 0.18, gapSize: 0.14 }));
    l.computeLineDistances();
    return l;
  }
  /* Grey a part out when it is switched off. */
  function dim(obj, off) {
    obj.traverse(function (m) {
      if (!m.isMesh) return;
      if (m.userData.c0 === undefined) { m.userData.c0 = m.material.color.getHex(); m.userData.e0 = m.material.emissiveIntensity; }
      m.material.color.setHex(off ? 0x3a4046 : m.userData.c0);
      if (m.material.emissive) m.material.emissiveIntensity = off ? 0 : m.userData.e0;
    });
  }
  /* Small cubes that keep flowing along a set of links. links: [{a, b, color, n, speed}] */
  function Flow(stage, K) {
    var parts = [];
    this.set = function (links) {
      parts.forEach(function (p) { stage.root.remove(p.m); p.m.geometry.dispose(); p.m.material.dispose(); });
      parts = [];
      links.forEach(function (l) {
        var n = l.n || 2;
        for (var i = 0; i < n; i++) {
          var m = K.box(0.15, 0.15, 0.15, l.color, { emissive: l.color, emissiveIntensity: 0.9 });
          m.castShadow = false;
          m.position.lerpVectors(l.a, l.b, i / n);
          stage.root.add(m);
          parts.push({ m: m, l: l, t: i / n });
        }
      });
      stage.animating = parts.length > 0;
      stage.invalidate();
    };
    this.update = function (dt) {
      parts.forEach(function (p) {
        p.t = (p.t + dt * (p.l.speed || 0.35)) % 1;
        p.m.position.lerpVectors(p.l.a, p.l.b, p.t);
      });
    };
  }
  function table(rows, head) {
    return '<table><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c, i) { return '<td>' + (i ? c : '<strong>' + c + '</strong>') + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }

  /* ================= 3.4A scene 1: networks by size ================= */

  var SIZES = [
    { id: 'pan', name: 'Personal area network (PAN)', reach: 'A few metres around one person.', example: 'A phone linked to a watch and earbuds by Bluetooth.', runs: 'The person who owns the devices.', note: 'Convenient and automatic, which also means devices may connect and share without you noticing.' },
    { id: 'lan', name: 'Local area network (LAN)', reach: 'One room, floor or building.', example: 'A school’s computers, printers and Wi-Fi.', runs: 'The organisation that owns the building.', note: 'Fast and under local control. Whoever runs it can see and filter what passes through.' },
    { id: 'man', name: 'Metropolitan area network (MAN)', reach: 'A town or city.', example: 'A city linking its libraries, schools and offices, or a university linking its campuses.', runs: 'A city, a university or a telecom company.', note: 'Shares expensive links between many sites. Coverage often follows where it is profitable to build.' },
    { id: 'wan', name: 'Wide area network (WAN)', reach: 'A country, a continent or the whole world.', example: 'A bank linking branches across a country. The internet is the largest WAN.', runs: 'Many organisations together. No single owner.', note: 'Connects almost anyone to anyone, using cables and equipment that cross many borders and laws.' }
  ];
  var SIZE_Q = [
    { text: 'A fitness watch sends your run to the phone in your pocket.', answer: 'pan', why: 'Two devices a metre apart, belonging to one person: a personal area network.' },
    { text: 'Every classroom in one school prints to the same printer in the library.', answer: 'lan', why: 'One building, one organisation: a local area network.' },
    { text: 'A hospital chain shares patient scans between sites in three different countries.', answer: 'wan', why: 'Spanning countries needs a wide area network.' },
    { text: 'A city gives all its buses and bus stops a live link to the transit office.', answer: 'man', why: 'Many sites across one city: a metropolitan area network.' }
  ];

  function buildSizes(stage, K) {
    var T = THREE, g = stage.root, V = T.Vector3;
    var ALL = { target: [0.6, 1.3, 0], radius: 20, theta: 0.0, phi: 1.22 };
    stage.setView({ target: ALL.target, radius: ALL.radius, theta: ALL.theta, phi: ALL.phi, minR: 3, maxR: 32, shadow: 13, exposure: 0.85 });
    g.add(K.floor(17, 0));
    var isl = {};
    function ringMark(x, r) {
      var m = new T.Mesh(new T.TorusGeometry(r, 0.035, 8, 64), K.mat(0x0f766e, { emissive: 0x2dd4bf, emissiveIntensity: 0.35 }));
      m.rotation.x = Math.PI / 2;
      K.put(m, x, 0.04, 0, g);
    }

    // PAN: one person and the devices they carry
    var pan = K.group();
    pan.add(person(K));
    var ph = K.rbox(0.2, 0.4, 0.03, 0.04, 0x15181c, { metalness: 0.6, roughness: 0.3 });
    K.put(ph, 0.75, 1.15, 0.3, pan);
    K.put(glow(K, 0.17, 0.36), 0.75, 1.15, 0.317, pan);
    var w = new T.Mesh(new T.TorusGeometry(0.12, 0.03, 8, 24), K.mat(0x334155)); w.castShadow = true;
    K.put(w, -0.75, 1.0, 0.3, pan);
    [-0.1, 0.1].forEach(function (x) { K.put(K.sphere(0.06, 0xf1f5f9, 12), x, 2.0, 0.3, pan); });
    [[0.75, 1.15], [-0.75, 1.0], [0, 2.0]].forEach(function (p, i, arr) {
      var q = arr[(i + 1) % 3];
      pan.add(dashed(new V(p[0], p[1], 0.3), new V(q[0], q[1], 0.3)));
    });
    K.put(pan, -8, 0, 0, g); ringMark(-8, 1.3);
    isl.pan = { obj: pan, x: -8, r: 5, y: 1.1 };

    // LAN: one building's devices around a switch
    var lan = K.group();
    K.put(K.box(3.6, 0.1, 2.8, 0xcbd5e1, { roughness: 0.8 }), 0, 0.05, 0, lan);
    var sw = switchBox(K); K.put(sw, 0, 0.1, 0, lan);
    [[-1.2, -0.9], [1.2, -0.9], [-1.2, 0.9]].forEach(function (p) {
      K.put(desk(K, 0.9), p[0], 0.5, p[1], lan).scale.set(1, 0.5, 0.7);
      var l = laptop(K); l.scale.setScalar(0.6); K.put(l, p[0], 0.7, p[1], lan);
      lan.add(cable(K, new V(p[0], 0.3, p[1]), new V(0, 0.2, 0), 0x2563eb, 0.025));
    });
    var pr = printer(K); pr.scale.setScalar(0.6); K.put(pr, 1.2, 0.1, 0.9, lan);
    lan.add(cable(K, new V(1.2, 0.25, 0.9), new V(0, 0.2, 0), 0x2563eb, 0.025));
    K.put(lan, -3.4, 0, 0, g); ringMark(-3.4, 2.4);
    isl.lan = { obj: lan, x: -3.4, r: 7, y: 0.8 };

    // MAN: buildings across a city joined by a fibre ring
    var man = K.group();
    K.put(K.box(4.6, 0.08, 3.6, 0x1f2937, { roughness: 0.9 }), 0, 0.04, 0, man);
    var spots = [[-1.6, -1.0, 1.6], [0, -1.2, 2.6], [1.6, -0.9, 1.9], [1.3, 1.0, 1.3], [-1.2, 1.0, 2.1]];
    spots.forEach(function (s, i) {
      K.put(building(K, 0.8, s[2], 0.8, [0x334155, 0x475569, 0x3f3f46][i % 3]), s[0], 0.08, s[1], man);
      var n = spots[(i + 1) % spots.length];
      var a = new V(s[0], 0.12, s[1] + 0.5), b = new V(n[0], 0.12, n[1] + 0.5);
      var seg = K.box(a.distanceTo(b), 0.04, 0.05, 0xf97316, { emissive: 0xf97316, emissiveIntensity: 1.3 });
      seg.position.copy(a).add(b).multiplyScalar(0.5);
      seg.rotation.y = -Math.atan2(b.z - a.z, b.x - a.x);
      seg.castShadow = false;
      man.add(seg);
    });
    K.put(man, 2.4, 0, 0, g); ringMark(2.4, 3.0);
    isl.man = { obj: man, x: 2.4, r: 8.5, y: 1.2 };

    // WAN: links around the world
    var wan = K.group(), R = 1.7;
    K.put(K.cyl(0.5, 0.8, 0.4, 0x2b323a, 28, { metalness: 0.5, roughness: 0.45 }), 0, 0.2, 0, wan);
    var globe = K.sphere(R, 0x1e3a8a, 40, { roughness: 0.7 });
    K.put(globe, 0, 2.3, 0, wan);
    var cities = [[0.4, 0.6], [1.5, 0.3], [2.6, 0.9], [0.9, -0.4], [2.1, -0.3], [-0.5, 0.2]].map(function (c) {
      return new V(Math.cos(c[1]) * Math.sin(c[0]), Math.sin(c[1]), Math.cos(c[1]) * Math.cos(c[0])).multiplyScalar(R);
    });
    cities.forEach(function (c, i) {
      var d = K.sphere(0.07, 0xfde68a, 10, { emissive: 0xfde68a, emissiveIntensity: 1.5 }); d.castShadow = false;
      K.put(d, c.x, c.y + 2.3, c.z, wan);
      var n = cities[(i + 2) % cities.length], mid = c.clone().add(n).normalize().multiplyScalar(R * 1.3);
      var arc = K.tube([[c.x, c.y + 2.3, c.z], [mid.x, mid.y + 2.3, mid.z], [n.x, n.y + 2.3, n.z]], 0.02, 0xf97316, { emissive: 0xf97316, emissiveIntensity: 1.2 });
      arc.castShadow = false;
      wan.add(arc);
    });
    K.put(wan, 8.6, 0, 0, g);
    isl.wan = { obj: wan, x: 8.6, r: 8.5, y: 2.0 };

    SIZES.forEach(function (s) {
      stage.pickable(isl[s.id].obj, s.id);
      stage.label(s.id.toUpperCase(), new V(isl[s.id].x, s.id === 'wan' ? 4.4 : s.id === 'man' ? 3.2 : 2.5, 0), { cls: 'big' });
    });

    var challenge = null;
    function select(id) {
      var s = SIZES.filter(function (x) { return x.id === id; })[0], it = isl[id];
      stage.highlight(null);
      picker.select(id, true);
      stage.flyTo({ target: [it.x, it.y, 0], radius: it.r, theta: 0.3, phi: 1.2 }, 900);
      if (challenge !== null) {
        var c = SIZE_Q[challenge];
        if (id === c.answer) { stage.info('<h3>Yes: ' + s.name + '</h3><p>' + c.why + '</p>'); challenge = null; }
        else stage.info('<h3>Challenge</h3><p>' + c.text + '</p><p><strong>Not a ' + id.toUpperCase() + '.</strong> Its reach is: ' + s.reach.toLowerCase() + ' Which fits better?</p>');
        return;
      }
      stage.info('<h3>' + s.name + '</h3><p><strong>Reach:</strong> ' + s.reach + ' <strong>Example:</strong> ' + s.example + '</p><p><strong>Who runs it:</strong> ' + s.runs + '</p><p class="note">' + s.note + '</p>');
    }
    var picker = stage.ui.choices('Network', SIZES.map(function (s) { return { id: s.id, label: s.id.toUpperCase() }; }), select);
    var row = stage.ui.row();
    stage.ui.button('See all four', function () { picker.select('', true); stage.flyTo(ALL, 900); }, row);
    var next = 0, ch = stage.ui.button('Start a challenge', function () {
      challenge = next; next = (next + 1) % SIZE_Q.length;
      picker.select('', true); stage.flyTo(ALL, 700); ch.textContent = 'Next challenge';
      stage.info('<h3>Challenge ' + (challenge + 1) + ' of ' + SIZE_Q.length + '</h3><p>' + SIZE_Q[challenge].text + '</p><p><strong>Select the type of network.</strong></p>');
    }, row);
    ch.classList.add('primary');
    stage.onPick = select;
    stage.info('<h3>Four sizes of network</h3><p>Networks are named by how far they reach: around a person, a building, a city, or the world. Select one to visit it.</p>' +
      '<p class="note">Simplified: the four are drawn side by side at different scales. In reality each sits inside the next, and your phone is on all four at once.</p>');
  }

  /* ================= 3.4A scene 2: client-server or peer-to-peer ================= */

  function buildShare(stage, K) {
    var T = THREE, g = stage.root, V = T.Vector3;
    stage.setView({ target: [0, 0.9, 0], radius: 13.5, theta: 0.3, phi: 1.0, minR: 5, maxR: 24, shadow: 8, exposure: 1.0 });
    g.add(K.floor(11, 0));
    var N = 6, RAD = 4, peers = [], pos = [];
    for (var i = 0; i < N; i++) {
      var a = i / N * Math.PI * 2 + Math.PI / 2, p = new V(Math.cos(a) * RAD, 0, Math.sin(a) * RAD);
      var grp = K.group();
      K.put(K.cyl(0.75, 0.85, 0.3, 0x2b323a, 28, { metalness: 0.5, roughness: 0.45 }), 0, 0.15, 0, grp);
      K.put(laptop(K), 0, 0.3, 0, grp);
      grp.position.copy(p);
      grp.rotation.y = Math.atan2(p.x, p.z) + Math.PI;
      g.add(grp);
      peers.push(grp); pos.push(new V(p.x, 0.9, p.z));
      stage.label(i === 0 ? 'You' : 'Laptop ' + (i + 1), grp, { dy: 1.25, cls: i === 0 ? 'big' : '' });
    }
    var srv = server(K); g.add(srv);
    var srvLabel = stage.label('Server: holds every file', srv, { dy: 2.0 });
    var C = new V(0, 1.0, 0);
    var csLines = K.group(), ppLines = K.group();
    pos.forEach(function (p, i) {
      csLines.add(K.line([new V(p.x, 0.06, p.z), new V(0, 0.06, 0)], 0x7fd3c8));
      [1, 2].forEach(function (d) { var q = pos[(i + d) % N]; ppLines.add(K.line([new V(p.x, 0.06, p.z), new V(q.x, 0.06, q.z)], 0xf97316)); });
    });
    g.add(csLines, ppLines);

    var st = { mode: 'cs', serverOff: false, peerOff: false, busy: false };
    function refresh() {
      csLines.visible = srv.visible = st.mode === 'cs';
      ppLines.visible = st.mode === 'p2p';
      srvLabel.show(st.mode === 'cs');
      srvLabel.set(st.serverOff ? 'Server: OFF' : 'Server: holds every file');
      dim(srv, st.serverOff);
      dim(peers[2], st.peerOff);
      offBtn.textContent = st.mode === 'cs' ? (st.serverOff ? 'Switch the server back on' : 'Switch the server off') : (st.peerOff ? 'Switch laptop 3 back on' : 'Switch laptop 3 off');
      stage.invalidate();
    }
    function explain() {
      stage.info(st.mode === 'cs'
        ? '<h3>Client–server</h3><p>Files live on one central server. Every laptop is a <strong>client</strong> that asks the server for what it needs.</p><p><strong>Predict:</strong> what happens to everyone if the server goes down? Switch it off and request a file.</p>'
        : '<h3>Peer-to-peer (P2P)</h3><p>There is no server. Every laptop is an equal <strong>peer</strong> that both stores files and shares them. Laptops 3 and 5 each hold a copy of the file you want.</p><p><strong>Predict:</strong> what happens if one peer goes down? Switch laptop 3 off and request the file.</p>');
    }
    stage.ui.choices('How data is shared', [{ id: 'cs', label: 'Client–server' }, { id: 'p2p', label: 'Peer-to-peer' }], function (id) {
      if (st.busy) return;
      st.mode = id; refresh(); explain();
    }, 'cs');
    var row = stage.ui.row('Try');
    var go = stage.ui.button('Request a file', function () {
      if (st.busy) return;
      st.busy = true;
      var done = function () { st.busy = false; };
      if (st.mode === 'cs') {
        if (st.serverOff) K.steps(stage, 'Client–server with the server off', [
          { from: pos[0], to: C, color: 0xf97316, msg: 'Your laptop asks the server for the file.' },
          { from: C, to: C, color: 0xdc2626, ms: 500, msg: 'No reply. The only copy is on the server, so every client has lost access at once. This is a single point of failure.' }
        ], done);
        else K.steps(stage, 'Client–server', [
          { from: pos[0], to: C, color: 0xf97316, msg: 'Your laptop (the client) asks the server for the file.' },
          { from: C, to: pos[0], color: 0x4ade80, msg: 'The server checks you are allowed, then sends it. One place to secure, back up and control.' }
        ], done);
      } else {
        var src = st.peerOff ? 4 : 2;
        K.steps(stage, st.peerOff ? 'Peer-to-peer with laptop 3 off' : 'Peer-to-peer', [
          { from: pos[0], to: pos[src], color: 0xf97316, msg: st.peerOff ? 'Laptop 3 is off, so your laptop asks laptop 5, which has another copy.' : 'Your laptop asks a peer that has the file: laptop 3.' },
          { from: pos[src], to: pos[0], color: 0x4ade80, msg: st.peerOff ? 'Laptop 5 sends it. The network carries on without the missing peer.' : 'Laptop 3 sends it directly. No server was involved.' },
          { from: pos[0], to: pos[0], color: 0x4ade80, ms: 300, msg: 'The cost: nobody is in charge of backups, security or who is allowed to have the file.' }
        ], done);
      }
    }, row);
    go.classList.add('primary');
    var offBtn = stage.ui.button('', function () {
      if (st.busy) return;
      if (st.mode === 'cs') st.serverOff = !st.serverOff; else st.peerOff = !st.peerOff;
      refresh();
    }, row);
    refresh(); explain();
  }

  /* ================= 3.4B: the parts of a school network ================= */

  var COMP = {
    laptop: ['Device with a network interface card (NIC)', 'Every device needs a network interface, wired or wireless, to turn its data into signals. Each interface has a <strong>MAC address</strong>: a 48-bit identifier, written in hexadecimal, given to it when it was made.'],
    pc: ['Wired desktop', 'Connected by an ethernet cable. Wired links are faster and steadier than wireless and harder to listen in on, but the device cannot move.'],
    wap: ['Wireless access point (WAP)', 'Creates the Wi-Fi signal. It talks to devices by radio and is itself plugged into the switch by cable. A large building needs many, placed for coverage.'],
    sw: ['Switch', 'Joins the devices on a local network. It learns which device is on which port and sends each packet only where it is addressed.'],
    hub: ['Hub', 'An older, simpler box that copies every packet to every port. Easy to set up, but it wastes capacity and lets every device see traffic meant for others.'],
    printer: ['Shared printer', 'A resource on the local network. Printing to it never needs to leave the building.'],
    router: ['Router', 'Connects one network to another. It reads the destination address on each packet and forwards it along the best available route. This is the edge of the school’s network.'],
    modem: ['Modem', 'Converts the network’s digital signals into the form the outside line carries (telephone line, cable or optical fibre) and back again.'],
    isp: ['Internet service provider (ISP)', 'The company that sells the connection to the wider internet. Everything the school sends or receives passes through it.']
  };

  function buildParts(stage, K) {
    var T = THREE, g = stage.root, V = T.Vector3;
    stage.setView({ target: [0.9, 1.3, 0], radius: 18, theta: 0.15, phi: 1.05, minR: 5, maxR: 28, shadow: 11, exposure: 1.0 });
    g.add(K.floor(14, 0));
    var o = {};
    K.put(desk(K), -6.5, 0.4, 1.8, g); o.laptop = K.put(laptop(K), -6.5, 0.8, 1.8, g);
    K.put(desk(K), -6.5, 0.4, -1.8, g);
    o.pc = K.group();
    K.put(K.rbox(0.9, 0.56, 0.04, 0.03, 0x0b0d10, { roughness: 0.3 }), 0, 0.42, 0, o.pc);
    K.put(glow(K, 0.84, 0.5), 0, 0.42, 0.022, o.pc);
    K.put(K.box(0.08, 0.2, 0.06, 0xb9c0c7, K.metal(0xb9c0c7, 0.3)), 0, 0.1, -0.03, o.pc);
    K.put(K.box(0.3, 0.5, 0.5, 0x2b323a, { metalness: 0.5, roughness: 0.45 }), 0.5, 0.25, -0.1, o.pc);
    K.put(o.pc, -6.7, 0.8, -1.8, g);
    o.wap = K.put(wap(K), -3.4, 0, 1.8, g);
    K.put(K.box(2.0, 0.9, 1.0, 0x2b323a, { metalness: 0.5, roughness: 0.45 }), -0.8, 0.45, 0, g);
    o.sw = K.put(switchBox(K), -0.8, 0.9, 0, g);
    o.hub = K.put(switchBox(K, 0xb45309), -0.8, 0.9, 0, g); o.hub.visible = false;
    K.put(K.box(1.3, 0.6, 1.0, 0x8a6a4a, { roughness: 0.75 }), -0.8, 0.3, -2.9, g);
    o.printer = K.put(printer(K), -0.8, 0.6, -2.9, g);
    K.put(K.box(1.5, 0.9, 1.0, 0x2b323a, { metalness: 0.5, roughness: 0.45 }), 2.4, 0.45, 0, g);
    o.router = K.put(router(K), 2.4, 0.9, 0, g);
    o.modem = K.put(modem(K), 4.6, 0, 0, g);
    o.isp = K.group();
    o.isp.add(building(K, 1.8, 3.0, 1.4, 0x334155));
    K.put(cloud(K), 0, 4.2, 0, o.isp);
    K.put(o.isp, 8, 0, 0, g);

    var P = { laptop: new V(-6.5, 1.3, 1.8), pc: new V(-6.5, 1.3, -1.8), wap: new V(-3.4, 2.3, 1.8), sw: new V(-0.8, 1.35, 0), printer: new V(-0.8, 1.3, -2.9), router: new V(2.4, 1.5, 0), modem: new V(4.6, 1.2, 0), isp: new V(8, 2.0, 0) };
    g.add(cable(K, new V(-6.2, 0.9, -1.8), new V(-1.4, 1.0, -0.2), 0x2563eb));
    g.add(cable(K, new V(-3.4, 0.1, 1.8), new V(-1.2, 1.0, 0.3), 0x2563eb));
    g.add(cable(K, new V(-0.8, 0.7, -2.5), new V(-0.8, 1.0, -0.3), 0x2563eb));
    g.add(cable(K, new V(0, 1.0, 0), new V(1.8, 1.0, 0), 0x2563eb));
    g.add(cable(K, new V(3, 1.0, 0), new V(4.45, 0.4, 0), 0x2563eb));
    g.add(cable(K, new V(4.8, 0.3, 0), new V(7.1, 0.3, 0), 0xf97316, 0.05));
    g.add(dashed(P.laptop, P.wap));

    var names = { laptop: 'Laptop (Wi-Fi)', pc: 'Desktop (wired)', wap: 'Access point', sw: 'Switch', printer: 'Printer', router: 'Router', modem: 'Modem', isp: 'ISP and the internet' };
    var dys = { laptop: 1.0, pc: 1.0, wap: 2.6, sw: 0.5, printer: 0.8, router: 1.0, modem: 1.2, isp: 3.3 }, labels = {};
    Object.keys(names).forEach(function (k) { stage.pickable(o[k], k); labels[k] = stage.label(names[k], o[k], { dy: dys[k] }); });
    stage.pickable(o.hub, 'hub');

    var st = { hub: false, busy: false };
    function select(id) {
      if (id === 'sw' && st.hub) id = 'hub';
      stage.highlight(o[id]);
      picker.select(id === 'hub' ? 'sw' : id, true);
      stage.info('<h3>' + COMP[id][0] + '</h3><p>' + COMP[id][1] + '</p>');
    }
    var picker = stage.ui.choices('Parts', Object.keys(names).map(function (k) { return { id: k, label: names[k].replace(/ \(.*| and the internet/, '') }; }), select);
    var row = stage.ui.row('Try');
    function run(title, steps) {
      if (st.busy) return;
      st.busy = true; stage.highlight(null);
      K.steps(stage, title, steps, function () { st.busy = false; });
    }
    stage.ui.button('Print from the laptop', function () {
      var mid = st.hub ? 'hub' : 'switch';
      var steps = [
        { from: P.laptop, to: P.wap, color: 0xf97316, msg: 'The laptop’s wireless interface sends the print job by radio to the access point.' },
        { from: P.wap, to: P.sw, color: 0xf97316, msg: 'The access point passes it down its cable to the ' + mid + '.' }
      ];
      if (st.hub) {
        steps.push({ from: P.sw, to: P.printer, color: 0xdc2626, msg: 'The hub copies it to <em>every</em> port: the printer, the desktop and the router all receive it. Only the printer wants it.', after: function () {
          [P.pc, P.router].forEach(function (t) {
            var c = K.box(0.28, 0.28, 0.28, 0xdc2626, { emissive: 0xdc2626, emissiveIntensity: 0.6 });
            g.add(c);
            stage.tween(700, function (k) { c.position.lerpVectors(P.sw, t, k); }, function () { g.remove(c); });
          });
        } });
        steps.push({ from: P.printer, to: P.printer, color: 0xdc2626, ms: 800, msg: 'Wasted capacity, and every device saw data that was not meant for it.' });
      } else {
        steps.push({ from: P.sw, to: P.printer, color: 0x4ade80, msg: 'The switch knows which port the printer is on and sends the job only there. It never left the building.' });
      }
      run('Printing on the local network', steps);
    }, row);
    stage.ui.button('Open a website', function () {
      run('Reaching the internet', [
        { from: P.laptop, to: P.wap, color: 0xf97316, msg: 'The laptop sends the request by radio to the access point.' },
        { from: P.wap, to: P.sw, color: 0xf97316, msg: 'It travels by cable to the ' + (st.hub ? 'hub' : 'switch') + '.' },
        { from: P.sw, to: P.router, color: 0xfacc15, msg: 'The address is outside the school, so it goes to the router, the way out of the local network.' },
        { from: P.router, to: P.modem, color: 0xfacc15, msg: 'The router forwards it to the modem, which converts it for the outside line.' },
        { from: P.modem, to: P.isp, color: 0x4ade80, msg: 'It reaches the internet service provider, which carries it on towards the website.' }
      ]);
    }, row);
    var hubBtn = stage.ui.button('Swap the switch for a hub', function () {
      if (st.busy) return;
      st.hub = !st.hub;
      o.hub.visible = st.hub; o.sw.visible = !st.hub;
      labels.sw.set(st.hub ? 'Hub' : 'Switch');
      hubBtn.textContent = st.hub ? 'Put the switch back' : 'Swap the switch for a hub';
      stage.info('<h3>' + COMP[st.hub ? 'hub' : 'sw'][0] + '</h3><p>' + COMP[st.hub ? 'hub' : 'sw'][1] + '</p><p><strong>Predict, then print from the laptop:</strong> which devices will receive the print job now?</p>');
    }, row);
    stage.onPick = select;
    stage.info('<h3>A small school network</h3><p>Select a part to see what it does, then send a print job and a web request and compare how far each travels.</p>' +
      '<p class="note">Simplified: a real school has dozens of access points and switches, a firewall and servers. In a home, the router, switch, access point and modem are often one box.</p>');
  }

  /* ================= 3.4C scene 1: packets across the internet ================= */

  function buildPackets(stage, K) {
    var T = THREE, g = stage.root, V = T.Vector3;
    stage.setView({ target: [0, 0.8, 0], radius: 16.5, theta: 0.0, phi: 0.95, minR: 5, maxR: 28, shadow: 10, exposure: 1.0 });
    g.add(K.floor(13, 0));
    var nodes = { S: new V(-7.5, 0, 0), D: new V(7.5, 0, 0) };
    var rp = [[-3.6, -2.4], [0, -3], [3.6, -2.4], [-3.6, 2.4], [0, 3], [3.6, 2.4]], routers = [], alive = [];
    var links = [['S', 0], ['S', 3], [0, 1], [1, 2], [3, 4], [4, 5], [0, 3], [1, 4], [2, 5], [0, 4], [1, 5], [2, 'D'], [5, 'D']];
    K.put(desk(K), -7.5, 0.4, 0, g); K.put(laptop(K), -7.5, 0.8, 0, g);
    K.put(server(K), 7.5, 0, 0, g);
    stage.label('Sender', new V(-7.5, 1.9, 0));
    stage.label('Web server', new V(7.5, 2.1, 0));
    rp.forEach(function (p, i) {
      nodes[i] = new V(p[0], 0, p[1]);
      var grp = K.group();
      K.put(K.cyl(0.8, 0.9, 0.25, 0x2b323a, 28, { metalness: 0.5, roughness: 0.45 }), 0, 0.125, 0, grp);
      K.put(router(K), 0, 0.25, 0, grp);
      grp.position.copy(nodes[i]);
      g.add(grp);
      stage.pickable(grp, i);
      routers.push(grp); alive.push(true);
      stage.label('Router ' + (i + 1), grp, { dy: 1.25, cls: 'quiet' });
    });
    var lineObjs = links.map(function (l) {
      var a = nodes[l[0]], b = nodes[l[1]];
      var ln = K.line([new V(a.x, 0.05, a.z), new V(b.x, 0.05, b.z)], 0x7fd3c8);
      g.add(ln);
      return ln;
    });
    function ok(n) { return n === 'S' || n === 'D' || alive[n]; }
    function path(seed) {
      // breadth-first search; neighbours are tried in a different order for each packet
      var prev = {}, queue = ['S'], seen = { S: true };
      while (queue.length) {
        var cur = queue.shift();
        if (cur === 'D') break;
        var nb = [];
        links.forEach(function (l) { if (String(l[0]) === String(cur)) nb.push(l[1]); else if (String(l[1]) === String(cur)) nb.push(l[0]); });
        nb = nb.filter(ok).sort(function (x, y) { return ((String(x).charCodeAt(0) * 7 + seed * 13) % 5) - ((String(y).charCodeAt(0) * 7 + seed * 13) % 5); });
        nb.forEach(function (n) { if (!seen[n]) { seen[n] = true; prev[n] = cur; queue.push(n); } });
      }
      if (!seen.D) return null;
      var out = ['D'];
      while (out[0] !== 'S') out.unshift(prev[out[0]]);
      return out;
    }
    var packets = [], tags = [];
    for (var i = 0; i < 4; i++) {
      var m = K.rbox(0.42, 0.42, 0.42, 0.08, [0xf97316, 0xfacc15, 0x4ade80, 0x60a5fa][i], { emissive: [0xf97316, 0xfacc15, 0x4ade80, 0x60a5fa][i], emissiveIntensity: 0.5 });
      m.visible = false; g.add(m); packets.push(m);
      tags.push(stage.label(String(i + 1), m, { dy: 0.5, cls: 'big' }));
    }
    var busy = false, btns = [];
    function refresh() {
      routers.forEach(function (r, i) { dim(r, !alive[i]); btns[i].setAttribute('aria-pressed', alive[i] ? 'true' : 'false'); btns[i].textContent = 'Router ' + (i + 1) + (alive[i] ? ': on' : ': off'); });
      links.forEach(function (l, i) { lineObjs[i].visible = ok(l[0]) && ok(l[1]); });
      stage.invalidate();
    }
    function toggle(i) { if (busy) return; alive[i] = !alive[i]; refresh(); stage.info('<h3>Router ' + (i + 1) + ' is ' + (alive[i] ? 'back on' : 'off') + '</h3><p><strong>Predict:</strong> will the message still arrive? Send it and watch which routes the packets take.</p>'); }
    var row = stage.ui.row('Routers');
    for (var b = 0; b < 6; b++) (function (i) { var bt = stage.ui.button('', function () { toggle(i); }, row); bt.classList.add('chip'); btns.push(bt); })(b);
    var send = stage.ui.button('Send a message', function () {
      if (busy) return;
      var routes = [0, 1, 2, 3].map(function (i) { return path(i + 1); });
      if (!routes[0]) { stage.info('<h3>No route</h3><p>Every path from sender to server passes through a router that is off. The message cannot be delivered until one comes back.</p>'); return; }
      busy = true;
      var order = [], used = {};
      stage.info('<h3>Sending</h3><ol style="margin:0;padding-left:20px"><li>The message is split into four numbered <strong>packets</strong>.</li><li>Each packet is labelled with the sender’s and receiver’s <strong>IP addresses</strong>.</li><li>Routers pass each one along whatever route is open. They need not all go the same way.</li></ol>');
      routes.forEach(function (r, i) {
        used[r.join('>')] = true;
        var hops = r.map(function (n) { return new V(nodes[n].x, 1.5, nodes[n].z); }), leg = 0;
        packets[i].visible = true; packets[i].position.copy(hops[0]);
        var delay = i * 450 + (i % 2) * 350 * (r.length - 3);
        stage.tween(delay + 1, function () {}, function hop() {
          if (leg >= hops.length - 1) {
            order.push(i + 1); packets[i].visible = false;
            if (order.length === 4) {
              busy = false;
              stage.info('<h3>Delivered</h3><p>Packets arrived in the order <strong>' + order.join(', ') + '</strong>, by ' + Object.keys(used).length + ' different route' + (Object.keys(used).length > 1 ? 's' : '') +
                '. The receiver uses the numbers to put them back as 1, 2, 3, 4 and asks again for any that are missing. That is the job of <strong>TCP</strong>; getting each packet to the right address is the job of <strong>IP</strong>.</p>' +
                '<p class="note">No router knew the whole message, and none was essential. Switch one off and send again.</p>');
            }
            return;
          }
          var a = hops[leg], c = hops[leg + 1]; leg++;
          stage.tween(520, function (k) { packets[i].position.lerpVectors(a, c, k); }, hop);
        });
      });
    });
    send.classList.add('primary');
    stage.onPick = toggle;
    refresh();
    stage.info('<h3>How a message crosses the internet</h3><p>The internet is a mesh of routers with many possible paths. Send a message, then switch routers off and try again.</p>' +
      '<p class="note">Simplified: six routers stand in for many thousands, and real packets are far smaller than a whole message quarter.</p>');
  }

  /* ================= 3.4C scene 2: bandwidth ================= */

  function buildBandwidth(stage, K) {
    var T = THREE, g = stage.root, V = T.Vector3;
    stage.setView({ target: [0, 1.6, 0], radius: 15, theta: 0.2, phi: 1.2, minR: 5, maxR: 26, shadow: 9, exposure: 1.0 });
    g.add(K.floor(12, 0));
    K.put(server(K), -6.5, 0, 0, g);
    stage.label('Streaming service', new V(-6.5, 2.1, 0));
    var house = K.group();
    K.put(K.box(2.4, 1.8, 2.0, 0xe7e5e4, { roughness: 0.8 }), 0, 0.9, 0, house);
    var roof = K.cyl(0, 1.9, 1.0, 0x7c2d12, 4, { roughness: 0.8 }); roof.rotation.y = Math.PI / 4;
    K.put(roof, 0, 2.3, 0, house);
    K.put(glow(K, 0.9, 0.55, '#7c3aed'), -0.3, 1.0, 1.005, house);
    K.put(house, 6.5, 0, 0, g);
    var homeLabel = stage.label('', new V(6.5, 3.1, 0), { cls: 'big' });
    var pipe = K.cyl(1, 1, 9, 0x7dd3fc, 28, { transparent: true, opacity: 0.22, roughness: 0.1, depthWrite: false });
    pipe.castShadow = false; pipe.rotation.z = Math.PI / 2;
    K.put(pipe, 0, 1.6, 0, g);
    var flow = new Flow(stage, K), waiting = K.group();
    g.add(waiting);
    stage.onFrame = function (dt) { flow.update(dt); };

    var st = { bw: 25, n: 2, q: 5, squeeze: false };
    function refresh() {
      var rate = st.q * (st.squeeze ? 0.5 : 1), demand = st.n * rate, sent = Math.min(demand, st.bw), over = Math.max(0, demand - st.bw);
      var r = 0.25 + 0.85 * st.bw / 100;
      pipe.scale.set(r, 1, r);
      var lanes = Math.max(1, Math.round(sent / 5)), links = [];
      for (var i = 0; i < lanes; i++) {
        var a = (i / lanes) * Math.PI * 2, rr = lanes > 1 ? r * 0.55 : 0;
        links.push({ a: new V(-4.5, 1.6 + Math.sin(a) * rr, Math.cos(a) * rr), b: new V(4.5, 1.6 + Math.sin(a) * rr, Math.cos(a) * rr), color: 0x4ade80, n: 5, speed: 0.3 });
      }
      flow.set(links);
      while (waiting.children.length) { var c = waiting.children[0]; waiting.remove(c); c.geometry.dispose(); c.material.dispose(); }
      for (var w = 0; w < Math.min(24, Math.round(over / 2.5)); w++) K.put(K.box(0.28, 0.28, 0.28, 0xdc2626, { emissive: 0xdc2626, emissiveIntensity: 0.5 }), -5.2 - (w % 3) * 0.32, 0.2 + Math.floor(w / 6) * 0.32, -0.3 + (w % 2) * 0.6 + (Math.floor(w / 3) % 2) * 0.1, waiting);
      homeLabel.set(over > 0 ? 'Buffering…' : 'Playing smoothly');
      stage.info('<h3>' + (over > 0 ? 'Not enough bandwidth: buffering' : 'Enough bandwidth: smooth playback') + '</h3>' +
        '<p>' + st.n + ' device' + (st.n > 1 ? 's' : '') + ' × ' + rate + ' Mbps each = <strong>' + demand + ' Mbps needed</strong>. The connection can carry <strong>' + st.bw + ' Mbps</strong>.' +
        (over > 0 ? ' The extra ' + over + ' Mbps has to wait (red), so the video stalls.' : ' ' + (st.bw - demand) + ' Mbps to spare.') + '</p>' +
        (st.squeeze ? '<p>Stronger <strong>lossy compression</strong> is on: detail is thrown away for good, so each stream needs half the data but looks worse.</p>' : '') +
        '<p class="note">Classroom model: the figures are round numbers for teaching, not measurements of a real service. Bandwidth is the most data a connection can carry each second; it is not the same as how quickly one packet makes the trip.</p>');
    }
    stage.ui.slider('Bandwidth', { min: 5, max: 100, step: 5, value: 25, format: function (v) { return v + ' Mbps'; } }, function (v) { st.bw = v; refresh(); });
    stage.ui.slider('Devices streaming', { min: 1, max: 8, value: 2 }, function (v) { st.n = v; refresh(); });
    stage.ui.choices('Picture quality', [{ id: 5, label: 'HD (5 Mbps)' }, { id: 20, label: '4K (20 Mbps)' }], function (id) { st.q = +id; refresh(); }, 5);
    var sq = stage.ui.button('Turn on stronger compression', function () {
      st.squeeze = !st.squeeze; sq.textContent = st.squeeze ? 'Turn off stronger compression' : 'Turn on stronger compression'; refresh();
    });
    refresh();
  }

  /* ================= 3.4D/E: what happens when you use a service ================= */

  function buildServices(stage, K) {
    var T = THREE, g = stage.root, V = T.Vector3;
    stage.setView({ target: [0.3, 1.3, 0], radius: 16, theta: 0.1, phi: 1.05, minR: 5, maxR: 28, shadow: 10, exposure: 1.0 });
    g.add(K.floor(13, 0));
    K.put(desk(K), -6.5, 0.4, 1, g); K.put(laptop(K), -6.5, 0.8, 1, g);
    K.put(person(K), -7.6, 0, 1.6, g);
    var bar = K.text([''], { w: 3.6, h: 1.1, size: 30, bg: '#f8fafc', fg: '#0f172a', mono: true, title: 'YOUR SCREEN' });
    var frame = K.rbox(3.8, 1.3, 0.1, 0.08, 0x15181c);
    K.put(frame, -6.5, 3.0, 0.6, g); K.put(bar, -6.5, 3.0, 0.66, g);
    var isp = K.put(building(K, 1.4, 2.2, 1.2, 0x334155), -2.2, 0, 0, g);
    var dns = K.put(server(K), 1.4, 0, -3.4, g), web = K.put(server(K), 6.2, 0, -1, g), mail = K.put(server(K), 6.2, 0, 2.2, g);
    var friend = K.group(); friend.add(person(K, 0xc2410c));
    K.put(K.rbox(0.2, 0.4, 0.03, 0.04, 0x15181c), 0.4, 1.2, 0.2, friend);
    K.put(friend, 1.6, 0, 3.8, g);
    stage.label('You', new V(-6.5, 1.9, 1));
    stage.label('Your ISP', isp, { dy: 2.5 });
    stage.label('DNS server', dns, { dy: 2.0 });
    stage.label('Web and service server', web, { dy: 2.0 });
    stage.label('Mail server', mail, { dy: 2.0 });
    stage.label('A friend', friend, { dy: 1.9 });
    var P = { me: new V(-6.5, 1.4, 1), isp: new V(-2.2, 2.4, 0), dns: new V(1.4, 1.9, -3.4), web: new V(6.2, 1.9, -1), mail: new V(6.2, 1.9, 2.2), friend: new V(1.6, 1.8, 3.8) };
    [[P.me, P.isp], [P.isp, P.dns], [P.isp, P.web], [P.isp, P.mail], [P.isp, P.friend]].forEach(function (l) {
      g.add(K.line([new V(l[0].x, 0.05, l[0].z), new V(l[1].x, 0.05, l[1].z)], 0x7fd3c8));
    });
    var busy = false;
    function run(title, first, steps, last) {
      if (busy) return;
      busy = true; bar.setText(first);
      K.steps(stage, title, steps, function () { busy = false; bar.setText(last); stage.invalidate(); });
    }
    var row = stage.ui.row('Use a service');
    stage.ui.button('Open a web page', function () {
      run('Opening https://www.example.org/news', ['https://www.example.org/news', 'loading…'], [
        { from: P.me, to: P.isp, color: 0xf97316, msg: 'Your browser needs the server’s IP address. The question goes out through your ISP.' },
        { from: P.isp, to: P.dns, color: 0xf97316, msg: 'A <strong>DNS server</strong> looks up the domain name www.example.org, like a phone book.' },
        { from: P.dns, to: P.me, color: 0xfacc15, msg: 'It answers with an IP address (here an example one: 203.0.113.10).' },
        { from: P.me, to: P.web, color: 0x60a5fa, msg: 'The browser sends an <strong>HTTP</strong> request to that address: “GET /news”. With HTTPS, it is encrypted.' },
        { from: P.web, to: P.me, color: 0x4ade80, msg: 'The web server replies with the page as <strong>HTML</strong>, which the browser turns into what you see.' }
      ], ['https://www.example.org/news', 'NEWS  (page loaded)']);
    }, row).classList.add('primary');
    stage.ui.button('Send an email', function () {
      run('Sending an email', ['To: friend@example.org', 'sending…'], [
        { from: P.me, to: P.mail, color: 0xf97316, msg: 'Your email app hands the message to your provider’s <strong>mail server</strong>.' },
        { from: P.mail, to: P.dns, color: 0xfacc15, msg: 'The mail server uses DNS to find which server handles mail for example.org.' },
        { from: P.dns, to: P.mail, color: 0xfacc15, msg: 'The message is passed on and stored on the recipient’s mail server.' },
        { from: P.mail, to: P.friend, color: 0x4ade80, msg: 'It waits there until your friend’s device collects it. Email is store-and-forward, not live.' }
      ], ['To: friend@example.org', 'Sent']);
    }, row);
    stage.ui.button('Make a video call', function () {
      run('A video call (VoIP)', ['Calling friend…', ''], [
        { from: P.me, to: P.web, color: 0xf97316, msg: 'Your app contacts the calling service’s server to find your friend and set up the call.' },
        { from: P.web, to: P.friend, color: 0xfacc15, msg: 'The service rings your friend’s device.' },
        { from: P.me, to: P.friend, color: 0x4ade80, msg: 'Sound and picture are chopped into packets and sent across the internet, both ways, many times a second. This is <strong>VoIP</strong>: voice over internet protocol.' },
        { from: P.friend, to: P.me, color: 0x4ade80, msg: 'Late packets are simply dropped, which is why a weak connection makes a call stutter.' }
      ], ['In call with friend', '00:07']);
    }, row);
    bar.setText(['https://', '']);
    stage.info('<h3>One connection, many services</h3><p>Your ISP gives you a path to the internet. Everything else is a service running on top of it. Choose one and follow the steps.</p>' +
      '<p class="note">Simplified: each arrow stands for many packets crossing many routers, and example.org and the IP address are reserved example values, not a real news site.</p>');
  }

  /* ================= 3.4F: how the web changed ================= */

  var ERAS = [
    { id: 'w1', label: 'Early web', name: 'The early internet and Web 1.0', when: '1969 to about 2000',
      what: 'The internet began in 1969 as a research network linking a few universities. In 1989 Tim Berners-Lee proposed the World Wide Web: pages joined by links, running on top of the internet.',
      flow: 'Information flowed one way. A few people with technical skills published pages; everyone else read them. No single company could see what everyone was reading.',
      people: 'You were a reader. Being online needed a desk, a computer and a phone line.' },
    { id: 'w2', label: 'Social web', name: 'Web 2.0: the read-write web', when: 'about 2000 to 2020',
      what: 'Platforms made publishing easy: social media, video sharing, wikis, reviews, online shops. Phones put the web in every pocket.',
      flow: 'Information flows both ways. Users create most of the content, and the platform in the middle sees all of it.',
      people: 'You became a creator and also the product: platforms earn money from attention and from data about you.' },
    { id: 'w3', label: 'Semantic web', name: 'Web 3.0: the semantic web', when: 'about 2020 onwards (still emerging)',
      what: 'The idea that data is labelled with its meaning so that software can connect it across sites and act on it for you. Artificial intelligence is doing much of this work.',
      flow: 'Machines talk to machines. Services link data from many sources and answer you directly.',
      people: 'Convenient, but you see less of where an answer came from. Note: “Web3” is also used for a different idea based on blockchains.' },
    { id: 'iot', label: 'Internet of things', name: 'The internet of things (IoT)', when: 'growing fast now',
      what: 'Everyday objects with sensors and a network connection: thermostats, doorbells, speakers, fridges, cars, factory machines.',
      flow: 'Things send data all day without anyone pressing a button, usually to the company that made them.',
      people: 'Homes and cities become more responsive and more watched. Cheap devices are often poorly secured and rarely updated.' }
  ];

  function buildEras(stage, K) {
    var T = THREE, g = stage.root, V = T.Vector3;
    stage.setView({ target: [0, 1.4, 0.4], radius: 15.5, theta: 0.0, phi: 1.02, minR: 5, maxR: 26, shadow: 10, exposure: 1.0 });
    g.add(K.floor(13, 0));
    var hub = K.put(server(K), 0, 0, -1.2, g), H = new V(0, 1.9, -1.2);
    var hubLabel = stage.label('', hub, { dy: 2.0, cls: 'big' });
    var users = K.group(), U = [];
    for (var i = 0; i < 5; i++) {
      var a = Math.PI * (0.12 + 0.76 * i / 4), p = new V(-Math.cos(a) * 6, 0, Math.sin(a) * 4.2 - 0.2);
      var u = K.group();
      K.put(K.cyl(0.6, 0.7, 0.25, 0x2b323a, 24, { metalness: 0.5, roughness: 0.45 }), 0, 0.125, 0, u);
      K.put(laptop(K), 0, 0.25, 0, u).scale.setScalar(0.8);
      K.put(person(K, [0x0f766e, 0xc2410c, 0x7c3aed, 0x1d4ed8, 0xb45309][i]), 0.75, 0, 0.2, u).scale.setScalar(0.85);
      u.position.copy(p); u.rotation.y = Math.atan2(-p.x, -1.2 - p.z);
      users.add(u); U.push(new V(p.x, 1.0, p.z));
    }
    g.add(users);
    var extra = K.group(), E = [new V(-4.6, 1.9, -4), new V(4.6, 1.9, -4)];
    E.forEach(function (e) { K.put(server(K), e.x, 0, e.z, extra); });
    g.add(extra);
    var things = K.group(), TH = [];
    var makers = [
      function () { var t = K.group(); K.put(K.cyl(0.4, 0.4, 0.12, 0xf1f1ef, 28), 0, 1.2, 0, t).rotation.x = Math.PI / 2; K.put(K.box(0.3, 0.16, 0.02, 0xf97316, { emissive: 0xf97316, emissiveIntensity: 1.2 }), 0, 1.2, 0.07, t); K.put(K.box(0.1, 1.0, 0.1, 0x7b8794), 0, 0.5, -0.1, t); return t; },
      function () { var t = K.group(); K.put(K.rbox(0.9, 1.9, 0.8, 0.08, 0xcfd4d9, K.metal(0xcfd4d9, 0.4)), 0, 0.95, 0, t); K.put(K.box(0.3, 0.2, 0.02, 0x38bdf8, { emissive: 0x38bdf8, emissiveIntensity: 1.3 }), 0, 1.4, 0.41, t); return t; },
      function () { var t = K.group(); K.put(K.cyl(0.32, 0.36, 0.7, 0x23282e, 28), 0, 0.35, 0, t); var r = new T.Mesh(new T.TorusGeometry(0.3, 0.025, 8, 32), K.mat(0x2dd4bf, { emissive: 0x2dd4bf, emissiveIntensity: 1.6 })); r.rotation.x = Math.PI / 2; K.put(r, 0, 0.7, 0, t); return t; },
      function () { var t = K.group(); K.put(K.box(0.08, 1.4, 0.08, 0x7b8794), 0, 0.7, 0, t); K.put(K.rbox(0.5, 0.3, 0.3, 0.06, 0xf1f1ef), 0, 1.5, 0.1, t); K.put(K.cyl(0.09, 0.09, 0.06, 0x0b0d10, 16), 0, 1.5, 0.26, t).rotation.x = Math.PI / 2; return t; }
    ];
    ['Thermostat', 'Fridge', 'Speaker', 'Doorbell camera'].forEach(function (n, i) {
      var t = makers[i](), x = -4.8 + i * 3.2;
      K.put(t, x, 0, 2.6, things);
      TH.push(new V(x, 1.3, 2.6));
      stage.label(n, t, { dy: i === 1 ? 2.1 : 1.9, cls: 'quiet' });
    });
    var co = K.put(building(K, 1.6, 2.6, 1.2, 0x475569), 5.4, 0, -1.2, things), CO = new V(5.4, 2.8, -1.2);
    stage.label('Device maker', co, { dy: 2.9 });
    g.add(things);
    var flow = new Flow(stage, K);
    stage.onFrame = function (dt) { flow.update(dt); };

    function show(id) {
      var e = ERAS.filter(function (x) { return x.id === id; })[0], links = [];
      users.visible = id !== 'iot'; things.visible = id === 'iot'; extra.visible = id === 'w3';
      hubLabel.set({ w1: 'Web sites', w2: 'Platform', w3: 'Linked services', iot: 'Cloud service' }[id]);
      if (id === 'w1') U.forEach(function (u) { links.push({ a: H, b: u, color: 0x60a5fa, n: 2 }); });
      if (id === 'w2' || id === 'w3') U.forEach(function (u) { links.push({ a: H, b: u, color: 0x60a5fa, n: 2 }); links.push({ a: new V(u.x, 1.4, u.z), b: new V(0, 2.3, -1.2), color: 0xf97316, n: 2 }); });
      if (id === 'w3') E.forEach(function (x) { links.push({ a: x, b: H, color: 0x2dd4bf, n: 3, speed: 0.6 }); links.push({ a: new V(0, 2.3, -1.2), b: new V(x.x, 2.3, x.z), color: 0x2dd4bf, n: 3, speed: 0.6 }); });
      if (id === 'iot') { TH.forEach(function (t) { links.push({ a: t, b: H, color: 0x4ade80, n: 4, speed: 0.5 }); }); links.push({ a: H, b: CO, color: 0xf97316, n: 5, speed: 0.5 }); }
      flow.set(links);
      stage.info('<h3>' + e.name + '</h3><p class="note">' + e.when.charAt(0).toUpperCase() + e.when.slice(1) + '. The dates are rough labels, not sharp boundaries.</p><p>' + e.what + '</p><p><strong>Which way does information flow?</strong> ' + e.flow + '</p><p><strong>For people:</strong> ' + e.people + '</p>');
    }
    stage.ui.choices('Era', ERAS.map(function (e) { return { id: e.id, label: e.label }; }), show, 'w1');
    show('w1');
  }

  /* ================= 3.4G: attack and defend ================= */

  var DEF = {
    training: ['Staff training', 'People learn to spot fake messages and check before they click.'],
    mfa: ['Multi-factor authentication', 'Logging in needs a second proof, such as a code on your phone, as well as a password.'],
    updates: ['Updates and antivirus', 'Security fixes are installed promptly and known malware is detected and removed.'],
    firewall: ['Firewall', 'Inspects traffic entering and leaving the network and blocks what the rules do not allow.'],
    backups: ['Backups', 'Copies of the data are kept somewhere separate so it can be restored.'],
    proxy: ['Web filter (proxy server)', 'Stands between users and the internet and blocks known harmful sites.']
  };
  var THREATS = [
    { id: 'phish', name: 'Phishing', what: 'A message pretending to be from someone you trust, sent to trick you into giving away a password.', target: 'staff',
      stop: ['training'], limit: ['mfa', 'proxy'],
      won: 'The staff member types their password into a fake page. The attacker logs in as them and reads everything they can.',
      limited: { mfa: 'The password was stolen, but the attacker cannot pass the second login step.', proxy: 'The fake page was on the filter’s block list this time. New fake pages appear every day.' },
      stopped: 'The staff member notices the odd address, does not click, and reports it.' },
    { id: 'virus', name: 'Virus', what: 'Malicious code attached to a file or program that spreads when it is opened.', target: 'staff',
      stop: ['updates'], limit: ['training', 'backups'],
      won: 'The attachment is opened. The virus copies itself to shared folders and other computers.',
      limited: { training: 'Most staff do not open the unexpected attachment, so it spreads to far fewer machines.', backups: 'Files are damaged, but clean copies can be restored.' },
      stopped: 'The antivirus recognises the file and removes it before it runs.' },
    { id: 'ransom', name: 'Ransomware', what: 'Malware that encrypts an organisation’s files and demands payment to unlock them.', target: 'server',
      stop: ['updates'], limit: ['backups'],
      won: 'Every file is locked. The organisation must pay with no guarantee, or lose its data.',
      limited: { backups: 'Files are locked, but the organisation restores from backup and pays nothing. It still loses days of work.' },
      stopped: 'The weakness it relied on had been patched, and the malware is caught before it runs.' },
    { id: 'ddos', name: 'DDoS attack', what: 'Distributed denial of service: thousands of hijacked devices flood a server with requests until it cannot answer real users.', target: 'server',
      stop: [], limit: ['firewall'],
      won: 'The server is overwhelmed. Real users cannot reach the service until the flood stops.',
      limited: { firewall: 'Filtering at the gateway drops much of the flood. The service is slow but stays up.' },
      stopped: '' },
    { id: 'flaw', name: 'Hacking through a flaw', what: 'An attacker finds a known weakness in software that has not been updated and uses it to get in.', target: 'server',
      stop: ['updates'], limit: ['firewall'],
      won: 'The attacker gets into the server and copies the database of personal records.',
      limited: { firewall: 'The firewall blocks the unusual connection the attacker needed, but the weakness is still there.' },
      stopped: 'The fix had already been installed, so the weakness no longer exists.' }
  ];
  var BUDGET = 3;

  function outcome(t, on) {
    var s = t.stop.filter(function (d) { return on[d]; })[0];
    if (s) return { level: 2, by: s, text: t.stopped };
    var l = t.limit.filter(function (d) { return on[d]; })[0];
    if (l) return { level: 1, by: l, text: t.limited[l] };
    return { level: 0, text: t.won };
  }

  function buildDefend(stage, K) {
    var T = THREE, g = stage.root, V = T.Vector3;
    stage.setView({ target: [0.2, 1.4, 0], radius: 16.5, theta: 0.1, phi: 1.05, minR: 5, maxR: 28, shadow: 10, exposure: 1.0 });
    g.add(K.floor(13, 0));
    var att = K.group(); att.add(person(K, 0x111827)); K.put(laptop(K), 0.2, 0.9, 0.5, att).scale.setScalar(0.7);
    K.put(att, -7.6, 0, 0, g);
    K.put(cloud(K), -4.4, 3.2, 0, g);
    stage.label('Attacker', att, { dy: 1.9 });
    stage.label('Internet', new V(-4.4, 4.2, 0), { cls: 'quiet' });
    // the organisation's boundary, with a gateway
    [-2.6, 2.6].forEach(function (z) { K.put(K.box(0.3, 2.2, 3.2, 0x475569, { roughness: 0.8 }), -1.6, 1.1, z, g); });
    var gate = K.box(0.14, 2.0, 2.0, 0xf97316, { emissive: 0xf97316, emissiveIntensity: 1.2, transparent: true, opacity: 0.55 });
    gate.castShadow = false; K.put(gate, -1.6, 1.0, 0, g);
    var gateLabel = stage.label('Firewall', gate, { dy: 1.3 });
    K.put(desk(K), 2.2, 0.4, 2.4, g); var lap = K.put(laptop(K), 2.2, 0.8, 2.4, g);
    var staff = K.put(person(K), 3.3, 0, 2.9, g);
    var phone = K.rbox(0.2, 0.4, 0.03, 0.04, 0x15181c); K.put(phone, 3.75, 1.2, 3.1, g);
    var phoneLabel = stage.label('Code on phone', phone, { dy: 0.4, cls: 'quiet' });
    var shield = new T.Mesh(new T.TorusGeometry(0.5, 0.04, 8, 32), K.mat(0x4ade80, { emissive: 0x4ade80, emissiveIntensity: 1.4 }));
    K.put(shield, 2.2, 1.2, 2.75, g);
    var hat = K.cyl(0.02, 0.18, 0.16, 0xfacc15, 16, { emissive: 0xfacc15, emissiveIntensity: 0.8 }); K.put(hat, 3.3, 1.75, 2.9, g);
    var srv = K.put(server(K), 3.4, 0, -2.2, g);
    var bak = K.put(K.rbox(0.9, 0.6, 0.7, 0.08, 0x1d4ed8, { metalness: 0.4, roughness: 0.4 }), 6.4, 0.3, -2.2, g);
    var bakLabel = stage.label('Backup copy', bak, { dy: 0.6 });
    var filt = K.put(K.rbox(0.8, 0.5, 0.6, 0.08, 0x7c3aed, { metalness: 0.4, roughness: 0.4 }), -0.4, 0.25, 1.9, g);
    var filtLabel = stage.label('Web filter', filt, { dy: 0.5 });
    stage.label('Staff', staff, { dy: 1.9 });
    stage.label('Server and data', srv, { dy: 2.0 });
    var P = { att: new V(-7.6, 1.5, 0), net: new V(-4.4, 2.6, 0), gate: new V(-1.6, 1.2, 0), staff: new V(2.2, 1.4, 2.4), server: new V(3.4, 1.9, -2.2) };

    var on = {}, busy = false, btns = {};
    function count() { return Object.keys(on).filter(function (k) { return on[k]; }).length; }
    function refresh() {
      gate.visible = !!on.firewall; gateLabel.show(!!on.firewall);
      phone.visible = !!on.mfa; phoneLabel.show(!!on.mfa);
      shield.visible = !!on.updates; hat.visible = !!on.training;
      bak.visible = !!on.backups; bakLabel.show(!!on.backups);
      filt.visible = !!on.proxy; filtLabel.show(!!on.proxy);
      Object.keys(btns).forEach(function (k) { btns[k].setAttribute('aria-pressed', on[k] ? 'true' : 'false'); });
      stage.invalidate();
    }
    var row = stage.ui.row('Defences (' + BUDGET + ' at most)');
    Object.keys(DEF).forEach(function (k) {
      var b = stage.ui.button(DEF[k][0], function () {
        if (busy) return;
        if (!on[k] && count() >= BUDGET) { stage.info('<h3>Budget spent</h3><p>You can afford ' + BUDGET + ' defences. Switch one off before adding another. Which matters most?</p>'); return; }
        on[k] = !on[k]; refresh();
        stage.info('<h3>' + DEF[k][0] + (on[k] ? ': on' : ': off') + '</h3><p>' + DEF[k][1] + '</p><p class="note">' + count() + ' of ' + BUDGET + ' chosen.</p>');
      }, row);
      b.classList.add('chip'); btns[k] = b;
    });
    var word = ['Succeeded', 'Limited', 'Blocked'];
    var row2 = stage.ui.row('Launch');
    THREATS.forEach(function (t) {
      stage.ui.button(t.name, function () {
        if (busy) return;
        busy = true;
        var r = outcome(t, on), end = P[t.target];
        K.steps(stage, t.name, [
          { from: P.att, to: P.net, color: 0xdc2626, msg: t.what },
          { from: P.net, to: P.gate, color: 0xdc2626, msg: 'It arrives at the edge of the organisation’s network.' },
          { from: P.gate, to: r.level === 2 && r.by === 'firewall' ? P.gate : end, color: r.level === 2 ? 0x4ade80 : r.level === 1 ? 0xfacc15 : 0xdc2626,
            msg: '<strong>' + word[r.level] + (r.by ? ' by ' + DEF[r.by][0].toLowerCase() : '') + '.</strong> ' + r.text }
        ], function () { busy = false; });
      }, row2);
    });
    stage.ui.button('Test all five', function () {
      if (busy) return;
      var rows = THREATS.map(function (t) { var r = outcome(t, on); return [t.name, word[r.level], r.by ? DEF[r.by][0] : '—']; });
      var score = THREATS.reduce(function (a, t) { return a + outcome(t, on).level; }, 0);
      stage.info('<h3>Your ' + count() + ' defence' + (count() === 1 ? '' : 's') + ' against five threats: ' + score + ' of 10</h3>' + table(rows, ['Threat', 'Result', 'Because of']) +
        '<p class="note">Can you do better with a different three? Which threat can never be fully blocked here, and why?</p>');
    }, row2).classList.add('primary');
    refresh();
    stage.info('<h3>You are the network manager</h3><p>Five kinds of attack are coming and you can afford three defences. Choose, launch an attack, and see whether it is blocked, limited or succeeds.</p>' +
      '<p class="note">Simplified: real security is never this certain. A defence lowers the odds; it does not guarantee an outcome, and attackers adapt.</p>');
  }

  /* ================= the six lessons ================= */

  var L = window.DSBook;

  L.defineLesson({
    id: '3.4a', title: 'Types of computing networks',
    question: 'How many networks is your phone connected to right now?',
    intro: 'A network is any set of devices linked so they can share data. Networks differ in how far they reach, how they are connected and who is in charge of the data.',
    targets: ['Classify a network as a PAN, LAN, MAN or WAN.', 'Compare wired, wireless and cloud networks.', 'Explain the difference between client–server and peer-to-peer networks.', 'Discuss who has control, and who is left out, in each kind of network.'],
    predict: { q: 'A school keeps all its files on one central server. The server breaks on exam day. What happens?', options: ['Only the teacher who broke it loses access', 'Everyone loses access to the files at once', 'Nothing: the laptops share the files between themselves', 'The files move to the nearest laptop automatically'], after: 'Prediction recorded. Open “Client–server or peer-to-peer”, switch the server off and request a file. Then try the same in peer-to-peer.' },
    scenes: [
      { id: 'sizes', title: 'Networks by size', build: buildSizes, hint: 'Drag to rotate. Click a network, or use the buttons, to fly to it.',
        textVersion: table(SIZES.map(function (s) { return [s.name, s.reach, s.example, s.runs, s.note]; }), ['Type', 'Reach', 'Example', 'Who runs it', 'Worth noticing']) +
          '<p><strong>Challenges.</strong></p><ol>' + SIZE_Q.map(function (c) { return '<li>' + c.text + ' <details><summary>Answer</summary>' + c.why + '</details></li>'; }).join('') + '</ol>' },
      { id: 'share', title: 'Client–server or peer-to-peer', build: buildShare, hint: 'Choose how data is shared, then use the buttons below.',
        textVersion: '<p><strong>Client–server:</strong> files are held on one central server and every other computer (a client) asks it for them. Easy to secure, back up and control, but if the server fails everyone loses access.</p>' +
          '<p><strong>Peer-to-peer:</strong> there is no server. Every computer stores and shares files as an equal. If one peer fails, another with a copy can supply the file, but nobody is responsible for backups, security or permission.</p>' }
    ],
    sections: [
      { heading: 'Networks by size', html: '<p>Open <em>Networks by size</em>. A <strong>PAN</strong> surrounds one person, a <strong>LAN</strong> covers a building, a <strong>MAN</strong> covers a city and a <strong>WAN</strong> spans countries. The internet is the largest WAN: a network of networks.</p><p>Size also tells you about control. You run your own PAN, your school runs its LAN, and no single organisation runs the internet.</p>' },
      { heading: 'Wired, wireless and cloud', html: '<ul><li><strong>Wired</strong> networks use cables. They are fast, reliable and harder to intercept, but devices cannot move.</li><li><strong>Wireless</strong> networks use radio (Wi-Fi, Bluetooth, mobile data). They are convenient and cheaper to extend, but slower, affected by walls and distance, and easier to listen in on.</li><li><strong>Cloud</strong> networks move the storage and software off-site, onto servers reached over the internet. An organisation rents what it needs and depends on its connection and its provider.</li></ul>' },
      { heading: 'Who holds the data?', html: '<p>In a <strong>client–server</strong> network, one server holds the data and decides who may have it. In a <strong>peer-to-peer</strong> network every device is equal. Try both in the second model.</p><p>The choice is about more than technology. Central control makes rules, backups and security possible, and it also creates one place that can fail, be attacked, or be used to watch everyone.</p>' },
      { heading: 'In the real world: your school', html: '<p>Your school runs a client–server LAN with wireless access, connected to the internet (a WAN), and stores much of its work in a cloud service. Your phone adds a PAN on top. One morning of school uses every kind of network in this lesson.</p>' }
    ],
    terms: [['Network', 'A set of connected devices (nodes) that can share data.'], ['PAN / LAN / MAN / WAN', 'Personal, local, metropolitan and wide area networks: named by how far they reach.'], ['Wired / wireless network', 'A network connected by cables, or by radio signals such as Wi-Fi.'], ['Cloud network', 'Computing resources hosted off-site and reached over the internet.'], ['Client–server network', 'A network where data is stored centrally on a server and clients request access to it.'], ['Peer-to-peer (P2P) network', 'A decentralised network where every computer shares responsibility for storing and sharing data.']],
    questions: [
      { q: 'A company links its offices in Halifax, Toronto and Vancouver. Which type of network is this?', options: [['LAN', 'A LAN covers one building or site. These offices are thousands of kilometres apart.'], ['PAN', 'A PAN is the few metres around one person.'], ['MAN', 'A MAN covers one city. This spans a country.'], 'WAN'], answer: 3, why: 'A network spanning a country or more is a wide area network.' },
      { q: 'What is the main weakness of a client–server network?', options: [['Nobody controls who can see the files.', 'That is the weakness of peer-to-peer. A server is where access is controlled.'], 'If the server fails, every client loses access.', ['Files cannot be backed up.', 'A central server makes backups easier, not harder.'], ['It only works without wires.', 'Client–server describes who holds the data, not how devices are connected.']], answer: 1, why: 'Central storage is a single point of failure, as the model shows when the server is switched off.' },
      { q: 'A café offers free Wi-Fi. Compared with a wired connection, what risk is greater?', options: ['Other people nearby can more easily intercept the signal.', ['The connection will always be faster.', 'Wireless is usually slower and less steady than a cable.'], ['The café cannot see which sites are visited.', 'Whoever runs a network can see a good deal about the traffic passing through it.'], ['Devices must stay in one place.', 'That is the limit of wired networks.']], answer: 0, why: 'Radio signals spread in every direction, so wireless networks need encryption to keep traffic private.' }
    ],
    inquiry: { prompt: 'More and more schools keep all student work in a cloud service run by a large company in another country. Who benefits, and what is being traded away?', consider: ['Consider students, teachers, the school’s budget, the company, and the laws of the country where the data sits.', 'Separate immediate impacts (cost, access from home, less equipment) from longer-term implications (dependence, who can see the data, what happens if prices or terms change).', 'Under what conditions would you judge the trade acceptable?'] }
  });

  L.defineLesson({
    id: '3.4b', title: 'Components of computing networks',
    question: 'What does your message pass through between your laptop and the internet?',
    intro: 'Wi-Fi feels like magic until it stops. Behind it is a short chain of boxes, each with one job.',
    targets: ['Explain the role of a network interface, access point, switch, hub, router and modem.', 'Describe a MAC address.', 'Trace the path of data inside a local network and out to the internet.', 'Explain why a switch is better than a hub.'],
    predict: { q: 'You send a document from your laptop to the classroom printer over school Wi-Fi. Does it travel out to the internet?', options: ['Yes, everything on Wi-Fi goes through the internet', 'No, it stays inside the school’s local network', 'Only if the printer is switched off', 'It goes to the ISP and comes back'], after: 'Prediction recorded. Open the model and choose “Print from the laptop”, then “Open a website”. Compare where each one stops.' },
    scenes: [{ id: 'parts', title: 'A school network', build: buildParts, hint: 'Drag to rotate. Click a part to see what it does, then use the Try buttons.',
      textVersion: table(Object.keys(COMP).map(function (k) { return [COMP[k][0], COMP[k][1]]; }), ['Part', 'What it does']) +
        '<p><strong>Printing:</strong> laptop → access point → switch → printer. It never leaves the building. With a hub in place of the switch, the job is copied to every device.</p><p><strong>Opening a website:</strong> laptop → access point → switch → router → modem → ISP → internet.</p>' }],
    sections: [
      { heading: 'Getting onto the network', html: '<p>Every device needs a <strong>network interface card</strong>, wired or wireless, to turn data into signals. Each interface carries a <strong>MAC address</strong>, a unique 48-bit identifier written in hexadecimal and assigned when the hardware is made.</p><p>A <strong>wireless access point</strong> provides the Wi-Fi signal. It is still plugged in by cable: even a wireless network is mostly wires.</p>' },
      { heading: 'Moving data around the building', html: '<p>A <strong>switch</strong> connects the devices on a local network and sends each packet only to the device it is addressed to. A <strong>hub</strong> is the older, simpler version: it copies everything to everyone. Swap them in the model and print again.</p>' },
      { heading: 'The way out', html: '<p>A <strong>router</strong> joins one network to another and chooses the route for each packet. A <strong>modem</strong> converts the signals for the line that leaves the building, which today is often optical fibre. Beyond it is your <strong>internet service provider</strong>.</p><p>At home these jobs are usually done by one box. In a school or office they are separate so that each can be bigger, managed and replaced.</p>' },
      { heading: 'In the real world: the choke points', html: '<p>Follow the web request in the model and notice how many devices it passes through that belong to someone else. Each one is a place where traffic can be measured, slowed, filtered or logged. That is useful for keeping a school network safe, and it is also where questions about privacy begin.</p>' }
    ],
    terms: [['Network interface card (NIC)', 'The hardware that converts a device’s data into signals and sends them onto a network.'], ['MAC address', 'A unique identifier assigned to every network interface when it is made.'], ['Wireless access point (WAP)', 'A device that creates a wireless local network so devices can connect by Wi-Fi.'], ['Hub', 'A simple device that sends incoming data to every device connected to it.'], ['Switch', 'A device that connects devices on a network and forwards data only to the intended one.'], ['Router', 'A device that transfers data from one network to another by the most efficient available route.'], ['Modem', 'A device that converts digital data into a form that can travel over the outside line, and back.'], ['Internet service provider (ISP)', 'A company that provides access to the internet.']],
    questions: [
      { q: 'Which device connects a local network to a different network, such as the internet?', options: [['Switch', 'A switch joins devices within one network.'], 'Router', ['Hub', 'A hub only repeats data to devices on the same network.'], ['Network interface card', 'That connects one device to its own network.']], answer: 1, why: 'Routing between networks is what a router does.' },
      { q: 'Why is a switch usually preferred to a hub?', options: [['A switch needs no electricity.', 'Both need power.'], ['A hub cannot connect more than two devices.', 'A hub can connect several. Look at what it does with each packet.'], 'A switch sends data only to the device it is meant for, saving capacity and keeping it from other devices.', ['A switch connects straight to the internet.', 'That is the router’s job.']], answer: 2, why: 'A hub broadcasts to every port; a switch delivers to one.' },
      { q: 'What is a MAC address?', options: ['A unique identifier built into a device’s network interface.', ['The street address of the ISP.', 'It identifies hardware, not a place.'], ['A password for the Wi-Fi.', 'A MAC address identifies a device. It is not a secret.'], ['The name of a website.', 'That is a domain name, covered in the next lesson.']], answer: 0, why: 'Every network interface is given one when it is manufactured.' }
    ],
    inquiry: { prompt: 'A school’s network equipment can record which device visited which site and when. Should a school monitor its students’ internet use?', consider: ['Whose interests are involved: students, parents, teachers, the IT staff, the school as an employer and as a guardian?', 'What is gained (safety, focus, protection from malware) and what is lost (privacy, trust, freedom to look things up)?', 'Does your answer change with the age of the student, or if the device belongs to the student?'] }
  });

  L.defineLesson({
    id: '3.4c', title: 'Characteristics of computing networks',
    question: 'How can billions of different devices, made by different companies, all talk to each other?',
    intro: 'The internet works because everyone agreed on the rules. This lesson looks at those rules, at how much a connection can carry, and at how networks are kept secure.',
    targets: ['Explain what a protocol is and why standards allow interoperability.', 'Describe the roles of TCP, IP and DNS.', 'Distinguish bandwidth from speed and lossy from lossless compression.', 'Describe how authentication, firewalls, proxy servers and encryption protect a network.'],
    predict: { q: 'A message is split into four packets and sent across the internet. One router on the way is switched off. What happens?', options: ['The whole message is lost', 'The packets wait until the router is repaired', 'The packets take other routes and the message still arrives', 'Only the first packet arrives'], after: 'Prediction recorded. Open “Packets across the internet”, send a message, then switch routers off and send again.' },
    scenes: [
      { id: 'packets', title: 'Packets across the internet', build: buildPackets, hint: 'Click a router, or use its button, to switch it off. Then send a message.',
        textVersion: '<p>A message is split into numbered packets. Each is labelled with the sender’s and receiver’s IP addresses. Routers pass each packet along any open route, so packets may travel different ways and arrive out of order. The receiver uses the numbers to rebuild the message and asks again for anything missing (TCP). If one router fails, packets go round it. Only when every route is cut does delivery fail.</p>' },
      { id: 'bandwidth', title: 'Bandwidth', build: buildBandwidth, hint: 'Use the sliders and buttons below. Drag to rotate the model.',
        textVersion: '<p>Demand = number of devices × data each stream needs. If demand is more than the bandwidth, the extra data has to wait and the video buffers. In this classroom model an HD stream needs 5 Mbps and a 4K stream 20 Mbps. Example: 4 devices in HD need 20 Mbps, which fits a 25 Mbps connection; 2 devices in 4K need 40 Mbps, which does not. Stronger lossy compression halves the data needed and lowers the picture quality.</p>' }
    ],
    sections: [
      { heading: 'Standards and protocols', html: '<p>A <strong>protocol</strong> is an agreed set of rules for exchanging data. Because every manufacturer follows the same ones, a phone made by one company can load a page from a server made by another. That ability to work together is <strong>interoperability</strong>.</p><p>The internet’s rules are grouped into four layers, each relying on the one below:</p><ul><li><strong>Application:</strong> what the data is for (web pages with HTTP, email, file transfer).</li><li><strong>Transport:</strong> <strong>TCP</strong> splits data into numbered packets, checks they all arrive and reassembles them.</li><li><strong>Internet:</strong> <strong>IP</strong> adds the sender’s and receiver’s addresses and routes each packet.</li><li><strong>Physical network:</strong> the cables, radio and hardware that carry the bits.</li></ul>' },
      { heading: 'Addresses and names', html: '<p>Every device on the internet has an <strong>IP address</strong>, a number that says where to deliver packets. People prefer names, so the <strong>domain name system (DNS)</strong> translates a name such as example.org into the IP address behind it.</p>' },
      { heading: 'How much can it carry?', html: '<p><strong>Bandwidth</strong> is the most data a connection can carry each second, usually given in megabits per second (Mbps). <strong>Speed</strong> is how quickly data actually gets from one place to another. A wide road and a fast car are different things.</p><p><strong>Compression</strong> makes files smaller so they need less bandwidth. <strong>Lossy</strong> compression (JPG images, MP4 video) throws some detail away for good. <strong>Lossless</strong> compression shrinks a file without losing anything, so the original can be rebuilt exactly.</p><p><strong>Net neutrality</strong> is the principle that an ISP should treat all traffic equally and not slow down or charge more for particular sites or services.</p>' },
      { heading: 'Keeping a network secure', html: '<ul><li><strong>Authentication</strong> checks who you are, with a username and strong password. <strong>Multi-factor authentication</strong> adds a second proof: something you have (a phone, a card) or something you are (a fingerprint, a face).</li><li><strong>Access rights</strong> decide what each user may do: read only, or full control.</li><li>A <strong>firewall</strong> inspects traffic entering and leaving and blocks what the rules forbid.</li><li>A <strong>proxy server</strong> sits between users and the internet. It can hide internal addresses and filter sites.</li><li><strong>Encryption</strong> makes data unreadable to anyone without the key, both in storage and on the Wi-Fi.</li></ul>' }
    ],
    terms: [['Protocol', 'An agreed set of rules for how data is formatted and exchanged.'], ['Interoperability', 'The ability of different systems and devices to work together.'], ['TCP (transmission control protocol)', 'Splits data into packets, makes sure they arrive, and reassembles them in order.'], ['IP (internet protocol) / IP address', 'The rules for addressing and routing packets; the unique number identifying a device on a network.'], ['Domain name system (DNS)', 'The service that translates domain names into IP addresses.'], ['Bandwidth', 'The maximum amount of data a connection can transfer in a given time.'], ['Data compression', 'Reducing the size of a file. Lossy compression removes data permanently; lossless does not.'], ['Net neutrality', 'The principle that all internet traffic should be treated equally by providers.'], ['Multi-factor authentication', 'Using two or more independent proofs of identity to log in.'], ['Firewall', 'Hardware or software that blocks unauthorised access by inspecting network traffic.'], ['Proxy server', 'A system that acts as an intermediary between a network’s users and the internet.']],
    questions: [
      { q: 'Packets from one message arrive out of order. Which protocol puts them back correctly?', options: [['DNS', 'DNS turns names into addresses. It does not handle the packets of a message.'], ['IP', 'IP gets each packet to the right address but does not reorder them.'], 'TCP', ['HTTP', 'HTTP defines web requests and responses, and relies on a lower layer to deliver them complete.']], answer: 2, why: 'TCP numbers the packets, checks for missing ones and reassembles them.' },
      { q: 'A family’s video keeps buffering when four people stream at once, but works for one. What is the most likely cause?', options: ['Their bandwidth is too low for the total demand.', ['Their IP address has expired.', 'An address problem would stop one stream too.'], ['The videos use lossless compression.', 'Streaming video uses lossy compression. Think about total demand.'], ['Their firewall is switched off.', 'A firewall affects security, not how much data fits down the line.']], answer: 0, why: 'Four streams need four times the data. If that is more than the connection can carry, the rest must wait.' },
      { q: 'Which of these is multi-factor authentication?', options: [['A very long password', 'Still only one factor: something you know.'], ['Two different passwords', 'Two of the same kind of proof is not two factors.'], 'A password plus a code sent to your phone', ['A username and a password', 'The username is not a secret, so this is one factor.']], answer: 2, why: 'It combines something you know with something you have.' }
    ],
    inquiry: { prompt: 'Without net neutrality, an internet provider could let some services load quickly for a fee and leave others slow. Should providers be allowed to do that?', consider: ['Consider internet providers, large streaming companies, small new websites, schools, and households on low incomes.', 'What might be gained (investment in faster networks, priority for urgent services) and what lost (a level field for new ideas, equal access to information)?', 'Find two sources that disagree. What does each one want, and who paid for it?'] }
  });

  L.defineLesson({
    id: '3.4de', title: 'Network services and the World Wide Web',
    question: 'Is the web the same thing as the internet?',
    intro: 'People use the two words as if they mean the same. They do not: the internet is the network, and the web is one of many services that run on it.',
    targets: ['Explain what an internet service provider and a mobile service provider supply.', 'Distinguish the internet from the World Wide Web.', 'Describe the roles of a URL, HTTP/HTTPS and HTML.', 'Trace the steps when a web page is requested.'],
    predict: { q: 'You type a web address and press Enter. What is the very first thing your computer needs to find out?', options: ['The colour scheme of the page', 'The IP address that belongs to that name', 'The password of the web server', 'How many people are on the site'], after: 'Prediction recorded. Open the model and choose “Open a web page”. Which server is contacted first?' },
    scenes: [{ id: 'services', title: 'Using a service', build: buildServices, hint: 'Choose a service below and follow the steps. Drag to rotate.',
      textVersion: '<p><strong>Opening a web page:</strong> (1) the browser asks a DNS server for the IP address of the domain name; (2) DNS replies with the address; (3) the browser sends an HTTP request to that address, encrypted if the address begins https; (4) the web server replies with the page as HTML; (5) the browser displays it.</p><p><strong>Sending an email:</strong> your app passes the message to your mail server, which finds the recipient’s mail server and passes it on, where it waits to be collected.</p><p><strong>A video call (VoIP):</strong> a service sets up the call, then sound and picture travel as packets in both directions. Late packets are dropped, so a poor connection makes the call stutter.</p>' }],
    sections: [
      { heading: 'Who gets you online', html: '<p>An <strong>internet service provider (ISP)</strong> sells a connection to the internet, and often email, web hosting and domain names too. A <strong>mobile service provider</strong> does the same over the mobile phone network, using radio masts instead of a line to the building.</p><p>Access depends on where the provider has built its network and what it charges, which is why connection quality differs so much between city and countryside and between countries.</p>' },
      { heading: 'Services that run on the internet', html: '<p>The internet only moves packets. What people actually use are services on top of it: the web, email, messaging, file sharing, streaming, online games and <strong>VoIP</strong> (voice over internet protocol), which carries phone and video calls as data.</p>' },
      { heading: 'The World Wide Web', html: '<p>The <strong>World Wide Web</strong> is a huge collection of linked pages and resources reached through a browser. Three ideas hold it together:</p><ul><li>A <strong>URL</strong> is the unique address of a resource, for example <code>https://www.example.org/news</code>: the protocol, the domain name, then the path to the page.</li><li><strong>HTTP</strong> is the protocol browsers and web servers use to ask for and send pages. <strong>HTTPS</strong> is the encrypted version.</li><li><strong>HTML</strong> is the language pages are written in. It marks up text, images and links so a browser can display them.</li></ul>' },
      { heading: 'In the real world: one name, many hands', html: '<p>Follow the web request in the model and count the organisations involved: your ISP, a DNS service, the company hosting the site. Each sees part of what you do. Encryption (HTTPS) hides the content of the page from those in between, but not the fact that you visited.</p>' }
    ],
    terms: [['Internet', 'The global network of networks that carries data between devices.'], ['World Wide Web', 'The collection of linked pages and resources accessed over the internet with a browser.'], ['Internet service provider (ISP)', 'A company that provides internet access and related services to customers.'], ['Mobile service provider', 'A company that provides phone and data services over a mobile network.'], ['VoIP (voice over internet protocol)', 'Technology that carries voice and video calls as data over the internet.'], ['URL', 'The unique address of a resource on the web.'], ['HTTP / HTTPS', 'The protocol used to request and deliver web pages; HTTPS adds encryption.'], ['HTML', 'The markup language used to structure and link web pages.']],
    questions: [
      { q: 'Which statement is correct?', options: [['The internet and the web are two names for the same thing.', 'They are related but different. One is the network; the other runs on it.'], 'The web is one service that runs on the internet.', ['The internet runs on the web.', 'It is the other way round.'], ['The web is the hardware; the internet is the software.', 'The internet is the network of hardware and connections. The web is pages and links.']], answer: 1, why: 'Email, calls and games use the internet without using the web.' },
      { q: 'In https://www.example.org/news, what does “https” tell you?', options: [['The name of the company', 'That is the domain name part.'], ['The page on the site', 'That is the path at the end.'], 'The protocol to use, with encryption', ['The country the server is in', 'Nothing in this address shows a country.']], answer: 2, why: 'It names the protocol, HTTP, with the S meaning the connection is encrypted.' },
      { q: 'Why does a browser contact a DNS server before loading a page?', options: ['To find the IP address that matches the domain name', ['To check the page for viruses', 'DNS does not inspect pages.'], ['To pay the ISP', 'No payment is involved in a lookup.'], ['To convert the page into HTML', 'The page already is HTML when the web server sends it.']], answer: 0, why: 'Packets are delivered to numeric addresses, so the name has to be translated first.' }
    ],
    inquiry: { prompt: 'People build and present their identities through online services they do not own. How far is your online identity really yours?', consider: ['Which networks and services do you use to show who you are, and what does each one let you control?', 'How is an online identity different from an offline one? Who else shapes it (the platform, other users, algorithms)?', 'What happens to that identity if the service changes its rules, is sold, or closes?'] }
  });

  L.defineLesson({
    id: '3.4f', title: 'Evolution of the internet and the web',
    question: 'The web was built so that anyone could share knowledge freely. Is that what it became?',
    intro: 'In about fifty years the internet went from four linked computers to a network that includes your doorbell. Each stage changed who speaks, who listens and who collects the data.',
    targets: ['Outline the main stages in the development of the internet and the web.', 'Compare Web 1.0, Web 2.0 and Web 3.0 by the direction information flows.', 'Explain what the internet of things is and give examples.', 'Analyse one of these changes: why it happened, who gained and who lost.'],
    predict: { q: 'In a home full of smart devices, who receives most of the data they produce?', options: ['Nobody: it stays inside each device', 'Only the people who live there', 'Mostly the companies that made the devices', 'The government'], after: 'Prediction recorded. Open the model, choose “Internet of things” and follow the green and orange flows.' },
    scenes: [{ id: 'eras', title: 'Four stages of the web', build: buildEras, hint: 'Choose an era below and watch which way the data flows. Drag to rotate.',
      textVersion: table(ERAS.map(function (e) { return [e.name, e.when, e.what, e.flow, e.people]; }), ['Stage', 'When (rough)', 'What it was', 'Direction of information', 'For people']) }],
    sections: [
      { heading: 'From a research project to the web', html: '<p>The internet began in 1969 as a network linking a handful of research computers in the United States. Through the 1970s and 1980s the shared rules (TCP/IP) were developed and email became its first popular use.</p><p>In 1989 <strong>Tim Berners-Lee</strong>, working at the research centre CERN, proposed a way to link documents across the internet: the World Wide Web. Early pages were written by a few and read by many, which is why this period is called <strong>Web 1.0</strong>, the read-only web.</p>' },
      { heading: 'Web 2.0: everyone publishes', html: '<p>From about 2000, platforms made it easy to post without technical skill: social networks, video sharing, blogs, wikis, reviews. Smartphones kept people connected all day. Users now create most of what is online, and a small number of platforms sit in the middle of it.</p>' },
      { heading: 'Web 3.0 and the internet of things', html: '<p><strong>Web 3.0</strong>, the <strong>semantic web</strong>, is the idea that data carries labels describing what it means, so software can connect and reason about it. It is still emerging, and the label is used in more than one way.</p><p>The <strong>internet of things (IoT)</strong> connects objects, not only people: sensors, appliances, vehicles, machines. They report data continuously, which can save energy and time, and which also means a home or a city is observed all day.</p>' },
      { heading: 'Has the web met its founder’s hopes?', html: '<p>Berners-Lee wanted a web that was open to everyone and controlled by no one. Today it reaches billions of people, and it is also dominated by a few companies, funded largely by advertising and personal data, and used to spread falsehoods as easily as knowledge. Whether that counts as success depends on whose experience you look at.</p>' }
    ],
    terms: [['ARPANET', 'The research network, begun in 1969, from which the internet grew.'], ['Web 1.0', 'The early, mostly read-only web of static pages.'], ['Web 2.0', 'The read-write web of platforms where users create and share content.'], ['Web 3.0 (semantic web)', 'An emerging web in which data is described so that software can interpret and connect it.'], ['Internet of things (IoT)', 'Everyday objects fitted with sensors and connected to the internet so they can send and receive data.'], ['Platform', 'An online service that hosts and organises content created by its users.']],
    questions: [
      { q: 'What most clearly separates Web 2.0 from Web 1.0?', options: [['Web 2.0 has no servers.', 'Platforms run on very large numbers of servers.'], 'Ordinary users create and share content, not only read it.', ['Web 2.0 does not use the internet.', 'All of the web runs on the internet.'], ['Web 2.0 pages cannot contain links.', 'Links are central to every stage of the web.']], answer: 1, why: 'The change was from reading to reading and writing.' },
      { q: 'Which is an example of the internet of things?', options: [['Reading a news site on a laptop', 'A person browsing is the ordinary web, not a connected object reporting data.'], ['Sending an email', 'That is a person using a service.'], 'A thermostat that reports room temperature to an app', ['Printing a document at school', 'That stays on the local network and involves no sensing object.']], answer: 2, why: 'It is an everyday object with a sensor that sends data over the internet by itself.' },
      { q: 'Who invented the World Wide Web, and when?', options: [['The US military in 1969', '1969 is the start of the internet’s forerunner, not the web.'], 'Tim Berners-Lee, who proposed it in 1989', ['A social media company around 2004', 'By then the web was already fifteen years old.'], ['Nobody: it appeared gradually', 'The web had a specific proposal and a named inventor.']], answer: 1, why: 'The internet came first; the web was proposed on top of it in 1989.' }
    ],
    inquiry: { prompt: 'Smart home devices promise comfort, safety and lower energy bills. Are they worth what a household gives up to have them?', consider: ['Who is affected inside the home (owners, children, guests, renters) and outside it (the device maker, insurers, police, burglars)?', 'What happens now, and what might follow in ten years when the maker stops updating the device?', 'What would have to be true about a smart doorbell for you to accept one on your neighbour’s house, facing your door?'] }
  });

  L.defineLesson({
    id: '3.4g', title: 'Internet dilemmas',
    question: 'If you could afford only three protections for a network, which would you choose?',
    intro: 'Connecting everything makes everything reachable, including by people who mean harm. This lesson looks at the main threats, what they cost real people, and why no defence is complete.',
    targets: ['Describe spam, hacking, phishing, viruses, ransomware and DDoS attacks.', 'Match a suitable defence to each threat and explain its limits.', 'Explain consequences for people: loss of privacy, identity theft, trolling and harassment.', 'Evaluate how responsibility for security should be shared.'],
    predict: { q: 'An organisation has an excellent firewall. A staff member receives a convincing fake email and types in their password. Does the firewall stop the attack?', options: ['Yes, a firewall blocks all attacks', 'No, the attack goes through a person, not through the firewall', 'Only if the email is long', 'Yes, because the password is encrypted'], after: 'Prediction recorded. Open the model, switch on only the firewall, and launch Phishing.' },
    scenes: [{ id: 'defend', title: 'Attack and defend', build: buildDefend, hint: 'Choose up to three defences, then launch an attack. Drag to rotate.',
      textVersion: table(THREATS.map(function (t) {
        return [t.name, t.what, t.stop.length ? t.stop.map(function (d) { return DEF[d][0]; }).join(', ') : 'Nothing in this model', t.limit.map(function (d) { return DEF[d][0]; }).join(', '), t.won];
      }), ['Threat', 'What it is', 'Blocked by', 'Limited by', 'If it succeeds']) +
        table(Object.keys(DEF).map(function (k) { return DEF[k]; }), ['Defence', 'What it does']) +
        '<p>Task: choose three defences and work out the result for all five threats. One strong answer is staff training, updates and antivirus, and a firewall, which blocks four and limits the fifth. A DDoS attack can only be limited, never fully blocked, in this model.</p>' }],
    sections: [
      { heading: 'Risks to data', html: '<ul><li><strong>Spam:</strong> unwanted bulk messages, mostly advertising, sometimes carrying scams.</li><li><strong>Hacking:</strong> gaining access to a computer or network without permission, by tricking a person (<strong>social engineering</strong>), breaking into a website, or using a software flaw that has not been fixed.</li><li><strong>Phishing:</strong> a message disguised as coming from a trusted source to steal passwords or payment details.</li><li><strong>Viruses:</strong> malicious code attached to files that copies itself and spreads.</li><li><strong>Ransomware:</strong> malware that locks files and demands payment.</li><li><strong>DDoS:</strong> a flood of requests from many hijacked devices that knocks a service offline.</li></ul><p>A well-known example of a software flaw is “Log4Shell”, found in late 2021 in a widely used piece of code. Because so many services contained it, organisations around the world had to rush to install the fix.</p>' },
      { heading: 'Consequences for people', html: '<p>Behind every breach are people. Stolen personal data can be used for <strong>identity theft</strong>: opening accounts or borrowing money in someone else’s name. <strong>Anonymity</strong> online protects whistle-blowers and vulnerable people, and it also shelters <strong>trolling</strong> and harassment.</p><p>Many countries give people rights over their data. Under the European Union’s data protection law, for example, a person can ask for their data to be erased in certain circumstances: the <strong>right to be forgotten</strong>.</p>' },
      { heading: 'Why there is no perfect defence', html: '<p>Run <em>Test all five</em> in the model with different sets of three. Technology stops technical attacks, but phishing targets people, so training matters as much as software. A flood of traffic can be reduced and not prevented. Backups stop nothing and are still what saves an organisation after ransomware.</p><p>Security is a matter of layers, cost and judgement, and it is shared between the people who build systems, the organisations that run them and everyone who uses them.</p>' },
      { heading: 'Surveillance', html: '<p>The same networks that carry attacks also make watching easy: cameras, drones, smart speakers and location data. The tools that keep a network safe, such as logging and filtering, are close cousins of the tools used to monitor people. Where protection ends and surveillance begins is a decision, not a technical fact.</p>' }
    ],
    terms: [['Spamming', 'Sending unsolicited messages in bulk.'], ['Hacking', 'Gaining unauthorised access to a computer or network.'], ['Social engineering', 'Manipulating a person into giving up access or information.'], ['Phishing', 'A fraudulent message that imitates a trusted source to steal information.'], ['Virus', 'Malicious code that attaches to files and spreads when they are opened.'], ['Ransomware', 'Malware that encrypts files and demands payment to restore them.'], ['Distributed denial of service (DDoS)', 'An attack that overwhelms a service with traffic from many compromised devices.'], ['Identity theft', 'Using someone else’s personal information to pretend to be them, usually for money.'], ['Anonymity', 'Acting online without revealing who you are.'], ['Trolling', 'Posting to provoke or upset others.'], ['Right to be forgotten', 'A person’s right, in some laws, to have their personal data erased in certain circumstances.']],
    questions: [
      { q: 'Which defence does the most against phishing?', options: [['A firewall', 'A phishing email looks like normal mail and passes straight through. Try it in the model.'], ['Backups', 'Backups help you recover files. They do not stop a password being given away.'], 'Staff training, supported by multi-factor authentication', ['A faster router', 'Speed has nothing to do with it.']], answer: 2, why: 'Phishing works on people. Training stops the click, and a second factor limits the damage if a password is given away.' },
      { q: 'An organisation is hit by ransomware. Which earlier decision lets it recover without paying?', options: ['Keeping regular, separate backups', ['Buying more bandwidth', 'Capacity does not unlock encrypted files.'], ['Using a hub in place of a switch', 'That makes a network less secure, not more.'], ['Turning off multi-factor authentication', 'That removes a protection.']], answer: 0, why: 'With clean copies stored elsewhere, the locked files can be replaced.' },
      { q: 'What is a DDoS attack?', options: [['A message that tricks someone into revealing a password', 'That is phishing.'], ['Malware that locks files for payment', 'That is ransomware.'], 'A flood of traffic from many devices that makes a service unavailable', ['Someone reading your email without permission', 'That is unauthorised access, a form of hacking.']], answer: 2, why: 'Distributed (many sources) denial of service (real users cannot get through).' }
    ],
    inquiry: { prompt: 'When a company loses its customers’ personal data in an attack, who should be held responsible: the attacker, the company, the software maker whose flaw was used, or the staff member who clicked?', consider: ['What could each of them reasonably have done differently, and who had the most power to prevent it?', 'Who actually bears the consequences (the customers whose identities are stolen) and who decides what happens next?', 'Would your answer change if the company was a hospital, or a small charity with no IT staff?'] }
  });
})();
