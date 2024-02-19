import React from 'react'
import './App.css';
import { Routes, Route } from 'react-router-dom'
import Welcome from './components/Welcome';
import Signup from './components/Signup';
import Login from './components/Login';
import Navbar from './components/Navbar';
import { useSelector } from 'react-redux';

function App() {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  console.log(isLoggedIn);
  return (
    <React.Fragment>
      <header>
        <Navbar />
      </header>
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {isLoggedIn && <Route path="/user" element={<Welcome />} />}
        </Routes>
      </main>
    </React.Fragment>
  );
}

export default App;
