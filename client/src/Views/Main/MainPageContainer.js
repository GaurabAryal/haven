import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query, Mutation } from '@apollo/react-components';
import { Redirect } from 'react-router-dom';
import { MIN_GROUP_SIZE, USER_STATUSES } from 'src/constants';
import { Switch, Route } from 'react-router-dom';
import './MainPage.css';
import { AUTH_TOKEN } from 'src/constants';

import Sidebar from './components/Sidebar/Sidebar';
import ChatContainer from './components/Chat/ChatContainer';
import CommunityContainer from './components/Community/CommunityContainer';
import Modal from 'src/components/Modal/Modal';

const GET_USER_QUERY = gql`
  {
    me {
      id
      firstName
      profile {
        status
      }
    }
    membership {
      id
      members {
        id
        firstName
        lastName
      }
    }
  }
`;

const UPDATE_USER_STATUS_MUTATION = gql`
  mutation JoinCommunityMutation($status: Int) {
    updateProfile(profileInput: { status: $status }) {
      profile {
        id
        status
      }
    }
  }
`;

export default class MainPageContainer extends React.Component {
  logout = async client => {
    if (localStorage[AUTH_TOKEN]) {
      localStorage.removeItem(AUTH_TOKEN);
    }
    await client.clearStore();
    this.props.history.push('/login');
  };

  getMembersList(members) {
    return members.map((member, index) => (
      <div key={member.firstName + index}>
        {member.firstName} {member.lastName}
      </div>
    ));
  }

  onAfterOpenModal(id) {
    this.props.history.push(`/t/${id}`);
  }

  async onCloseModal(mutation) {
    await mutation({
      variables: { status: USER_STATUSES.NORMAL[1] },
    });
  }

  async test(mutation) {
    await mutation({
      variables: { status: USER_STATUSES.NEWLY_MATCHED[1] },
    });
  }

  render() {
    return (
      <Query query={GET_USER_QUERY}>
        {({ client, loading, error, data }) => {
          if (loading) return <div />;
          if (error) return `Error! ${error.message}`;

          const groupMembersAmount =
            data.membership[0]?.members?.length || 0;

          if (groupMembersAmount < MIN_GROUP_SIZE) {
            return (
              <Redirect
                to={{
                  pathname: '/onboarding',
                  state: { from: this.props.location },
                }}
              />
            );
          }

          return (
            <div className="mainpage-container">
              <Sidebar
                groups={data.membership}
                logout={() => this.logout(client)}
              />
              <Switch>
                <Route
                  path="/community"
                  component={CommunityContainer}
                />
                <Route path="/t/:id" component={ChatContainer} />
                <Route exact path="/">
                  <Redirect to={`/t/${data.membership[0].id}`} />
                </Route>
              </Switch>
              <Mutation mutation={UPDATE_USER_STATUS_MUTATION}>
                {(mutation, { data: mutationData }) => {
                  const updatedStatus =
                    mutationData?.updateProfile?.profile?.status ||
                    null;
                  const matchedGroup =
                    data.membership[data.membership.length - 1];
                  return (
                    <>
                      <Modal
                        isOpen={
                          (updatedStatus ||
                            data?.me?.profile?.status) ===
                          USER_STATUSES.NEWLY_MATCHED[0]
                        }
                        onAfterOpen={() =>
                          this.onAfterOpenModal(matchedGroup.id)
                        }
                        onClose={() => this.onCloseModal(mutation)}
                        buttonText="Let's get the conversation starting!"
                        header={`${data.me.firstName}, you've been matched with:`}
                        onButtonClick={() =>
                          this.onCloseModal(mutation)
                        }
                      >
                        <>
                          {this.getMembersList(matchedGroup.members)}
                        </>
                      </Modal>
                      <button onClick={() => this.test(mutation)}>
                        REMOVE THIS AFTER
                      </button>
                    </>
                  );
                }}
              </Mutation>
            </div>
          );
        }}
      </Query>
    );
  }
}

MainPageContainer.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
};
