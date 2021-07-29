import React from "react";
import { connect } from "react-redux";

import { setCurrentUser } from "../../actions/authActions";

import "./Profile.css";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { profile: [] };
  }

  async componentDidMount() {
    await this.props.setCurrentUser();
  }
  render() {
    if (this.props.auth.isAuthenticated) {
      console.log(this.props.auth.user)
      return (
        <div className="jumbotron">
          <h1 className="display-4">Cheers, {this.props.auth.user.name}!</h1>
          <p className="lead">Check out these local bars near you!</p>
          <hr className="my-4" />
        </div>
      );
    } else return <div>mmh hold on, login first!</div>;
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { setCurrentUser }
)(Profile);
