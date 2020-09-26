import jwt_decode from 'jwt-decode';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { logoutUser, setCurrentUser } from './actions/authActions';
import './App.css';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Navbar from './components/layout/Navbar';
import store from './store';
import setAuthToken from './utils/setAuthToken';
// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decode = jwt_decode(localStorage.jwtToken);
  // Set user and is isAuthenticated
  store.dispatch(setCurrentUser(decode));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decode.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser);
    // TODO: Clear current Profile
    // Redirect to login
    window.location.href = '/login';
  }
}
if (localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);
}
function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <Route exact path="/" component={Landing} />
          <div className="container">
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
          </div>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
