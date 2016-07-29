/*jslint indent: 2, maxlen: 80, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var hf = require('./helperfuncs.js'), slashed, raw;

hf.verifyOutput(function readmePreview(console) {
  var univeil = require('univeil'), cl = console.log, tmp;
  cl(univeil("Hello world!"));        //= `Hello world!`
  cl(univeil("Hel​lo snowman! ☃"));    //= `Hel\u200Blo\u00A0snowman!\u205F☃`
  cl(univeil("foo \t \r \n"));        //= `foo \u0009 \u000D \u000A`
  cl(univeil("\x1B \x7F \xA0 bar"));  //= `\u001B \u007F \u00A0 bar`

  tmp = '\\,\t,\r,\n,\b,\xA0,\f';
  cl(univeil(tmp));       //= `\,\u0009,\u000D,\u000A,\u0008,\u00A0,\u000C`
  cl(univeil(tmp, '\xA0\n'));   // whitelist
    //= `\,\u0009,\u000D,`
    //= `,\u0008, ,\u000C`
  cl(univeil(tmp, { '\xA0': '<nbsp>', '\n': '<nl>', '': '<?!>' }));   // dict
    //= `\,<?!>,<?!>,<nl>,<?!>,<nbsp>,<?!>`
  cl(univeil(tmp, encodeURIComponent));         // translator function
    //= `\,%09,%0D,%0A,%08,%C2%A0,%0C`
  // For more variants, see "Custom translations" below.

  tmp = [0, 1, 'nbsp=\xA0', 'devCtrl=\x90', { b: true }, null, -2];
  cl(univeil.jsonify(tmp));
    //= `[0,1,"nbsp=\u00A0","devCtrl=\u0090",{"b":true},null,-2]`

  // Special reserved indentation "-1": spaces but no newlines.
  cl(univeil.jsonify(tmp, null, -1));
    //= `[0, 1, "nbsp=\u00A0", "devCtrl=\u0090", {"b": true}, null, -2]`

  tmp = univeil.funcProxy(cl, null, ['(('], { '\xA0': '<nbsp>' }, ['))']);
  tmp('hello\xA0world');    //= `(( hello<nbsp>world ))`
})();



hf.sleq("\\\\\\r\\n", "\\\\u000D\\u000A");
hf.sleq('<\\u0000> <\\u000D> <\\u007F>');


// Surrogate characters:
// =====================

function surrogatePattern(ptn) {
  ptn = ptn.replace(/\d/g, function (m) { return surrogatePattern.chr[m]; });
  raw = hf.unslash(ptn);
  return ptn;
}

surrogatePattern.chr = ['\\uD83C', '\\uDF68', '\\uD83C', '\\uDF70'];
slashed = surrogatePattern('0123');
hf.sleq(slashed + '=' + raw, '🍨🍰=🍨🍰');
slashed = surrogatePattern('12');
hf.sleq(raw, slashed);
slashed = surrogatePattern('1');
hf.sleq(raw, slashed);
slashed = surrogatePattern('0=1=2=3');
hf.sleq(raw, slashed);
slashed = surrogatePattern('0 00 : 01 10 11 1 12 : 23 32');
hf.sleq(raw, slashed.replace(/: \S+/g, hf.unslash));
slashed = surrogatePattern('000 00 : 01 11 111');
hf.sleq(raw, slashed.replace(/: \S+/g, hf.unslash));


// ASCII control characters:
// =========================

hf.sleq(hf.url2uHHHH(hf.cc2str(hf.rangeIncl(0x00, 0x0F))));
hf.sleq(hf.url2uHHHH(hf.cc2str(hf.rangeIncl(0x10, 0x1F).concat(0x7F))));


// Some Latin Supplement chars:
// ============================

slashed = ['nbsp=\\u00A0',
  'shy=\\u00AD',
  'dev-ctrl=\\u0090',
  'wait=\\u0095',
  '¡¿©®¶«»¦§°±¹²³¼½…·×÷'].join(' ');
hf.sleq(slashed);


// Custom translations:
// ====================
function join(glue, arr) { return arr.join(glue); }

slashed = [ ['name', 'age', 'pet'],
            ['Bob',     22, 'dog'],
            ['Susan',   46, 'cat'],
          ].map(join.bind(null, '\\u0009')).join('\\u000A');
raw = hf.unslash(slashed);
hf.sleq(slashed);
hf.sleq([slashed, { '\t': '\t', '\n': '\n' }], raw);
hf.sleq([slashed, '\t\n'], raw);
hf.sleq([slashed, /\t|\n/], raw);

slashed = 'nbsp=\\u00A0, tab=\\t, nl=\\n, foods=🍨🍰';
hf.sleq([slashed, encodeURIComponent],
  'nbsp=%C2%A0, tab=%09, nl=%0A, foods=🍨🍰');
hf.sleq([slashed, { '': '?' }], 'nbsp=?, tab=?, nl=?, foods=🍨🍰');

slashed = '\\uDF68:\\uD83C';
hf.sleq([slashed, encodeURIComponent], 'URIError: URI malformed');
hf.sleq([slashed, { '': '?' }], '?:?');











hf.exitReport();
