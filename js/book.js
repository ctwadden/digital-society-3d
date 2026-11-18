/* The book's table of contents.
   To add a lesson: write a file in lessons/ and give its entry below a `file`.
   Entries without a `file` are shown on the contents page as planned.
   Nothing else in the shell needs to change. */
(function () {
  'use strict';

  window.DSBook = {
    version: '18',   // raise this whenever files change, so browsers reload them
    title: 'Digital Society in 3D',
    subtitle: 'An interactive book for IB Digital Society',

    chapters: [
      {
        id: '3.3',
        title: 'Computing devices',
        blurb: 'What counts as a computer, what is inside one, how it is instructed, and how computing has changed.',
        lessons: [
          {
            id: '3.3a',
            title: 'Types of computers',
            file: 'lessons/3-3a-types-of-computers.js',
            summary: 'Eight kinds of computer, from a chip hidden in a microwave to a mainframe, at true scale.'
          },
          {
            id: '3.3b',
            title: 'Components of a computer',
            file: 'lessons/3-3b-components.js',
            summary: 'Pull a desktop apart, follow data from keyboard to screen, and see how software sits on top of hardware.'
          },
          {
            id: '3.3c',
            title: 'Uses and forms of computer coding',
            file: 'lessons/3-3c-coding.js',
            summary: 'A line of code translated into machine code, and bits you can flip.'
          },
          {
            id: '3.3d',
            title: 'Evolution of computing',
            file: 'lessons/3-3d-evolution.js',
            summary: 'Five generations of hardware, Moore’s Law on a slider, and a qubit you can measure.'
          },
          {
            id: '3.3p',
            title: 'Pinnacle task: The computer shop',
            file: 'lessons/3-3p-computer-shop.js',
            summary: 'Work the shop counter: five customers, five budgets. Choose the parts, build the computer, test it, and justify it.'
          }
        ]
      },
      {
        id: '3.4',
        title: 'Networks and the internet',
        blurb: 'How devices are connected, how data finds its way, and what being connected costs.',
        lessons: [
          { id: '3.4a', title: 'Types of computing networks', file: 'lessons/3-4-networks.js', summary: 'Visit a PAN, LAN, MAN and WAN, then break a server and see who loses access.' },
          { id: '3.4b', title: 'Components of computing networks', file: 'lessons/3-4-networks.js', summary: 'Follow a print job and a web request through access point, switch, router and modem.' },
          { id: '3.4c', title: 'Characteristics of computing networks', file: 'lessons/3-4-networks.js', summary: 'Send packets across a mesh of routers, switch some off, and run out of bandwidth.' },
          { id: '3.4de', title: 'Network services and the World Wide Web', file: 'lessons/3-4-networks.js', summary: 'Trace a web page, an email and a video call step by step.' },
          { id: '3.4f', title: 'Evolution of the internet and the web', file: 'lessons/3-4-networks.js', summary: 'Watch the direction of data change from the early web to the internet of things.' },
          { id: '3.4g', title: 'Internet dilemmas', file: 'lessons/3-4-networks.js', summary: 'Five attacks, six defences, and a budget for three.' }
        ]
      },
      { id: '4.4', title: 'Health', blurb: 'Planned.', lessons: [] },
      { id: 'Ed', title: 'Education', blurb: 'Planned.', lessons: [] }
    ],

    lessons: {},

    /* Called by each lesson file. */
    defineLesson: function (lesson) {
      this.lessons[lesson.id] = lesson;
    },

    /* Every built lesson in reading order, with its chapter attached. */
    allLessons: function () {
      var out = [];
      this.chapters.forEach(function (ch) {
        ch.lessons.forEach(function (l) {
          if (l.file) out.push({ id: l.id, title: l.title, file: l.file, summary: l.summary, chapter: ch });
        });
      });
      return out;
    },

    /* Self-check progress, kept in this browser only. */
    getScore: function (id) {
      try { return JSON.parse(localStorage.getItem('dsbook:' + id)); } catch (e) { return null; }
    },
    setScore: function (id, score) {
      try { localStorage.setItem('dsbook:' + id, JSON.stringify(score)); } catch (e) { /* private mode */ }
    }
  };
})();
