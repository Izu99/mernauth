import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { authActions } from '../store';

axios.defaults.withCredentials = true;

function Navbar() {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(state => state.isLoggedIn);

    const sendLogoutReq = async () => {
        try {
            const res = await axios.post("http://localhost:5000/api/logout", null, {
                withCredentials: true
            });
            if (res.status === 200) {
                dispatch(authActions.logout());
            } else {
                throw new Error("Unable to logout. Please try again");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handlelogOut = () => {
        sendLogoutReq();
    };

    return (
        <div>
            <nav className="d-flex">
                <h3 className='text-success'>Navbar</h3>
                <div className='d-flex float-left ms-auto me-2'>
                    {!isLoggedIn && <>
                        <h3 className='me-2'><NavLink to={"/login"}>Login</NavLink></h3>
                        <h3 className='me-2'><NavLink to={"/signup"}>Register</NavLink></h3>
                    </>}
                    <h3 className='me-3'><NavLink to={'/user'}>Welcome</NavLink></h3>
                    {isLoggedIn &&
                        <h3 className='me-3' onClick={handlelogOut}><NavLink to={'/login'}>Logout</NavLink></h3>
                    }
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
