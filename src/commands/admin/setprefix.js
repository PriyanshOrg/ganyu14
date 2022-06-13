/* eslint-disable no-unused-vars */
const { Message, PermissionFlagsBits } = require("discord.js")
const Ganyu = require("../../structures/Ganyu")

module.exports = {
	name: "setprefix",
	cooldown: 3,
	adminOnly: true,
	reqArgs: true,
	description: "Change the default prefix",
	usage: "setprefix <new prefix>",
	clientPerms: {
		bitfield: [PermissionFlagsBits.ReadMessageHistory],
		display: ["READ_MESSAGE_HISTORY"]
	},
	/**
	 * @param  {Ganyu} client
	 * @param  {Message} message
	 * @param  {Array} args
	 * @param	 {object} data
	 */
	async execute(client, message, args, data, schema) {

		// Define a new prefix
		const prefix = args[0]

		// If the prefix is too long
		if (prefix.length > 5) return message.reply("prefix is too long")

		// Save to database
		data.prefix = prefix;
		schema.findOneAndUpdate({
			id: message.guild.id
		}, {
			data
		})
		client.redis.set(`ganyu-${message.guild.id}`, JSON.stringify(data))
		
		return message.reply({ embeds: [
			{
				description: `Prefix has been changed to \`${prefix}\``,
				color: 0x70ff9d,
			},
		] });
	},
}