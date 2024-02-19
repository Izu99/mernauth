import React, { useEffect, useState } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;
let firstRender = true;

const Welcome = () => {
  const [user, setUser] = useState();
  const [error, setError] = useState(null);

  const refreshToken = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/refresh", { withCredentials: true });
      const data = res.data;
      return data;
    } catch (error) {
      throw new Error("Error refreshing token");
    }
  };

  const sendRequest = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user', { withCredentials: true });
      const data = res.data;
      return data;
    } catch (error) {
      throw new Error("Error fetching user data");
    }
  }

  useEffect(() => {
    if (firstRender) {
      firstRender = false;
      sendRequest()
        .then((data) => setUser(data.user))
        .catch((error) => setError(error.message));
    }

    let interval = setInterval(() => {
      refreshToken()
        .then(data => setUser(data.user))
        .catch((error) => setError(error.message));
    }, 1000 * 29);

    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div>
        <h1>Something went wrong</h1>
        <p>{error}</p>
        <p>Please check your internet connection and try refreshing the page. If the problem persists, contact support.</p>
      </div>
    );
  }

  return (
    <div>
      {user && <h1>{user.name}</h1>}
    </div>
  );
}

export default Welcome;
