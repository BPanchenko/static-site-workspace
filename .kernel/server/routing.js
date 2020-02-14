import coloring from "chalk"
import express from "express"
import fs from "fs"
import globToRegExp from "glob-regex"
import path from "path"
import posthtml from "posthtml"
import posthtmlConfig from "../../.config/posthtml.config.js"
import serverConfig from "../../.config/server.config.js"

export const htmlSourcesRouter = (router => {
	const rule = globToRegExp(
		posthtmlConfig.input
			.map(str => ('/' + str).replace('//', '/'))
	)

	const handler = (request, response, next) => {
		const { dir, base: file } = path.parse(request.path)
		const fileDir = path.join(dir, file)
		const filePath = path.join(process.cwd(), dir, file)

		if (fs.existsSync(filePath)) {
			try {
				const hrstart = process.hrtime()
				const source = fs.readFileSync(filePath)
				
				posthtml(posthtmlConfig.plugins)
					.process(source, { sync: false })
					.then(result => {
						response.type('html').status(200).send(result.html).end()

						const hrend = process.hrtime(hrstart)
						console.info(
							coloring.magenta(`Sent ${fileDir} in %dms`),
							hrend[1] / 1000000
						)
					})

				console.log(coloring.blue('Processing'), coloring.cyan(fileDir))
			} catch (error) {
				next(error)
			}
		} else {
			response.sendStatus(404).end()
			console.log(coloring.bgRed('FILE NOT FOUND'), coloring.red(filePath))
		}
	}
	
	router.get('/', (request, response, next) => response.redirect('/' + serverConfig.index))
	router.get(rule, handler)
	
	return router
})(express.Router())
