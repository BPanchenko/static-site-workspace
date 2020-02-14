const logger = require('node-color-log')
const process = require('node:process')
const path = require('node:path')
const util = require('node:util')
const dateFormat = require('date-format')
const { root } = require("../.config/workspace.config.cjs")

const inspectOptions = { compact: false, showHidden: true, depth: 1, breakLength: 80 }
const roundNanoseconds = (value) => Math.round(value / 1000000) / 1000
const start = process.hrtime()

logger.setDate(() => dateFormat('hh:mm:ss.SSS', new Date()))

const debug = (...args) => {
	let curriedLogger = _.curry(logger.debug.bind(logger), args.length)
	args.forEach((arg) => {
		let parsed = arg
		if (_.isArrayLikeObject(arg)) {
			parsed = util.inspect(Array.from(arg), inspectOptions)
		} else if (_.isElement(arg)) {
			parsed = util.inspect(arg, inspectOptions)
		} else if (_.isObjectLike(arg)) {
			parsed = util.inspect(arg, inspectOptions)
		}
		return (curriedLogger = curriedLogger(parsed))
	})
}

logger.event = (name, ...args) => {
	logger.bold().color('black').append(`${name}: `).reset()

	switch(name) {
		case 'rename':
			args.splice(0, 0, 'from')
			args.splice(2, 0, 'to')
		default: 
			logger.debug(...args)
	}
}

logger.info = (...args) =>
	logger
		.color('white')
		.bgColor('blue')
		.append('[INFO]')
		.reset()
		.color('blue')
		.log(' ' + args.map((a) => a.toString()).join(' '))

logger.logSavedFile = (file, hrstart = start) => {
	const hrend = process.hrtime(hrstart);
	const relative = path.relative(root, file)
	logger
	  .bgColor('green')
	  .color('white')
	  .append('SAVED:')
	  .reset()
	  .append(` ${relative} `)
	  .bold()
	  .log(`in ${roundNanoseconds(hrend[1])} s`);
}
  
logger.logSummaryFiles = (array, hrstart = start) => {
	const hrend = process.hrtime(hrstart);
	logger
	  .color('green')
	  .bold()
	  .underscore()
	  .log(`TOTAL: Prepared ${array.length} files in ${roundNanoseconds(hrend[1])} seconds`);
}

module.exports = {
	default: logger,
	logger,
	debug,
}