/*
来源：https://github.com/Xu1o/Surge/tree/master

#!name=Reddit
#!desc=Reddit官方客户端去除时间线Promoted广告
#!system=ios

[MITM]
hostname = %APPEND% oauth.reddit.com

[Script]
http-response ^https?:\/\/oauth\.reddit\.com\/api\/v1\/me\/prefs\.json requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/Neint/MyRules/master/Surge/Surge3/Reddit.js,script-update-interval=0
*/

var obj = JSON.parse($response.body); 
obj['third_party_site_data_personalized_ads'] = false;
obj['hide_ads'] = true;
obj['activity_relevant_ads'] = false;
obj['third_party_data_personalized_ads'] = false;
obj['search_include_over_18'] = true;
$done({body: JSON.stringify(obj)});
