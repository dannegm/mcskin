import '@babel/polyfill'
import 'dotenv/config'
import 'colors'

import express from 'express'
import winston from 'winston'
import session from 'express-session'
import bodyParser from 'body-parser'
import favicon from 'serve-favicon'
import helmet from 'helmet'
import cors from 'cors'
import { highlight }  from 'cli-highlight'

import settings from '@/config/settings'
import { logger, handleErrors } from '@/utils/middlewares'

const app = express ()

app.locals.hostname = settings.server.hostname

app
    //.use (favicon ('./favicon.ico'))
    .use (helmet ())
    .use (cors ())
    .use (bodyParser.json ())
    .use (bodyParser.urlencoded ({ extended: false }))
    .use (
        session ({
            secret: settings.server.secret,
            resave: true,
            saveUninitialized: true,
        })
    )

const { log } = console
app.logger = new winston.Logger ()
app.logger.configure ({
    transports: [
        new (winston.transports.Console) ({
            name: 'Console',
            timestamp: (new Date ()).toISOString (),
            colorize: true,
        }),

        new (winston.transports.File) ({
            name: 'File',
            filename: `${process.env.npm_package_name}.log`,
            timestamp: (new Date ()).toISOString (),
            json: false,
            formatter: (options) => {
                const message = options.message.replace (/(\u001B)|(\\u[0-9a-f]{0,4})|(\[[0-9a-z]{1,3})/gi, '')
                return `${options.timestamp} - [${options.level.toUpperCase ()}] ${message}`
            },
        }),
    ],
})

app.logger.json = (tag, code) => {
    log (`[${tag}]`.magenta.bold)
    log (highlight (JSON.stringify (code, null, 4)))
}

//* Log all request
app.use (logger)
app.use (handleErrors)

//* Server
import server from '@/app'
const deploy = () => {
    server (app)
}
if (!module.parent) deploy ()

export default deploy