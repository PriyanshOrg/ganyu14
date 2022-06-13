const DJS = require('discord.js');
const { token } = require('../config');
const { logger } = require('../Utils/logger');
const { readdir, readdirSync } = require('fs');
const { join, resolve } = require('path');
const { connect } = require('mongoose');
const __basedir = resolve();
const redis = require("redis");

class Ganyu extends DJS.Client{
	constructor(){
		super({
			intents: [
				DJS.GatewayIntentBits.Guilds,
				DJS.GatewayIntentBits.GuildMessages,
				DJS.GatewayIntentBits.MessageContent,
				DJS.GatewayIntentBits.GuildInvites,
				DJS.GatewayIntentBits.GuildMembers,
				DJS.GatewayIntentBits.GuildPresences,
				DJS.GatewayIntentBits.GuildMessageReactions,
				DJS.GatewayIntentBits.GuildEmojisAndStickers
			],
			makeCache: DJS.Options.cacheWithLimits({
				...DJS.Options.DefaultMakeCacheSettings,
				MessageManager: 120,
				UserManager: 120,
				VoiceStateManager: 0,
				ReactionManager: 10,
				ThreadManager: 0,
				ThreadMemberManager: 0,
				StageInstanceManager: 0,
				PresenceManager: 120,
				ReactionUserManager: 0,
				GuildStickerManager: 0,
				GuildBanManager: 0,
				BaseGuildEmojiManager: 0,
				GuildInviteManager: 0,
				ApplicationCommandManager: 0
			})
		})
		this.commands = new DJS.Collection()
		this.aliases = new DJS.Collection()
		this.cooldown = new DJS.Collection()
		this.databaseCache = new DJS.Collection()
		this.guildsData = require("../schema/GuildSchema")
		this.logger = logger
		this.config = require("../config")
		this.emot = this.config.emotes
		// eslint-disable-next-line no-undef
		this.basedir = __dirname
		this.redis = redis.createClient("127.0.0.1", 6379)
	}

	
	/**
	 * EVENTS HANDLER
	 * @param  {string} path
	 */
	loadEvents(path) {
    readdir(path, (err, files) => {
      if (err) console.error(err);
      files = files.filter(f => f.split('.').pop() === 'js');
      if (files.length === 0) return this.logger.warn('No events found');
      this.logger.log("Loading",`${files.length} event(s) found...`);
      files.forEach(f => {
        const eventName = f.substring(0, f.indexOf('.'));
        const event = require(resolve(__basedir, join(path, f)));
        super.on(eventName, event.bind(null, this));
        delete require.cache[require.resolve(resolve(__basedir, join(path, f)))];
        this.logger.log("Loading", `Loading event: ${eventName}`)
      });
    });
    return this;
  }

	/**
	 * Commands Handler
	 * @param  {string} path
	 */
	loadCommands(path) {
    const commandFolder = readdirSync(path)
		for (const folder of commandFolder) {
			const commandFiles = readdirSync(`${__basedir}/${path}/${folder}`).filter(files => files.endsWith(".js"))
			for (const file of commandFiles) {
				const command = require(`${__basedir}/${path}/${folder}/${file}`);
				this.logger.log("Loading", `Loading Commands: ${command.name}`);
				this.commands.set(command.name, command)
				if (command.aliases && command.aliases.length > 0) {
					for (let alias of command.aliases) {
						this.aliases.set(alias, command)
					}
				}
			}
		}
  }

	/**
	 * Login
	 */
	loginBot() {
		this.login(token)
	}

	connectDatabase() {
		connect(process.env.MONGO_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
			.then(() => {
				this.logger.log("Database","Connected to the Mongodb database.")
			})
			.catch((err) => {
				this.logger.error("Database","Unable to connect to the Mongodb database. Error: " + err)
			})
	}

	async findOrCreateGuild({ id: guildID }) {
		if (await this.redis.get(guildID) !== null) {
			return JSON.parse(await this.redis.get(`ganyu-${guildID}`))
		}
		else {
			let guildData = await this.guildsData.findOne({ id: guildID })
			if (guildData) {
				this.redis.set(`ganyu-${guildID}`, JSON.stringify(guildData))
				this.redis.expire(`ganyu-${guildID}`, 86400)
				return guildData
			}
			else {
				guildData = new this.guildsData({ id: guildID })
				await guildData.save()
				this.redis.set(`ganyu-${guildID}`, JSON.stringify(guildData))
				this.redis.expire(`ganyu-${guildID}`, 86400)
				return guildData
			}
		}
	}

	getPrefix(message, data) {
		if (message.channel.type !== "DM") {
			const prefixes = [
				data.prefix,
				`<@!${message.client.user.id}> `,
				`<@${message.client.user.id}> `,
				message.client.user.username.toLowerCase(),
			]
			let prefix = null
			prefixes.forEach((p) => {
				if (message.content.startsWith(p) || message.content.toLowerCase().startsWith(p)) {
					prefix = p
				}
			})
			return prefix
		}
		else {
			return true
		}
	}

	/**
	 * Embed Builder
	 * @returns EmbedBuilder
	 */
	embed({ title = "", desc = "" }) {
		let embed = new DJS.EmbedBuilder()
		if (title){
			embed
			.setTitle(title.toString())
		}
		if (desc) {
			embed
			.setDescription(desc.toString())
		}
		embed
		.setColor(DJS.Colors.Blue)
		return embed
	}

}

module.exports = Ganyu