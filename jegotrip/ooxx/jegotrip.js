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
// $.delete('AsVow'); //取消本条注释删除所有Cookie
var AsVow = isNode ? process.env.AsVow : $.read('AsVow');
var info = '';

// 多平台通知参数设置
function SetVariable () {
  // 微信server酱
  $.SCKEY = '';
  // pushplus(推送加)
  $.PUSH_PLUS_TOKEN = '';
  $.PUSH_PLUS_USER = '';
  // iOS Bark APP(兼容Bark自建用户)
  $.BARK_PUSH = '';
  $.BARK_SOUND = '';
  $.BARK_GROUP = '';
  // Telegram 机器人
  $.TG_BOT_TOKEN = '';
  $.TG_USER_ID = '';
  $.TG_PROXY_HOST = '';
  $.TG_PROXY_PORT = '';
  $.TG_PROXY_AUTH = '';
  $.TG_API_HOST = '';
  // 钉钉机器人
  $.DD_BOT_TOKEN = '';
  $.DD_BOT_SECRET = '';
  // 企业微信机器人
  $.QYWX_KEY = '';
  // 企业微信应用消息推送
  $.QYWX_AM = '';
  // iGot
  $.IGOT_PUSH_KEY = '';
  // go-cqhttp
  $.GOBOT_URL = '';
  $.GOBOT_TOKEN = '';
  $.GOBOT_QQ = '';
}

