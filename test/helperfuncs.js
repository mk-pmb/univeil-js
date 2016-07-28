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


EX.xeq = function (result, expected) {
  var where = EX.guessCalledFrom();
  if (result === expected) {
    console.log('+ ' + where + ': ‹' + expected + '›');
    return true;
  }
  console.error('! ' + where + ': ‹' + result + '›\n  ' +
    where.replace(/[\S\s]/g, ' ') + '≠ ‹' + expected + '›');
  EX.failCnt += 1;
  return false;
};


EX.sleq = function (slashed, expected) {
  if (expected === undefined) { expected = slashed; }
  return EX.xeq(univeil(EX.unslash(slashed)), expected);
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















/*scroll*/
