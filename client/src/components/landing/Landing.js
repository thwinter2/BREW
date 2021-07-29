import React from "react";
import { connect } from "react-redux";

import { setCurrentUser } from "../../actions/authActions";

import Preferences from "../preferences/Preferences";

import "./Landing.css";

class Landing extends React.Component {
  async componentDidMount() {
    await this.props.setCurrentUser();
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;
    return (
      <div className="landing text-light">
        <div className="dark-overlay">
          <div className="landing-container text-center">
            <h1 className="display-3 mb-4">BREWS</h1>
            {isAuthenticated ? (
              <div className="authenticated-container">
                <h2 className="display-5 mb-4">Welcome, {user.name}</h2>
                <div className="preferences">
                  <Preferences />
                </div>
              </div>
            ) : (
              <div>
                <p className="lead">
                  Login to for a personalized experience of BREWS!
                </p>
                <div className="google-btn-container">
                  <a href="/auth/google">
                    <div className="google-btn">
                      <div className="google-icon-wrapper">
                        <img
                          className="google-icon"
                          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                          alt="signin"
                        />
                      </div>
                      <p className="btn-text">
                        <b>Log in with Google</b>
                      </p>
                    </div>
                  </a>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { setCurrentUser }
)(Landing);
