import child_process from "node:child_process"
import fs from "node:fs"
import path from "node:path"

import { BUILDS } from "../lib.cjs"
import logger from "../logger.cjs"
import workspace from "../../.config/workspace.config.cjs"

logger.info("Start Building")

// 1. Cleaning up previous bundle and copying resources

fs.rmSync(
	path.join(workspace.root, workspace.dirs.dist),
	{ recursive: true, force: true }
)

fs.cpSync(
	path.join(workspace.root, workspace.dirs.static),
	path.join(workspace.root, workspace.dirs.dist),
	{ recursive: true }
)

// 2. Synchronous source code building

const promises = BUILDS.map(
	async ([ref, build]) => await new Promise(
		(resolve) => build().on('exit', () => resolve(ref))
	)
)

// 3. Update the site map

promises.push(
	await new Promise((resolve) =>
		child_process.fork('./.kernel/builder/sitemap.js')
		.on('exit', () => resolve('SiteMap')))
)

Promise.allSettled(promises).then(
	() => {
		logger.info("Building is finished")
		process.exit(0)
	}
)

