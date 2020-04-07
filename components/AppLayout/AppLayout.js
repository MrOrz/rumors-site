// Wrapper for all pages.
//
// Ref: https://github.com/zeit/next.js/blob/master/examples/with-redux/pages/index.js
//
import React, { Fragment } from 'react';
import Router from 'next/router';
import { setLogin } from '../../util/gql';
import { connect } from 'react-redux';
import { showDialog, load } from 'ducks/auth';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import LoginModal from '../Modal/LoginModal';
import moment from 'moment';
import NProgress from 'nprogress';

import 'normalize.css';
import 'nprogress/nprogress.css';
import './AppLayout.css';


import getConfig from 'next/config';
import i18n from 'i18n';

const {
  publicRuntimeConfig: { PUBLIC_MOMENT_LANGUAGE_CODE },
} = getConfig();

console.log('PUBLIC_MOMENT_LANGUAGE_CODE', PUBLIC_MOMENT_LANGUAGE_CODE)

const lng = PUBLIC_MOMENT_LANGUAGE_CODE || 'zh-tw';
if (PUBLIC_MOMENT_LANGUAGE_CODE !== 'en') {
  require(`moment/locale/${lng}`);
  moment.locale(PUBLIC_MOMENT_LANGUAGE_CODE);
}

let isBootstrapping = true;

Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  NProgress.done();
};

class AppLayout extends React.Component {
  constructor(props) {
    super(props);

    if (typeof window !== 'undefined') {
      setLogin(() => props.dispatch(showDialog(i18n.t('login'))));
    }
  }

  componentDidMount() {
    // Bootstrapping: Load auth
    //
    if (isBootstrapping) {
      this.props.dispatch(load());
      isBootstrapping = false;
    }
  }

  render() {
    const { children } = this.props;

    return (
      <Fragment>
        <div>
          <AppHeader />
          {children}
          <LoginModal />
          <AppFooter />
        </div>
        <style jsx global>{`
          body {
            font-family: 'Kanit', sans-serif;
          }

          body:not(.home) .wrapper-page {
            background: transparent !important;
          }
          body:not(.home) .nav-item {
            color: #000 !important;
          }
          body:not(.home) .link-group {
            border: 1px solid #000 !important;
          }
          body:not(.home) .link-list {
            border-right: 1px solid #000 !important;
            color: #000 !important;
          }

          a { color: #FF6DAD; }
          a:hover, a:active, a:focus {
            color: #B4195D;
          }



        
          body.home .wrapper-page {
            background: url("static/img/bg-banner@2x.jpg") no-repeat center center;
            background-size: cover;
            margin: -120px 0 0;
            padding: 120px 0 0px;
          }
          @media screen and (min-width: 769px) {
            body.home .wrapper-page {
              background: url("static/img/bg-banner@2x.jpg") no-repeat top center;
              background-size: cover;
              margin: -160px 0 0;
              padding: 160px 0 0px;
            }
          }
          body.home .nav-item {
            color: #fff;
          }
          body.home .link-group {
            border: 1px solid #fff;
          }
          body.home .link-list {
            border-right: 1px solid #fff;
            color: #fff;
          }
        `}</style>
        
      </Fragment>
    );
  }
}

export default connect()(AppLayout);
