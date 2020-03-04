import React from 'react';
import PropTypes from 'prop-types';
import { getMemberNames } from 'src/utils';
import { ReactComponent as BookIcon } from './images/book-open.svg';
import { ReactComponent as SidebarIcon } from './images/sidebar.svg';

export default function ChatHeader(props) {
  return (
    <div className="group-header-container">
      <div className=" group-header__text text--lg font-weight--bold add-ellipses">
        {getMemberNames(props.members)}
      </div>
      <div className="group-header__actions">
        <div className="group-header__action">
          <BookIcon />
          <p className="color--purple group-header__action-text">
            Guidelines
          </p>
        </div>
        <div
          className="group-header__action"
          onClick={props.toggleDetails}
        >
          <SidebarIcon />
          <p className="color--purple group-header__action-text">
            Details
          </p>
        </div>
      </div>
    </div>
  );
}

ChatHeader.propTypes = {
  members: PropTypes.array,
};
