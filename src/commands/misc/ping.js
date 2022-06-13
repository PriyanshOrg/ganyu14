/* eslint-disable no-unused-vars */
const Ganyu = require("../../structures/Ganyu")
const { Message, PermissionFlagsBits } = require("discord.js")

const humanizeDuration = require("humanize-duration")
const { stripIndents } = require("common-tags/lib")

module.exports = {
	name: "ping",
	usage: "ping",
	description: "Replies with pong",
	clientPerms: {
		bitfield: [PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.EmbedLinks],
		display: ["READ_MESSAGE_HISTORY", "EMBED_LINKS"]
	},
	/**
	 * @param  {Ganyu} client
	 * @param  {Message} message
	 */
	async execute(client, message) {
		const m = await message.reply("Pinging...")
		.catch(() => console.log())
		m.edit({
			content: " ", embeds: [
				client.embed({
					title: "PONG!",
					desc: stripIndents`
					**Latency** · \`${Date.now() - message.createdTimestamp}ms\`
					**Api** · \`${client.ws.ping}ms\`
					**Uptime** · ${humanizeDuration(client.uptime, { round: true })}`
				})
			]
		})
		.catch(err => client.logger.error("COMMAND ERROR", err.stack))
	}
}