const { plugins: uikitPlugins } = require('@bpanchenko/uikit/postcss.config')
const { dirs, root } = require("./workspace.config.cjs")

module.exports = {
	root,
	input: [
		`${dirs.stylesheets}/document.css`,
		`${dirs.stylesheets}/main.css`,
	],
	plugins: [
		require('postcss-import-alias')({
			'~uikit': '@bpanchenko/uikit'
		}),
		...uikitPlugins
	],
	output: `${dirs.dist}/${dirs.bundles}`
}