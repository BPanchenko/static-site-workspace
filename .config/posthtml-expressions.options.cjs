const { checkDevelopmentMode } = require("../.kernel/lib.cjs")
const { livereloadScriptURL } = require("./server.config.cjs")

module.exports = {
	locals: {
		isDev: checkDevelopmentMode(),
		livereloadScriptURL
	},
	strictMode: false
}
