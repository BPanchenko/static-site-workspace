const { dirs } = require("./workspace.config.cjs")
const { getFilesByPattern, checkDevelopmentMode } = require("../.kernel/lib.cjs")

module.exports = {
	input: getFilesByPattern(`${dirs.scripts}/*.{js,mjs}`),
	output: {
		entryFileNames: '[name].mjs',
		sourcemap: checkDevelopmentMode(),
		format: 'es',
	},
	plugins: [
		require("@rollup/plugin-node-resolve").nodeResolve(),
		require("@rollup/plugin-terser")()
	]
}
