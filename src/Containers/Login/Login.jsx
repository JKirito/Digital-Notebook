import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { action_Login } from '../Application/actions';
import { LOGIN_BUTTON, SIGNUP_BUTTON } from '../Styled/components';
import "./Login.css";

function Login() {
    const usernameRef = useRef();
    const passwordRef = useRef();
    let dispatch = useDispatch();
    let history = useHistory();
    let isloggedin = useSelector(state => state.AuthReducer.isLoggedIn);
    let error = useSelector(state => state.LoginReducer.error);
    const submitForm = (e) => {
        e.preventDefault();
        dispatch(action_Login(usernameRef.current.value, passwordRef.current.value));
    }
    useEffect(() => {
        if (isloggedin) {
            history.push('/');
        }
    });
    return (
        <div className='login'>
            <div className="container">
                <h1> LOGIN</h1>
                <div className="inputcontainer">
                    <label htmlFor="email" className="text">
                        E-mail
            </label>
                    <input type="text" id="email" ref={usernameRef} />
                </div>
                <div className="inputcontainer">
                    <label htmlFor="email" className="text">
                        Password
            </label>
                    <input type="password" id="pass" ref={passwordRef} />
                </div>
                <LOGIN_BUTTON onClick={submitForm} className="buttonlogin">Login</LOGIN_BUTTON>
                <Link to='/signup'><SIGNUP_BUTTON className="buttonsignup">Create an Account</SIGNUP_BUTTON></Link>
                {error && <h2>{JSON.stringify(error)}</h2>}
            </div>
        </div>
    )
}

export default Login
