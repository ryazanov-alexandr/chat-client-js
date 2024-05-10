const fs = require('fs')
fs.writeFileSync('./.env', `SERVER_URL=${process.env.SERVER_URL}\n`)