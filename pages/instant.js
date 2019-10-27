import React from 'react';
import Head from 'next/head';
import gql from '../util/gql';
import style from '../components/AppLayout/AppLayout.css';
import querystring from 'querystring';
import i18n from 'i18n';

const POLLING_INTERVAL = 5000;

const SPECIAL_PROPS = {
  7: {
    top: 'Lucky',
  },
  17: {
    bottom: '8+9',
  },
  21: {
    top: `${i18n.t("pageInstant.onlyDaily")}`,
    bottom: `${i18n.t("pageInstant.threeHoursRemaining")}`,
  },
  44: {
    bottom: `${i18n.t("pageInstant.stoneLion")}`,
  },
  56: {
    bottom: `${i18n.t("pageInstant.notDead")}`,
  },
  64: {
    top: `${i18n.t("pageInstant.forget")}`,
  },
  77: {
    top: `${i18n.t("pageInstant.forest")}`,
  },
  87: {
    bottom: `${i18n.t("pageInstant.cannotHigher")}`,
  },
  92: {
    top: `${i18n.t("pageInstant.noConsensus")}`,
    bottom: `${i18n.t("pageInstant.consensus")}`,
  },
  94: {
    bottom: `${i18n.t("pageInstant.mad")}`,
  },
  101: {
    bottom: `${i18n.t("pageInstant.building")}`,
  },
  118: {
    top: `${i18n.t("pageInstant.see")}`,
    bottom: `${i18n.t("pageInstant.gone")}`,
  },
  123: {
    bottom: `${i18n.t("pageInstant.blockhead")}`,
  },
  133: {
    top: `${i18n.t("pageInstant.minimumWage")}`,
  },
  158: {
    top: 'mini',
  },
  165: {
    top: `${i18n.t("pageInstant.policeDepartment")}`,
    bottom: `${i18n.t("pageInstant.antiFraudLine")}`,
  },
  183: {
    bottom: 'CLUB',
  },
  193: {
    bottom: `${i18n.t("pageInstant.countyRoad")}`,
  },
  200: {
    top: `${i18n.t("pageInstant.unexpectedly")}`,
    bottom: `${i18n.t("pageInstant.yuan")}`,
  },
  228: {
    bottom: `${i18n.t("pageInstant.228")}`,
  },
  261: {
    top: `${i18n.t("pageInstant.noMention")}`,
  },
  318: {
    bottom: `${i18n.t("pageInstant.learning")}`,
  },
  377: {
    bottom: `${i18n.t("pageInstant.angry")}`,
  },
  500: {
    top: `${i18n.t("pageInstant.goDown")}`,
  },
};

function getSpecialProps(number) {
  return SPECIAL_PROPS[number.toString()];
}

