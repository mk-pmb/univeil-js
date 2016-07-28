/*jslint indent: 2, maxlen: 80, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var univeil = require('univeil');
function t(x) { console.log(univeil(x)); }

t("Hel​lo snowman! ☃");    //= `Hel\u200Blo\u00A0snowman!\u205F☃`
t("foo \t \r \n");        //= `foo \u0009 \u000D \u000A`
t("\x1B \x7F \xA0 bar");  //= `\u001B \u007F \u00A0 bar`
