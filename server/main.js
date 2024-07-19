require('dotenv').config();
const path = require('path');
const express = require('express');
const { createProxyMiddleware: proxy } = require('http-proxy-middleware');
const env = require('./env');

const app = express();
app.use(express.static('public'));

if (process.env.API_PROXY) {
  const apiProxy = proxy({
    target: `${process.env.API_PROXY}${process.env.API_ENDPOINT}`,
  });

  app.use(process.env.API_ENDPOINT, apiProxy);
}

app.get('/env.js', (req, res) =>
  res.send(`window.env = ${JSON.stringify(env)}`)
);

const enableHMR = (process.env.ENABLE_HMR || 'true') === 'true';
if (enableHMR && process.env.NODE_ENV === 'development') {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const config = require('../webpack.config.js');
  config.entry.app.push('webpack-hot-middleware/client');

  config.plugins = config.plugins || [];
  config.plugins.push(new webpack.HotModuleReplacementPlugin());

  const compiler = webpack(config);

  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath,
      writeToDisk: true,
      noInfo: true,
      stats: { colors: true },
      hot: true,
      inline: true,
      lazy: false,
      headers: { 'Access-Control-Allow-Origin': '*' },
      historyApiFallback: true,
    })
  );

  app.use(webpackHotMiddleware(compiler));
}

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => console.log(`App Started on http://localhost:${PORT}`));

const publicPath = path.join(__dirname, '..', 'public');

app.get('*', (req, res) => res.sendFile(path.join(publicPath, 'index.html')));
