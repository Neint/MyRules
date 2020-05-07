/*
来源：https://github.com/Xu1o/Surge/tree/master

#!name=Reddit
#!desc=Reddit官方客户端去除时间线Promoted广告
#!system=ios

[MITM]
hostname = %APPEND% oauth.reddit.com

[Script]
http-response ^https?:\/\/oauth\.reddit\.com\/api\/v1\/me\.json\?raw_json\=1" requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/Neint/MyRules/master/Surge/Surge3/Reddit1.js,script-update-interval=0
*/

var obj = JSON.parse($response.body); 
obj['seen_premium_adblock_modal'] = true;
obj['has_subscribed_to_premium'] = true;
obj['user_is_subscriber'] = true;
obj['safe_search'] = false;
obj['coins'] = 100000;

$done({body: JSON.stringify(obj)});
