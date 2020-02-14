const path = require('node:path')
const { dirs, root } = require("./workspace.config.cjs")

const config = {
	applyCSSLive: true,
	domain: 'localhost',
	exts: [ 'html', 'css', 'js' ],
	ports: {
		client: 8080,
		livereload: 35729
	}
}

const base = new URL(`http://${config.domain}:${config.ports.client}`)
const livereloadScriptURL = new URL('/livereload.js?snipver=1', `http://${config.domain}:${config.ports.livereload}`)
const watchedPaths = [dirs.dist, dirs.static].map(item => path.resolve(root, item))

module.exports = {
	...config,
	base,
	livereloadScriptURL,
	watchedPaths
}
