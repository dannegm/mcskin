
export function parseQuery (query) {
    if (query === undefined) {
        return {}
    }

    const params = query.split('&');
    const parsedObject = {};
    params.forEach(param => {
        const [ key, value ] = param.split('=')
        parsedObject[key] = !value || value
    })
    return parsedObject
}