/*
来源：https://raw.githubusercontent.com/xream/surge/master/Module/Reddit.sgmodule

#!name=Reddit
#!desc=Reddit官方客户端去除时间线Promoted广告
#!system=ios

[Script]
Reddit.js = script-path=https://raw.githubusercontent.com/xream/surge/master/Script/Reddit.js,requires-body=true,type=http-response,pattern=^https?:\/\/gql\.reddit\.com

[MITM]
hostname = %APPEND% gql.reddit.com
*/

const body = JSON.parse($response.body)

/*
if (body.data && body.data.subreddit && body.data.subreddit.posts && body.data.subreddit.posts.edges) {
  body.data.subreddit.posts.edges = body.data.subreddit.posts.edges.filter(i => i && i.node && (i.node.__typename !== "AdPost"))
}
*/
if (body.data && body.data.home && body.data.home.posts && body.data.home.posts.edges) {
  body.data.home.posts.edges = body.data.home.posts.edges.filter(i => i && i.node && (i.node.__typename !== "AdPost"))
} else if (body.data && body.data.popular && body.data.popular.posts && body.data.popular.posts.edges) {
  body.data.popular.posts.edges = body.data.popular.posts.edges.filter(i => i && i.node && (i.node.__typename !== "AdPost"))
}

$done({body: JSON.stringify(body)});