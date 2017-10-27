// =======================================================================
// Workaround for async react routes to work with react-hot-reloader till
//  https://github.com/reactjs/react-router/issues/2182 and
//  https://github.com/gaearon/react-hot-loader/issues/288 is fixed.
// =======================================================================

// if (process.env.NODE_ENV !== 'production') {
//   // Require async routes only in development for react-hot-reloader to work.
//   require('containers/PostListPage/PostListPage');
//   require('containers/PostDetailPage/PostDetailPage');
// }

// require.ensure polyfill for node
// if (typeof require.ensure !== 'function') {
//   require.ensure = function requireModule(deps, callback) {
//     callback(require);
//   };
// }
// // async require the Post List
// const PostList = (nextState, cb) => {
//   require.ensure([], (require) => {
//     cb(null, require('./modules/Post/pages/PostListPage/PostListPage').default);
//   });
// };
// // async require the Slug
// const Slug = (nextState, cb) => {
//   require.ensure([], (require) => {
//     cb(null, require('./modules/Post/pages/PostDetailPage/PostDetailPage').default);
//   });
// };
// async require NOT FOUND
// const NotFound = (nextState, cb) => {
//   require.ensure([], (require) => {
//     cb(null, require('./modules/Post/pages/NotFoundPage/NotFoundPage').default);
//   });
// };

import App from 'containers/App/App';
import DashboardPage from 'containers/DashboardPage';
import CodeEnterPage from 'containers/CodeEnterPage';
import CodeSuppliedPage from 'containers/CodeSuppliedPage';
import TermsPage from 'containers/TermsPage';
import RegisterPage from 'containers/RegisterPage';
import LoginPage from 'containers/LoginPage';
import SettingsPage from 'containers/SettingsPage';
import PreferencesPage from 'containers/PreferencesPage';
import ContactPage from 'containers/ContactPage';
import AccountPage from 'containers/AccountPage';
import NotFoundPage from 'containers/NotFoundPage/';
import ErrorPage from 'containers/ErrorPage/';
import PersonalPage from 'containers/PersonalPage';

// ============================================================
// How do the children (PostList, Slug) get passed into AppRoot
//  => using this declaritive structure and renderRoutes .....
// ============================================================
const routes = [
  {
    component: App,
    routes: [
      {
        path: '/',
        exact: true,
        component: DashboardPage,
      },
      {
        path: '/login',
        exact: true,
        component: LoginPage,
      },
      {
        path: '/register',
        exact: true,
        component: RegisterPage,
      },
      {
        path: '/terms',
        exact: true,
        component: TermsPage,
      },
      {
        path: '/settings',
        exact: true,
        component: SettingsPage,
      },
      {
        path: '/settings/account',
        exact: true,
        component: AccountPage,
      },
      {
        path: '/settings/preferences',
        exact: true,
        component: PreferencesPage,
      },
      {
        path: '/settings/contact',
        exact: true,
        component: ContactPage,
      },
      {
        path: '/settings/personal',
        exact: true,
        component: PersonalPage,
      },
      // {
      //   path: '/settings/vehicles',
      //   exact: true,
      //   component: SettingsPage,
      // },
      {
        path: '/code',
        exact: true,
        component: CodeEnterPage,
      },
      {
        path: '/code/:code',
        exact: true,
        component: CodeSuppliedPage,
      },
      {
        path: '/code/:code/:share',
        exact: true,
        component: CodeSuppliedPage,
      },
      {
        path: '/error',
        exact: true,
        component: ErrorPage,
      },
      {
        path: '*',
        component: NotFoundPage
      },

    ],
  },
];

export default routes;
