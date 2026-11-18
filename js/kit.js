/* Kit: helpers for building models out of simple shapes.
   Everything casts and receives shadows and uses a physically based material,
   so plain shapes pick up reflections from the stage's studio lighting. */
(function () {
  'use strict';
  var T = THREE;

  function shadow(m) { m.castShadow = true; m.receiveShadow = true; return m; }

  var K = {
    /* o: any MeshStandardMaterial setting, e.g. { metalness: 1, roughness: 0.3 } */
    mat: function (color, o) {
      var p = { color: color, roughness: 0.62, metalness: 0.05 };
      if (o) Object.keys(o).forEach(function (k) { p[k] = o[k]; });
      return new T.MeshStandardMaterial(p);
    },
    metal: function (color, rough) { return { metalness: 1, roughness: rough === undefined ? 0.32 : rough, color: color }; },

    box: function (w, h, d, color, o) {
      return shadow(new T.Mesh(new T.BoxGeometry(w, h, d), K.mat(color, o)));
    },
    /* Box with rounded corners on its front outline (w by h), d deep, centred. */
    rbox: function (w, h, d, r, color, o) {
      var s = new T.Shape(), x = -w / 2, y = -h / 2;
      s.moveTo(x + r, y);
      s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
      s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
      s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
      var b = Math.min(0.02, d / 4);
      var geo = new T.ExtrudeGeometry(s, { depth: d - 2 * b, bevelEnabled: true, bevelSize: b, bevelThickness: b, bevelSegments: 2, curveSegments: 6 });
      geo.translate(0, 0, -(d - 2 * b) / 2);
      return shadow(new T.Mesh(geo, K.mat(color, o)));
    },
    cyl: function (rTop, rBottom, h, color, seg, o) {
      return shadow(new T.Mesh(new T.CylinderGeometry(rTop, rBottom, h, seg || 24), K.mat(color, o)));
    },
    sphere: function (r, color, seg, o) {
      return shadow(new T.Mesh(new T.SphereGeometry(r, seg || 24, Math.max(10, Math.round((seg || 24) * 0.66))), K.mat(color, o)));
    },
    /* A round tube through a list of [x, y, z] points (cables, pipes). */
    tube: function (points, radius, color, o) {
      var curve = new T.CatmullRomCurve3(points.map(function (p) { return new T.Vector3(p[0], p[1], p[2]); }));
      return shadow(new T.Mesh(new T.TubeGeometry(curve, 24, radius, 8), K.mat(color, o)));
    },
    group: function () { return new T.Group(); },

    /* Position an object and add it to a parent in one call. */
    put: function (obj, x, y, z, parent) {
      obj.position.set(x, y, z);
      if (parent) parent.add(obj);
      return obj;
    },

    /* A line through a list of THREE.Vector3 points. */
    line: function (points, color) {
      return new T.Line(new T.BufferGeometry().setFromPoints(points), new T.LineBasicMaterial({ color: color }));
    },

    /* A soft round floor that fades out at its edge and catches shadows. */
    floor: function (radius, y) {
      var tex = K.tex(256, 256, function (g, w, h) {
        var gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
        gr.addColorStop(0, 'rgba(34,52,64,1)');
        gr.addColorStop(0.55, 'rgba(26,42,53,0.9)');
        gr.addColorStop(1, 'rgba(20,35,46,0)');
        g.fillStyle = gr;
        g.fillRect(0, 0, w, h);
      });
      var m = new T.Mesh(new T.CircleGeometry(radius, 64),
        new T.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.95, metalness: 0, depthWrite: false }));
      m.rotation.x = -Math.PI / 2;
      m.position.y = y || 0;
      m.receiveShadow = true;
      return m;
    },

    /* A texture drawn with the 2D canvas API: draw(ctx, width, height). */
    tex: function (w, h, draw) {
      var c = document.createElement('canvas');
      c.width = w; c.height = h;
      draw(c.getContext('2d'), w, h);
      var t = new T.CanvasTexture(c);
      t.encoding = T.sRGBEncoding;
      t.anisotropy = 4;
      return t;
    },
    /* A flat rectangle showing a texture (labels, circuit boards, stickers). */
    plate: function (w, h, tex, o) {
      var p = { map: tex, roughness: 0.6, metalness: 0.05 };
      if (o) Object.keys(o).forEach(function (k) { p[k] = o[k]; });
      var m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshStandardMaterial(p));
      m.receiveShadow = true;
      return m;
    },

    /* A fan: ring, hub and blades, facing +y. Spin fan.userData.rotor.rotation.y. */
    fan: function (radius, color, blades) {
      var f = new T.Group(), rotor = new T.Group(), n = blades || 9;
      var ring = shadow(new T.Mesh(new T.TorusGeometry(radius, radius * 0.07, 8, 40), K.mat(0x0c0e11, { roughness: 0.5 })));
      ring.rotation.x = Math.PI / 2;
      f.add(ring);
      rotor.add(K.cyl(radius * 0.3, radius * 0.3, radius * 0.16, 0x15181c, 20));
      for (var i = 0; i < n; i++) {
        var pivot = new T.Group();
        var blade = K.box(radius * 0.66, 0.012, radius * 0.34, color || 0x2f363d, { roughness: 0.45 });
        blade.position.x = radius * 0.6;
        blade.rotation.x = 0.45;
        pivot.rotation.y = (i / n) * Math.PI * 2;
        pivot.add(blade);
        rotor.add(pivot);
      }
      f.add(rotor);
      f.userData.rotor = rotor;
      return f;
    },

    /* A flat panel of text drawn on a canvas. Call panel.setText(lines) to change it.
       o: { w, h (world size), size (font px), bg, fg, mono, align, title } */
    text: function (lines, o) {
      var d = { w: 2, h: 1, px: 512, size: 40, bg: '#0d1b24', fg: '#e8f1f5', mono: false, align: 'left', pad: 26, title: '' };
      if (o) Object.keys(o).forEach(function (k) { d[k] = o[k]; });
      var c = document.createElement('canvas');
      c.width = d.px;
      c.height = Math.round(d.px * d.h / d.w);
      var tex = new T.CanvasTexture(c);
      tex.encoding = T.sRGBEncoding;
      var mesh = new T.Mesh(new T.PlaneGeometry(d.w, d.h), new T.MeshBasicMaterial({ map: tex, toneMapped: false }));
      mesh.setText = function (ls) {
        if (typeof ls === 'string') ls = ls.split('\n');
        var g = c.getContext('2d');
        g.fillStyle = d.bg;
        g.fillRect(0, 0, c.width, c.height);
        var y = d.pad;
        g.textBaseline = 'top';
        g.textAlign = d.align;
        var x = d.align === 'center' ? c.width / 2 : d.pad;
        if (d.title) {
          g.fillStyle = '#0f766e';
          g.font = '600 ' + Math.round(d.size * 0.6) + 'px system-ui, sans-serif';
          g.fillText(d.title, x, y);
          y += d.size * 0.95;
        }
        g.fillStyle = d.fg;
        g.font = (d.mono ? '500 ' : '600 ') + d.size + 'px ' + (d.mono ? 'ui-monospace, Menlo, Consolas, monospace' : 'system-ui, sans-serif');
        ls.forEach(function (line) { g.fillText(line, x, y); y += d.size * 1.3; });
        tex.needsUpdate = true;
      };
      mesh.setText(lines);
      return mesh;
    }
  };

  /* Plays a list of steps: a small cube travels from step.from to step.to while the
     info panel lists every step with the current one in bold.
     step: { from: Vector3, to: Vector3, color, msg, after() } */
  K.steps = function (stage, title, steps, done) {
    var cube = K.box(0.28, 0.28, 0.28, 0xffffff, { emissive: 0x555555 });
    stage.root.add(cube);
    function show(current) {
      stage.info('<h3>' + title + '</h3><ol style="margin:0;padding-left:20px">' + steps.map(function (s, i) {
        return '<li>' + (i === current ? '<strong>' + s.msg + '</strong>' : s.msg) + '</li>';
      }).join('') + '</ol>');
    }
    var i = 0;
    (function next() {
      if (i >= steps.length) { stage.root.remove(cube); show(-1); if (done) done(); return; }
      var s = steps[i];
      show(i);
      cube.material.color.setHex(s.color);
      cube.material.emissive.setHex(s.color);
      cube.material.emissiveIntensity = 0.5;
      stage.tween(s.ms || 700, function (k) { cube.position.lerpVectors(s.from, s.to, k); }, function () {
        if (s.after) s.after();
        i++;
        next();
      });
    })();
  };

  window.DSBook.kit = K;
})();
