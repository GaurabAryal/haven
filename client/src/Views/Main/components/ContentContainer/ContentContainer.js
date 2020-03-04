import React from 'react';
import PropTypes from 'prop-types';

import './ContentContainer.css';

export default class ContentContainer extends React.Component {
  state = {};

  render() {
    return (
      <div className="contentContainer-container">
        <div className="contentContainer-header">
          {this.props.header}
        </div>
        <div className="contentContainer-mainContent">
          <div className="messages-container">
            {this.props.children}
          </div>
          {this.props.showDetails ? this.props.details : null}
        </div>
      </div>
    );
  }
}

ContentContainer.propTypes = {
  header: PropTypes.element,
  children: PropTypes.element,
  details: PropTypes.element,
  showDetails: PropTypes.bool,
};
