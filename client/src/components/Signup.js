import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { SchemaTypeOptions } from 'mongoose';

const Signup = () => {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: ""
  });
  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,

    }));
  };
  const sendRequest = async () => {
    const res = await axios.post('http://localhost:5000/api/signup', {
      name: inputs.name,
      email: inputs.email,
      password: inputs.password
    }).catch(err => console.log(err));
    const data = await res.data;
    return data;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest().then(() => history("/login"));

  };
  return (
    <div>
      <div className="col-lg-6 mb-5 mb-lg-0">
        <div className="card">
          <div className="card-body py-5 px-md-5">
            <form onSubmit={handleSubmit}>
              <div className="form-outline mb-4">
                <input type="text" id="form3Example2" className="form-control" value={inputs.name} onChange={handleChange} name='name' />
              </div>
              <div className="form-outline mb-4">
                <input type="email" id="form3Example3" className="form-control" value={inputs.email} onChange={handleChange} name='email' />
              </div>
              <div className="form-outline mb-4">
                <input type="password" id="form3Example4" className="form-control" value={inputs.password} onChange={handleChange} name='password' />
              </div>
              <button type="submit">
                SignUp
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Signup