function Kuang() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
      html:after {
        content: '';
        position: fixed;
        border: 0.8vw solid rgba(0,0,0,0.64);
        top: 24px;
        right: 24px;
        bottom: 24px;
        left: 24px;
      }
    `,
      }}
    />
  );
}

function Hit({ number = 0, top = '', bottom = '' }) {
  return (
    <FullScreenResizer listen={number}>
      <div className="root">
        {top ? <div className="paragraph">{top}</div> : ''}
        <div className="number">{number}</div>
        {bottom ? <div className="paragraph">{bottom}</div> : ''}
      </div>
      <Kuang />
      <style jsx>{`
        .root {
          display: flex;
          flex-flow: column;
          justify-content: center;
          height: 100%;
          padding: 0 24px;
        }
        .number {
          font-size: 360px;
          font-weight: 100;
        }
        .paragraph {
          font-size: 84px;
          font-weight: 600;
          margin: 24px 0;
          white-space: nowrap;
        }
      `}</style>
    </FullScreenResizer>
  );
}

function Instant({ number = 0, total = 0 }) {
  return (
    <FullScreenResizer listen={number}>
      <div className="present">{i18n.t("pageInstant.currentReply")} {total} {i18n.t("article")}</div>
      <div className="verb">{i18n.t("increased")}</div>
      <div className="number">{number}</div>
      <div className="paragraph">{i18n.t("pageInstant.newReplyArticle")}</div>
      <style jsx>{`
        .present {
          font-size: 36px;
          font-weight: 200;
          padding: 36px 0 64px;
          white-space: nowrap;
        }
        .verb {
          font-size: 64px;
          font-weight: 600;
        }
        .number {
          font-size: 360px;
          font-weight: 400;
        }
        .paragraph {
          font-size: 44px;
          font-weight: 600;
        }
      `}</style>
    </FullScreenResizer>
  );
}

class FullScreenResizer extends React.PureComponent {
  state = {
    scale: 1,
    isHidden: true,
    listen: null, // When changed, invoke this.setScale()
  };

  componentDidMount() {
    this.setScale();
    this.setState({ isHidden: false }); // After scale is set, show this component
    window.addEventListener('resize', this.setScale);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setScale);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.listen !== this.props.listen) {
      this.setScale();
    }
  }

  setScale = () => {
    // Must wait until styled jsx boot up the stylesheet...
    ///
    requestAnimationFrame(() => {
      if (!this.rootElem) return;
      const { width, height } = this.rootElem.getBoundingClientRect();
      const horizontalScale = window.innerWidth / width;
      const verticalScale = window.innerHeight / height;

      this.setState({
        scale: Math.min(horizontalScale, verticalScale),
      });
    });
  };

  render() {
    const { scale, isHidden } = this.state;

    return (
      <div
        className={`root ${isHidden ? 'hidden' : ''}`}
        ref={root => {
          this.rootElem = root;
        }}
      >
        <div className="scaler" style={{ transform: `scale(${scale})` }}>
          {this.props.children}
        </div>
        <style jsx>{`
          .root {
            line-height: 1;
            text-align: center;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            transition: opacity 0.25s;
          }
          .hidden {
            opacity: 0;
          }
          .scaler {
            height: 768px;
            /* Fixed as in design mockup */
            padding: 0 44px;
          }
        `}</style>
      </div>
    );
  }
}

function Loading({ show }) {
  return (
    <div className={`root ${show ? '' : 'hidden'}`}>
      Loading...
      <style jsx>{`
        .root {
          position: fixed;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          background: #fff;
          opacity: 1;
          transition: opacity 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 100;
        }
        .hidden {
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

export default class InstantWrapper extends React.Component {
  state = {
    current: 0, // current number of replied articles
    startFrom: null, // start number of replied articles to compare from
    isBootstrapping: true,
  };

  componentDidMount() {
    const queryParams = querystring.parse(location.hash.slice(1));
    this.periodicallyUpdateNumber().then(count => {
      // If startFrom is not specified in hash, set startFrom to the count.
      //
      const startFrom =
        queryParams && queryParams.startFrom ? queryParams.startFrom : count;
      this.setState({ startFrom, isBootstrapping: false });
      location.hash = querystring.stringify({ startFrom });
    });
  }

  updateNumber = () => {
    return gql`
      {
        ListArticles(filter: { replyCount: { GT: 0 } }) {
          totalCount
        }
      }
    `().then(data => {
      const totalCount = data.getIn(['data', 'ListArticles', 'totalCount'], 0);
      this.setState({ current: totalCount });
      return totalCount;
    });
  };

  periodicallyUpdateNumber = () =>
    this.updateNumber().then(count => {
      clearTimeout(this._timer);
      this._timer = setTimeout(this.periodicallyUpdateNumber, POLLING_INTERVAL);
      return count;
    });

  render() {
    const { current, startFrom, isBootstrapping } = this.state;
    const number = current - startFrom;
    const specialProps = getSpecialProps(number);

    return (
      <div>
        <Head>
          <title>{number} {i18n.t("pageInstant.newReplyArticle")} - cofacts</title>
          <style dangerouslySetInnerHTML={{ __html: style }} />
          <style
            dangerouslySetInnerHTML={{
              __html: `
            html {
              font-family: 蘋方-繁, "PingFang TC", 思源黑體, "Source Han Sans", "Noto Sans CJK TC", sans-serif;
              color: rgba(0,0,0,0.76);
              overflow: hidden;
              height: 100%;
            }
          `,
            }}
          />
        </Head>
        {specialProps ? (
          <Hit number={number} {...specialProps} />
        ) : (
          <Instant number={number} total={current} />
        )}
        <Loading show={isBootstrapping} />
      </div>
    );
  }
}
