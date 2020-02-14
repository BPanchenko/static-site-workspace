import path from "node:path"
import process from "node:process"

import Watcher from 'watcher'
import logger from "./logger.cjs"
import workspace from "../.config/workspace.config.cjs"

import { BUILDS, debounce } from "./lib.cjs"

const { dirs, root } = workspace

const options = {
	recursive: true,
	renameDetection: true
}

const watchers = BUILDS.map(([ref, build]) => {
	const w = new Watcher(path.join(root, dirs[ref.toLowerCase()]), options, (event, targetPath, targetPathNext) => {
		logger.event(event, targetPath, targetPathNext ?? '')
	})
	w.on('all', () => debounce(build)())
	w.on('ready', () => logger.info(`${ref} watching is running`))
	return w
})

;['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(sig => process.on(sig, () => watchers.forEach(w => w.close())));