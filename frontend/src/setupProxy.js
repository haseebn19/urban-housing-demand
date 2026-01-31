/* eslint-disable @typescript-eslint/no-var-requires */
const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.BACKEND_PROXY || 'http://localhost:8080',
      changeOrigin: true,
      logLevel: 'warn', // Only log warnings and errors
    })
  );
};
