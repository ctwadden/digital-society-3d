/* Shell: turns a lesson definition into a page. It never needs editing to add a lesson.
   Order: load the lesson file, write the text (so it is readable at once),
   then load Three.js and start the 3D stage. */
(function () {
  'use strict';
  var B = window.DSBook;
  var THREE_CDN = 'https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js';
  var THREE_LOCAL = 'vendor/three.min.js';

  var $ = function (id) { return document.getElementById(id); };
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      // The version tag makes browsers fetch fresh files after an update.
      s.src = /^https?:/.test(src) ? src : src + '?v=' + B.version;
      s.onload = resolve;
      s.onerror = function () { s.remove(); reject(new Error('Could not load ' + src)); };
      document.head.appendChild(s);
    });
  }

  var id = new URLSearchParams(location.search).get('id');
  var all = B.allLessons();
  var index = all.findIndex(function (l) { return l.id === id; });
  var entry = all[index];
  var text = $('text');

  if (!entry) {
    text.innerHTML = '<h1>Lesson not found</h1><p>There is no lesson called “' +
      String(id).replace(/[<>&]/g, '') + '”. <a href="index.html">Back to the contents page</a>.</p>';
    return;
  }

  loadScript(entry.file).then(function () {
    var lesson = B.lessons[entry.id];
    if (!lesson) throw new Error(entry.file + ' did not define lesson ' + entry.id);
    renderText(lesson);
    return loadScript(THREE_CDN)
      .catch(function () { return loadScript(THREE_LOCAL); })
      .then(function () { return loadScript('js/stage.js'); })
      .then(function () { return loadScript('js/kit.js'); })
      .then(function () { startStage(lesson); });
  }).catch(function (err) {
    console.error(err);
    var box = el('div', 'stage-fail', 'The 3D model could not start on this device. The lesson text, the text versions of the models and the questions below still work.');
    $('stage').appendChild(box);
  });

  /* ---------- text column ---------- */

  function renderText(lesson) {
    var ch = entry.chapter;
    document.title = lesson.title + ' | ' + B.title;
    $('crumb').textContent = ch.id + ' ' + ch.title + '  ›  ' + lesson.title;

    text.appendChild(el('div', 'kicker', entry.id.toUpperCase() + ' · ' + ch.title));
    text.appendChild(el('h1', '', lesson.title));
    if (lesson.question) text.appendChild(el('p', 'question', lesson.question));
    if (lesson.intro) text.appendChild(el('p', '', lesson.intro));

    if (lesson.targets) {
      var t = el('div', 'targets', '<h2>By the end you can</h2>');
      var ul = el('ul');
      lesson.targets.forEach(function (x) { ul.appendChild(el('li', '', x)); });
      t.appendChild(ul);
      text.appendChild(t);
    }

    // Predict before interacting: no right or wrong here, the model settles it.
    if (lesson.predict) {
      var p = el('div', 'predict', '<h2>Predict first</h2>');
      var fs = el('fieldset');
      fs.appendChild(el('legend', '', lesson.predict.q));
      var after = el('p', 'after');
      after.setAttribute('role', 'status');
      lesson.predict.options.forEach(function (o) {
        var label = el('label', 'opt');
        var input = document.createElement('input');
        input.type = 'radio';
        input.name = 'predict';
        input.addEventListener('change', function () { after.textContent = lesson.predict.after; });
        label.appendChild(input);
        label.appendChild(el('span', '', o));
        fs.appendChild(label);
      });
      p.appendChild(fs);
      p.appendChild(after);
      text.appendChild(p);
    }

    (lesson.sections || []).forEach(function (s) {
      text.appendChild(el('h2', '', s.heading));
      text.appendChild(el('div', '', s.html));
    });

    // Non-3D equivalents of each model.
    var alts = lesson.scenes.filter(function (s) { return s.textVersion; });
    if (alts.length) {
      text.appendChild(el('h2', '', 'Text versions of the 3D models'));
      text.appendChild(el('p', '', 'Everything the models show, written out. Use these if the 3D view is not available or not useful to you.'));
      alts.forEach(function (s) {
        var d = el('details', 'alt');
        d.appendChild(el('summary', '', s.title));
        d.appendChild(el('div', '', s.textVersion));
        text.appendChild(d);
      });
    }

    if (lesson.terms) {
      text.appendChild(el('h2', '', 'Key terms'));
      var dl = el('dl', 'terms');
      lesson.terms.forEach(function (x) {
        dl.appendChild(el('dt', '', x[0]));
        dl.appendChild(el('dd', '', x[1]));
      });
      text.appendChild(dl);
    }

    if (lesson.questions) renderQuiz(lesson);

    if (lesson.inquiry) {
      var q = el('section', 'inquiry');
      q.appendChild(el('h2', '', 'Inquiry: people and communities'));
      q.appendChild(el('p', 'prompt', lesson.inquiry.prompt));
      if (lesson.inquiry.consider) {
        var ul2 = el('ul');
        lesson.inquiry.consider.forEach(function (x) { ul2.appendChild(el('li', '', x)); });
        q.appendChild(ul2);
      }
      text.appendChild(q);
    }

    var pager = el('nav', 'pager');
    pager.setAttribute('aria-label', 'Other lessons');
    var prev = all[index - 1], next = all[index + 1];
    pager.appendChild(prev ? link(prev, '← ' + prev.title) : el('span'));
    pager.appendChild(next ? link(next, next.title + ' →') : el('a', '', 'Back to contents'));
    if (!next) pager.lastChild.href = 'index.html';
    text.appendChild(pager);
  }

  function link(l, label) {
    var a = el('a', '', label);
    a.href = 'lesson.html?id=' + encodeURIComponent(l.id);
    return a;
  }

  function renderQuiz(lesson) {
    text.appendChild(el('h2', '', 'Check yourself'));
    var results = lesson.questions.map(function () { return null; });
    var score = el('p', 'score');
    score.setAttribute('role', 'status');

    lesson.questions.forEach(function (q, qi) {
      var fs = el('fieldset', 'q');
      fs.appendChild(el('legend', '', (qi + 1) + '. ' + q.q));
      var fb = el('p', 'fb');
      fb.setAttribute('role', 'status');
      q.options.forEach(function (opt, oi) {
        // An option is "text" or ["text", "feedback if this wrong answer is chosen"].
        var label = el('label', 'opt');
        var input = document.createElement('input');
        input.type = 'radio';
        input.name = 'q' + qi;
        input.addEventListener('change', function () {
          var right = oi === q.answer;
          fs.querySelectorAll('.opt').forEach(function (o) { o.classList.remove('right', 'wrong'); });
          label.classList.add(right ? 'right' : 'wrong');
          fb.className = 'fb ' + (right ? 'good' : 'bad');
          fb.textContent = right
            ? 'Correct. ' + q.why
            : 'Not quite. ' + (Array.isArray(opt) && opt[1] ? opt[1] : 'Look at the model again and have another go.');
          if (results[qi] === null) results[qi] = right; // first attempt counts
          var done = results.filter(function (r) { return r !== null; }).length;
          var correct = results.filter(function (r) { return r === true; }).length;
          score.textContent = 'First-try score: ' + correct + ' of ' + results.length +
            (done < results.length ? ' (' + (results.length - done) + ' still to answer)' : '');
          if (done === results.length) B.setScore(lesson.id, { correct: correct, total: results.length });
        });
        label.appendChild(input);
        label.appendChild(el('span', '', Array.isArray(opt) ? opt[0] : opt));
        fs.appendChild(label);
      });
      fs.appendChild(fb);
      text.appendChild(fs);
    });
    text.appendChild(score);
  }

  /* ---------- 3D stage ---------- */

  function startStage(lesson) {
    var stage;
    try {
      stage = new B.Stage({ wrap: $('stage'), labels: $('labels'), info: $('info'), controls: $('controls') });
    } catch (err) {
      throw new Error('WebGL is not available: ' + err.message);
    }

    $('zoom-in').addEventListener('click', function () { stage.zoom(0.8); });
    $('zoom-out').addEventListener('click', function () { stage.zoom(1.25); });
    $('reset').addEventListener('click', function () { stage.resetView(); });

    var motionBtn = $('motion');
    function setReduced(on) {
      stage.reduced = on;
      motionBtn.textContent = on ? 'Motion: off' : 'Motion: on';
      motionBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      motionBtn.setAttribute('aria-label', on ? 'Animations are off. Turn animations on' : 'Animations are on. Turn animations off');
    }
    setReduced(!!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches));
    motionBtn.addEventListener('click', function () { setReduced(!stage.reduced); });

    var tabs = $('tabs'), buttons = [];
    function show(i) {
      var s = lesson.scenes[i];
      stage.clear();
      buttons.forEach(function (b, bi) { b.setAttribute('aria-pressed', bi === i ? 'true' : 'false'); });
      $('hint').textContent = s.hint || 'Drag to rotate. Pinch or use + and − to zoom. Click a part to select it.';
      s.build(stage, B.kit);
      stage.invalidate();
    }
    lesson.scenes.forEach(function (s, i) {
      var b = el('button', '', s.title);
      b.type = 'button';
      b.addEventListener('click', function () { show(i); });
      tabs.appendChild(b);
      buttons.push(b);
    });
    if (lesson.scenes.length < 2) tabs.hidden = true;
    // lesson.html?id=3.3b&scene=2 opens straight on the second model (used by slide links).
    var q = new URLSearchParams(location.search);
    if (q.get('shot')) document.body.classList.add('shot');   // model only, for taking pictures
    stage.demo = !!q.get('demo');                              // scenes may open in their most useful state
    var first = parseInt(new URLSearchParams(location.search).get('scene'), 10) || 1;
    show(Math.max(0, Math.min(lesson.scenes.length - 1, first - 1)));

    B.stage = stage; // handy when testing from the console
  }
})();
