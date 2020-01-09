import responses from '@/utils/responses'

const handleErrors = (req, res, handler) => {
    try {
        handler ()
    } catch (error) {
        responses.INTERNAL_ERROR (res, { error })
    }
}

const logger = (req, res, next) => {
    const methods = {
        'GET': req.method.blue.bold,
        'POST': req.method.green.bold,
        'PUT': req.method.yellow.bold,
        'DELETE': req.method.red.bold,
        'PATCH': req.method.cyan.bold,
    }
    req.app.logger.info (`${' HTTP '.black.bold.bgWhite} ${methods [req.method]} ${req.path}`)
    // app.logger.json ('HEADERS', req.headers);
    req.app.logger.json ('BODY', req.body);
    next ()
}

export {
    handleErrors,
    logger,
}