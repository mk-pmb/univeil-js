/*jslint indent: 2, maxlen: 80, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var hf = require('./helperfuncs.js'), slashed, raw;

hf.sleq('hello world');
hf.sleq('snow☃man');
hf.sleq("\\\\", "\\");
hf.sleq('\\r\\n', '\\u000D\\u000A');
hf.sleq('<\\u0000> <\\u000D> <\\u007F>');

slashed = '\\b\\f\\t\\r\\n';
hf.sleq(slashed, hf.url2uHHHH(hf.unslash(slashed)));

// Surrogate characters:
slashed = ['\\uD83C', '\\uDF68', '\\uD83C', '\\uDF70'];
slashed.all = slashed.join('');
raw = hf.unslash(slashed.all);
hf.sleq(slashed.all + '=' + raw, '🍨🍰=🍨🍰');
hf.sleq(raw.substr(1, 2), slashed[1] + slashed[2]);
hf.sleq(raw.substr(1, 1), slashed[1]);
slashed.all = slashed.join('=');
raw = hf.unslash(slashed.all);
hf.sleq(raw, slashed.all);

// ASCII control characters:
hf.sleq(hf.url2uHHHH(hf.cc2str(hf.rangeIncl(0x00, 0x0F))));
hf.sleq(hf.url2uHHHH(hf.cc2str(hf.rangeIncl(0x10, 0x1F).concat(0x7F))));

// Some Latin Supplement chars:
slashed = ['nbsp=\\u00A0',
  'shy=\\u00AD',
  'dev-ctrl=\\u0090',
  'wait=\\u0095',
  '¡¿©®¶«»¦§°±¹²³¼½…·×÷'].join(' ');
hf.sleq(slashed);














hf.exitReport();
