import { TextField } from '@material-ui/core';
import { motion } from 'framer-motion';
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
    const displaynameRef = useRef();
    let history = useHistory();
    let dispatch = useDispatch();
    let isloading = useSelector(state => state.SignupReducer.isLoading);
    let isSuccessful = useSelector(state => state.SignupReducer.success);
    let error = useSelector(state => state.SignupReducer.error);

    const submitForm = async (e) => {
        e.preventDefault();
        if (signuppasswordRef.current.value !== signuppasswordConfirmRef.current.value && displaynameRef.current.value && signupusernameRef.current.value) {
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
        dispatch(action_Signup(signupusernameRef.current.value, signuppasswordRef.current.value, displaynameRef.current.value));
    }

    const pageTransition = {
        initial: {
            opacity: 0,
            x: '-100vw',
        },
        in: {
            opacity: 1,
            x: 0,
        },
        out: {
            opacity: 0,
            x: '100vw',
        },
    }
    const pagetransitions = {
        duration: 0.25,
    };

    useEffect(() => {
        if (isSuccessful) {
            history.push('/');
        }
    })
    useEffect(() => {
        dispatch({
            type: ActionTypes.setSignupError,
        });
    }, []);
    return (
        <motion.div className="login"
            initial="out"
            animate="in"
            exit="out"
            variants={pageTransition}
            transition={pagetransitions}
        >
            <div className="container" >
                <h1>Sign Up</h1>
                <div className="inputcontainer">
                    <form className='customTextField'>
                        <TextField id="outlined-basic" label="Display Name" variant="outlined" fullWidth inputRef={displaynameRef} />
                    </form>
                </div>
                <div className="inputcontainer">
                    <form className='customTextField'>
                        <TextField id="outlined-basic" label="Username" variant="outlined" fullWidth inputRef={signupusernameRef} />
                    </form>
                </div>
                <div className="inputcontainer">

                    <form className='customTextField'>
                        <TextField id="outlined-basic" label="Password" variant="outlined" type='password' fullWidth inputRef={signuppasswordRef} />
                    </form>
                </div>
                <div className="inputcontainer">
                    <form className='customTextField'>
                        <TextField id="outlined-basic" label="Confirm Password" variant="outlined" type='password' fullWidth inputRef={signuppasswordConfirmRef} />
                    </form>
                </div>
                {
                    error && <div className="inputcontainer">
                        <div className="errorBox">
                            <h3>{error.message}</h3>
                        </div>
                    </div>
                }
                <SIGNUP_BUTTON onClick={submitForm} style={{
                    marginTop: "20px", display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }} disabled={isloading} className="buttonsignup">
                    {/* Sign Up */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly", width: "40%", }}>
                        <div>Sign Up</div>
                        {isloading && <div id="loading"></div>}
                    </div>
                </SIGNUP_BUTTON>
                {/* <div id='loading'></div> */}
                <Link to='/login' style={{ marginTop: "20px" }}><LOGIN_BUTTON className="buttonlogin">Go to Login</LOGIN_BUTTON> </Link>
            </div>
        </motion.div >
    )
}


export default Signup;
