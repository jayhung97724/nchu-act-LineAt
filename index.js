const linebot = require('linebot');
const express = require('express');

const bot = linebot({
	channelId: process.env.CHANNEL_ID,
	channelSecret: process.env.CHANNEL_SECRET,
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

const app = express();

const linebotParser = bot.parser();

app.get('/',function(req,res){
    res.send('Hello World!');
});

app.post('/linewebhook', linebotParser);

let faqTemplate = {
	"type": "template",
	"altText": "這是常見問題集",
	"template": {
		"type": "buttons",
		"thumbnailImageUrl": "https://i.imgur.com/Sj1X4b1.png",
		"imageAspectRatio": "rectangle",
		"imageSize": "cover",
		"imageBackgroundColor": "#FFFFFF",
		"title": "常見問題",
		"text": "請選擇想查詢的內容",
		"defaultAction": {
			"type": "uri",
			"label": "View detail",
			"uri": "https://www.osa.nchu.edu.tw/osa/act/107club/"
		},
		"actions": [
			{
				"type": "postback",
				"label": "中興大學怎麼去",
				"data": "中興大學怎麼去",
				"displayText": "點擊座標以地圖App導航 \uDBC0\uDC49，或者到這裡參考更多：http://www.nchu.edu.tw/about-route-map/mid/83"
			},
			{
				"type": "uri",
				"label": "場館資訊",
				"uri": "https://www.osa.nchu.edu.tw/osa/act/107club/modules/tadnews/page.php?nsn=7"
			},
			{
				"type": "uri",
				"label": "跟著小天鵝，趣游湖畔",
				"uri": "https://www.facebook.com/NCHUlakefestival/"
			}
		]
	}
};
let myLocation = {
	"type": "location",
	"title": "我的地點在",
	"address": "402 台中市南區興大路145號",
	"latitude": 24.123568,
	"longitude": 120.675343
}

bot.on('postback', function (event) {
	let postbackData = event.postback.data;
	if (postbackData == "中興大學怎麼去") {
		event.reply(myLocation);
	}
})

bot.on('message', function (event) {
	let msg = event.message.text;
	console.log(msg);
	console.log(msg.indexOf('問') != -1);
	if (msg.indexOf('問') != -1 || msg.indexOf('鵝') != -1 || msg.indexOf('？') != -1 || msg.indexOf('?') != -1) {
		event.reply(faqTemplate).then(function (data) {
			console.log('Success', data);
		}).catch(function (error) {
			console.log('Error', error);
		});
	} else if (msg.search('[/hi/i安好嗨你笨豬呆萌哈喔哦！><]') != -1) {
		event.reply(msg);
	} else {
		event.reply(`可以呼叫「小天鵝」來幫你 \uDBC0\uDC0D`);
	}
});

// listen on port
const port = process.env.PORT || 80;
app.listen(port, function () {
	console.log(`LineBot is running on port ${port}`);
});