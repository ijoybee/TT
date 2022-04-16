/*
 * @Author: AsVow
 * @LastMod: 2022-01-20 20:43:14
 *
无忧行签到脚本
脚本兼容: QuantumultX, Surge4, Loon, Node.js
⚠️更新说明: 移除失效活动.
Cookie说明：分为四部分「 accountid｜mobile｜token｜userid 」
1.打开无忧行点击「 我的 」然后点击「 我的客服 」👉 通知成功写入「 accountid & mobile 」, 点击「 无忧币商城 」 👉 通知成功写入「 token & userid 」.
2.上述步骤完成后, 通知「 Cookie完整 」, 则可使用此签到脚本.
3.「 token 」失效时，重新点击「 无忧币商城 」 👉 通知更新「 token 」成功.
‼️‼️退出登录「 token 」即时失效, 因此添加多账号Cookie需删除APP重新下载, 再登录另一账号, 然后按照上述步骤重新获取.
4.获取Cookie后, 请将Cookie脚本禁用并移除主机名, 以免产生不必要的MITM.
Node.js用户说明: 
1.请自行设置AsVow环境参数, 参考格式:
export AsVow='[{accountid:账号1,mobile:账号1,token:账号1,userid:账号1},{accountid:账号2,mobile:账号2,token:账号2,userid:账号2}]'
2.在环境中或脚本内「 SetVariable 」函数里设置通知参数, 参考文档「 https://asvow.com/param 」.
**********************
QuantumultX 脚本配置:
**********************
[task_local]
# Tasks: JegoTrip
0 9 * * * https://ooxx.be/js/jegotrip.js, tag=无忧行, img-url=https://ooxx.be/own/icon/jegotrip.png, enabled=true
[rewrite_local]
# JegoTrip Cookie
https?:\/\/app\.jegotrip\.com\.cn\/.*(call_phone|logonFree) url script-response-body https://ooxx.be/js/jegotrip.js
[mitm] 
hostname= app.jegotrip.com.cn
**********************
Surge 4.2.0+ 脚本配置:
**********************
[Script]
Tasks: JegoTrip = type=cron,cronexp=0 9 * * *,script-path=https://ooxx.be/js/jegotrip.js
JegoTrip Cookie = type=http-response,pattern=https?:\/\/app\.jegotrip\.com\.cn\/.*(call_phone|logonFree),script-path=https://ooxx.be/js/jegotrip.js, requires-body=true
[MITM] 
hostname= app.jegotrip.com.cn
************************
Loon 2.1.0+ 脚本配置:
************************
[Script]
# Tasks: JegoTrip
cron "0 9 * * *" script-path=https://ooxx.be/js/jegotrip.js
# JegoTrip Cookie
http-response https?:\/\/app\.jegotrip\.com\.cn\/.*(call_phone|logonFree) script-path=https://ooxx.be/js/jegotrip.js, requires-body=true
[Mitm] 
hostname= app.jegotrip.com.cn
*/
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
