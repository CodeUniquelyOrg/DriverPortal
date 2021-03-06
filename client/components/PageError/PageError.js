// @flow
import * as React from 'react';
import Helmet from 'react-helmet';
import type { ErrorProps } from './ErrorBoundary';

const PageError = (props: ErrorProps) => (
  <main>
    <Helmet>
      <title>An error has occured</title>
    </Helmet>
    <section className="container text-center py-5">
      <h1>Something went wrong</h1>
      <h3 className="text-danger">Oh no! It appears that the page has crashed.</h3>
    </section>
  </main>
);

export default PageError;
