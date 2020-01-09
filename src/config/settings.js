import 'dotenv/config'

let server = {
    hostname: process.env.HOSTNAME || 'localhost',
    port: process.env.PORT || 3000,
    secret: process.env.SECRET,
}

export default {
  server,
}
