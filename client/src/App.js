import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";

import Profile from "./components/profile/Profile";
import Landing from "./components/landing/Landing";
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";
import Map from './components/map/Map';

import "./App.css";

function App() {
  // When the window is loaded, we can stop showing the loading screen
  // And show the app content.  By now, all components should have mounted.
  const onWindowLoad = () => {
    const ele = document.getElementById('ipl-progress-indicator')
    if (ele) {
      ele.classList.add('available')
    }

    window.removeEventListener('load', onWindowLoad);
  };
  window.addEventListener('load', onWindowLoad);

  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          {/* <Navbar /> */}
          {/* <Route exact path="/" component={Landing} /> */}
          {/* <div className="container">
            <Route exact path="/profile" component={Profile} />
          </div> */}
          <Map />
          {/* <Footer /> */}
        </div>
      </Router>
    </Provider>
  );
}

export default App;

