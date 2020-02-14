import express from "express"
import nocache from "nocache"

import { htmlSourcesRouter } from "./routing.js"
import { serverReady } from "./handlers.js"

import config from "../../.config/server.config.js"
import workspaceConfig from "../../.config/workspace.config.cjs"

const server = express()

server.use(nocache())
server.use(htmlSourcesRouter)
server.use(express.static(workspaceConfig.dirs.dist))
server.use(express.static(workspaceConfig.dirs.static))
server.listen(config.ports.client, serverReady)
