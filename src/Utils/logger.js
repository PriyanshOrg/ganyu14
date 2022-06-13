const chalk = require("chalk");

class Logger {
  get now() {
    return Intl.DateTimeFormat("id-ID", {
      minute: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      month: "2-digit",
      year: "numeric",
      second: "2-digit",
    }).format(Date.now());
  }

	/**
   * @param  {string} type
   * @param  {string} error
   */
  error(type, error) {
    const message = error instanceof Error ? error.message : error;
    return console.error(`${chalk.red("[ERROR]")}[${type.toUpperCase()}][${this.now}]: ${message}`);
  }

	/**
   * @param  {string} type
   * @param  {string} warning
   */
  warn(type, warning) {
    return console.warn(
      `${chalk.yellow("[WARNING]")}[${type.toUpperCase()}][${this.now}]: ${warning}`,
    );
  }
  
	/**
   * @param  {string} type
   * @param  {string} message
   */
  log(type, message) {
    return console.log(
      `${chalk.blueBright("[INFO]")}[${type.toUpperCase()}][${this.now}]: ${message}`,
    );
  }
}

const logger = new Logger();

module.exports = {
	logger
}
