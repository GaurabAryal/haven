import React from 'react';
import PropTypes from 'prop-types';
import { getMemberNames, getOtherMembers } from 'src/utils';
import { ReactComponent as BookIcon } from './images/book-open.svg';
import { ReactComponent as SidebarIcon } from './images/sidebar.svg';
import { ReactComponent as SidebarOpenIcon } from './images/sidebar-open.svg';

export default function ChatHeader(props) {
  const otherMembers = getOtherMembers(props.meId, props.members);

  return (
    <div className="group-header-container noselect">
      <div className=" group-header__text text--lg font-weight--bold add-ellipses">
        {getMemberNames(otherMembers, true)}
      </div>
      <div className="group-header__actions">
        <div
          className="group-header__action"
          onClick={props.showGuidelines}
        >
          <BookIcon />
          <p className="color--purple group-header__action-text">
            Guidelines
          </p>
        </div>
        <div
          className="group-header__action"
          onClick={props.toggleDetails}
        >
          {props.isDetailsOpen ? (
            <SidebarOpenIcon />
          ) : (
            <SidebarIcon />
          )}
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
  showGuidelines: PropTypes.func,
  toggleDetails: PropTypes.func,
  isDetailsOpen: PropTypes.bool,
  isDirectMessage: PropTypes.bool,
};
