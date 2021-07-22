import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";

import Profile from "./components/profile/Profile";
import Landing from "./components/landing/Landing";
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";
import Map from './components/map';

import "./App.css";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <div className="container">
              <Route exact path="/profile" component={Profile} />
            </div>
            <Map />
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;

