import * as ports from "port-authority"

import childProcess from "child_process"
import coloring from "chalk"
import livereload from "livereload"

import config from "../../.config/server.config.js"

const livePortFound = (port) => {
	const liveServer = livereload.createServer({ ...config, port })
	liveServer.watch(config.watchedPaths)
	
	console.log(coloring.green('LiveReload enabled on port ' + port))
	childProcess.exec(`start chrome ${config.base}`)
}

export const serverReady = () => {
	console.log(coloring.green(`DEV Server started at ${config.base}`))
	ports.find(config.ports.livereload).then(livePortFound)
}
