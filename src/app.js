import express from 'express'
import settings from '@/config/settings'
import buildModules from '@/modules'

export default function (app) {
    const schema = `http://${settings.server.hostname}:${settings.server.port}`

    app.use('/skins', express.static(`${__dirname}/skins`))
    app.locals.skinsPath = `${schema}/skins`

    buildModules (app)

    app.logger.info (`Listening on ${schema.yellow}`)
    app.listen (settings.server.port)
}