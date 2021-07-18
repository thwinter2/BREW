import './App.css';
import React from 'react';
import Login from './components/login';
import Logout from './components/logout';
import Map from './components/map';

function App() {
  return (
    <div className="App">
      <Login />
      <Logout />
      <Map />
    </div>
  );
}

export default App;
