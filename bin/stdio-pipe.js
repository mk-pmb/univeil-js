/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';
process.stdin.on('data',
  require('univeil').funcProxy('write', process.stdout,
    null, '\t\n', null));
