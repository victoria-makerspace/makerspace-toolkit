/* eslint-disable no-console */
var jwtDecode = require('jwt-decode');
const axios = require('axios').default;

export const loginService = {
  startLogin,
  finishLogin,
  logout
};

function startLogin(returnUrl) {
  location.href = 'http://localhost:5005/api/auth/login?returnUrl=' + encodeURI(returnUrl);
}

function finishLogin(sso, sig) {
  return axios.get("auth/GetToken?sso=" + sso + "&sig=" + sig).then(
    response => {
      var user = { token: response.data, ...jwtDecode(response.data) };

      if (user.token) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('access_token', user.token);
      }

      return user;
    }
  );
}

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('user');
}