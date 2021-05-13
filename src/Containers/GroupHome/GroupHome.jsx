import { Box, Button, ButtonGroup, Card, CardActions, CardContent, Grid, makeStyles, Modal, TextField, Typography } from '@material-ui/core';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { action_addRealTimeListener, action_createClass, action_fetchClasses, action_joinClass } from '../Application/actions';
import { ActionTypes, FirebaseCollections } from '../Application/Actiontypes';
import { auth, db } from '../Application/firebase';
import NavBar from '../Home/NavBar'

import "./GroupHome.css";

const modalTypes = {
    join: 'join',
    create: 'create',
}
const useStyles = makeStyles(theme => ({
    buttonmarginleftright: {
        margin: "0 0.25rem",
    },
    margintopbottom: {
        margin: "1rem 0",
    }
}))

function GroupHome() {
    const [showModal, setShowModal] = useState(false)
    const [currentModal, setCurrentModal] = useState(modalTypes.join);
    let myclasses = useSelector(state => state.ClassReducer.myclasses);
    let enrolledclasses = useSelector(state => state.ClassReducer.enrolledclasses);
    // const [myclassdata, setmyclassdata] = useState(classData);
    const dispatch = useDispatch();
    const history = useHistory();
    let currentData;
    const classes = useStyles();

    const addFirebaseRealtimeListenerToClasses = () => {
        // console.log(`Adding first global Listener`)
        dispatch(action_addRealTimeListener());
    }
    // useEffect(() => {
    //     if (classData) {
    //         setmyclassdata([...classData]);
    //     }
    // }, [classData]);
    const joinClass = () => {
        dispatch({
            type: ActionTypes.createClassResetDefaultState,
        });
        setCurrentModal(modalTypes.join);
        setShowModal(true)
    }
    const createClass = () => {
        dispatch({
            type: ActionTypes.createClassResetDefaultState,
        });
        setCurrentModal(modalTypes.create);
        setShowModal(true)
    }

    const ClassBox = ({ name }) => {
        const changeRouteToClass = () => {
            history.push(`/class/${name}`);
        }
        return (
            <Card variant='outlined'>
                <CardContent>
                    <Typography variant='h6'>{name}</Typography>
                    <Typography variant='subtitle2'>Some Description of Class-</Typography>
                </CardContent>
                <CardActions>
                    <Button variant='contained' color='primary' onClick={changeRouteToClass}>Enter Class</Button>
                </CardActions>
            </Card>
        );
    }

    useEffect(() => {
        addFirebaseRealtimeListenerToClasses();
        return () => {
            // unsubscribe();
        }
    }, []);

    return (
        <div>
            <NavBar />
            { showModal && <MyModal showModal={showModal} setShowModal={setShowModal} currentModal={currentModal} />}
            <div className="grouphome">
                <div className="grouphome_header">
                    <Grid container alignItems='center'>
                        <Grid item xs={2}>
                            <Typography variant='h4'>
                                Classes
                            </Typography>
                        </Grid>
                        <Grid item xs={3} md={6} lg={6}></Grid>
                        <Grid item xs={7} md={4} lg={4} container justify='flex-end'>
                            <ButtonGroup aria-label="outlined primary button group">
                                <Button variant="contained" color="primary" className={classes.buttonmarginleftright} onClick={joinClass}>Join</Button>
                                <Button variant="outlined" color="primary" className={classes.buttonmarginleftright} onClick={createClass}>Create</Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>

                    <div>
                    </div>
                </div>
                <div className='grouphome_header verticalflex' style={{ marginTop: '30px' }}>
                    <Typography variant='h5' className={classes.margintopbottom}>My Classes</Typography>
                    {/* <h3>List of classes</h3> */}
                    {myclasses && <Grid container spacing={3} justify='flex-start'>
                        {
                            myclasses.map(el => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={el.classname}>
                                    <ClassBox name={el.classname} />
                                </Grid>
                            ))
                        }
                    </Grid>
                    }
                    <Typography variant='h5' className={classes.margintopbottom}>Enrolled Classes</Typography>
                    {/* <h3>List of classes</h3> */}
                    {enrolledclasses && <Grid container spacing={3} justify='flex-start'>
                        {/* <EnrolledClasses /> */}
                        {
                            enrolledclasses.map(el => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={el.classname}>
                                    <ClassBox name={el.classname} />
                                </Grid>
                            ))
                        }
                    </Grid>
                    }
                </div>
            </div>
        </div>
    )
}

