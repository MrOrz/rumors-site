/* eslint-disable react/display-name */
// https://github.com/yannickcr/eslint-plugin-react/issues/1200

import React from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import { List } from 'immutable';
import { Link } from '../routes';
import { RadioGroup, Radio } from 'react-radio-group';
import { CheckboxGroup, Checkbox } from 'react-checkbox-group';

import AppLayout from 'components/AppLayout';
import ListPage from 'components/ListPage';
import Pagination from 'components/Pagination';
import ArticleItem from 'components/ArticleItem';
import FullSiteArticleStats from 'components/FullSiteArticleStats';
import articleList, { load, loadAuthFields } from 'ducks/articleList';
import CreateArticleButton from '../components/CreateArticleButton';
import i18n from '../i18n';

import { mainStyle, hintStyle } from './articles.styles';
import { TYPE_ARTICLE_OPTIONS } from 'constants/articleCategory';

class Articles extends ListPage {
  state = {
    localEditorHelperList: {
      demoId: {
        // ID of articles state which already read or replied
        read: true,
        notArticleReplied: false, // false ||
      },
    },
    user: null,
  };

  static async getInitialProps({ store, query }) {
    if (typeof query.replyRequestCount === 'undefined') {
      query.replyRequestCount = 1;
    }
    await store.dispatch(load(query));
    return { query };
  }

  componentDidMount() {
    // Browser-only
    this.props.dispatch(loadAuthFields(this.props.query));
    this.initLocalEditorHelperList();
  }

  initLocalEditorHelperList = () => {
    if (localStorage) {
      const localEditorHelperList = JSON.parse(
        localStorage.getItem('localEditorHelperList')
      );
      localEditorHelperList &&
        this.setState({
          localEditorHelperList,
        });
    }
  };

  handleLocalEditorHelperList = ({ id, read, notArticleReplied }) => {
    this.setState(
      ({ localEditorHelperList }) => ({
        localEditorHelperList: {
          ...localEditorHelperList,
          [id]: {
            read,
            notArticleReplied,
          },
        },
      }),
      () => {
        localStorage.setItem(
          'localEditorHelperList',
          JSON.stringify(this.state.localEditorHelperList)
        );
      }
    );
  };

  handleReplyRequestCountCheck = e => {
    // Sets / clears reply request as checkbox is changed
    if (e.target.checked) {
      this.goToQuery({
        replyRequestCount: 1,
      });
    } else {
      this.goToQuery({
        replyRequestCount: 2,
      });
    }
  };

  renderSearch = () => {
    const {
      query: { q },
    } = this.props;
    return (
      <div className="row justify-content-md-center my-2 my-md-4 my-lg-5">
        <div className={`col`}>
          <div className="search-form">
            <div className="row no-gutters justify-content-center">
              <div className="pr-2 col-9 col-md-10">
                <input
                  className="form-control text-field"
                  placeholder="พิมพ์ข้อความที่ต้องการตรวจสอบ"
                  type="search"
                  onBlur={this.handleKeywordChange}
                  onKeyUp={this.handleKeywordKeyup}
                  defaultValue={q}
                />
              </div>
              <div className="col-3 col-md-2">
                <button type="submit" className="btn btn-primary w-100">
                  ค้นหา
                </button>
              </div>
            </div>
          </div>
        </div>
        <style jsx>
          {`
            .search-form .form-inline .form-control,
            .search-form .text-field {
              padding: 15px;
              font-size: 16px;
              height: auto;
              font-weight: 300;
              border-radius: 10px;
              border-color: #fff;
              box-shadow: 0 12px 25px 0 rgba(0, 0, 0, 0.15);
            }
            .search-form .text-field::placeholder {
              font-style: italic;
              font-size: 90%;
            }
            @media screen and (min-width: 768px) {
              .search-form .text-field {
                font-size: 20px;
              }
            }
            .search-form .form-inline .form-control {
              width: 79%;
              margin-right: 1%;
            }
            .search-form .btn {
              padding: 15px;
            }
            .search-form .form-inline .btn {
              width: 20%;
              padding: 15px;
            }
            .search-form .btn-primary {
              background-color: #f0b4d0;
              border-color: #f0b4d0;
              font-size: 16px;
              font-weight: 500;
              color: #000;
              border-radius: 10px;
              box-shadow: 0 12px 25px 0 rgba(0, 0, 0, 0.15);
            }
            @media screen and (min-width: 768px) {
              .search-form .btn-primary {
                font-size: 20px;
              }
            }
            .search-form .btn-primary:hover,
            .search-form .btn-primary:active,
            .search-form .btn-primary:focus {
              background-color: #ff79ac !important;
              border-color: #ff79ac !important;
              color: #000;
            }
          `}
        </style>
      </div>
    );
  };

