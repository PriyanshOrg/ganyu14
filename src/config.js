require("dotenv").config()

module.exports = {
	token: process.env.TOKEN,
	prefix: "g",
	support: {
		id: "867089739224317994",
		invite: "https://discord.com/invite/keqingbot",
		logs: "867966959462023209",
	},
	invite: {
		topgg: "https://top.gg/bot/772642704257187840",
	},
	emotes: {
		success: "<:check:910161042754125854>",
		error: "<:xmark:910160267361550427>",
		online: "<:online:938742766639403009>",
		offline: "<:offline:942099139448172596>",
		dnd: "<:dnd:938748152176070706>",
		idle: "<:idle:938748996531396608>",
		next: "<:next:939787007226445855>",
		back: "<:back:939787007637479474>",
		loading: "<a:loading:902809910306308126>"
	},
	owner: {
		id: ["435931308061884416"],
		name: ["Dei#6089"],
	},
}