const path = require('node:path')

const beautifyConfig = require("./posthtml-beautify.config.cjs")
const expressions = require("./posthtml-expressions.options.cjs")
const { dirs, root } = require("./workspace.config.cjs")

module.exports = {
	root,
	input: `${dirs.html}/**/*.html`,
	output: dirs.dist,
	plugins: [
		require('posthtml-extend')({
			root: path.join(root, '.templates'),
			expressions,
			tagName: 'template',
			slotTagName: 'slot',
			fillTagName: 'block'
		}),
		require('htmlnano')({ removeComments: 'all' }),
		require('posthtml-beautify')(beautifyConfig)
	]
}
