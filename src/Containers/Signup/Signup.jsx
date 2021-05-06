import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { action_Signup } from '../Application/actions';
import { ActionTypes } from '../Application/Actiontypes';
import { LOGIN_BUTTON, SIGNUP_BUTTON } from '../Styled/components';
import "./Signup.css";

function Signup() {
    const signupusernameRef = useRef();
    const signuppasswordRef = useRef();
    const signuppasswordConfirmRef = useRef();
    let history = useHistory();
    let dispatch = useDispatch();
    let isloading = useSelector(state => state.SignupReducer.isLoading);
    let isSuccessful = useSelector(state => state.SignupReducer.success);
    let error = useSelector(state => state.SignupReducer.error);

    const submitForm = async (e) => {
        e.preventDefault();
        if (signuppasswordRef.current.value !== signuppasswordConfirmRef.current.value) {
            dispatch({
                type: ActionTypes.fetchSignupFailure,
                payload: {
                    error: {
                        code: 'auth/password-not-confirmed',
                        message: 'Passwords Dont Match',
                    },
                    success: false,
                },
            })
            return;
        }
        dispatch(action_Signup(signupusernameRef.current.value, signuppasswordRef.current.value));
    }
    useEffect(() => {
        if (isSuccessful) {
            history.push('/');
        }
    })
    return (
        <div className="login">
            <div className="container">
                <h1>Sign Up</h1>
                <div className="inputcontainer">
                    <label htmlFor="email" className="text">
                        E-mail
          </label>
                    <input type="text" id="email" ref={signupusernameRef} />
                </div>
                <div className="inputcontainer">
                    <label htmlFor="pass" className="text">
                        Password
          </label>
                    <input type="password" id="pass" ref={signuppasswordRef} />
                </div>
                <div className="inputcontainer">
                    <label htmlFor="pass" className="text">
                        Confirm password
          </label>
                    <input type="password" id="pass" ref={signuppasswordConfirmRef} />
                </div>
                <SIGNUP_BUTTON onClick={submitForm} disabled={isloading} className="buttonsignup">Sign Up</SIGNUP_BUTTON>
                <Link to='/login'><LOGIN_BUTTON className="buttonlogin">Go to Login</LOGIN_BUTTON> </Link>
                {error && <h3>{JSON.stringify(error)}</h3>}
            </div>
        </div>
    )
}


export default Signup;
