import gql from 'graphql-tag'
import _ from 'lodash'
import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { Query } from 'react-apollo'
import { Link } from 'react-router-dom'
import FollowButton from '../FollowButton'
import Page from '../Page'
import WithViewer from '../WithViewer'
import ArticleTabs from './ArticleTabs'

const GET_PROFILE = gql`
  query Profile($username: String!) {
    profile(username: $username) {
      id
      username
      image
      bio
      following
      followers {
        totalCount
      }
    }
  }
`

const EditSettingsLink = () => (
  <Link to="/settings" className="btn btn-sm btn-outline-secondary action-btn">
    <i className="ion-gear-a" />
    &nbsp;
    Edit Profile Settings
  </Link>
)

const Profile = ({ username }) => (
  <Query query={GET_PROFILE} variables={{ username }}>
    {({ loading, error, data }) => {
      if (loading || error) return null

      const { profile } = data

      return (
        <WithViewer>
          {viewer => (
            <Fragment>
              <img src={profile.image} className="user-img" alt="" />
              <h4>{profile.username}</h4>
              <p>{profile.bio}</p>

              {_.get(viewer, 'profile.id') === profile.id
                ? <EditSettingsLink />
                : <FollowButton user={profile} className="action-btn" />
              }
            </Fragment>
          )}
        </WithViewer>
      )
    }}
  </Query>
)

Profile.propTypes = {
  username: PropTypes.string.isRequired
}

const ProfilePage = ({ match: { params: { username } } }) => (
  <Page title={`@${username}`} className="profile-page">
    <div className="user-info">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <Profile username={username} />
          </div>
        </div>
      </div>
    </div>

    <ArticleTabs username={username} />
  </Page>
)

ProfilePage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      username: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
}

export default ProfilePage
