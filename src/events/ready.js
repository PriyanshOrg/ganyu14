// eslint-disable-next-line no-unused-vars
const Ganyu = require("../structures/Ganyu");

/**
 * @param  {Ganyu} client
 */
module.exports = async (client) => {
	client.user.setActivity({ name: "you", type: "WATCHING" })

	client.logger.log("Events", `${client.user.username} is online!`);
	await client.redis.connect().catch((err) => client.logger.error("Redis", err.message)).then(() => client.logger.log("Redis", "Connected"))
}