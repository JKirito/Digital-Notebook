import { TextField, Typography } from '@material-ui/core';
import { motion } from 'framer-motion';
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { action_Login } from '../Application/actions';
import { ActionTypes } from '../Application/Actiontypes';
import { LOGIN_BUTTON, SIGNUP_BUTTON } from '../Styled/components';
import "./Login.css";

function Login() {
    const usernameRef = useRef();
    const passwordRef = useRef();
    let dispatch = useDispatch();
    let history = useHistory();
    let isloggedin = useSelector(state => state.AuthReducer.isLoggedIn);
    let error = useSelector(state => state.LoginReducer.error);
    let isLoading = useSelector(state => state.LoginReducer.isLoading);
    const submitForm = (e) => {
        e.preventDefault();
        dispatch({
            type: ActionTypes.removeLoggedInError,
        });
        if (usernameRef.current.value === '' || passwordRef.current.value === '') {
            dispatch({
                type: ActionTypes.setLoggedInError,
                payload: {
                    code: 'Data Not Provided',
                    message: 'Please fill the required Data',
                },
            })
            return;
        }
        dispatch(action_Login(usernameRef.current.value, passwordRef.current.value));
    }
    useEffect(() => {
        if (isloggedin) {
            history.push('/');
        }
    }, [isloggedin]);
    useEffect(() => {
        dispatch({
            type: ActionTypes.removeLoggedInError,
        });
    }, []);
    const pageTransition = {
        initial: {
            opacity: 0,
            x: '100vw',
        },
        in: {
            opacity: 1,
            x: 0,
        },
        out: {
            opacity: 0,
            x: '-100vw',
        },
    }
    const pagetransitions = {
        duration: 0.25,
    };

    return (
        <motion.div className='login' initial="out"
            animate="in"
            exit="out"
            variants={pageTransition}
            transition={pagetransitions}
        >
            <div className="container">
                <h1> LOGIN</h1>
                <div className="inputcontainer">
                    <form noValidate autoComplete="off" className='customTextField'>
                        <TextField id="outlined-basic" label="Username" variant="outlined" fullWidth inputRef={usernameRef} />
                    </form>
                </div>
                <div className="inputcontainer">
                    <form noValidate autoComplete="off" className='customTextField'>
                        <TextField id="outlined-basic" label="password" variant="outlined" type='password' fullWidth inputRef={passwordRef} />
                    </form>
                </div>
                {
                    error && <div className="inputcontainer">
                        <div className="errorBox">
                            {/* <h3>The password that you've entered is incorrect. <Link to='/forgotpassword'><p>Forgot Password?</p></Link> </h3> */}
                            <Typography variant='subtitle2' style={{ color: 'red' }}>{error?.message}</Typography>
                        </div>
                    </div>
                }
                <LOGIN_BUTTON onClick={submitForm} style={{
                    marginTop: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }} disabled={isLoading} className="buttonlogin">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly", width: "40%", }}>
                        <div>Login</div>
                        {isLoading && <div id="loading"></div>}
                    </div>
                </LOGIN_BUTTON>
                <Link to='/signup' style={{ marginTop: "20px" }}><SIGNUP_BUTTON className="buttonsignup">Create an Account</SIGNUP_BUTTON></Link>
                {/* {error && <h2>{JSON.stringify(error)}</h2>} */}
            </div>
        </motion.div>
    )
}

export default Login
