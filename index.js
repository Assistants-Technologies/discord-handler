exports.CommandHandler = require(`${__dirname}/command.js`);
exports.EventHandler = require(`${__dirname}/event.js`);
exports.FunctionHandler = require(`${__dirname}/function.js`);
exports.log = message => console.log(`\x1b[31mAssistants \x1b[37m» \x1b[32m${message}\x1b[37m`);