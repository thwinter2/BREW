import React from 'react';
import { GoogleLogout } from 'react-google-login';

const clientId =
  '860951423199-l7ej8sgfttu01p4hjvi56oeh1t9uj1r6.apps.googleusercontent.com';

function Logout() {
  const onSuccess = () => {
    console.log('Logout made successfully');
    alert('Logout made successfully');
  };

  return (
    <div>
      <GoogleLogout
        clientId={clientId}
        buttonText="Logout"
        onLogoutSuccess={onSuccess}
      ></GoogleLogout>
    </div>
  );
}

export default Logout;
