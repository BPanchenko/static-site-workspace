import fs from "node:fs"
import path from "node:path"
import posthtml from "posthtml"
import { makeDirectorySync } from "make-dir"

import config from "../../.config/posthtml.config.cjs"
import logger from "../logger.cjs"
import workspace from "../../.config/workspace.config.cjs"
import { getFilesByPattern } from "../lib.cjs"

const { dirs, root } = workspace

{
	logger.log('Start building HTML')

	const files = getFilesByPattern(config.input)
	
	const promises = files.map(async (input) => {
		const relative = path.relative(path.resolve(root, dirs.html), input)
		const output = path.resolve(root, dirs.dist, relative)
		const source = fs.readFileSync(input)

		const { html } = await posthtml(config.plugins)
			.process(source)

		makeDirectorySync(path.parse(output).dir)
		fs.writeFileSync(output, html)
		logger.logSavedFile(output)
	})
	
	Promise.allSettled(promises).then((results) => {
		logger.logSummaryFiles(results)
		process.exit(results.length === 0 ? 1 : 0)
	})
}