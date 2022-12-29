exports.CommandHandler = require(`${__dirname}/command.js`);
exports.EventHandler = require(`${__dirname}/event.js`);
exports.FunctionHandler = require(`${__dirname}/function.js`);
exports.log = (msg) => console.log(`\x1b[31mAssistants \x1b[37m» \x1b[32m${msg}\x1b[37m`);