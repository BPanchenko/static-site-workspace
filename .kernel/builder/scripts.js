import fs from 'node:fs'
import path from 'node:path'
import { makeDirectorySync } from "make-dir"
import { rollup } from 'rollup'

import config from "../../.config/rollup.config.cjs"
import workspace from "../../.config/workspace.config.cjs"
import logger from "../logger.cjs"

const { dirs, root } = workspace
const dist = path.join(root, dirs.dist, dirs.bundles)
const savedFiles = []

makeDirectorySync(dist)
build()

async function build() {
	logger.log('Start building Browser Scripts')
	let bundle
	let buildFailed = false
	try {
		bundle = await rollup(config)
		await generateOutputs(bundle)
	} catch (err) {
		buildFailed = true
		logger.error(err)
	}
	if (bundle) {
		await bundle.close()
		logger.logSummaryFiles(savedFiles)
	}
	process.exit(buildFailed ? 1 : 0)
}

async function generateOutputs(bundle) {
	const { output } = await bundle.generate(config.output)

	for (const chunkOrAsset of output) {
		const { type, fileName, code, source } = chunkOrAsset
		const file = path.join(dist, fileName)
		const content = type === 'asset' ? source : code
		saveFile(file, content)
	}
}

function saveFile(file, content) {
	fs.writeFileSync(file, content)
	logger.logSavedFile(file)
	savedFiles.push(file)
}