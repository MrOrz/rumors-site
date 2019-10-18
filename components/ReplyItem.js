import React from 'react';
import { Link } from '../routes';
import moment from 'moment';
import { listItemStyle } from './ListItem.styles';
import { TYPE_ICON, TYPE_NAME } from '../constants/replyType';
import i18n from 'i18n';

export default function ReplyItem({ reply, showUser = true }) {
  const replyType = reply.get('type');
  const createdAt = moment(reply.get('createdAt'));

  return (
    <Link route="reply" params={{ id: reply.get('id') }}>
      <a className="item">
        <div title={TYPE_NAME[replyType]}>{TYPE_ICON[replyType]}</div>
        <div className="item-content">
          <div className="item-text">
            {showUser ? `${reply.getIn(['user', 'name'], i18n.t("someone"))}：` : ''}
            {reply.get('text')}
          </div>
          <div className="item-info">
            {i18n.t("usedIn")} {reply.get('replyConnectionCount')} {i18n.t("article")}
            {createdAt.isValid() ? (
              <span title={createdAt.format('lll')}>
                ・{createdAt.fromNow()}
              </span>
            ) : (
              ''
            )}
          </div>
        </div>
        <style jsx>{listItemStyle}</style>
        <style jsx>{`
          .item {
            display: flex;
          }
          .item-content {
            margin-left: 8px;
            min-width: 0; /* Make inner ellipsis work */
          }
          .item-info {
            font-size: 0.8em;
            color: rgba(0, 0, 0, 0.5);
          }
        `}</style>
      </a>
    </Link>
  );
}
