
univeil
===========
Unveil some Unicode characters that are easily overlooked.


Security reminder
-----------------
Although `univeil` can replace characters with a backslash notation,<br>
it is __about visibility, not security__.

It might protect your terminal emulator from that U+0090 device control,
but it won't care about your database or shell, since most quotes and
backslashes are perfectly visible characters.


Usage
-----
From [test.js](test/test.js):
```javascript
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
```




License
-------
ISC
