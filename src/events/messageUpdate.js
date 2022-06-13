/* eslint-disable no-unused-vars */
const { Message } = require("discord.js")

/** Process
 * @param  {Message} old
 * @param  {Message} news
 */
module.exports = async (client, old, news) => {
	if (news.author.id !== "646937666251915264") return
	if (news.embeds.length <= 0) return
	const e = news.embeds[0]
	if (e.title === "Actions Menu") {
		console.log(e)
	}
}