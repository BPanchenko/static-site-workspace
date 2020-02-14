const child_process = require("node:child_process")
const path = require('node:path')
const { existsSync, mkdirSync } = require('node:fs')

const glob = require('glob')
const { root } = require('../.config/workspace.config.cjs')

const BUILDS = [
	['Scripts', () => child_process.fork('./.kernel/builder/scripts.js')],
	['Stylesheets', () => child_process.fork('./.kernel/builder/stylesheets.cjs')],
	['HTML', () => child_process.fork('./.kernel/builder/html.js')],
]

const checkProductionMode = () => getEnvMode() === 'production'
const checkDevelopmentMode = () => getEnvMode() === 'development'

const getEnvMode = () => (`${process.env.NODE_ENV ?? 'development'}`).trim()

const getFilesByPattern = (pattern, ignore) => glob
	.sync(pattern, {
		dot: false,
		ignore
	}).map((file) => path.resolve(root, file))

function checkFileDir(filePath) {
	const { dir } = path.parse(filePath)
	if (!existsSync(dir)) {
		mkdirSync(dir, { recursive: true })
	}
	return true
}

function debounce(func, timeout = 300){
	let timer;
	return (...args) => {
	  clearTimeout(timer);
	  timer = setTimeout(() => { func.apply(this, args); }, timeout);
	}
}

module.exports = {
	BUILDS,
	checkDevelopmentMode,
	checkFileDir,
	checkProductionMode,
	debounce,
	getEnvMode,
	getFilesByPattern
}