import * as React from 'react'
import { appState } from '../redux/store/templates/appState'
const test = process.env.CLIENT_ID;
import { GoogleLogin, GoogleLogout } from 'react-google-login';

export default props => {
    const onLogin = (googleUser) => {
        // Useful data for your client-side scripts:
        var profile = googleUser.getBasicProfile();
        console.log("ID: " + profile.getId()); // Don't send this directly to your server!
        console.log('Full Name: ' + profile.getName());
        console.log('Given Name: ' + profile.getGivenName());
        console.log('Family Name: ' + profile.getFamilyName());
        console.log("Image URL: " + profile.getImageUrl());
        console.log("Email: " + profile.getEmail());

        // The ID token you need to pass to your backend:
        var id_token = googleUser.getAuthResponse().id_token;
        console.log("ID Token: " + id_token);
        props.login(id_token);
    };
    const onLoginError = (e) => {
        console.log('Something went wrong:', JSON.stringify(e));
    };
    const logout = () => {
        console.log('User signed out.');
    };
    return (
        <div>
            <GoogleLogin
                clientId={process.env.CLIENT_ID}
                buttonText="Login"
                onSuccess={onLogin}
                onFailure={onLoginError}
            />
            <GoogleLogout
                buttonText="Logout"
                onLogoutSuccess={logout}
            />
        </div>
    )
}