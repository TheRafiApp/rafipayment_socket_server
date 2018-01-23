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
    domain: 'ws.staging.rafipayment.com',
    http_package: 'https',
    port: 4200
  },
  production: {
    domain: 'ws.rafipayment.com',
    http_package: 'https',
    port: 4200
  }
}
