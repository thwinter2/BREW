import './App.css';
import React from 'react';
import Login from './components/login';
import Logout from './components/logout';

function App() {
  return (
    <div className="App">
      <Login />
      <br />
      <Logout />
    </div>
  );
}

export default App;