const MyModal = ({ showModal, setShowModal, currentModal }) => {
    const createClassFieldRef = useRef();
    const dispatch = useDispatch();
    let error = useSelector(state => state.ClassReducer.error);
    let success = useSelector(state => state.ClassReducer.success);
    let isLoading = useSelector(state => state.ClassReducer.loading);
    const [modalStyle, setModalStyle] = useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    useEffect(() => {
        if (showModal) {
            setOpen(showModal);
        }
    }, [showModal])
    const useStyles = makeStyles((theme) => ({
        paper: {
            position: 'absolute',
            width: 400,
            backgroundColor: theme.palette.background.paper,
            // border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
        textfieldmargintop: {
            margin: '0.25rem 0',
        }
    }));
    const createClass = () => {
        if (createClassFieldRef.current.value !== '') {
            // console.log(createClassFieldRef.current.value);
            dispatch(action_createClass(createClassFieldRef.current.value))
            // setShowModal(false);
        }
        else {
            dispatch({
                type: ActionTypes.createClassFetchError,
                payload: {
                    code: 'Empty Data',
                    message: 'Please Fill the Data Properly',
                }
            })
        }
    }
    const joinClass = () => {
        if (createClassFieldRef.current.value !== '') {
            dispatch(action_joinClass(createClassFieldRef.current.value));
            // setShowModal(false);
        } else {
            dispatch({
                type: ActionTypes.createClassFetchError,
                payload: {
                    code: 'Empty Data',
                    message: 'Please Fill the Data Properly',
                }
            })
        }
    }

    const classes = useStyles();
    function getModalStyle() {
        const top = 50;
        const left = 50;

        return {
            top: `${top}%`,
            left: `${left}%`,
            transform: `translate(-${top}%, -${left}%)`,
        };
    }
    return (
        // <AnimatePresence exitBeforeEnter>
        //     <motion.div className='grouphome_overlay'>
        //         <div className='grouphome_content'>
        //             <div className='grouphome_overlaycross' onClick={() => { setShowModal(false) }}>
        //                 <i className='fas fa-times fa-lg'></i>
        //             </div>
        //             <div>
        //                 <span> Class Name</span>
        //                 <input type="text" ref={createClassFieldRef} />
        //             </div>
        //             {error && <p style={{ color: "red" }}>{error.message}</p>}
        //             {success && (currentModal === modalTypes.create) && <p style={{ color: "green" }}>Class has been created Successfully</p>}
        //             {success && (currentModal === modalTypes.join) && <p style={{ color: "green" }}>Added to the waiting list. Class host will confirm your identity and let you in.</p>}
        //             {(currentModal === modalTypes.create) ?
        //                 <button className='joinButton' onClick={createClass}><div>Create Class</div>{isLoading && <div id="loading"></div>} </button>
        //                 :
        //                 <button className='joinButton' onClick={joinClass}><div>Enter Class</div> {isLoading && <div id="loading"></div>} </button>}
        //         </div>
        //     </motion.div>
        // </AnimatePresence >
        <Modal open={open} onClose={() => { setShowModal(false) }}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description">
            <div style={modalStyle} className={classes.paper}>
                {(currentModal === modalTypes.create) ?
                    <Typography variant='h5' id="simple-modal-title">Create Class</Typography>
                    :
                    <Typography variant='h5' id="simple-modal-title">Join Class</Typography>}
                <form className={classes.textfieldmargintop} noValidate autoComplete="off">
                    <TextField id="outlined-basic" label="Class Name" variant="outlined" fullWidth inputRef={createClassFieldRef} />
                </form>
                {error && <Typography variant='subtitle2' style={{ color: "red" }}>{error.message}</Typography>}
                {success && (currentModal === modalTypes.create) && <Typography variant='subtitle1' style={{ color: "green" }}>Class has been created Successfully</Typography>}
                {success && (currentModal === modalTypes.join) && <Typography variant='subtitle1' style={{ color: "green" }}>Added to the waiting list. Class host will confirm your identity and let you in.</Typography>}
                {(currentModal === modalTypes.create) ?
                    <Button variant='contained' color='primary' onClick={createClass}><div>Create Class</div>{isLoading && <div id="loading"></div>} </Button>
                    :
                    <Button variant='contained' color='primary' onClick={joinClass}><div>Enter Class</div> {isLoading && <div id="loading"></div>} </Button>}
                <MyModal />
            </div>
        </Modal>
    )
}

export default GroupHome
