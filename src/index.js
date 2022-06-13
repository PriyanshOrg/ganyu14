const Ganyu = require("./structures/Ganyu");
const client = new Ganyu()

const init = () => {
	client.loadCommands("./src/commands")
	client.loadEvents("./src/events")
	client.loginBot()
	client.connectDatabase()
}
init()

process.on("unhandledRejection", (error) => client.logger.error("error", error));

process.on("uncaughtExceptionMonitor", (error) => client.logger.error("error", error.stack));

process.on("uncaughtException", error => client.logger.error("error", error.stack));
	
process.on("warning", (warning) => {
  client.logger.warn("warning", warning)
});