!(async () => {
  if (typeof $request != 'undefined') {
    GetCookie();
  } else if (AsVow) {
    if (isNode) {
      await SetVariable ();
      AsVow = $.toObj(AsVow.replace(/(['"])?(\w+)(['"])?/g, '"$2"'));
    }
    for (i in AsVow) {
      accountid = AsVow[i].accountid;
      mobile = AsVow[i].mobile;
      token = AsVow[i].token;
      userid = AsVow[i].userid;
      invalid = false;
      if (accountid && mobile && token && userid) {
        star = '';
        for(x in [...Array(mobile.length-6).keys()]) star += '*';
        _mobile = mobile.slice(0,3);
        mobile_ = mobile.slice(-3);
        _mobile_ = _mobile + star + mobile_;
        head = `=== 账号${(+i)+1}：${_mobile_} ===\n`;
        info += `\n${head}`;
        headers['User-Agent'] = GetRandomUA();
        await QuerySign();
        if (invalid) {
          info += 'Token已失效‼️\n\n';
          continue;
        }
        11 == mobile.length ? await QueryVideoTask() : info += '视频任务：+86号码专属‼️\n';
        await Total();
      } else {
        INC_Cookie = $.toStr(AsVow[i]);
        AsVow = $.toObj($.toStr(AsVow).replace(INC_Cookie,'').replace(/,]*$/, ']'));
        $.write(AsVow,'AsVow');
        $.error(`⚠️自动删除不完整的Cookie\n ${INC_Cookie}`);
      }
    }
    $.notify($.name, '', info);
  } else {
    info = '签到失败：请先获取Cookie⚠️';
    $.notify($.name, '', info);
  }
})().finally(() => {
  $.done();
});


function Total() {
  const url = '\u0068\u0074\u0074\u0070\u0073\u003a\u002f\u002f\u0061\u0070\u0070\u002e\u006a\u0065\u0067\u006f\u0074\u0072\u0069\u0070\u002e\u0063\u006f\u006d\u002e\u0063\u006e\u002f\u0061\u0070\u0069\u002f\u0073\u0065\u0072\u0076\u0069\u0063\u0065\u002f\u0075\u0073\u0065\u0072\u002f\u0076\u0031\u002f\u0067\u0065\u0074\u0055\u0073\u0065\u0072\u0041\u0073\u0073\u0065\u0074\u0073\u003f\u006c\u0061\u006e\u0067\u003d\u007a\u0068\u005f\u0063\u006e\u0026\u0074\u006f\u006b\u0065\u006e\u003d' + token;
  const body = `{"token":"${token}"}`;
  headers['Host'] = '\u0061\u0070\u0070\u002e\u006a\u0065\u0067\u006f\u0074\u0072\u0069\u0070\u002e\u0063\u006f\u006d\u002e\u0063\u006e';
  headers['Referer'] = '\u0068\u0074\u0074\u0070\u003a\u002f\u002f\u0074\u0061\u0073\u006b\u002e\u006a\u0065\u0067\u006f\u0074\u0072\u0069\u0070\u002e\u0063\u006f\u006d\u002e\u0063\u006e\u003a\u0038\u0030\u0038\u0030\u002f';
  const request = {
      url: url,
      headers: headers,
      body: body
  };
  return new Promise(resolve => {
    $.http.post(request)
      .then((resp) => {
        $.log(`\nTotal body: \n${$.toStr(resp)}`);
        data = $.toObj(resp.body);
        total = data.body.tripCoins;
        info += `无忧币总计：${total}💰\n`;
      })
      .catch((err) => {
        const error = '账号信息获取失败⚠️';
        $.error(error + '\n' + err);
        $.notify($.name, '', `${head+error}请查看日志‼️`);
      })
      .finally(() => {
        resolve();
      });
  });
}


function QuerySign() {
  const url = '\u0068\u0074\u0074\u0070\u0073\u003a\u002f\u002f\u0061\u0070\u0070\u002e\u006a\u0065\u0067\u006f\u0074\u0072\u0069\u0070\u002e\u0063\u006f\u006d\u002e\u0063\u006e\u002f\u0061\u0070\u0069\u002f\u0073\u0065\u0072\u0076\u0069\u0063\u0065\u002f\u0076\u0031\u002f\u006d\u0069\u0073\u0073\u0069\u006f\u006e\u002f\u0073\u0069\u0067\u006e\u002f\u0071\u0075\u0065\u0072\u0079\u0053\u0069\u0067\u006e\u003f\u0074\u006f\u006b\u0065\u006e\u003d' + token;
  headers['Origin'] = '\u0068\u0074\u0074\u0070\u0073\u003a\u002f\u002f\u0063\u0064\u006e\u002e\u006a\u0065\u0067\u006f\u0074\u0072\u0069\u0070\u002e\u0063\u006f\u006d\u002e\u0063\u006e';
  headers['Host'] = '\u0061\u0070\u0070\u002e\u006a\u0065\u0067\u006f\u0074\u0072\u0069\u0070\u002e\u0063\u006f\u006d\u002e\u0063\u006e';
  headers['User-Agent'] = 'Mozilla/4.0 MDN Example';
  headers['Referer'] = '\u0068\u0074\u0074\u0070\u0073\u003a\u002f\u002f\u0063\u0064\u006e\u002e\u006a\u0065\u0067\u006f\u0074\u0072\u0069\u0070\u002e\u0063\u006f\u006d\u002e\u0063\u006e\u002f';
  const request = {
      url: url,
      headers: headers
  };
  return new Promise(resolve => {
    $.http.post(request)
      .then(async (resp) => {
        $.log(`\nQuerySign body: \n${resp}`);
        data = resp.body;
        if (data.includes('成功')) {
          data = $.toObj(data);
          list = data.body.reverse();
          for (var i in list) {
            isSign = list[i].isSign;
            if (isSign == '3') {
              info += '签到失败：今日已签到‼️\n';
              break;
            } else if (isSign == '2') {
              id = list[i].id;
              rewardCoin = list[i].rewardCoin;
              await UserSign(headers);
              break;
            }
          }
        } else if (data.includes('不正确')) {
          invalid = true;
          $.notify($.name, '', `${head}\nToken已失效‼️`);
        }
      })
      .catch((err) => {
        const error = '签到状态获取失败⚠️';
        $.error(error + '\n' + err);
        $.notify($.name, '', `${head+error}请查看日志‼️`);
      })
      .finally(() => {
        resolve();
      });
  });
}


function UserSign(headers) {
  const url = '\u0068\u0074\u0074\u0070\u0073\u003a\u002f\u002f\u0061\u0070\u0070\u002e\u006a\u0065\u0067\u006f\u0074\u0072\u0069\u0070\u002e\u0063\u006f\u006d\u002e\u0063\u006e\u002f\u0061\u0070\u0069\u002f\u0073\u0065\u0072\u0076\u0069\u0063\u0065\u002f\u0076\u0031\u002f\u006d\u0069\u0073\u0073\u0069\u006f\u006e\u002f\u0073\u0069\u0067\u006e\u002f\u0075\u0073\u0065\u0072\u0053\u0069\u0067\u006e\u003f\u0074\u006f\u006b\u0065\u006e\u003d' + token;
  const body = `{"signConfigId":"${id}"}`;
  const request = {
      url: url,
      headers: headers,
      body: body
  };
  return new Promise(resolve => {
    $.http.post(request)
      .then((resp) => {
        $.log(`\nUserSign body: \n${resp}`);
        data = resp.body;
        if (data.includes('成功')) {
          info += `签到成功：无忧币 +${rewardCoin}🎉\n`;
        }
      })
      .catch((err) => {
        const error = '签到失败⚠️';
        $.error(error + '\n' + err);
        $.notify($.name, '', `${head+error}请查看日志‼️`);
      })
      .finally(() => {
        resolve();
      });
  });
}


function QueryVideoTask() {
  const url = '\u0068\u0074\u0074\u0070\u0073\u003a\u002f\u002f\u0075\u0064\u0073\u002d\u0069\u002e\u0063\u006d\u0069\u0073\u0068\u006f\u0077\u002e\u0063\u006f\u006d\u003a\u0031\u0034\u0034\u0033\u002f\u0075\u0064\u0073\u002f\u0063\u006c\u006f\u0075\u0064\u002f\u0077\u0061\u0074\u0063\u0068\u002f\u006c\u0069\u0073\u0074\u003f\u0076\u0065\u0072\u0073\u0069\u006f\u006e\u003d\u0031';
  headers['Origin'] = '\u0068\u0074\u0074\u0070\u0073\u003a\u002f\u002f\u0069\u0073\u0068\u006f\u0077\u002e\u006a\u0065\u0067\u006f\u0074\u0072\u0069\u0070\u002e\u0063\u006f\u006d\u002e\u0063\u006e';
  headers['Host'] = '\u0075\u0064\u0073\u002d\u0069\u002e\u0063\u006d\u0069\u0073\u0068\u006f\u0077\u002e\u0063\u006f\u006d\u003a\u0031\u0034\u0034\u0033';
  headers['Referer'] = '\u0068\u0074\u0074\u0070\u0073\u003a\u002f\u002f\u0069\u0073\u0068\u006f\u0077\u002e\u006a\u0065\u0067\u006f\u0074\u0072\u0069\u0070\u002e\u0063\u006f\u006d\u002e\u0063\u006e\u002f';
  const body = `{
      "userId":"${accountid}",
      "accountId":"${mobile}"
  }`;
  const request = {
      url: url,
      headers: headers,
      body: body
  };
  return new Promise(resolve => {
    $.http.post(request)
      .then(async (resp) => {
        $.log(`\nQueryVideoTask body: \n${resp}`);
        data = resp.body;
        if (data.includes('"exchangeNum":10,')) {
          info += `视频任务：今日已完成‼️\n`;
        } else {
          await VideoTask(headers);
        }
      })
      .catch((err) => {
        const error = '视频任务信息获取失败⚠️';
        $.error(error + '\n' + err);
        $.notify($.name, '', `${head+error}请查看日志‼️`);
      })
      .finally(() => {
        resolve();
      });
  });
}


function VideoTask(headers) {
  const url = '\u0068\u0074\u0074\u0070\u0073\u003a\u002f\u002f\u0075\u0064\u0073\u002d\u0069\u002e\u0063\u006d\u0069\u0073\u0068\u006f\u0077\u002e\u0063\u006f\u006d\u003a\u0031\u0034\u0034\u0033\u002f\u0075\u0064\u0073\u002f\u0063\u006c\u006f\u0075\u0064\u002f\u0077\u0061\u0074\u0063\u0068\u002f\u0075\u0070\u0064\u0061\u0074\u0065\u003f\u0076\u0065\u0072\u0073\u0069\u006f\u006e\u003d\u0031';
  headers['Referer'] = '\u0068\u0074\u0074\u0070\u0073\u003a\u002f\u002f\u0069\u0073\u0068\u006f\u0077\u002e\u006a\u0065\u0067\u006f\u0074\u0072\u0069\u0070\u002e\u0063\u006f\u006d\u002e\u0063\u006e\u002f\u0066\u0072\u0065\u0065\u0053\u0074\u0079\u006c\u0065\u0054\u006f\u0075\u0072\u0069\u0073\u006d\u002f\u0064\u0065\u0074\u0061\u0069\u006c';
  const body = `{
      "userId":"${accountid}",
      "userWatchTime":"10.0",
      "accountId":"${mobile}"
  }`;
  const request = {
      url: url,
      headers: headers,
      body: body
  };
  return new Promise(resolve => {
    $.http.post(request)
      .then(async (resp) => {
        $.log(`\nVideoTask body: \n${resp}`);
        data = resp.body;
        if (data.includes('update success')) {
          await Exchange(headers);
        }
      })
      .catch((err) => {
        const error = '视频任务失败⚠️';
        $.error(error + '\n' + err);
        $.notify($.name, '', `${head+error}请查看日志‼️`);
      })
      .finally(() => {
        resolve();
      });
  });
}


function Exchange(headers) {
  const url = '\u0068\u0074\u0074\u0070\u0073\u003a\u002f\u002f\u0075\u0064\u0073\u002d\u0069\u002e\u0063\u006d\u0069\u0073\u0068\u006f\u0077\u002e\u0063\u006f\u006d\u003a\u0031\u0034\u0034\u0033\u002f\u0075\u0064\u0073\u002f\u0063\u006c\u006f\u0075\u0064\u002f\u0077\u0061\u0074\u0063\u0068\u002f\u0065\u0078\u0063\u0068\u0061\u006e\u0067\u0065\u003f\u0076\u0065\u0072\u0073\u0069\u006f\u006e\u003d\u0031';
  headers['Referer'] = '\u0068\u0074\u0074\u0070\u0073\u003a\u002f\u002f\u0069\u0073\u0068\u006f\u0077\u002e\u006a\u0065\u0067\u006f\u0074\u0072\u0069\u0070\u002e\u0063\u006f\u006d\u002e\u0063\u006e\u002f\u0066\u0072\u0065\u0065\u0053\u0074\u0079\u006c\u0065\u0054\u006f\u0075\u0072\u0069\u0073\u006d\u002f\u0061\u0063\u0074\u0069\u0076\u0069\u0074\u0079';
  const body = `{
      "userId":"${accountid}",
      "exchangeTime":10,
      "exchangeNum":10,
      "accountId":"${mobile}"
  }`;
  const request = {
      url: url,
      headers: headers,
      body: body
  };
  return new Promise(resolve => {
    $.http.post(request)
      .then((resp) => {
        $.log(`\nExchange body: \n${resp}`);
        data = resp.body;
        if (data.includes('"exchangeNum":10,')) {
          info += '视频任务：无忧币 +10🎉\n';
        } else {
          $.error(`\n${head}\n兑换失败⚠️`);
          res = $.toObj(data.replace('.',''));
          info += `视频任务：${res.mes}‼️\n`;
        }
      })
      .catch((err) => {
        const error = '兑换失败⚠️';
        $.error(error + '\n' + err);
        $.notify($.name, '', `${head+error}请查看日志‼️`);
      })
      .finally(() => {
        resolve();
      });
  });
}


function GetCookie() {
  const { headers, url, method } = $request;
  const { body } = $response;
  if (url.includes('accountid') && url.includes('call_phone')) {
    const accountid = url.match(/accountid=(\d+)/)[1];
    const mobile = url.match(/call_phone=(\d+)/)[1];
    SetCookie('accountid',accountid,'mobile',mobile);
  }
  if (url.includes('logonFree') && body.includes('uid')) {
    const token = url.match(/token=(\w+)/)[1];
    const userid = body.match(/uid=(\w+)/)[1];
    SetCookie('token',token,'userid',userid);
  }
  if (info.length > 10) {
    $.notify($.name, '', info);
  }
  if (info.includes('\n')) {
    info = `=== 账号${AsVow.length}：${AsVow.pop().mobile} ===\nCookie完整🎉`;
    $.notify($.name, '', info);
  }
}


function SetCookie(k1,v1,k2,v2) {
  if (typeof AsVow != 'undefined') {
    if (!$.toStr(AsVow).includes(`'${k1}':'${v1}','${k2}':'${v2}'`)) {
      i = AsVow.length;
      if (k1 == 'token'){
        for (j in AsVow) {
          if (AsVow[j].userid == v2) {
            info = `=== 账号 ${AsVow[j].mobile} ===\n`
            AsVow[j][k1] = v1;
            $.write(AsVow, 'AsVow');
            $.read('AsVow') == AsVow ? info = '更新token成功🎉' : info = '更新token失败‼️';
            return;
          }
        }
      }
      if (Object.keys(AsVow[i-1]).length < 4){
        AsVow[i-1][k1] = v1;
        AsVow[i-1][k2] = v2;
      } else {
        AsVow[i] = {[k1]:v1,[k2]:v2};
      }
      $.write(AsVow, 'AsVow');
      $.read('AsVow') == AsVow ? info = `写入 ${k1} & ${k2} 成功🎉` : info = `写入 ${k1} & ${k2} 失败‼️`;
    }
  } else {
    AsVow = [{[k1]:v1,[k2]:v2}];
    $.write(AsVow, 'AsVow');
      $.read('AsVow') == AsVow ? info = `写入 ${k1} & ${k2} 成功🎉` : info = `写入 ${k1} & ${k2} 失败‼️`;
  }
  Cookie = $.toStr(AsVow[AsVow.length-1]);
  if (Cookie.match('accountid.*mobile') && Cookie.match('token.*userid')) {
    info += `\n`;
  }
}

// 随机 User-Agent
function GetRandomUA() {
  const USER_AGENTS=['Mozilla/5.0 (Linux; Android 10; ONEPLUS A5010 Build/QKQ1.191014.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (Linux; Android 9; Mi Note 3 Build/PKQ1.181007.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/045131 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 10; GM1910 Build/QKQ1.190716.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 9; 16T Build/PKQ1.190616.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (Linux; Android 9; MI 6 Build/PKQ1.190118.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 11; Redmi K30 5G Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045511 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15F79 source/jegotrip','Mozilla/5.0 (Linux; Android 10; M2006J10C Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 10; M2006J10C Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 10; ONEPLUS A6000 Build/QKQ1.190716.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045224 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 9; MHA-AL00 Build/HUAWEIMHA-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 8.1.0; 16 X Build/OPM1.171019.026; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 8.0.0; HTC U-3w Build/OPR6.170623.013; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (Linux; Android 10; LYA-AL00 Build/HUAWEILYA-AL00L; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (Linux; Android 8.1.0; MI 8 Build/OPM1.171019.026; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/045131 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 10; Redmi K20 Pro Premium Edition Build/QKQ1.190825.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045227 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip','Mozilla/5.0 (Linux; Android 11; Redmi K20 Pro Premium Edition Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045513 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (Linux; Android 10; MI 8 Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045227 Mobile Safari/537.36 source/jegotrip','Mozilla/5.0 (iPhone; CPU iPhone OS 14_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip'];
  const RANDOM_UA = USER_AGENTS[Math.min(Math.floor(Math.random() * USER_AGENTS.length), USER_AGENTS.length)];
  return RANDOM_UA;
}

// prettier-ignore
/*********************************** API *************************************/
function ENV(){const e='undefined'!=typeof $task,t='undefined'!=typeof $loon;return{isQX:e,isLoon:t,isSurge:'undefined'!=typeof $httpClient&&!t,isNode:'undefined'!=typeof module&&!!module.exports,isRequest:'undefined'!=typeof $request,isResponse:'undefined'!=typeof $response,isScriptable:'undefined'!=typeof importModule}}function HTTP(e={baseURL:''}){const{isQX:t,isLoon:s,isSurge:o,isNode:n,isScriptable:i}=ENV(),r=/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;const u={};return['GET','POST','PUT','DELETE','HEAD','OPTIONS','PATCH'].forEach(h=>u[h.toLowerCase()]=(u=>(function(u,h){h='string'==typeof h?{url:h}:h;const a=e.baseURL;a&&!r.test(h.url||'')&&(h.url=a?a+h.url:h.url),h&&h.body&&h.headers&&!h.headers['Content-Type']&&(h.headers['Content-Type']='application/x-www-form-urlencoded');const l=(h={...e,...h}).timeout,c={...{onRequest:()=>{},onResponse:e=>e,onTimeout:()=>{}},...h.events};let d,f;if(c.onRequest(u,h),t)d=$task.fetch({method:u,...h});else if(s||o||n)d=new Promise((e,t)=>{(n?require('request'):$httpClient)[u.toLowerCase()](h,(s,o,n)=>{s?t(s):e({statusCode:o.status||o.statusCode,headers:o.headers,body:n})})});else if(i){const e=new Request(h.url);e.method=u,e.headers=h.headers,e.body=h.body,d=new Promise((t,s)=>{e.loadString().then(s=>{t({statusCode:e.response.statusCode,headers:e.response.headers,body:s})}).catch(e=>s(e))})}const p=l?new Promise((e,t)=>{f=setTimeout(()=>(c.onTimeout(),t(`${u} URL: ${h.url} exceeds the timeout ${l} ms`)),l)}):null;return(p?Promise.race([p,d]).then(e=>(clearTimeout(f),e)):d).then(e=>c.onResponse(e))})(h,u))),u}function API(e='untitled',t=!1){const{isQX:s,isLoon:o,isSurge:n,isNode:i,isScriptable:r}=ENV();return new class{constructor(e,t){this.name=e,this.debug=t,this.http=HTTP(),this.env=ENV(),this.startTime=(new Date).getTime(),console.log(`\ud83d\udd14${e}, \u5f00\u59cb!`),this.node=(()=>{if(i){return{fs:require('fs')}}return null})(),this.initCache();Promise.prototype.delay=function(e){return this.then(function(t){return((e,t)=>new Promise(function(s){setTimeout(s.bind(null,t),e)}))(e,t)})}}initCache(){if(s&&(this.cache=JSON.parse($prefs.valueForKey(this.name)||'{}')),(o||n)&&(this.cache=JSON.parse($persistentStore.read(this.name)||'{}')),i){let e='root.json';this.node.fs.existsSync(e)||this.node.fs.writeFileSync(e,JSON.stringify({}),{flag:'wx'},e=>console.log(e)),this.root={},e=`${this.name}.json`,this.node.fs.existsSync(e)?this.cache=JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)):(this.node.fs.writeFileSync(e,JSON.stringify({}),{flag:'wx'},e=>console.log(e)),this.cache={})}}persistCache(){const e=JSON.stringify(this.cache,null,2);s&&$prefs.setValueForKey(e,this.name),(o||n)&&$persistentStore.write(e,this.name),i&&(this.node.fs.writeFileSync(`${this.name}.json`,e,{flag:'w'},e=>console.log(e)),this.node.fs.writeFileSync('root.json',JSON.stringify(this.root,null,2),{flag:'w'},e=>console.log(e)))}write(e,t){if(this.log(`SET ${t}`),-1!==t.indexOf('#')){if(t=t.substr(1),n||o)return $persistentStore.write(e,t);if(s)return $prefs.setValueForKey(e,t);i&&(this.root[t]=e)}else this.cache[t]=e;this.persistCache()}read(e){return this.log(`READ ${e}`),-1===e.indexOf('#')?this.cache[e]:(e=e.substr(1),n||o?$persistentStore.read(e):s?$prefs.valueForKey(e):i?this.root[e]:void 0)}delete(e){if(this.log(`DELETE ${e}`),-1!==e.indexOf('#')){if(e=e.substr(1),n||o)return $persistentStore.write(null,e);if(s)return $prefs.removeValueForKey(e);i&&delete this.root[e]}else delete this.cache[e];this.persistCache()}notify(e,t='',i='',r={}){const u=r['open-url'],h=r['media-url'];if(i=i.replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm,''),!this.isMute&&(s&&$notify(e,t,i,r),n&&$notification.post(e,t,i+`${h?'\n\u591a\u5a92\u4f53:'+h:''}`,{url:u}),o)){let s={};u&&(s.openUrl=u),h&&(s.mediaUrl=h),'{}'===this.toStr(s)?$notification.post(e,t,i):$notification.post(e,t,i,s)}if(!this.isMuteLog){let s=['','==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============='];s.push(e),t&&s.push(t),i&&s.push(i),u&&s.push(`\u70b9\u51fb\u8df3\u8f6c: ${u}`),h&&s.push(`\u591a\u5a92\u4f53: ${h}`),console.log(s.join('\n'))}}log(e){this.debug&&console.log(`[${this.name}] LOG:\n${this.toStr(e)}`)}info(e){console.log(`[${this.name}] INFO:\n${this.toStr(e)}`)}error(e){console.log(`[${this.name}] ERROR:\n${this.toStr(e)}`)}wait(e){return new Promise(t=>setTimeout(t,e))}done(e={}){const t=((new Date).getTime()-this.startTime)/1e3;console.log(`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${t} \u79d2`),s||o||n?$done(e):i&&'undefined'!=typeof $context&&($context.headers=e.headers,$context.statusCode=e.statusCode,$context.body=e.body)}toObj(e){if('object'==typeof e||e instanceof Object)return e;try{return JSON.parse(e)}catch(t){return e}}toStr(e){if('string'==typeof e||e instanceof String)return e;try{return JSON.stringify(e)}catch(t){return e}}}(e,t)}
/*****************************************************************************/
