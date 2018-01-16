const env = process.env.NODE_ENV

const fs = require('fs')
const chalk = require('chalk')
const config = require('../config')[env]

const log = console.log

module.exports = () => {
  const ssl = ['production', 'staging'].includes(env)

  if (ssl) {
    log(chalk.green(`Using SSL for ${env}`))

    let root_path = '/etc/letsencrypt/live/'
    let key_path = `${root_path}${config.domain}/privkey.pem`
    let cert_path = `${root_path}${config.domain}/cert.pem`

    return {
      key: fs.readFileSync(key_path),
      cert: fs.readFileSync(cert_path)
    }
  }
}
