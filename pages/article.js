import React from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import stringSimilarity from 'string-similarity';
import { nl2br, linkify } from '../util/text';

import AppLayout from 'components/AppLayout';
import ArticleInfo from 'components/ArticleInfo';
import ArticleItem from 'components/ArticleItem';
import CurrentReplies from 'components/CurrentReplies';
import RelatedReplies from 'components/RelatedReplies';
import ReplySearch from 'components/ReplySearch/ReplySearch.js';
import ReplyForm from 'components/ReplyForm';
import ReplyRequestReason from 'components/ReplyRequestReason';
import Hyperlinks from 'components/Hyperlinks';
import Trendline from 'components/Trendline';
import {
  load,
  loadAuth,
  submitReply,
  connectReply,
  searchReplies,
  searchRepiedArticle,
  updateArticleReplyStatus,
  voteReply,
  reset,
  voteReplyRequest,
} from 'ducks/articleDetail';
import i18n from '../i18n';

import { detailStyle, tabMenuStyle } from './article.styles';

class ArticlePage extends React.Component {
  state = {
    tab: 'search', // 'new, 'related', 'search'
  };

  static async getInitialProps({ store: { dispatch }, query: { id } }) {
    await dispatch(load(id));
    return { id };
  }

  componentDidMount() {
    const { id, dispatch } = this.props;
    return dispatch(loadAuth(id));
  }

  handleConnect = ({ target: { value: replyId } }) => {
    const { dispatch, id } = this.props;
    return dispatch(connectReply(id, replyId)).then(this.scrollToReplySection);
  };

  handleSearchReply = ({ target: { value: queryString } }, after) => {
    const { dispatch } = this.props;
    dispatch(
      searchReplies({
        q: queryString,
        after,
      })
    );
    dispatch(
      searchRepiedArticle({
        q: queryString,
      })
    );
  };

  handleSubmit = reply => {
    const { dispatch, id } = this.props;
    return dispatch(
      submitReply({
        ...reply,
        articleId: id,
      })
    ).then(this.scrollToReplySection);
  };

  handleReplyConnectionDelete = conn => {
    const { dispatch, id } = this.props;
    return dispatch(
      updateArticleReplyStatus(id, conn.get('replyId'), 'DELETED')
    );
  };

  handleReplyConnectionRestore = conn => {
    const { dispatch, id } = this.props;
    return dispatch(
      updateArticleReplyStatus(id, conn.get('replyId'), 'NORMAL')
    ).then(this.scrollToReplySection);
  };

  handleVoteReplyRequest = (replyRequestId, voteType, indexOfReplyRequests) => {
    const { dispatch, id } = this.props;
    dispatch(
      voteReplyRequest(id, replyRequestId, voteType, indexOfReplyRequests)
    );
  };

  handleReplyConnectionVote = (conn, vote, comment) => {
    const { dispatch, id } = this.props;
    return dispatch(voteReply(id, conn.get('replyId'), vote, comment));
  };

  handleTabChange = tab => () => {
    this.setState({
      tab,
    });
  };

