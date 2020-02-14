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

logger.event = (name, ...args) => {
	logger.bold().color('black').append(`${name}: `).reset()

	switch(name) {
		case 'rename':
			args.splice(0, 0, 'from')
			args.splice(2, 0, 'to')
		default: 
			logger.write(...args)
	}
}

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

logger.write = (...args) => {
	args.forEach((arg, ind, args) => {
		if (typeof arg === 'object') {
			args[ind] = util.inspect(arg, inspectOptions)
		} else if (typeof arg === 'string' && arg.includes(root)) {
			args[ind] = '`' + arg.replace(root, '') + '`'
		}
	})

	logger.log(...args)
}

module.exports = logger