const $ = API('无忧行');
const { isNode } = ENV();
const headers = {
    'Accept-Encoding': 'gzip, deflate, br',
    'Origin': '\u0068\u0074\u0074\u0070\u003a\u002f\u002f\u0074\u0061\u0073\u006b\u002e\u006a\u0065\u0067\u006f\u0074\u0072\u0069\u0070\u002e\u0063\u006f\u006d\u002e\u0063\u006e\u003a\u0038\u0030\u0038\u0030',
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json;charset=utf-8',
    'Connection': 'keep-alive',
    'Host': '\u0074\u0061\u0073\u006b\u002e\u006a\u0065\u0067\u006f\u0074\u0072\u0069\u0070\u002e\u0063\u006f\u006d\u002e\u0063\u006e\u003a\u0038\u0030\u0038\u0030',
    'Accept-Language': 'en-us',
    'Referer': '\u0068\u0074\u0074\u0070\u003a\u002f\u002f\u0074\u0061\u0073\u006b\u002e\u006a\u0065\u0067\u006f\u0074\u0072\u0069\u0070\u002e\u0063\u006f\u006d\u002e\u0063\u006e\u003a\u0038\u0030\u0038\u0030\u002f\u0074\u0061\u0073\u006b\u002f\u0069\u006e\u0064\u0065\u0078\u002e\u0068\u0074\u006d\u006c'
};
$.delete('AsVow'); //取消本条注释删除所有Cookie
var AsVow = isNode ? process.env.AsVow : $.read('AsVow');
var info = '';