  renderHeader = () => {
    const { stats, repliedArticleCount } = this.props;

    return (
      <h2 className="header justify-content-center justify-content-md-end">
        {/* <span>{i18n.t('articleList')}</span> */}
        <FullSiteArticleStats
          stats={stats}
          repliedArticleCount={repliedArticleCount}
        />
        <style jsx>{`
          .header {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: stretch;
            // padding-bottom: 1rem;
            // border-bottom: 1px solid rgba(0, 0, 0, 0.3);
          }
          @media screen and (min-width: 576px) {
            .header {
              flex-direction: row;
              align-items: flex-end;
            }
          }
        `}</style>
      </h2>
    );
  };

  renderSearchedArticleHeader = () => {
    const {
      query: { searchUserByArticleId },
      articles,
    } = this.props;
    const searchedArticle = articles.find(
      article => article.get('id') === searchUserByArticleId
    );
    return (
      <h2>
        {i18n.t('with')}{' '}
        <mark>
          {searchedArticle
            ? searchedArticle.get('text')
            : `Article ID: ${searchUserByArticleId}`}
        </mark>{' '}
        {i18n.t('pageArticles.listArticlesSameReturnee')}
        <style jsx>{`
          mark {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            max-width: 14em;
            display: inline-block;
            vertical-align: bottom;
            padding: 0 0.3em;
          }
        `}</style>
      </h2>
    );
  };

  renderOrderBy = () => {
    const {
      query: { orderBy, q },
    } = this.props;
    if (q) {
      return <span> {i18n.t('pageArticles.relevance')}</span>;
    }

    return (
      <div>
        <span>
          <select
            onChange={this.handleOrderByChange}
            value={orderBy || 'createdAt'}
          >
            <option value="createdAt">{i18n.t('mostRecentlyAsked')}</option>
            <option value="replyRequestCount">{i18n.t('mostAsked')}</option>
          </select>
        </span>
      </div>
    );
  };

  renderFilter = () => {
    const {
      query: { categories: _categories, filter, replyRequestCount },
    } = this.props;

    let categories = _categories ? _categories.split(',') : [];

    return (
      <div>
        {/* TODO: waiting for backend */}
        <div className={`mt-3 col-sm-6 col-md-4 col-lg-3`}>
          <div className={`card`}>
            <div className={`card-body`}>
              <h5>{i18n.t('categories')}</h5>
              <CheckboxGroup
                checkboxDepth={3}
                name="categories"
                value={categories}
                onChange={this.handleCategoriesChange}
                Component="ul"
              >
                {TYPE_ARTICLE_OPTIONS.map((item, i) => (
                  <li key={i}>
                    <label>
                      <Checkbox value={item} />
                      {item}
                    </label>
                  </li>
                ))}
              </CheckboxGroup>
            </div>
          </div>
        </div>
        <div className={`mt-3 col-sm-6 col-md-4 col-lg-3`}>
          <div className={`card`}>
            <div className={`card-body`}>
              <h5>{i18n.t('reply')}</h5>
              <RadioGroup
                onChange={this.handleFilterChange}
                selectedValue={filter || 'all'}
                Component="ul"
              >
                <li>
                  <label>
                    <Radio value="unsolved" />
                    {i18n.t('notRepliedYet')}
                  </label>
                </li>
                <li>
                  <label>
                    <Radio value="solved" />
                    {i18n.t('replied')}
                  </label>
                </li>
                <li>
                  <label>
                    <Radio value="all" />
                    {i18n.t('all')}
                  </label>
                </li>
              </RadioGroup>
            </div>
          </div>
        </div>
        {i18n.t('pageArticles.orderBy')}:{this.renderOrderBy()}
        <div className={`row mt-3`}>
          <div className={`col-12`}>
            <label>
              <input
                type="checkbox"
                checked={
                  +replyRequestCount === 1 ||
                  typeof replyRequestCount === 'undefined'
                }
                onChange={this.handleReplyRequestCountCheck}
              />{' '}
              {i18n.t('pageArticles.listArticlesIncludeOne')}
            </label>
          </div>
        </div>
        <style>
          {`
            .reply-request-count {
              width: 2em;
            }
            ul {
              list-style: none;
              padding-left: 0;
              margin-bottom: 0;
            }
            ul li input {
              margin-right: 0.5rem;
            }
        `}
        </style>
      </div>
    );
  };

