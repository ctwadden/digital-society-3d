/* 3.3C Uses and forms of computer coding.
   Two models: a program translated from a high-level language to machine code, and eight bits to flip. */
(function () {
  'use strict';

  /* The instruction names and binary patterns are invented for teaching.
     Every real processor family has its own instruction set. */
  var PROGRAMS = [
    {
      id: 'add', label: 'Add two numbers',
      high: ['total = price + tax'],
      asm: ['LOAD   price', 'ADD    tax', 'STORE  total'],
      bin: ['0001 0100', '0011 0101', '0010 0110']
    },
    {
      id: 'if', label: 'Make a decision',
      high: ['if age >= 18:', '    allow_entry()'],
      asm: ['LOAD     age', 'COMPARE  18', 'JUMP_LT  skip', 'CALL     allow'],
      bin: ['0001 0111', '0101 0010', '0110 1001', '0111 1100']
    },
    {
      id: 'loop', label: 'Repeat something',
      high: ['repeat 3 times:', '    beep()'],
      asm: ['SET      count 3', 'CALL     beep', 'SUB      count 1', 'JUMP_NZ  back'],
      bin: ['1000 0011', '0111 1010', '0100 0001', '0110 0001']
    }
  ];

  var PARTS = {
    source: ['High-level language', 'Written for people. It uses words and symbols close to English and maths, one line can do a lot, and the same program can be translated for different kinds of computer. Examples: Python, Java, JavaScript, C#.'],
    compiler: ['Compiler', 'A program that translates a whole high-level program into machine code and saves the result as a file that can be run later. The programmer never has to write binary.'],
    asm: ['Assembly language', 'A low-level language with one short word for each processor instruction. People can read it, but it is tied to one type of processor and takes many lines to do anything. It is used when code must be very fast or must control hardware directly.'],
    machine: ['Machine code', 'The only form a processor can carry out directly: instructions stored as binary numbers. It is specific to one family of processor, which is why an app built for one kind of chip will not run on another without being translated again.'],
    cpu: ['CPU', 'Fetches machine-code instructions one at a time and carries them out. It has no idea what the original program looked like.']
  };

  function buildTranslate(stage, K) {
    var T = THREE, g = stage.root, V = T.Vector3;
    stage.setView({ target: [0.1, 2.0, 0], radius: 11.2, theta: 0.1, phi: 1.36, minR: 5, maxR: 26, shadow: 9, exposure: 0.9 });
    g.add(K.floor(12, 0));

    function panel(title, w, h, x, y, ry, size) {
      var grp = K.group();
      grp.add(K.rbox(w + 0.2, h + 0.2, 0.12, 0.1, 0x15181c, { metalness: 0.5, roughness: 0.4 }));
      var txt = K.text([''], { w: w, h: h, size: size || 34, bg: '#0b1620', fg: '#e8f1f5', mono: true, title: title });
      txt.position.z = 0.065;
      grp.add(txt);
      K.put(K.box(0.12, y - h / 2, 0.12, 0x7b8794, K.metal(0x7b8794, 0.4)), 0, -(h / 2 + (y - h / 2) / 2), -0.05, grp);
      grp.position.set(x, y, 0);
      grp.rotation.y = ry;
      g.add(grp);
      grp.userData.txt = txt;
      return grp;
    }

    var src = panel('HIGH-LEVEL LANGUAGE (for people)', 3.4, 1.7, -4.6, 1.9, 0.3);
    var asm = panel('ASSEMBLY LANGUAGE (one word per instruction)', 3.6, 1.9, 0, 3.9, 0, 30);
    var mac = panel('MACHINE CODE (for the processor)', 3.4, 1.9, 4.6, 1.9, -0.3);

    // The compiler: a machine with an intake, an outlet and two gears.
    var comp = K.group();
    comp.add(K.rbox(2.0, 1.5, 1.4, 0.15, 0x0f766e, { metalness: 0.5, roughness: 0.4 }));
    K.put(K.box(0.5, 0.5, 0.9, 0x0b0d10), -1.02, 0.1, 0, comp);
    K.put(K.box(0.5, 0.5, 0.9, 0x0b0d10), 1.02, 0.1, 0, comp);
    var gears = [];
    [[-0.45, 0.3], [0.4, -0.05]].forEach(function (p, i) {
      var gear = K.group();
      var wheel = K.cyl(0.36, 0.36, 0.1, 0xd9a930, 24, K.metal(0xd9a930, 0.3));
      wheel.rotation.x = Math.PI / 2;
      gear.add(wheel);
      for (var t = 0; t < 8; t++) {
        var tooth = K.box(0.14, 0.14, 0.1, 0xd9a930, K.metal(0xd9a930, 0.3));
        tooth.position.set(Math.cos(t * Math.PI / 4) * 0.4, Math.sin(t * Math.PI / 4) * 0.4, 0);
        tooth.rotation.z = t * Math.PI / 4;
        gear.add(tooth);
      }
      gear.userData.dir = i ? -1 : 1;
      K.put(gear, p[0], p[1], 0.74, comp);
      gears.push(gear);
    });
    K.put(comp, 0, 0.95, 0, g);
    K.put(K.box(2.4, 0.2, 1.8, 0x2b323a, { metalness: 0.5, roughness: 0.45 }), 0, 0.1, 0, g);

    // The processor that finally runs the code.
    var cpu = K.group();
    cpu.add(K.box(2.0, 0.1, 1.6, 0x0e3b29, { roughness: 0.6 }));
    var chip = K.rbox(0.9, 0.9, 0.16, 0.08, 0xcfd4d9, K.metal(0xcfd4d9, 0.3));
    chip.rotation.x = -Math.PI / 2;
    K.put(chip, 0, 0.13, 0, cpu);
    K.put(cpu, 4.4, 0.05, 2.6, g);

    var objs = { source: src, compiler: comp, asm: asm, machine: mac, cpu: cpu };
    Object.keys(objs).forEach(function (k) { stage.pickable(objs[k], k); });
    stage.label('Compiler', comp, { dy: 0.95 });
    stage.label('CPU', cpu, { dy: 0.5 });

    var prog = PROGRAMS[0], compiled = false, busy = false, spin = 0;

    function draw() {
      src.userData.txt.setText(prog.high);
      asm.userData.txt.setText(compiled ? prog.asm : ['', '  (compile to see)']);
      mac.userData.txt.setText(compiled ? prog.bin : ['', '  (not compiled yet)']);
      stage.invalidate();
    }

    stage.onFrame = function (dt) {
      if (spin <= 0) return;
      spin -= dt;
      gears.forEach(function (gr) { gr.rotation.z += dt * 4 * gr.userData.dir; });
      if (spin <= 0) stage.animating = false;
    };

    function select(id) {
      stage.highlight(objs[id]);
      picker.select(id, true);
      stage.info('<h3>' + PARTS[id][0] + '</h3><p>' + PARTS[id][1] + '</p>');
    }

    stage.ui.choices('Program', PROGRAMS.map(function (p) { return { id: p.id, label: p.label }; }), function (id) {
      if (busy) return;
      prog = PROGRAMS.filter(function (p) { return p.id === id; })[0];
      compiled = false;
      draw();
      stage.info('<h3>' + prog.label + '</h3><p>Read the high-level version. <strong>Predict:</strong> how many processor instructions will this need? Then compile it and count.</p>');
    }, 'add');
    var picker = stage.ui.choices('Explain', [
      { id: 'source', label: 'High-level' }, { id: 'compiler', label: 'Compiler' }, { id: 'asm', label: 'Assembly' },
      { id: 'machine', label: 'Machine code' }, { id: 'cpu', label: 'CPU' }
    ], select);

    var go = stage.ui.button('Compile and run', function () {
      if (busy) return;
      busy = true; compiled = false; draw();
      stage.highlight(null);
      spin = 3; stage.animating = true;
      var A = new V(-4.4, 1.9, 0.3), B = new V(-1.0, 1.05, 0), C = new V(1.0, 1.05, 0), D = new V(4.4, 1.9, 0.3), E = new V(4.4, 0.5, 2.6);
      K.steps(stage, 'Compiling: ' + prog.label.toLowerCase(), [
        { from: A, to: B, color: 0x60a5fa, msg: 'The compiler reads the whole program, written in a high-level language.' },
        { from: B, to: C, color: 0xfacc15, msg: 'It breaks each line into the small steps a processor can do. Assembly language shows those steps as words.', after: function () { asm.userData.txt.setText(prog.asm); } },
        { from: C, to: D, color: 0xf97316, msg: 'It writes each step as machine code: a binary number. ' + prog.high.length + ' line' + (prog.high.length > 1 ? 's' : '') + ' became ' + prog.bin.length + ' instructions.', after: function () { compiled = true; draw(); } },
        { from: D, to: E, color: 0x4ade80, msg: 'The CPU fetches and carries out the machine code. It never sees the words you wrote.', after: function () { stage.highlight(cpu); } }
      ], function () { busy = false; });
    });
    go.classList.add('primary');

    stage.onPick = select;
    draw();
    stage.info('<h3>From your words to the processor’s numbers</h3><p>Choose a program, predict how many instructions it will become, then press <strong>Compile and run</strong>.</p>' +
      '<p class="note">Simplified: the instruction names and binary patterns are invented for this model. Real processors each have their own, and real programs become thousands of instructions.</p>');
  }

  /* ================= Bits ================= */

  function buildBits(stage, K) {
    var T = THREE, g = stage.root;
    stage.setView({ target: [0, 1.9, 0], radius: 11.5, theta: 0.0, phi: 1.3, minR: 5, maxR: 24, shadow: 8, exposure: 0.9 });
    g.add(K.floor(11, 0));
    K.put(K.box(10.4, 0.2, 1.6, 0x2b323a, { metalness: 0.5, roughness: 0.45 }), 0, 0.1, 0, g);

    var readout = K.text([''], { w: 9.2, h: 1.7, px: 1024, size: 66, bg: '#0b1620', fg: '#e8f1f5', mono: true, align: 'center', pad: 40 });
    var frame = K.rbox(9.5, 2.0, 0.14, 0.12, 0x15181c, { metalness: 0.5, roughness: 0.4 });
    K.put(frame, 0, 3.5, -1.2, g);
    K.put(readout, 0, 3.5, -1.12, g);

    var bits = [0, 1, 0, 0, 0, 0, 0, 1], cubes = [], tags = [], buttons = [];
    for (var i = 0; i < 8; i++) {
      var cube = K.rbox(0.9, 0.9, 0.9, 0.12, 0x2b323a, { metalness: 0.4, roughness: 0.4, emissive: 0x2dd4bf, emissiveIntensity: 0 });
      K.put(cube, (i - 3.5) * 1.25, 0.65, 0, g);
      stage.pickable(cube, i);
      cubes.push(cube);
      tags.push(stage.label('0', cube, { dy: 0.75, cls: 'big' }));
      var foot = new T.Object3D();
      foot.position.set((i - 3.5) * 1.25, 0.2, 0.9);
      g.add(foot);
      stage.label(String(Math.pow(2, 7 - i)), foot, { cls: 'quiet' });
    }

    function value() { return bits.reduce(function (a, b) { return a * 2 + b; }, 0); }

    function refresh() {
      var v = value(), str = bits.join('');
      var ch = v >= 33 && v <= 126 ? String.fromCharCode(v) : (v === 32 ? 'space' : '');
      bits.forEach(function (b, i) {
        cubes[i].position.y = b ? 1.15 : 0.65;
        cubes[i].material.color.setHex(b ? 0x0f766e : 0x2b323a);
        cubes[i].material.emissiveIntensity = b ? 0.22 : 0;
        cubes[i].userData.em0 = undefined;
        tags[i].set(String(b));
        buttons[i].setAttribute('aria-pressed', b ? 'true' : 'false');
        buttons[i].textContent = Math.pow(2, 7 - i) + ': ' + (b ? 'on' : 'off');
      });
      readout.setText([str.slice(0, 4) + ' ' + str.slice(4) + '  =  ' + v, ch ? 'as text:  ' + ch : 'no letter for this value']);
      var parts = bits.map(function (b, i) { return b ? Math.pow(2, 7 - i) : null; }).filter(function (x) { return x !== null; });
      stage.info('<h3>' + str.slice(0, 4) + ' ' + str.slice(4) + ' in binary is ' + v + '</h3><p>' +
        (parts.length ? 'Add the place values that are switched on: ' + parts.join(' + ') + ' = ' + v + '.' : 'Every bit is off, so the value is 0.') +
        ' In hexadecimal that is ' + ('0' + v.toString(16).toUpperCase()).slice(-2) + '.' +
        (ch ? ' Read as text, the same pattern means “' + ch + '”.' : '') + '</p>' +
        '<p class="note">The pattern is only bits. Whether it means a number, a letter, a colour or an instruction depends on how the software chooses to read it.</p>');
      stage.invalidate();
    }

    function flip(i) { bits[i] = bits[i] ? 0 : 1; refresh(); }
    function set(v) { for (var i = 7; i >= 0; i--) { bits[i] = v & 1; v = v >> 1; } refresh(); }

    var row = stage.ui.row('Bits');
    for (var b = 0; b < 8; b++) {
      (function (i) {
        var btn = stage.ui.button('', function () { flip(i); }, row);
        btn.classList.add('chip');
        btn.setAttribute('aria-label', 'Bit worth ' + Math.pow(2, 7 - i));
        buttons.push(btn);
      })(b);
    }
    var row2 = stage.ui.row('Try');
    stage.ui.button('Letter A', function () { set(65); }, row2);
    stage.ui.button('Letter a', function () { set(97); }, row2);
    stage.ui.button('Largest', function () { set(255); }, row2);
    stage.ui.button('Add 1', function () { set((value() + 1) % 256); }, row2);
    stage.ui.button('Clear', function () { set(0); }, row2);

    stage.onPick = function (i) { flip(i); };
    refresh();
  }

  window.DSBook.defineLesson({
    id: '3.3c',
    title: 'Uses and forms of computer coding',
    question: 'If a processor only understands numbers, how does it run a program written in words?',
    intro: 'Programmers write in languages designed for people. Processors run something very different. This lesson follows a program across that gap.',
    targets: [
      'Distinguish high-level languages, assembly language and machine code.',
      'Explain what a compiler does and why programmers need one.',
      'Read a small binary number and explain that the same bits can mean different things.',
      'Discuss who gains power when most people cannot read the code that affects them.'
    ],
    predict: {
      q: 'A programmer writes one line: total = price + tax. How many separate instructions do you think the processor carries out for it?',
      options: ['One: the same line', 'About three', 'About fifty', 'None: the processor reads the words directly'],
      after: 'Prediction recorded. Open “Translate a program”, compile “Add two numbers” and count the lines of machine code.'
    },
    scenes: [
      {
        id: 'translate', title: 'Translate a program', build: buildTranslate,
        hint: 'Drag to rotate. Pinch or use + and − to zoom. Choose a program, then Compile and run.',
        textVersion: '<p>A compiler reads a whole high-level program, works out the processor steps, writes them as machine code, and the CPU runs that.</p>' +
          '<table><tr><th>Program</th><th>High-level</th><th>Assembly (invented for teaching)</th><th>Machine code (invented)</th></tr>' +
          PROGRAMS.map(function (p) { return '<tr><td><strong>' + p.label + '</strong></td><td><code>' + p.high.join('<br>') + '</code></td><td><code>' + p.asm.join('<br>') + '</code></td><td><code>' + p.bin.join('<br>') + '</code></td></tr>'; }).join('') +
          '</table>' + Object.keys(PARTS).map(function (k) { return '<p><strong>' + PARTS[k][0] + '.</strong> ' + PARTS[k][1] + '</p>'; }).join('')
      },
      {
        id: 'bits', title: 'Flip the bits', build: buildBits,
        hint: 'Click a cube, or use the buttons below, to switch a bit on or off.',
        textVersion: '<p>Eight bits have the place values 128, 64, 32, 16, 8, 4, 2 and 1. A bit that is on adds its place value. ' +
          'Example: 0100 0001 has 64 and 1 switched on, so its value is 65. Read as text, 65 is the letter A. Adding 32 gives 97, the letter a. ' +
          'All eight on gives 255, the largest value eight bits can hold, so eight bits can represent 256 different values (0 to 255).</p>'
      }
    ],
    sections: [
      {
        heading: 'Three forms of code',
        html: '<ul><li><strong>High-level languages</strong> such as Python, Java and JavaScript are written for people. They are close to English and maths, and the same program can be made to run on different computers.</li>' +
          '<li><strong>Assembly language</strong> gives each processor instruction a short name. It is readable, but long-winded and tied to one type of processor. Programmers use it when code must be extremely fast or must control hardware directly.</li>' +
          '<li><strong>Machine code</strong> is what the processor actually carries out: instructions stored as binary, often written in hexadecimal to make it shorter for people to read. Each family of processor has its own.</li></ul>' +
          '<p>The last two are called <strong>low-level</strong> languages because they sit close to the hardware.</p>'
      },
      {
        heading: 'The translator in the middle',
        html: '<p>Writing directly in binary is slow and full of mistakes, so programmers write in a high-level language and let a <strong>compiler</strong> translate. ' +
          'The compiler reads the source code and produces a file of machine code. When you open an app, the operating system loads that file and the processor runs it.</p>' +
          '<p>This is why an app has separate versions for different kinds of device: the source code may be the same, but it must be compiled again for each type of processor.</p>'
      },
      {
        heading: 'Why binary?',
        html: '<p>A processor is built from billions of tiny switches, each either off or on. One switch stores one <strong>bit</strong>: 0 or 1. Groups of bits make larger values. ' +
          'In <em>Flip the bits</em>, eight bits (one <strong>byte</strong>) give 256 possible patterns.</p>' +
          '<p>A pattern has no meaning of its own. The same eight bits can be the number 65, the letter A, a shade of grey or an instruction. Software decides how to read them.</p>'
      },
      {
        heading: 'In the real world: code you cannot read',
        html: '<p>Most software reaches you already compiled. You can run it, but you cannot read what it does, because machine code is nearly impossible for people to follow. ' +
          'Open-source projects publish their source code so anyone can check it. Most commercial software does not.</p>'
      }
    ],
    terms: [
      ['High-level language', 'A programming language designed for people to read and write, independent of any one processor.'],
      ['Low-level language', 'A language close to the hardware: assembly language or machine code.'],
      ['Assembly language', 'A low-level language that uses a short name for each processor instruction.'],
      ['Machine code', 'Instructions in binary that a particular type of processor can carry out directly.'],
      ['Compiler', 'A program that translates high-level source code into machine code and saves it as a runnable file.'],
      ['Source code', 'A program as the programmer wrote it, before translation.'],
      ['Bit / byte', 'A single binary digit, 0 or 1; a group of eight bits.'],
      ['Binary / hexadecimal', 'Number systems using two digits (0, 1) or sixteen (0 to 9 then A to F). Hexadecimal is a compact way to write binary.']
    ],
    questions: [
      {
        q: 'What does a compiler do?',
        options: [
          ['It runs a program faster by adding more memory.', 'A compiler is software that translates code. It does not change the hardware.'],
          'It translates a program written in a high-level language into machine code.',
          ['It turns machine code into English so users can read it.', 'That is the reverse direction, and it is not what a compiler is for.'],
          ['It protects a program from malware.', 'That describes security software. A compiler’s job is translation.']
        ],
        answer: 1,
        why: 'The compiler is the translator between the language people write and the binary the processor runs.'
      },
      {
        q: 'Why do most programmers write in a high-level language and not in machine code?',
        options: [
          ['Processors run high-level languages directly.', 'They do not. Compile a program in the model and see what reaches the CPU.'],
          ['Machine code cannot do everything a high-level language can.', 'Everything a computer does is machine code in the end. The limit is on people, not on the code.'],
          'High-level code is far quicker for people to write, read and fix, and can be translated for different processors.',
          ['High-level programs need no storage.', 'Every program is stored somewhere, whatever language it was written in.']
        ],
        answer: 2,
        why: 'High-level languages suit human thinking. The compiler takes care of the detail and of the differences between processors.'
      },
      {
        q: 'Eight bits are set to 0000 0101. What is the value, and how many different values can eight bits represent in total?',
        options: [
          ['101, out of 8 possible values', 'Read the place values, not the digits as a decimal number. And each added bit doubles the number of patterns.'],
          ['5, out of 16 possible values', 'The value is right. But four bits give 16 patterns; eight bits give many more.'],
          '5, out of 256 possible values',
          ['3, out of 255 possible values', 'The bits switched on are worth 4 and 1. Count the all-zeros pattern too when you count the total.']
        ],
        answer: 2,
        why: 'The 4 and the 1 are on, giving 5. Eight bits have 2 × 2 × 2 × 2 × 2 × 2 × 2 × 2 = 256 patterns, 0 to 255.'
      }
    ],
    inquiry: {
      prompt: 'Software decides who gets a loan, which posts you see and how a car brakes, yet almost nobody affected can read the code. Should people have a right to see the source code of software that makes decisions about them?',
      consider: [
        'Consider the people affected, the company that wrote the code, regulators, and security researchers.',
        'What is gained by publishing code (checking for errors and unfairness) and what could be lost (trade secrets, clues for attackers)?',
        'Would publishing the code be enough for ordinary people to understand a decision? What else would they need?'
      ]
    }
  });
})();
