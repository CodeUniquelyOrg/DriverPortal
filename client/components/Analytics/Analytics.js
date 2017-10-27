import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GoogleAnalytics from 'react-ga';

GoogleAnalytics.initialize('UA-106546786-1'); // UA-Code Chris set up !!!

// Expose call to Analytics
const trackPage = page => {
  GoogleAnalytics.set({
    page,
    // ...options,
  });
  GoogleAnalytics.pageview(page);
};

class Analytics extends Component {

  componentDidMount() {
    let page;
    // every change of page will fire this function
    this.context.router.history.listen((state:Object) => {
      page = state.pathname;
      trackPage(page);
    });

    // also fire on initial page render too...
    page = this.context.router.history.location.pathname;
    trackPage(page);
  }

  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    return null;
  }
}

export default Analytics;