  scrollToReplySection = () => {
    if (!this._replySectionEl) return;
    this._replySectionEl.scrollIntoView({
      behavior: 'smooth',
    });
  };

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(reset());
  }

  renderTabMenu = () => {
    const { data } = this.props;
    const { tab } = this.state;
    const relatedReplyCount = data.get('relatedReplies').size;

    return (
      <ul className="tabs">
        <li
          onClick={this.handleTabChange('new')}
          className={`tab ${tab === 'new' ? 'active' : ''}`}
        >
          {i18n.t("pageArticle.tabMenu1")}
        </li>
        <li
          onClick={this.handleTabChange('related')}
          className={`tab ${tab === 'related' ? 'active' : ''} ${
            relatedReplyCount === 0 ? 'disabled' : ''
          }`}
        >
          {relatedReplyCount === 0 ? (
            `${i18n.t("pageArticle.tabMenu2")}`
          ) : (
            <span>
              {i18n.t("sentence.useRelavantReplies")} <span className="badge">{relatedReplyCount}</span>
            </span>
          )}
        </li>
        <li
          onClick={this.handleTabChange('search')}
          className={`tab ${tab === 'search' ? 'active' : ''}`}
        >
          {i18n.t("search")}
        </li>
        <li className="empty" />
        <style jsx>{tabMenuStyle}</style>
      </ul>
    );
  };

  renderNewReplyTab = () => {
    const { data, isReplyLoading } = this.props;
    const { tab } = this.state;

    const article = data.get('article');
    const relatedReplies = data.get('relatedReplies');
    const searchArticles = data.get('searchArticles');
    const searchReplies = data.get('searchReplies');

    const articleText = article.get('text', '');
    const getArticleSimilarity = relatedArticleText =>
      stringSimilarity.compareTwoStrings(articleText, relatedArticleText);

    switch (tab) {
      case 'new':
        return (
          <ReplyForm onSubmit={this.handleSubmit} disabled={isReplyLoading} />
        );

      case 'related':
        return (
          <RelatedReplies
            onConnect={this.handleConnect}
            relatedReplies={relatedReplies}
            getArticleSimilarity={getArticleSimilarity}
          />
        );

      case 'search':
        return (
          <ReplySearch
            onConnect={this.handleConnect}
            onSearch={this.handleSearchReply}
            articles={searchArticles}
            replies={searchReplies}
          />
        );

      default:
        return null;
    }
  };

  render() {
    const { data, isLoading, isReplyLoading } = this.props;

    const article = data.get('article');
    const replyConnections = data.get('replyConnections');
    const relatedArticles = data.get('relatedArticles');

    if (isLoading && article === null) {
      return <div>Loading...</div>;
    }

    if (article === null) {
      return <div>Article not found.</div>;
    }

    const slicedArticleTitle = article.get('text').slice(0, 15);

    return (
      <AppLayout>
        <div className="root">
          <Head>
            <title>{slicedArticleTitle}⋯⋯ | {i18n.t("SiteName")} {i18n.t("realOrFake")}</title>
          </Head>
          <section className="section">
            <header className="header">
              <h2>{i18n.t("originalMessage")}</h2>
              <div className="trendline">
                <Trendline id={article.get('id')} />
              </div>
              <ArticleInfo article={article} />
            </header>
            <article className="message">
              {nl2br(
                linkify(article.get('text'), {
                  props: {
                    target: '_blank',
                  },
                })
              )}
              <Hyperlinks hyperlinks={article.get('hyperlinks')} />
            </article>
            <footer>
              {article.get('replyRequests').map((replyRequest, index) => {
                return (
                  <ReplyRequestReason
                    key={`reason-${index}`}
                    index={index}
                    articleId={article.get('id')}
                    replyRequest={replyRequest}
                    isArticleCreator={index === 0}
                    onVoteReason={this.handleVoteReplyRequest}
                  />
                );
              })}
            </footer>
          </section>
          <section
            id="current-replies"
            className="section"
            ref={replySectionEl => (this._replySectionEl = replySectionEl)}
          >
            <h2>{i18n.t("existingResponse")}</h2>
            <CurrentReplies
              replyConnections={replyConnections}
              disabled={isReplyLoading}
              onDelete={this.handleReplyConnectionDelete}
              onRestore={this.handleReplyConnectionRestore}
              onVote={this.handleReplyConnectionVote}
            />
          </section>
          <section className="section">
            <h2>{i18n.t("addNewResponse")}</h2>
            {this.renderTabMenu()}
            <div className="tab-content">{this.renderNewReplyTab()}</div>
          </section>
          {relatedArticles.size ? (
            <section className="section">
              <h2>{i18n.t("sentence.similarArticles")}</h2>
              <div>
                {relatedArticles.map(article => (
                  <ArticleItem key={article.get('id')} article={article} />
                ))}
              </div>
            </section>
          ) : (
            ''
          )}
          <style jsx>{detailStyle}</style>
          <style jsx>{`
            .tab-content {
              padding: 20px;
              border: 1px solid #ccc;
              border-top: 0;
            }
          `}</style>
        </div>
      </AppLayout>
    );
  }
}

function mapStateToProps({ articleDetail }) {
  return {
    isLoading: articleDetail.getIn(['state', 'isLoading']),
    isReplyLoading: articleDetail.getIn(['state', 'isReplyLoading']),
    data: articleDetail.get('data'),
  };
}

export default connect(mapStateToProps)(ArticlePage);
