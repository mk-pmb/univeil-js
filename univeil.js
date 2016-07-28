/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var EX = function univeil(txt, escFunc) {
  if (!escFunc) { escFunc = EX.uHHHH; }
  var esc2nd = function (m, k, c) { return k + escFunc(m && c); };
  txt = String(txt);
  txt = txt.replace(EX.rgx.nonprintCombo, escFunc);
  txt = txt.replace(EX.rgx.unpairedLowSurrogate, esc2nd);
  txt = txt.replace(EX.rgx.unpairedHighSurrogate, escFunc);
  return txt;
};


EX.uHHHH = function uHHHH(chr) {
  return '\\u' + (0x10000 + chr.charCodeAt(0)).toString(16
    ).substr(1, 4).toUpperCase();
};


EX.rgx = {
  asciiControlChars_nonpr: /[\x00-\x1F\x7F]/g,
  generalPunctuation_nonpr: /[\u2000-\u200F\u2028-\u202F\u205F-\u206F]/g,
  latinSupplement_ctrl: /[\x80-\x9F]/g,
  nbsp_nonpr: /\xA0/g,
  softHyphen_nonpr: /\xAD/g,
  surrogatePair: /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
  unpairedHighSurrogate: /[\uD800-\uDBFF](?=[\x00-\uD7FF\uE000-\uFFFF]|$)/g,
  unpairedLowSurrogate: /(^|[\x00-\uD7FF\uE000-\uFFFF])([\uDC00-\uDFFF])/g,
};

(function extendRgx(r) {
  r.nonprintCombo = new RegExp('[' + Object.keys(r).map(function (k) {
    return (!k.match(/_(nonpr|ctrl)$/) ? '' : String(r[k]
      ).replace(/^\/|\/g?$|\[|\]/g, ''));
  }).join('') + ']', 'g');
}(EX.rgx));









module.exports = EX;
