const path = require('node:path')
const { readFileSync, writeFileSync } = require('node:fs')
const postcss = require('postcss')

const config = require("../../.config/postcss.config.cjs")
const logger = require('../logger.cjs')
const { getFilesByPattern, checkFileDir } = require('../lib.cjs')

const { root } = require("../../.config/workspace.config.cjs")

const getTarget = (filePath) => {
	const { base } = path.parse(filePath);
	return path.join(root, config.output, base);
}

{
	logger.log('Start building Stylesheets')
	
	const promises = getFilesByPattern(config.input).map((source) => {
		const target = getTarget(source)
		const rawCss = readFileSync(source, { flag: 'r' })
		
		checkFileDir(target)

		return postcss(config.plugins)
		  .process(rawCss, { from: source, to: target })
		  .then((result) => {
			writeFileSync(target, result.css, { flag: 'w' })
	  
			const relative = target.replace(root, '').replace(/^\\/, '')
			logger.logSavedFile(relative)
		  })
		  .catch((error) => {
			logger.error(error)
		  })
	})
	  
	Promise.allSettled(promises).then((results) => {
		logger.logSummaryFiles(results)
		process.exit(results.length === 0 ? 1 : 0)
	})
}
