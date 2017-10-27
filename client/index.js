// =================================
// Client mount point
// =================================
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';

import { configureStore } from './store';
import IntlWrapper from 'components/Intl/IntlWrapper';
import App from './App';

// mount point in index.html
const mountApp = document.getElementById('root');

// Initialize store
const store = configureStore(window.__INITIAL_STATE__);

// HMR
const mount = (Component: React.ComponentType<any>) => {
  render(
    <AppContainer>
      <Provider store={store}>
        <IntlWrapper>
          <Component />
        </IntlWrapper>
      </Provider>
    </AppContainer>,
    mountApp
  );
};

// Render the App
mount(App);

// For hot reloading of react components
if (module.hot) {
  module.hot.accept('./App', () => { mount(App); });
  // module.hot.accept('./App', () => {
  //   // If you use Webpack 2 in ES modules mode, you can
  //   // use <App /> here rather than require() a <NextApp />.
  //   const NewApp = require('./App').default; // eslint-disable-line global-require
  //   mount(NewApp);
  // });
}
