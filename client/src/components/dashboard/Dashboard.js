import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteAccount, getCurrentProfile } from '../../actions/profileAction';
import Spinner from '../common/Spinner';
import Experience from './Experience';
import PrfoileActions from './ProfileActions';
class Dashboard extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
  }

  onDeleteClick(e) {
    this.props.deleteAccount();
  }
  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;

    let dashboardContent;
    if (profile === null || loading) {
      dashboardContent = <Spinner />;
    } else {
      // Check if logged in user has profile data
      if (Object.keys(profile).length > 0) {
        dashboardContent = (
          <div>
            <p className="lead text-muted">
              Welcome <Link to={`/profile/${profile.handle}`}>{user.name}</Link>
            </p>
            <PrfoileActions />
            <Experience experience={profile.experience} />
            <div style={{ marginBottom: '60px' }} />
            <button
              onClick={this.onDeleteClick.bind(this)}
              className="btn btn-danger"
            >
              Delete My Account{' '}
            </button>
          </div>
        );
      } else {
        // User is logged in but has no profile
        dashboardContent = (
          <div>
            <p className="lead text-muted">Welcome {user.name}</p>
            <p>You have not yet setup a profile, please add some info</p>

            <Link to="/create-profile" className="btn btn-lg btn-info">
              Create Profile
            </Link>
          </div>
        );
      }
    }
    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Dashboard</h1>
              {dashboardContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};
const mapStoreToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});
export default connect(mapStoreToProps, { deleteAccount, getCurrentProfile })(
  Dashboard
);
