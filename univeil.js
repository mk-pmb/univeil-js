/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var EX = function univeil(txt, escFunc) {
  if (!escFunc) { escFunc = EX.uHHHH; }
  var esc2nd = function (m, k, c) { return k + escFunc(m && c); };
  switch (escFunc && (typeof escFunc)) {
  case 'string':
    escFunc = EX.whitelist_or_uHHHH.bind(null, escFunc);
    break;
  case 'object':
    if (escFunc instanceof RegExp) {
      escFunc = EX.matchesRegexp_or_uHHHH.bind(null, escFunc);
      break;
    }
    escFunc = EX.dict_or_uHHHH.bind(null, escFunc);
    break;
  }
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
  surrogatePair: /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
  unpairedHighSurrogate: /[\uD800-\uDBFF](?=[\x00-\uD7FF\uE000-\uFFFF]|$)/g,
  unpairedLowSurrogate: /(^|[\x00-\uD7FF\uE000-\uFFFF])([\uDC00-\uDFFF])/g,
  variationSelectors_nonpr: /[\uFE00-\uFE0F]/g,
  zwnbspAkaByteOrderMark_nonpr: /\uFEFF/g,
};

(function extendRgx(r) {
  r.nonprintCombo = new RegExp('[' + Object.keys(r).map(function (k) {
    return (!k.match(/_(ctrl|nonpr|untrust)$/) ? '' : String(r[k]
      ).replace(/^\/|\/g?$|\[|\]/g, ''));
  }).join('') + ']', 'g');
}(EX.rgx));


EX.jsonify = function (data, preProcessor, indent) {
  var ty = (data && (typeof data));
  if ((indent === undefined) && ((typeof preProcessor) === 'number')) {
    indent = preProcessor;
    preProcessor = null;
  }
  if (indent === -1) {
    if (ty === 'object') { ty = -1; }
    indent = 1;
  }
  data = JSON.stringify(data, preProcessor, indent);
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
  if (!(preArgs instanceof Array)) {
    throw new Error('funcProxy(): preArgs must be an array or false-y.');
  }
  if (!postArgs) { postArgs = []; }
  if (!(postArgs instanceof Array)) {
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
