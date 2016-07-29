/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var EX = exports, univeil = require('univeil');

EX.failCnt = 0;
EX.charCodeAt0 = function (s) { return String(s).charCodeAt(0); };


EX.cc2str = function (cc) {
  if (!(cc instanceof Array)) { cc = [cc]; }
  return String.fromCharCode.apply(String, cc);
};


EX.unslash = function (slashed) {
  try {
    return JSON.parse('"' + String(slashed) + '"');
  } catch (err) {
    console.dir(slashed);
    throw err;
  }
};


EX.url2uHHHH = function (s) {
  var u = encodeURIComponent(s).replace(/%/g, '\\u00');
  if (u.length === (6 * s.length)) { return u; }
  return ('url2uHHHH: bad strlen: ' + u.length);
};


EX.guessCalledFrom = function () {
  var c = (new Error('foo')).stack;
  c = c.substr(c.lastIndexOf(' (' + module.filename),
    c.length).split(/\n\s*at\s+/)[1].split(/\/|\)|:/);
  c = c[c.length - 4] + '#' + c[c.length - 3];
  return c;
};


EX.quot = function (s) { return '‹' + String(s).replace(/\n/g, '¶') + '›'; };


EX.xeq = function (result, expected) {
  var where = EX.guessCalledFrom();
  if (result === expected) {
    if (EX.xeq.verbose) {
      console.log('+ ' + where + ': ' + EX.quot(expected));
    }
    return true;
  }
  console.error('! ' + where + ': ' + EX.quot(result) + '\n  ' +
    where.replace(/[\S\s]/g, ' ') + '≠ ' + EX.quot(expected));
  EX.failCnt += 1;
  return false;
};
EX.xeq.verbose = false;


EX.sleq = function (args, expected) {
  if (!(args instanceof Array)) { args = [args]; }
  if (expected === undefined) { expected = args[0]; }
  args[0] = EX.unslash(args[0]);
  try {
    args = univeil.apply(null, args);
  } catch (err) {
    args = String(err);
  }
  return EX.xeq(args, expected);
};


EX.exitReport = function () {
  if (EX.failCnt === 0) {
    console.log('+OK all tests passed.');
  } else {
    console.error('-ERR ' + EX.failCnt + ' tests failed');
  }
  process.exit(EX.failCnt);
};


EX.rangeIncl = function (start, end, step) {
  var rng = [];
  if (start instanceof Array) {
    return rng.map.call(arguments, Function.apply.bind(EX.rangeIncl, null));
  }
  if (!step) { step = 1; }
  if ((typeof start) === 'string') { start = start.charCodeAt(0); }
  if ((typeof end) === 'string') { end = end.charCodeAt(0); }
  for (0; start <= end; start += step) { rng[rng.length] = start; }
  return rng;
};


EX.verifyOutput = function (doStuff) {
  var cons = { stdout: '', stderr: '' }, expected = [];
  String(doStuff).replace(/ \/{2}= *`([ -\uFFFF]*)`/g,
    function (m, ln) { expected[expected.length] = (m && ln); });
  expected.next = 0;
  cons.log = cons.error = function () {
    var msg = Array.prototype.slice.call(arguments, 0).join(' ');
    msg.split(/\n/).forEach(function (ln) {
      EX.xeq(ln, expected[expected.next]);
      expected.next += 1;
    });
  };
  return doStuff.bind(null, cons);
};

















/*scroll*/
