// Express Server Stuff
import Express from 'express';
import compression from 'compression';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';
import url from 'url';
import cors from 'cors';
import locale from 'locale';

// Webpack Requirements
import webpack from 'webpack';
import config from '../webpack.config.dev';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

// React And Redux Setup
import React from 'react';
import { configureStore } from 'client/store';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';

import { matchRoutes, renderRoutes } from 'react-router-config';

// HELMET
import Helmet from 'react-helmet';

// cookies
// const isomorphicCookie = require('isomorphic-cookie');

// Import required modules
import IntlWrapper from 'components/Intl/IntlWrapper';

// load the supported lanaguages we have configured
import { enabledLanguages, localizationData } from 'i18n/setup';
// import { fetchComponentData } from './util/fetchData';

// ** !!!! **
import App from 'containers/App/App';

// *** ROUTING ***
import { API_ROOT } from 'services/apiCaller';
import routes from 'client/routes';
import apiRouter from 'server/routes';

// Other stuff
// import dummyData from './dummyData';
import serverConfig from './config';

// Initialize the Express App
const app = new Express();

// Run Webpack in development mode - to build the client
if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}

// Set native promises as mongoose promise
mongoose.Promise = global.Promise;

// connect mongoose => MongoDB
mongoose.connect(serverConfig.mongoURL, (error) => {
  if (error) {
    console.error('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
    console.error(serverConfig.mongoURL); // eslint-disable-line no-console
    console.error(error); // eslint-disable-line no-console
    throw error;
  }

  // Load default data into the DB.
  // dummyData();
});

// CORS
app.use(cors());

// props.intl.enabledLanguages
// what locale is the browser useing to connect to us
app.use(locale(enabledLanguages, 'en')); // the default is configured inside 'intl' anyway

// Apply body Parser and server public assets and routes
app.use(compression());

app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));

// Where are the 'staic' contents served from
let staticPath;
if (process.env.NODE_ENV === 'development') {
  staticPath = path.resolve(__dirname, '../dist');
} else {
  staticPath = path.resolve(__dirname, '..');
}

console.log('\n *** Serving content from\n', staticPath); // eslint-disable-line no-console
console.log('\n *** CWD is \n', process.cwd()); // eslint-disable-line no-console
console.log('\n'); // eslint-disable-line no-console
app.use(Express.static(staticPath));

// Wire up servers 'api routes' root path => api router / middleware
app.use(API_ROOT, apiRouter);

// Helper Function to build index.html contents
const renderFullPage = (html, initialState) => {
  const head = Helmet.rewind();

  // Import Manifests
  const assetsManifest = process.env.webpackAssets && JSON.parse(process.env.webpackAssets);
  const chunkManifest = process.env.webpackChunkAssets && JSON.parse(process.env.webpackChunkAssets);

  return `
    <!doctype html>
    <html>
      <head>
        ${head.base.toString()}
        ${head.title.toString()}
        ${head.meta.toString()}
        ${head.link.toString()}
        ${head.script.toString()}
        ${process.env.NODE_ENV === 'production' ? `<link rel='stylesheet' href='${assetsManifest['/app.css']}' />` : ''}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,700">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Mono:700">
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
        <link rel="shortcut icon" href="http://res.cloudinary.com/hashnode/image/upload/v1455629445/static_imgs/mern/mern-favicon-circle-fill.png" type="image/png" />
     </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
          ${process.env.NODE_ENV === 'production' ? `//<![CDATA[window.webpackManifest = ${JSON.stringify(chunkManifest)};//]]>` : ''}
        </script>
        <script src='https://cdnjs.cloudflare.com/ajax/libs/core-js/2.5.1/core.min.js'></script>
        <script src='${process.env.NODE_ENV === 'production' ? assetsManifest['/vendor.js'] : '/vendor.js'}'></script>
        <script src='${process.env.NODE_ENV === 'production' ? assetsManifest['/app.js'] : '/app.js'}'></script>
      </body>
    </html>
  `;
};

// DEFAULT ERROR HANDLER NOW CATCHES THIS
// const renderError = err => {
//   const softTab = '&#32;&#32;&#32;&#32;';
//   const errTrace = process.env.NODE_ENV !== 'production' ?
//     `:<br><br><pre style="color:red;">${softTab}${err.stack.replace(/\n/g, `<br>${softTab}`)}</pre>` : '';
//   return renderFullPage(`Server Error${errTrace}`, {});
// };

// Server Side Rendering based on routes matched by React-router.
app.use((req, res, next) => {
  // START !!!

  // get the local that the browser is using
  // and then set internationalization [i(18)n]
  const locale = req.locale.trim();
  const intl = {
    locale: locale,
    enabledLanguages: enabledLanguages,
    messages: localizationData[locale].messages
  };

  // connect to the REDUX store
  const store = configureStore({ intl: intl });

  // matchRoutes - filters route to components needed to render the URL.
  // const branch = matchRoutes(routes, req.url);

  // Once we have the list of routes for the given URL, we can map through each
  // and check whether it has a static method named fetchData. If the component
  // has the fetchData method, then execute those else return a null promise.
  // const promises = branch.map(({ route }) => {
  //   const fetchData = route.component.fetchData;
  //   return fetchData instanceof Function ? fetchData(store) : Promise.resolve(null);
  // });

  // *** THIS ISS A PRE-FETCH VERSION OF THE ABOVE ***
  // const parsedUrl = url.parse(req.url, true);
  // const prefetchingRequests = matchRoutes(routes, parsedUrl.pathname)
  //   .map(({ route, match }) => {
  //     return route.component.loadData ? route.component.loadData(match) : Promise.resolve(null);
  //   });

  // where context will be held after rendering
  const context = {};

  // const componentHtml = renderToString(
  //   <Provider store={store}>
  //     <IntlWrapper>
  //       <StaticRouter location={req.url} context={context}>
  //         {renderRoutes(routes)}
  //       </StaticRouter>
  //     </IntlWrapper>
  //   </Provider>
  // );

  /* SIMPLER of the ASYNC above VERSION */
  const componentHtml = renderToString(
    <Provider store={store}>
      <IntlWrapper locale={locale}>
        <StaticRouter location={req.url} context={context}>
          <App />
        </StaticRouter>
      </IntlWrapper>
    </Provider>
  );

  // Promise.all(prefetchingRequests)
  //   .then(prefetchedData => {
  //     const html = React.renderToString(<App data={prefetchedData} />);
  //     res.set('content-type', 'text/html');
  //     res.send(html);
  //   });

  if (context.url) {
    res.redirect(302, context.url);
  } else if (context.status === 404) {
    res.status(404);
  } else {
    // we're good, send the response
    const preloadedState = store.getState();
    const html = renderFullPage(componentHtml, preloadedState);
    res.set('content-type', 'text/html');
    res.send(html);
  }

  // Handle all inbound request with 'index.html'
  /*
  return Promise.all(promises)
    .then(() => {
      if (context.url) {
        res.redirect(302, context.url);
      } else if (context.status === 404) {
        res.status(404);
      } else {
        // we're good, send the response
        const preloadedState = store.getState();
        const html = renderFullPage(componentHtml, preloadedState);
        res.set('content-type', 'text/html');
        res.send(html);
      }
    })
    .catch(error => next(error));
  */
});

// start app
app.listen(serverConfig.port, (error) => {
  if (!error) {
    console.log(`Portal is running on port: ${serverConfig.port}! Let's build something amazing!`); // eslint-disable-line
  }
});

export default app;
