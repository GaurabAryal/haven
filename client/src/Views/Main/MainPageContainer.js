import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query, Mutation } from '@apollo/react-components';
import { Redirect } from 'react-router-dom';
import { MIN_GROUP_SIZE, USER_STATUSES } from 'src/constants';
import { Switch, Route } from 'react-router-dom';
import './MainPage.css';
import { AUTH_TOKEN } from 'src/constants';
import { getMemberColor } from 'src/utils';

import Sidebar from './components/Sidebar/Sidebar';
import ChatContainer from './components/Chat/ChatContainer';
import CommunityContainer from './components/Community/CommunityContainer';
import Modal from 'src/components/Modal/Modal';
import ProfilePic from 'src/components/ProfilePic/ProfilePic';

const GET_USER_QUERY = gql`
  {
    me {
      id
      firstName
      profile {
        id
        status
        profilePicture
      }
    }
    membership {
      id
      members {
        id
        firstName
        lastName
        profile {
          id
          profilePicture
          position
          bio
          interests
        }
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

  getMemberIntro(member) {
    let intro = '';
    const position = member.profile.position;
    const interests = member.profile.interests;
    const firstName = member.firstName;
    if (position === 'other' || position === 'prefer not to say') {
      if (interests) {
        return `${firstName} is interested in ${interests.toLowerCase()}`;
      } else {
        return `${firstName} hasn't added details`;
      }
    } else if (position === 'professional') {
      intro = `${firstName} is a professional caregiver`;
      if (interests)
        intro += ` and is interested in ${interests.toLowerCase()}`;
      return intro;
    } else {
      intro = `${firstName} is a ${position} of a person with dementia`;
      if (interests)
        intro += ` and is interested in ${interests.toLowerCase()}`;
      return intro;
    }
  }

  getMembersList(members, meId) {
    return members.map((member, index) =>
      member.id !== meId ? (
        <div
          key={member.firstName + index}
          className="new-match-person"
        >
          <div className="new-match-person__pic">
            <ProfilePic
              imageUrl={member.profile.profilePicture}
              size="md"
              backgroundColor={getMemberColor(member.id, members)}
            />
          </div>
          <div className="new-match-person__details">
            <div className="text--md font-weight--bold">
              {member.firstName} {member.lastName}
            </div>
            <div className="text--md">
              {this.getMemberIntro(member)}
            </div>
          </div>
        </div>
      ) : null,
    );
  }

  onAfterOpenModal(id) {
    this.props.history.push(`/t/${id}`);
  }

  async onCloseModal(mutation) {
    await mutation({
      variables: { status: USER_STATUSES.NORMAL[1] },
    });
  }

  render() {
    return (
      <Query query={GET_USER_QUERY}>
        {({ client, loading, error, data }) => {
          if (loading) return <div />;
          if (error) return <div />;

          const groupMembersAmount =
            data.membership[0]?.members?.length || 0;

          const newestGroupMembersAmount =
            data.membership[data.membership.length - 1]?.members
              ?.length || 0;

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
                    <Modal
                      isOpen={
                        (updatedStatus ||
                          data?.me?.profile?.status) ===
                          USER_STATUSES.NEWLY_MATCHED[0] &&
                        newestGroupMembersAmount >= MIN_GROUP_SIZE
                      }
                      onAfterOpen={() =>
                        this.onAfterOpenModal(matchedGroup.id)
                      }
                      onClose={() => this.onCloseModal(mutation)}
                      buttonText="Get started"
                      header={`${data.me.firstName}, meet your new group!`}
                      onButtonClick={() =>
                        this.onCloseModal(mutation)
                      }
                      width="600px"
                      height="600px"
                    >
                      <>
                        <p className="spacing-bottom--md text--md">
                          You are matched in this group because your
                          preferences fit the members’ preferences.
                          Get to know them below!
                        </p>
                        <div className="members-list">
                          {this.getMembersList(
                            matchedGroup.members,
                            data.me.id,
                          )}
                        </div>
                      </>
                    </Modal>
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
  createSnackbar: PropTypes.func,
};
