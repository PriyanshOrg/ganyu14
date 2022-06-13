/* eslint-disable no-unused-vars */
const { EmbedBuilder } = require("@discordjs/builders");
const { Message, Collection, PermissionFlagsBits, ActionRowBuilder } = require("discord.js");
const Ganyu = require("../structures/Ganyu");
/**
 * @param  {Ganyu} client
 * @param  {Message} message
 */
module.exports = async (client, message) => {
	
	let data = {}

	if (message.guild) {
		const guild = await client.findOrCreateGuild({ id: message.guild.id });
		data = guild;
	}

	if (message.content.includes(`<@!${client.user.id}>`)) {
		message.reply(`Hi :wave: my prefix is \`${data.prefix}\``)
	}
	
	const prefix = client.getPrefix(message, data);

	if (!prefix || message.author.bot) return
	const args = message.content.slice(prefix.toString().length).trim().split(/ +/g)
	const cmd = args.shift()
	const command = client.commands.get(cmd) || client.aliases.get(cmd)
	if (!command) return
	if (command.devOnly) {
		if (message.author.id != client.config.owner.id) {
			return message.reply({ embeds: [
				{
					color: "RED",
					title: "Missing Permission",
					description: "You do not have access to that command."
				}
			] })
		}
	}
	if (command.adminOnly) {
		if (!message.member.permissions.has("ADMINISTRATOR")) {
			return message.reply({ embeds: [
				{
					color: "RED",
					title: "Missing Permission",
					description: "You are too weak to use this command :("
				}
			] })
		}
	}
	if (command.reqArgs) {
		if (!args.length) {
			return message.reply({ embeds: [client.embed({ title: "Invalid arguments", desc: `Usage : \`${prefix}${command.usage}\`` }).setColor("RED")] })
		}
	}
	if (command.clientPerms) {
		const perms = message.channel.permissionsFor(message.guild.members.me)
		if (!perms.has([PermissionFlagsBits.SendMessages])) return
		if (!perms || !perms.has(command.clientPerms.bitfield)) {
			return message.channel.send(`${client.emot.error} | Uh... I need the \`${command.clientPerms.display.join(", ").toString()}\` permissions to perform this action. Please fix it.. thanks.`)
				.catch((err) => console.log(err))
		}
	}
	if (command.permissions) {
		const authorPerms = message.channel.permissionsFor(message.author)
		if (!authorPerms || !authorPerms.has(command.permissions)) {
			const noPerms = new EmbedBuilder()
				.setColor("RED")
				.setDescription("You don't have permissions to run this command")

			message.reply({ embeds: [noPerms] })
				.then((sent) => {
					setTimeout(() => {
						sent.delete()
					}, 2000)
				})
		}
	}
	const { cooldown } = client
	if (!cooldown.has(command.name)) {
		cooldown.set(command.name, new Collection())
	}
	const now = Date.now()
	const timestamp = cooldown.get(command.name)
	const cooldownAmount = (command.cooldown || 1) * 1000

	if (timestamp.has(message.author.id)) {
		const expired = timestamp.get(message.author.id) + cooldownAmount
		if (now < expired) {
			const timeleft = (expired - now) / 1000
			const timeleftEmbed = new EmbedBuilder()
				.setColor("RED")
				.setDescription(`Please wait another ${timeleft.toFixed(1)} more seconds to able to run this command again`)
			return message.reply({ embeds: [timeleftEmbed] })
		}
	}

	timestamp.set(message.author.id, now)
	setTimeout(() => timestamp.delete(message.author.id), cooldownAmount)

	try {
		command.execute(client, message, args, data, client.guildsData).catch((reason) => {
			client.logger.error("COMMAND ERROR", reason.stack)
			message.reply(`an error has occurred while running this command. DM \`Dei#4445\` to report this bug.`)
			// client.errHandler(reason, command.name)
			// client.webhookLog(client.emot.error, "ERROR", reason.stack)
		})
	}
	catch (err) {
		client.logger.error("Message Create", err.stack)
		message.reply(`An error happened while trying to run this command. Please contact \`${client.config.owner.name}\` thanks.`)
	}
}