  renderPagination = () => {
    const {
      query = {}, // URL params
      firstCursor,
      lastCursor,
      firstCursorOfPage,
      lastCursorOfPage,
    } = this.props;

    return (
      <Pagination
        query={query}
        firstCursor={firstCursor}
        lastCursor={lastCursor}
        firstCursorOfPage={firstCursorOfPage}
        lastCursorOfPage={lastCursorOfPage}
      />
    );
  };

  renderList = () => {
    const { localEditorHelperList } = this.state;
    const {
      articles = null,
      totalCount,
      authFields,
      user,
      dispatch,
      query: { q },
    } = this.props;

    return (
      <div className={`article-wrapper`}>
        {totalCount > 0 ? (
          <div>
            <p>
              {totalCount} {i18n.t('pageArticles.articles')}
            </p>
            {this.renderPagination()}
            <ul className="article-list">
              {articles.map(article => {
                const id = article.get('id');

                const replyConnections = article.get('articleReplies');
                return (
                  <ArticleItem
                    key={id}
                    article={article}
                    isLogin={authFields.size !== 0}
                    requestedForReply={authFields.get(article.get('id'))}
                    handleLocalEditorHelperList={
                      this.handleLocalEditorHelperList
                    }
                    replyConnections={replyConnections}
                    {...localEditorHelperList[id]}
                  />
                );
              })}
            </ul>
            {this.renderPagination()}
          </div>
        ) : (
          <div>
            <h4 className={`mt-4`}>{i18n.t('notFoundSearchArticleResult')}</h4>
          </div>
        )}

        {q ? (
          <div>
            {totalCount > 0
              ? i18n.t('createArticleLinkExistTeaser')
              : i18n.t('createArticleLinkTeaser')}
            &nbsp;<CreateArticleButton dispatch={dispatch} user={user} />
          </div>
        ) : (
          ``
        )}
        <style jsx>
          {`
            .article-wrapper {
              border-top: 1px solid rgba(0, 0, 0, 0.3);
              margin-top: 1rem;
            }
            .article-list {
              list-style: none;
              display: flex;
              -ms-flex-direction: column;
              flex-direction: column;
              padding-left: 0;
              margin-bottom: 0;
            }
          `}
        </style>
      </div>
    );
  };

  render() {
    const {
      isLoading = false,
      query: { replyRequestCount, searchUserByArticleId },
    } = this.props;

    const { user } = this.props;

    return (
      <body>
        <AppLayout>
          <main className="wrapper-main">
            <Head>
              <title>{i18n.t('pageArticles.reallyFake')}</title>
            </Head>
            {searchUserByArticleId
              ? this.renderSearchedArticleHeader()
              : this.renderHeader()}
            {this.renderSearch()}
            {this.renderFilter()}
            {isLoading ? <p>Loading...</p> : this.renderList()}
            <span />
            {+replyRequestCount !== 1 &&
            typeof replyRequestCount !== 'undefined' ? (
              <span className="hint">
                {i18n.t('pageArticles.listArticlesMoreThanTwoPeople')}{' '}
                <Link route="articles" params={{ replyRequestCount: 1 }}>
                  <a>{i18n.t('pageArticles.clickHere')}</a>
                </Link>
              </span>
            ) : null}
            <style jsx>{hintStyle}</style>
            <style jsx>{mainStyle}</style>
          </main>
        </AppLayout>
      </body>
    );
  }
}

function mapStateToProps({ articleList, auth }) {
  return {
    isLoading: articleList.getIn(['state', 'isLoading']),
    articles: (articleList.get('edges') || List()).map(edge =>
      edge.get('node')
    ),
    stats: articleList.get('stats'),
    authFields: articleList.get('authFields'),
    totalCount: articleList.get('totalCount'),
    firstCursor: articleList.get('firstCursor'),
    lastCursor: articleList.get('lastCursor'),
    firstCursorOfPage: articleList.getIn(['edges', 0, 'cursor']),
    lastCursorOfPage: articleList.getIn(['edges', -1, 'cursor']),
    repliedArticleCount: auth.getIn(['user', 'repliedArticleCount']),
    user: auth.get('user'),
  };
}

export default connect(mapStateToProps)(Articles);
