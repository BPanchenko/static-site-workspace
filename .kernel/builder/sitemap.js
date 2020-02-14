import fs from "node:fs"
import path from "node:path"
import dateFormat from "date-format"
import { globSync } from "glob"
import { create } from "xmlbuilder2"

import logger from "../logger.cjs"
import config from "../../.config/posthtml.config.cjs"
import workspace from "../../.config/workspace.config.cjs"

const { dirs, root } = workspace
const BASE = "http://website.domain"
const FILE = "sitemap.xml"

const xml = create({
	encoding: 'UTF-8',
	version: '1.0'
}).ele('urlset', {
	xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9"
});

logger.log('Start updating Site Map')

{
	const urlset = globSync(config.input, { root })
		.map(file => {
			const filePath = path.resolve(root, file)
			const urlPath = path.relative(dirs.html, file).replace('index.html', '')
			return {
				stats: fs.statSync(filePath),
				url: new URL(urlPath, BASE)
			}
		})

	urlset.forEach(
		({ stats, url }) =>
			xml.ele('url')
				.ele('loc').txt(url).up()
				.ele('lastmod').txt(dateFormat('yyyy-MM-dd', stats.mtime)).up()
	)
}

{
	const content = xml.end({ prettyPrint: true })
	const output = path.resolve(root, dirs.dist, FILE)

	try {
		fs.writeFileSync(output, content)
		logger.logSavedFile(output)
		process.exit(0)
	} catch (err) {
		logger.error(err)
		process.exit(1)
	}
	
}