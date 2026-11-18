/* Stage: one WebGL canvas with orbit controls, HTML labels, click picking,
   tweens and a small control-panel builder. Lessons draw into stage.root.
   It only redraws when something changed, to stay light on Chromebooks. */
(function () {
  'use strict';
  var T = THREE;

  function ease(k) { return k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* Soft gradient behind the model. */
  function backdrop() {
    var c = document.createElement('canvas');
    c.width = c.height = 256;
    var g = c.getContext('2d');
    var gr = g.createRadialGradient(128, 105, 10, 128, 128, 190);
    gr.addColorStop(0, '#2b4a5c');
    gr.addColorStop(0.6, '#152632');
    gr.addColorStop(1, '#0a1319');
    g.fillStyle = gr;
    g.fillRect(0, 0, 256, 256);
    var t = new T.CanvasTexture(c);
    t.encoding = T.sRGBEncoding;
    return t;
  }

  /* A small "photo studio" of light panels, baked into a reflection map so that
     metal and plastic parts have something to reflect. Built once, costs nothing per frame. */
  function studio(renderer) {
    var s = new T.Scene();
    s.add(new T.Mesh(new T.BoxGeometry(24, 14, 24), new T.MeshBasicMaterial({ color: 0x1c232a, side: T.BackSide })));
    function panel(x, y, z, w, h, color, gain) {
      var m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: color, side: T.DoubleSide }));
      m.material.color.multiplyScalar(gain);
      m.position.set(x, y, z);
      m.lookAt(0, 0, 0);
      s.add(m);
    }
    panel(0, 6.8, 0, 12, 12, 0xffffff, 2.6);
    panel(-11, 2, 5, 7, 9, 0xcfe3ff, 2.2);
    panel(11, 1, -4, 7, 9, 0xffe6cc, 2.0);
    panel(0, 1, 11.5, 10, 5, 0xffffff, 1.2);
    var pm = new T.PMREMGenerator(renderer);
    var tex = pm.fromScene(s, 0.03).texture;
    pm.dispose();
    return tex;
  }

  function Stage(els) {
    // els: { wrap, labels, info, controls }
    var self = this;
    this.els = els;

    var r = this.renderer = new T.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    r.outputEncoding = T.sRGBEncoding;
    this.canvas = r.domElement;
    this.canvas.tabIndex = 0;
    this.canvas.setAttribute('role', 'application');
    this.canvas.setAttribute('aria-label', '3D model. Arrow keys rotate, plus and minus zoom, zero resets the view.');
    els.wrap.insertBefore(this.canvas, els.wrap.firstChild);

    r.toneMapping = T.ACESFilmicToneMapping;
    r.toneMappingExposure = 1.0;
    r.shadowMap.enabled = true;
    r.shadowMap.type = T.PCFSoftShadowMap;
    r.shadowMap.autoUpdate = false; // redrawn only when the model changes

    this.scene = new T.Scene();
    this.scene.background = backdrop();
    this.scene.environment = studio(r);
    this.camera = new T.PerspectiveCamera(40, 1, 0.05, 200);
    this.scene.add(new T.HemisphereLight(0xdfeaf5, 0x2a3540, 0.5));
    var sun = this.sun = new T.DirectionalLight(0xfff3e2, 1.25);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.bias = -0.0006;
    sun.shadow.normalBias = 0.03;
    sun.shadow.radius = 3;
    this.scene.add(sun, sun.target);
    var fill = new T.DirectionalLight(0xa9c8ff, 0.35);
    fill.position.set(-6, 3, 5);
    this.scene.add(fill);
    this.root = new T.Group();
    this.scene.add(this.root);

    this.view = { target: new T.Vector3(), radius: 8, theta: 0.6, phi: 1.1, minR: 1, maxR: 30, maxPhi: 1.52 };
    this.home = null;
    this.tweens = [];
    this.labelList = [];
    this.pickables = [];
    this.onPick = null;
    this.onFrame = null;
    this.animating = false;
    this.dirty = true;
    this._hl = null;
    this.shadowDirty = true;
    this._makeLeaders();
    this._ray = new T.Raycaster();
    this._v = new T.Vector3();

    this._bindInput();

    if (window.ResizeObserver) {
      new ResizeObserver(function () { self._resize(); }).observe(els.wrap);
    } else {
      window.addEventListener('resize', function () { self._resize(); });
    }
    this._resize();

    this._last = performance.now();
    requestAnimationFrame(function tick(now) {
      requestAnimationFrame(tick);
      self._frame(now);
    });

    this.ui = makeUI(this);
  }

  /* ---------- camera ---------- */

  Stage.prototype.setView = function (v, asHome) {
    var cur = this.view;
    if (v.target) cur.target.set(v.target[0], v.target[1], v.target[2]);
    ['radius', 'theta', 'phi', 'minR', 'maxR', 'maxPhi'].forEach(function (k) {
      if (v[k] !== undefined) cur[k] = v[k];
    });
    if (asHome !== false) {
      this.home = this._snapshot();
      this.renderer.toneMappingExposure = v.exposure || 1.0;
      // Aim the key light and fit its shadow to the scene. v.shadow = half-width to cover.
      var size = v.shadow || cur.radius * 0.8, sun = this.sun, cam = sun.shadow.camera;
      sun.target.position.copy(cur.target);
      sun.position.copy(cur.target).add(new T.Vector3(0.5, 1, 0.65).normalize().multiplyScalar(size * 3));
      cam.left = -size; cam.right = size; cam.top = size; cam.bottom = -size;
      cam.near = 0.1; cam.far = size * 7;
      cam.updateProjectionMatrix();
      this.shadowDirty = true;
    }
    this.dirty = true;
  };

  Stage.prototype._snapshot = function () {
    var v = this.view;
    return { target: v.target.toArray(), radius: v.radius, theta: v.theta, phi: v.phi };
  };

  Stage.prototype.flyTo = function (v, ms) {
    var cur = this.view, from = this._snapshot();
    var to = {
      target: v.target || from.target,
      radius: v.radius !== undefined ? v.radius : from.radius,
      theta: v.theta !== undefined ? v.theta : from.theta,
      phi: v.phi !== undefined ? v.phi : from.phi
    };
    var a = new T.Vector3().fromArray(from.target), b = new T.Vector3().fromArray(to.target);
    if (this._fly) this._fly.dead = true;
    this._fly = this.tween(ms || 700, function (k) {
      cur.target.lerpVectors(a, b, k);
      cur.radius = from.radius + (to.radius - from.radius) * k;
      cur.theta = from.theta + (to.theta - from.theta) * k;
      cur.phi = from.phi + (to.phi - from.phi) * k;
    });
  };

  Stage.prototype.resetView = function () { if (this.home) this.flyTo(this.home, 500); };

  Stage.prototype.zoom = function (factor) {
    var v = this.view;
    v.radius = clamp(v.radius * factor, v.minR, v.maxR);
    this.dirty = true;
  };

  Stage.prototype.rotate = function (dTheta, dPhi) {
    var v = this.view;
    v.theta -= dTheta;
    v.phi = clamp(v.phi - dPhi, 0.12, v.maxPhi);
    this.dirty = true;
  };

  Stage.prototype._applyCamera = function () {
    var v = this.view, s = Math.sin(v.phi);
    this.camera.position.set(
      v.target.x + v.radius * s * Math.sin(v.theta),
      v.target.y + v.radius * Math.cos(v.phi),
      v.target.z + v.radius * s * Math.cos(v.theta)
    );
    this.camera.lookAt(v.target);
  };

  /* ---------- input ---------- */

  Stage.prototype._bindInput = function () {
    var self = this, c = this.canvas;
    var pts = {}, count = 0, start = null, moved = 0, pinch = 0;

    function dist() {
      var k = Object.keys(pts);
      return Math.hypot(pts[k[0]].x - pts[k[1]].x, pts[k[0]].y - pts[k[1]].y);
    }

    c.addEventListener('pointerdown', function (e) {
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      count = Object.keys(pts).length;
      try { c.setPointerCapture(e.pointerId); } catch (err) { /* synthetic events */ }
      if (count === 1) { start = { x: e.clientX, y: e.clientY }; moved = 0; }
      if (count === 2) pinch = dist();
    });

    c.addEventListener('pointermove', function (e) {
      var p = pts[e.pointerId];
      if (!p) { self._hover(e); return; }
      var dx = e.clientX - p.x, dy = e.clientY - p.y;
      p.x = e.clientX; p.y = e.clientY;
      if (count === 1) {
        moved += Math.abs(dx) + Math.abs(dy);
        if (moved > 5) self.rotate(dx * 0.008, dy * 0.008);
      } else if (count === 2) {
        var d = dist();
        if (pinch > 0 && d > 0) self.zoom(pinch / d);
        pinch = d;
        moved = 99;
      }
    });

    function up(e) {
      if (!pts[e.pointerId]) return;
      delete pts[e.pointerId];
      count = Object.keys(pts).length;
      if (count === 0 && moved <= 5 && e.type === 'pointerup') self._pickAt(e.clientX, e.clientY);
    }
    c.addEventListener('pointerup', up);
    c.addEventListener('pointercancel', up);

    // Trackpad pinch arrives as ctrl+wheel. A plain two-finger scroll is left
    // alone so the page still scrolls when the pointer is over the model.
    c.addEventListener('wheel', function (e) {
      if (!e.ctrlKey) return;
      e.preventDefault();
      self.zoom(Math.exp(e.deltaY * 0.01));
    }, { passive: false });

    c.addEventListener('keydown', function (e) {
      var step = 0.12, used = true;
      if (e.key === 'ArrowLeft') self.rotate(step, 0);
      else if (e.key === 'ArrowRight') self.rotate(-step, 0);
      else if (e.key === 'ArrowUp') self.rotate(0, step);
      else if (e.key === 'ArrowDown') self.rotate(0, -step);
      else if (e.key === '+' || e.key === '=') self.zoom(0.87);
      else if (e.key === '-' || e.key === '_') self.zoom(1.15);
      else if (e.key === '0') self.resetView();
      else used = false;
      if (used) e.preventDefault();
    });
  };

  Stage.prototype._findPick = function (x, y) {
    if (!this.pickables.length) return null;
    var rect = this.canvas.getBoundingClientRect();
    var ndc = new T.Vector2(((x - rect.left) / rect.width) * 2 - 1, -((y - rect.top) / rect.height) * 2 + 1);
    this._ray.setFromCamera(ndc, this.camera);
    var hits = this._ray.intersectObjects(this.pickables, true);
    for (var i = 0; i < hits.length; i++) {
      var o = hits[i].object;
      if (!o.visible) continue;
      while (o && o.userData.pickId === undefined) o = o.parent;
      if (o && o.visible) return o;
    }
    return null;
  };

  Stage.prototype._pickAt = function (x, y) {
    var o = this._findPick(x, y);
    if (o && this.onPick) { this.onPick(o.userData.pickId, o); this.invalidate(); }
  };

  Stage.prototype._hover = function (e) {
    var now = performance.now();
    if (now - (this._hoverAt || 0) < 80) return;
    this._hoverAt = now;
    this.canvas.style.cursor = this._findPick(e.clientX, e.clientY) ? 'pointer' : 'grab';
  };

  /* ---------- scene helpers ---------- */

  /* Make an object clickable. Materials are cloned so it can be highlighted alone. */
  Stage.prototype.pickable = function (obj, id) {
    obj.userData.pickId = id;
    obj.traverse(function (m) { if (m.isMesh) m.material = m.material.clone(); });
    this.pickables.push(obj);
    return obj;
  };

  Stage.prototype.highlight = function (obj) {
    function paint(o, on) {
      o.traverse(function (m) {
        if (!m.isMesh || !m.material.emissive) return;
        if (on) {
          if (m.userData.em0 === undefined) m.userData.em0 = m.material.emissive.getHex();
          m.material.emissive.setHex(0x0f4a52);
        } else if (m.userData.em0 !== undefined) {
          m.material.emissive.setHex(m.userData.em0);
        }
      });
    }
    if (this._hl) paint(this._hl, false);
    this._hl = obj || null;
    if (obj) paint(obj, true);
    this.dirty = true;
  };

  /* A text label that follows a 3D object or point. */
  Stage.prototype.label = function (text, target, opts) {
    opts = opts || {};
    var el = document.createElement('div');
    el.className = 'label3d' + (opts.cls ? ' ' + opts.cls : '');
    el.textContent = text;
    this.els.labels.appendChild(el);
    var self = this, NS = 'http://www.w3.org/2000/svg', line = null, dot = null;
    if (opts.offset) {
      el.classList.add('callout');
      line = document.createElementNS(NS, 'line');
      dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('r', 3);
      this._leaders.appendChild(line);
      this._leaders.appendChild(dot);
    }
    var L = {
      el: el, target: target, dy: opts.dy || 0, visible: true, offset: opts.offset, line: line, dot: dot,
      set: function (t) { el.textContent = t; },
      show: function (on) { L.visible = on; self.dirty = true; }
    };
    this.labelList.push(L);
    this.dirty = true;
    return L;
  };

  Stage.prototype._makeLeaders = function () {
    this._leaders = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this._leaders.setAttribute('class', 'leaders');
    this.els.labels.appendChild(this._leaders);
  };

  Stage.prototype._updateLabels = function () {
    var w = this.els.wrap.clientWidth, h = this.els.wrap.clientHeight, v = this._v;
    for (var i = 0; i < this.labelList.length; i++) {
      var L = this.labelList[i], t = L.target, shown = L.visible;
      if (shown) {
        if (t.isObject3D) {
          t.getWorldPosition(v);
          for (var o = t; o; o = o.parent) if (!o.visible) { shown = false; break; }
        } else v.copy(t);
        v.y += L.dy;
        v.project(this.camera);
        if (v.z > 1 || Math.abs(v.x) > 1.05 || Math.abs(v.y) > 1.05) shown = false;
      }
      var px = (v.x * 0.5 + 0.5) * w, py = (-v.y * 0.5 + 0.5) * h;
      if (shown && L.offset) {
        var lx = px + L.offset[0], ly = py + L.offset[1];
        L.el.style.display = '';
        L.el.style.transform = 'translate(-50%,-50%) translate(' + lx.toFixed(1) + 'px,' + ly.toFixed(1) + 'px)';
        L.line.setAttribute('x1', px); L.line.setAttribute('y1', py);
        L.line.setAttribute('x2', lx); L.line.setAttribute('y2', ly);
        L.dot.setAttribute('cx', px); L.dot.setAttribute('cy', py);
        L.line.style.display = L.dot.style.display = '';
      } else if (shown) {
        L.el.style.display = '';
        L.el.style.transform = 'translate(-50%,-100%) translate(' + px.toFixed(1) + 'px,' + py.toFixed(1) + 'px)';
      } else {
        L.el.style.display = 'none';
        if (L.line) L.line.style.display = L.dot.style.display = 'none';
      }
    }
  };

  /* Run fn(k) with k going 0..1 over ms milliseconds. */
  Stage.prototype.tween = function (ms, fn, done) {
    var tw = { t0: performance.now(), ms: this.reduced ? 1 : Math.max(1, ms), fn: fn, done: done, dead: false };
    this.tweens.push(tw);
    return tw;
  };

  Stage.prototype.info = function (html) { this.els.info.innerHTML = html; };
  Stage.prototype.invalidate = function () { this.dirty = true; this.shadowDirty = true; };

  /* Remove everything a scene added, ready for the next scene. */
  Stage.prototype.clear = function () {
    var root = this.root;
    root.traverse(function (o) {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        if (o.material.map) o.material.map.dispose();
        o.material.dispose();
      }
    });
    while (root.children.length) root.remove(root.children[0]);
    this.els.labels.innerHTML = '';
    this._makeLeaders();
    this.els.controls.innerHTML = '';
    this.els.controls.className = 'scene-controls';
    this.els.info.className = 'scene-info';
    this.els.info.innerHTML = '';
    this.labelList = [];
    this.tweens = [];
    this.pickables = [];
    this.onPick = null;
    this.onFrame = null;
    this.animating = false;
    this._hl = null;
    this.dirty = true;
    this.shadowDirty = true;
  };

  /* ---------- loop ---------- */

  Stage.prototype._resize = function () {
    var w = this.els.wrap.clientWidth, h = this.els.wrap.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.dirty = true;
  };

  Stage.prototype._frame = function (now) {
    var dt = Math.min(0.05, (now - this._last) / 1000);
    this._last = now;

    if (this.tweens.length) {
      var list = this.tweens.slice();
      for (var i = 0; i < list.length; i++) {
        var tw = list[i];
        if (tw.dead) continue;
        var k = (now - tw.t0) / tw.ms;
        tw.fn(ease(clamp(k, 0, 1)));
        if (k >= 1) { tw.dead = true; if (tw.done) tw.done(); }
      }
      this.tweens = this.tweens.filter(function (t) { return !t.dead; });
      this.dirty = true;
      this.shadowDirty = true;
    }
    if (this.animating && this.onFrame && !this.reduced) { this.onFrame(dt, now / 1000); this.dirty = true; }

    if (!this.dirty) return;
    this.dirty = false;
    if (this.shadowDirty) { this.renderer.shadowMap.needsUpdate = true; this.shadowDirty = false; }
    this._applyCamera();
    this.renderer.render(this.scene, this.camera);
    this._updateLabels();
  };

  /* ---------- control panel builder ---------- */

  function makeUI(stage) {
    var uid = 0;
    function host() { return stage.els.controls; }
    function row(labelText) {
      var d = document.createElement('div');
      d.className = 'ctl-row';
      if (labelText) {
        var s = document.createElement('span');
        s.className = 'ctl-label';
        s.textContent = labelText;
        d.appendChild(s);
      }
      host().appendChild(d);
      return d;
    }
    function wrap(fn) { return function () { var r = fn.apply(null, arguments); stage.invalidate(); return r; }; }

    return {
      /* A single action button. */
      button: function (label, fn, parentRow) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'btn';
        b.textContent = label;
        b.addEventListener('click', wrap(fn));
        (parentRow || row()).appendChild(b);
        return b;
      },
      row: row,
      /* A set of buttons where one is selected. items: [{id, label}] */
      choices: function (label, items, onSelect, selected) {
        var d = row(label), btns = {};
        d.setAttribute('role', 'group');
        if (label) d.setAttribute('aria-label', label);
        function select(id, silent) {
          Object.keys(btns).forEach(function (k) { btns[k].setAttribute('aria-pressed', k === String(id) ? 'true' : 'false'); });
          if (!silent) onSelect(id);
          stage.invalidate();
        }
        items.forEach(function (it) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'btn chip';
          b.textContent = it.label;
          b.setAttribute('aria-pressed', 'false');
          b.addEventListener('click', function () { select(it.id); });
          d.appendChild(b);
          btns[it.id] = b;
        });
        if (selected !== undefined) select(selected, true);
        return { select: select, buttons: btns, el: d };
      },
      /* A labelled slider. o: {min, max, step, value, format} */
      slider: function (label, o, fn) {
        var d = row(), id = 'sl' + (++uid);
        var l = document.createElement('label');
        l.className = 'ctl-label';
        l.htmlFor = id;
        l.textContent = label;
        var input = document.createElement('input');
        input.type = 'range';
        input.id = id;
        input.min = o.min; input.max = o.max; input.step = o.step || 1; input.value = o.value;
        var out = document.createElement('output');
        out.htmlFor = id;
        var fmt = o.format || function (v) { return v; };
        function fire() {
          var v = parseFloat(input.value);
          out.textContent = fmt(v);
          input.setAttribute('aria-valuetext', fmt(v));
          fn(v);
          stage.invalidate();
        }
        input.addEventListener('input', fire);
        d.appendChild(l); d.appendChild(input); d.appendChild(out);
        out.textContent = fmt(parseFloat(input.value));
        return { input: input, set: function (v, silent) { input.value = v; if (silent) out.textContent = fmt(v); else fire(); } };
      }
    };
  }

  window.DSBook.Stage = Stage;
})();
