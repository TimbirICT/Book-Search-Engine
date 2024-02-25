import decode from 'jwt-decode';
import { useMutation } from '@apollo/client';
import { LOGIN_USER, ADD_USER } from './mutations'; // Import your GraphQL mutations

class AuthService {
  getProfile() {
    return decode(this.getToken());
  }

  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  }

  getToken() {
    return localStorage.getItem('id_token');
  }

  async login(email, password) {
    try {
      const { data } = await useMutation(LOGIN_USER, {
        variables: { email, password },
      });

      const idToken = data.login.token;
      localStorage.setItem('id_token', idToken);
      window.location.assign('/');
    } catch (error) {
      console.error('Login failed:', error.message);
      // Handle login failure (e.g., show error message)
    }
  }

  async signup(username, email, password) {
    try {
      const { data } = await useMutation(ADD_USER, {
        variables: { username, email, password },
      });

      const idToken = data.addUser.token;
      localStorage.setItem('id_token', idToken);
      window.location.assign('/');
    } catch (error) {
      console.error('Signup failed:', error.message);
      // Handle signup failure (e.g., show error message)
    }
  }

  logout() {
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }
}

export default new AuthService();
