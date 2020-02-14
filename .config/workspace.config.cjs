const config = {
	root: process.cwd(),
	dirs: {
		bundles: 'assets',
		dist: 'public',
		html: 'src',
		scripts: 'js',
		static: 'resources',
		stylesheets: 'css'
	}
}

module.exports = {
	...config,
	default: config
}