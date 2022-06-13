/* eslint-disable no-unused-vars */
const { Message, PermissionFlagsBits, Colors, codeBlock } = require("discord.js")
const Ganyu = require("../../structures/Ganyu")
const Guilds = require("../../schema/GuildSchema")

module.exports = {
	name: "eval",
	devOnly: true,
	clientPerms: {
		bitfield: [PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.EmbedLinks],
		display: ["READ_MESSAGE_HISTORY", "EMBED_LINKS"]
	},
	/**
	 * @param  {Ganyu} client
	 * @param  {Message} message
	 * @param  {Array} args
	 */
	async execute(client, message, args, data) {

		const input = args.join(" ")
		if (!input.toLowerCase().includes("token")) {
			const embed = client.embed({})

			let output = new Promise((resolve) => resolve(eval(input)));
			return output.then((output) => {
				if(typeof output !== "string"){
					output = require("util").inspect(output, { depth: 0 });
				}
				if(output.includes(client.token)){
					output = output.replace(client.token, "(╯°□°)╯︵ ┻━┻ MY token. **MINE**.");
				}
	
				embed
				.setDescription(codeBlock("js", output.length > 2048 ? "Too large to display." : output))
				.setColor(Colors.Blue)
				message.reply({ embeds: [embed] })		
			})
			.catch((err) => {
				err = err.toString();
				if(err.includes(client.token)){
					err = err.replace(client.token, "(╯°□°)╯︵ ┻━┻ MY token. **MINE**.");
				}
				embed
				.addFields([
					{ name: "Input", value: codeBlock("js", input.length > 1024 ? "Too large to display." : input) },
					{ name: "Output", value: codeBlock("js", err.length > 1024 ? "Too large to display." : err) },
				])
				.setColor(Colors.DarkRed)
				message.reply({ embeds: [embed] })
			});
		}
		else {
			message.reply("(╯°□°)╯︵ ┻━┻ MY token. **MINE**.")
		}
	},
}
