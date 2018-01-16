module.exports = {
  dev: {
    http_package: 'http',
    port: 4200
  },
  staging: {
    domain: 'staging.rafipayment.com',
    http_package: 'https',
    port: 4200
  },
  production: {
    domain: 'rafipayment.com',
    http_package: 'https',
    port: 4200
  }
}
