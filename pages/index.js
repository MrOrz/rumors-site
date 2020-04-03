import React from 'react';
import Head from 'next/head';
import AutoCompleteSearchBox from '../components/AutoCompleteSearchBox';
import AppLayout from 'components/AppLayout';
import { indexStyle, jumbotronStyle, sectionStyle } from './index.styles';

import i18n from '../i18n';
import Router from 'next/router';

class IndexPage extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.setState({ isSubmitting: true });
    const searchQuery = e.target.query.value.trim();

    this.setState({ isSubmitting: false });

    Router.push(`/articles?q=${searchQuery}`);
  };

  render() {
    return (
      <body className={`home`}>
        <AppLayout>
          <div className="root wrapper-page">
            <Head>
              <title>
                {i18n.t('pageCreate.title')} | Cofacts {i18n.t('realOrFake')}
              </title>
            </Head>

            {/*Section#1*/}
            <div className="jumbotron text-light">
              <div className="text-center">
                <h1 className="mb-3">
                  Cofact - พื้นที่เปิดให้ทุกคนมาช่วยกันตรวจสอบข่าวลวง
                </h1>
                <h2 className="mt-3 mb-5">
                  คนใกล้ชิดของคุณ อาจ<em className="emphasis">
                    ตกเป็นเหยื่อของข่าวลวง
                  </em>{' '}
                  หรือ <br className={`d-none d-md-block`} />
                  <em className="emphasis">
                    ส่งต่อข่าวลวง
                  </em>บนอินเทอร์เน็ตโดยไม่รู้ตัว
                </h2>
                <div className="row justify-content-md-center">
                  <div className={`col col-lg-8 col-xl-6`}>
                    <div id="SearchQueryField">
                      {/*<form onSubmit={this.handleSubmit}>*/}
                      {/*  <input type="text" name="query" />*/}
                      {/*  <button type="submit">Search</button>*/}
                      {/*</form>*/}
                      <AutoCompleteSearchBox
                        items={['t', 'this', 'no', 'co', 'Cov']}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*Section#2*/}
          <div className="section section-line">
            <div className="container">
              <div className="content">
                <div className="add-line d-flex align-items-end mb-2 mb-md-4">
                  <h2 className="mr-2 mb-0">เช็คข่าวลวง<br />ชวน Add LINE</h2>
                  <img src="/static/img/btn-line-cofact.png" alt="@cofact" width="250px" className="img-fluid" />
                </div>
                
                <p>
                  Add LINE @cofact หรือ QR Code แล้ว "ส่งต่อ"
                  ข้อความที่คุณคิดว่าเป็น ข่าวลวง ข่าวลือ ข้อความหลอก หรือ
                  ข้อความน่าสงสัย เพื่อให้ Chat Bot
                  ของเราช่วยตรวจสอบความน่าเชื่อถือของข้อความเหล่านั้น!
                </p>
                <p>
                  <img src="/static/img/qr-code.png" />
                </p>
              </div>
              <div className="phone-container">
                <div className="phone-img">
                  <video
                    poster="/static/img/recording-still-th.gif"
                    src="/static/img/recording-th.mp4"
                    autoPlay
                    loop
                    muted
                  />
                </div>
              </div>
            </div>
            <style> {sectionStyle} </style>
          </div>

          <style jsx>
            {`
              .jumbotron {
                background-color: transparent;
                color: #fff;
                text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
                border-radius: 0;
                margin-bottom: 0;
              }
              .jumbotron h1 {
                font-size: 2rem;
              }
              .jumbotron h2 {
                font-size: 1.5rem;
              }
              @media screen and (min-width: 768px) {
                .jumbotron {
                  padding: 6rem 2rem;
                }
                .jumbotron h1 {
                  font-size: 2.5rem
                }
                .jumbotron h2 {
                  font-size: 2rem;
                }
              }
              .jumbotron .emphasis {
                color: #ff79ac;
                font-weight: 500;
                font-style: normal;
              }
              .jumbotron h2 {
                font-weight: 400;
              }


              .section-line {
                background-color: #f0b4d0;
              }
              .section-line .content {
                padding: 2rem;
              }
                .add-line h2 {
                  font-size: 3.5rem;
                }
              @media screen and (min-width: 768px) {
                .section-line .content {
                  padding: 4rem;
                }
                .add-line h2 {
                  font-size: 2.5rem;
                }
              }

            `}
          </style>
        </AppLayout>
      </body>
    );
  }
}

export default IndexPage;
