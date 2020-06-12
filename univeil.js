/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var EX, structurallySafeJsonify = require('json-stringify-safe');

EX = function univeil(txt, escFunc, escArg) {
  if (escFunc === false) { return txt; }
  escFunc = EX.findBindEscFunc(escFunc, escArg);
  txt = String(txt);
  txt = txt.replace(EX.rgx.nonprintCombo, escFunc);
  txt = txt.replace(EX.rgx.unpairedLowSurrogate,
    EX.simulateLookbehind_simple.bind(null, escFunc));
  txt = txt.replace(EX.rgx.unpairedHighSurrogate, escFunc);
  return txt;
};


EX.findBindEscFunc = function (f, a) {
  if (!f) { return EX.uHHHH; }
  var t = typeof f;
  if (t === 'function') { return f; }
  if (t === 'string') {
    if (a) { return EX.whitelist_or_dict_or_uHHHH.bind(null, f, a); }
    return EX.whitelist_or_uHHHH.bind(null, f);
  }
  if (t === 'object') {
    if (f instanceof RegExp) {
      return EX.matchesRegexp_or_uHHHH.bind(null, f);
    }
    return EX.dict_or_uHHHH.bind(null, f);
  }
  return f;
};


EX.simulateLookbehind_simple = function (replacer, match, badPrefix) {
  return (badPrefix ? match : replacer(match));
};


EX.uHHHH = function uHHHH(chr) {
  return '\\u' + (0x10000 + chr.charCodeAt(0)).toString(16
    ).substr(1, 4).toUpperCase();
};


EX.xmlCharRef = function (chr) {
  chr = (chr.length === 1 ? chr.charCodeAt(0) : chr.codePointAt(0));
  if (chr > 99) { chr = 'x' + chr.toString(16).toUpperCase(); }
  return '&#' + chr + ';';
};


EX.dict_or_uHHHH = function (dict, chr) {
  var found = dict[chr];
  if ((typeof found) === 'string') { return found; }
  found = dict[''];
  if ((typeof found) === 'string') { return found; }
  return EX.uHHHH(chr);
};


EX.whitelist_or_uHHHH = function (whl, chr) {
  return (whl.indexOf(chr) < 0 ? EX.uHHHH(chr) : chr);
};


EX.whitelist_or_dict_or_uHHHH = function (whl, dict, chr) {
  return (whl.indexOf(chr) < 0 ? EX.dict_or_uHHHH(dict, chr) : chr);
};


EX.matchesRegexp_or_uHHHH = function (rgx, chr) {
  return (rgx.exec(chr) ? chr : EX.uHHHH(chr));
};


EX.rgx = {
  asciiControlChars_nonpr: /[\x00-\x1F\x7F]/g,
  generalPunctuation_nonpr: /[\u2000-\u200F\u2028-\u202F\u205F-\u206F]/g,
  latinSupplement_ctrl: /[\x80-\x9F]/g,
  nbsp_nonpr: /\xA0/g,
  privateUseArea_untrust: /[\uE000-\uF8FF]/g,
  softHyphen_nonpr: /\xAD/g,
  specials_nonpr: /[\uFFF9-\uFFFF]/g,
  variationSelectors_nonpr: /[\uFE00-\uFE0F]/g,
  zwnbspAkaByteOrderMark_nonpr: /\uFEFF/g,
};
(function extendRgx(r) {
  r.nonprintGroups = {};
  r.nonprintCombo = new RegExp('[' + Object.keys(r).map(function (k) {
    if (!k.match(/_(ctrl|nonpr|untrust)$/)) { return ''; }
    r.nonprintGroups[k] = r[k];
    return String(r[k]).replace(/^\/|\/g?$|\[|\]/g, '');
  }).join('') + ']', 'g');

  r.surrogatePair = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
  // by definition   ^-- high srg.  ^-- low srg.

  r.unpairedHighSurrogate = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])/g;
  // any high surrogate -----^              ^  ^-- a low surrogate
  // not followed by -----------------------'

  r.unpairedLowSurrogate = /([\uD800-\uDBFF]|)[\uDC00-\uDFFF]/g;
  // lookbehind shim: high srg. optional ---^ ^-- then a low srg.
  // JS will prefer the earliest matching variant in group 1,
  // so if there's any chance it can find a correct pair instead of
  // just a lonely low surrogate, it will prefer to match the pair.
  // In that case, group 1 has text, so EX.simulateLookbehind_simple
  // will replace the pair with itself, effectively skipping it.
  // In case of just a low surrogate, the entire match (group 0)
  // will be only one character, so it's safe to send it to escFunc
  // even if that only escapes the 1st character.

}(EX.rgx));


EX.jsonify = function jsonify(data, preProcessor, indent) {
  if ((indent === undefined) && ((typeof preProcessor) === 'number')) {
    return jsonify(data, null, preProcessor);
  }
  var ty = (data && (typeof data));
  if (indent === -1) {
    if (ty === 'object') { ty = -1; }
    indent = 1;
  }
  data = structurallySafeJsonify(data, preProcessor, indent);
  if (ty === -1) {
    data = data.replace(/(\{|\[)\n */g, '$1'
      ).replace(/\n *(\}|\])/g, '$1'
      ).replace(/\n */g, ' ');
  }
  switch (ty) {
  case 'object':
  case 'string':
  case -1:
    data = EX(data, '\n');
    break;
  }
  return data;
};


EX.funcProxy = function (func, ctx, preArgs, opts, postArgs) {
  if ((typeof func) === 'string') { func = (ctx || false)[func]; }
  if ((typeof func) !== 'function') {
    throw new Error('funcProxy(): func must be a function or a method name');
  }
  if (!preArgs) { preArgs = []; }
  if (!Array.isArray(preArgs)) {
    throw new Error('funcProxy(): preArgs must be an array or false-y.');
  }
  if (!postArgs) { postArgs = []; }
  if (!Array.isArray(postArgs)) {
    throw new Error('funcProxy(): postArgs must be an array or false-y.');
  }
  postArgs = [].concat(preArgs, null, postArgs);
  preArgs = preArgs.length;
  return function univeilFuncProxy(data) {
    postArgs[preArgs] = EX(data, opts);
    return func.apply(ctx, postArgs);
  };
};













module.exports = EX;
