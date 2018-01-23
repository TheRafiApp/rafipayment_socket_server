module.exports = {
  test: {
    http_package: 'http',
    port: 4201
  },
  dev: {
    http_package: 'http',
    port: 4200
  },
  staging: {
    domain: 'staging.rafipayment.com',
    http_package: 'https',
    port: 80
  },
  production: {
    domain: 'rafipayment.com',
    http_package: 'https',
    port: 4200
  }
}
