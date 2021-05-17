import { Avatar, Button, Card, CardActions, CardContent, Fab, Grid, List, ListItem, ListItemAvatar, ListItemText, makeStyles, Modal, Paper, TextField, Typography } from '@material-ui/core';
import { DomainDisabledTwoTone } from '@material-ui/icons';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router'
import { action_RejectUserAccessToClass, action_PostAttendance, action_AllowUserAccessToClass, action_SetCurrentQuiz, action_MarkAttendance } from '../Application/actions';
import { ActionTypes, FirebaseCollections } from '../Application/Actiontypes';
import { auth, db } from '../Application/firebase';
import NavBar from '../Home/NavBar';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import "./ClassPage.css"

function ClassPage() {
    let { classname } = useParams()
    const dispatch = useDispatch();
    let myclasses = useSelector(state => state.ClassReducer.myclasses)
    let enrolledclasses = useSelector(state => state.ClassReducer.enrolledclasses)
    let quizList = useSelector(state => state.QuizReducer.quizAvailable)
    const [isHost, setIsHost] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    let filteredArray;
    const [isModalOpen, setModalOpen] = useState(false)
    const [isAttendanceDetailModalOpen, setAttendanceDetailModalOpen] = useState(false)
    const [currentSelectedAttendance, setCurrentSelectedAttendance] = useState({
        el: null,
    });

    useEffect(() => {
        let unsubscribe = db.collection(FirebaseCollections.class).doc(classname).collection(FirebaseCollections.attendance).onSnapshot(querySnapshot => {
            let attendanceList = [];
            if (querySnapshot) {
                querySnapshot.docs.forEach(doc => {
                    attendanceList.push({
                        id: doc.id,
                        data: doc.data(),
                    })
                    // console.dir(`${doc.id}`);
                    // console.dir(doc.data());
                })
            }
            console.log(attendanceList);
            dispatch({
                type: ActionTypes.updateAttendanceList,
                payload: attendanceList,
            })
        });
        return () => {
            unsubscribe();
        }
    }, [])

    useEffect(() => {
        filteredArray = myclasses?.filter(element => element.classname === classname);
        // console.log(filteredArray)
        setFilteredData(filteredArray);
        if (filteredArray && filteredArray.length > 0) setIsHost(true);
    }, [myclasses, enrolledclasses]);
    return (
        <div>
            <NavBar />
            {isModalOpen && <MyModal classname={classname} showModal={isModalOpen} setShowModal={setModalOpen}></MyModal>}
            {isAttendanceDetailModalOpen && <AttendanceDetailModal classname={classname} showModal={isAttendanceDetailModalOpen} setShowModal={setAttendanceDetailModalOpen} currentSelectedAttendance={currentSelectedAttendance}></AttendanceDetailModal>}
            {/* <h1>Welcome to Class {classname} </h1>
            {JSON.stringify(myClasses)}
            {JSON.stringify(isHost)} */}
            <div style={{ width: '90%', margin: '0 auto', }}>
                <div className='classpageamargintop'>
                    <Typography variant='h4'>Welcome to {classname} class</Typography>
                    {isHost ? <HostDisplayUI
                        myclasses={myclasses}
                        classname={classname}
                        quizList={quizList}
                        filteredData={filteredData}
                        isModalOpen={isModalOpen}
                        setModalOpen={setModalOpen}
                        isAttendanceDetailModalOpen={isAttendanceDetailModalOpen}
                        setAttendanceDetailModalOpen={setAttendanceDetailModalOpen}
                        currentSelectedAttendance={currentSelectedAttendance}
                        setCurrentSelectedAttendance={setCurrentSelectedAttendance} />
                        : <JoinDisplayUI
                            quizList={quizList}
                            classname={classname} />}
                </div>
            </div>
        </div>
    )
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const HostDisplayUI = ({ myclasses, classname, filteredData, quizList, isModalOpen, setModalOpen, setAttendanceDetailModalOpen, isAttendanceDetailModalOpen, setCurrentSelectedAttendance }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    let attendanceReducerList = useSelector(state => state.AttendanceReducer);
    const stylesClasses = useStyles();
    const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
    const rejectUserAccessToClass = (el) => {
        let index = filteredData[0].waitinglist.findIndex(x => x.id === el.id)
        let newArray = filteredData[0].waitinglist;
        newArray.splice(index, 1);
        // console.log(index, newArray)
        dispatch(action_RejectUserAccessToClass({ classname: classname, user: auth.currentUser.uid, data: [...newArray] }));
    }
    const allowUserAccessToClass = (el) => {
        let newArray = filteredData[0].enrolled;
        newArray.push(el.id);
        // Adding data to enrolled then deleting data from waiting
        dispatch(action_AllowUserAccessToClass({ classname: classname, user: auth.currentUser.uid, data: [...newArray] }));
        let index = filteredData[0].waitinglist.findIndex(x => x.id === el.id)
        let newArray1 = filteredData[0].waitinglist;
        newArray1.splice(index, 1);
        dispatch(action_RejectUserAccessToClass({ classname: classname, user: auth.currentUser.uid, data: [...newArray1] }))
    }
    const createQuiz = () => {
        history.push(`/class/createquiz/${classname}`)
    }

    return (
        <div>
            {/* <h3>Only Visible To Host</h3>
            <div>Assignments</div>
            <div>Attendance</div> */}
            <Grid container justify='space-between' alignItems='center' style={{ marginTop: '10px' }}>
                <Grid item>
                    <Typography variant='h5'>Hosted Quizes</Typography>
                </Grid>
                <Grid item>
                    <Button variant='contained' style={{ background: '#57C245', color: 'white', fontWeight: 'bold' }} onClick={createQuiz}>Create Quiz</Button>
                </Grid>
            </Grid>
            <div>
                <HostedQuizzesList classname={classname} />
            </div>
            <Grid container justify='space-between' alignItems='center' style={{ marginTop: '20px' }}>
                <Grid item>
                    <Typography variant='h5'>Attendance</Typography>
                </Grid>
                <Grid item>
                    <Button variant='contained' style={{ background: '#57C245', color: 'white', fontWeight: 'bold' }} onClick={() => { setModalOpen(true) }}>Take Attendance</Button>
                </Grid>
            </Grid>
            <Grid container >
                <Grid item xs={12}>
                    <Typography variant='subtitle1'>Active Attendance List</Typography>
                </Grid>
                <Grid container>
                    {
                        attendanceReducerList?.availableAttendanceList?.map((el, index) => {
                            let title = new Date(parseInt(el.id)).toLocaleDateString();
                            let hours = new Date(parseInt(el.id)).getHours();
                            let minute = new Date(parseInt(el.id)).getMinutes();
                            let endTimeData = {
                                hours: new Date(parseInt(el.data.endTime)).getHours(),
                                minute: new Date(parseInt(el.data.endTime)).getMinutes(),
                            }
                            // console.log(title)
                            return <Paper key={index} elevation={4} style={{ width: "100%", padding: '0.8rem 1.2rem', marginTop: '10px' }}>
                                <Grid container justify='space-between' alignItems='center'>
                                    <Grid item>
                                        {/* Attendance Time */}
                                        {hours}:{minute} - {endTimeData.hours}:{endTimeData.minute} ( {title} )
                                    </Grid>
                                    <Grid item>
                                        <Button variant='contained' style={{ background: '#F75D59', color: 'white' }} onClick={() => { setAttendanceDetailModalOpen(true); setCurrentSelectedAttendance({ el: el }); }}>View Details</Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        })
                    }
                    {/* <Paper elevation={4} style={{ width: "100%", padding: '0.8rem 1.2rem' }}>
                        <Grid container justify='space-between' alignItems='center'>
                            <Grid item>
                                Attendance Time
                            </Grid>
                            <Grid item>
                                <Button variant='contained'>Present</Button>
                            </Grid>
                        </Grid>
                    </Paper> */}
                </Grid>
            </Grid>
            <div style={{ marginTop: '20px' }}>
                <Typography variant='h5' className='heading'>Waiting Room</Typography>
                <Grid container spacing={2}>
                    {
                        myclasses && filteredData && filteredData[0].waitinglist.map(el => (
                            <Paper key={el.email} elevation={4} style={{ width: '100%', padding: '0.5rem 0', marginTop: '6px' }}>
                                <Grid container justify='space-between' alignItems='center' style={{ marginLeft: '8px', marginTop: '4px' }}>
                                    <Grid item>
                                        <Typography variant='h6' >{el.email}</Typography>
                                    </Grid>
                                    <Grid item >
                                        {/* <button><i className='fas fa-check' onClick={() => { allowUserAccessToClass(el) }}></i></button> */}
                                        <Fab aria-label='accept' style={{ margin: '0 5px', background: '#33D74C', color: 'white' }} onClick={() => { allowUserAccessToClass(el) }}>
                                            <CheckIcon />
                                        </Fab>
                                        <Fab aria-label='reject' style={{ marginLeft: '5px', marginRight: '12px', background: "#FE3B2F", color: "white" }} onClick={() => { rejectUserAccessToClass(el) }}>
                                            <CloseIcon />
                                        </Fab>
                                        {/* <button> <i className='fas fa-times' onClick={() => { rejectUserAccessToClass(el) }}></i> </button> */}
                                    </Grid>
                                </Grid>
                            </Paper>
                        ))
                    }
                    {
                        myclasses && filteredData[0].waitinglist.length === 0 && <Grid container justify='center' style={{ marginTop: '10px', color: '#747474' }}>
                            <Grid item>
                                <Typography variant='h6'>The Waiting Room is Empty</Typography>
                            </Grid>
                        </Grid>
                    }
                </Grid>
            </div>
        </div>
    );
};

const JoinDisplayUI = ({ quizList, classname }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    let attendanceReducerList = useSelector(state => state.AttendanceReducer);
    useEffect(() => {
        // console.log(quizList);
    }, [quizList])
    const takeQuiz = (quizname) => {
        let newArray = quizList.filter(x => x.id === quizname);
        // let index = quizList.findIndex(x => x.id === quizname);
        // console.log(newArray);
        dispatch(action_SetCurrentQuiz(newArray[0]));
        history.push(`/class/${classname}/quiz/${quizname}`);
    }
    const MarkAttendance = (id) => {
        dispatch(action_MarkAttendance({ id: id, classname: classname }));
    };
    return (
        <div>
            <Typography variant='h5'>Available Quizes</Typography>
            <Grid container spacing={3} style={{ marginTop: '10px' }}>
                {
                    quizList && quizList.map(el => (
                        <Grid item xs={12} md={6} lg={3} xl={2} className='list__quiz__item' key={el.quizdata.quizname}>
                            <Card variant='outlined'>
                                <CardContent>
                                    <Typography variant='h6'>{el.quizdata.quizname}</Typography>
                                    <Typography variant='subtitle2'>Quiz Description</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button variant='contained' color='primary' onClick={() => { takeQuiz(el.quizdata.quizname) }}>Start Quiz</Button>
                                </CardActions>
                            </Card>

                            {/* <Typography variant='h6' className='list__quiz__name'>{el.quizdata.quizname}</Typography>
                            <Button variant='contained' color='primary' className='list__quiz__takebutton' onClick={() => { takeQuiz(el.quizdata.quizname) }}>Start Quiz</Button> */}
                        </Grid>
                    ))
                }
            </Grid>
            <Grid container style={{ marginTop: '20px' }}>
                <Typography variant='h5'>Available Attendance</Typography>
                {
                    attendanceReducerList?.availableAttendanceList?.map((el, index) => {
                        let title = new Date(parseInt(el.id)).toLocaleDateString();
                        let hours = new Date(parseInt(el.id)).getHours();
                        let minute = new Date(parseInt(el.id)).getMinutes();
                        let endTimeData = {
                            hours: new Date(parseInt(el.data.endTime)).getHours(),
                            minute: new Date(parseInt(el.data.endTime)).getMinutes(),
                        }
                        console.log(title)
                        return <Paper key={index} elevation={4} style={{ width: "100%", padding: '0.8rem 1.2rem', marginTop: '10px' }}>
                            <Grid container justify='space-between' alignItems='center'>
                                <Grid item xs={12} md={10}>
                                    {/* Attendance Time */}
                                    {hours}:{minute} - {endTimeData.hours}:{endTimeData.minute} ( {title} )
                                    </Grid>
                                <Grid item xs={12} md={2} style={{ marginTop: '10px' }}>
                                    <Button variant='contained' style={{ background: '#F75D59', color: 'white' }} onClick={() => { MarkAttendance(el.id) }}>Mark as Present</Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    })
                }
            </Grid>
        </div>
    );
};

const HostedQuizzesList = ({ classname }) => {
    let hostedquizlist = useSelector(state => state.QuizReducer.hostedQuiz);
    const history = useHistory();
    const SeeHostedQuiz = (quizname) => {
        history.push(`/class/${classname}/control/${quizname}`);
    };
    return (
        <>
            <Grid container spacing={3} style={{ marginTop: '10px' }}>
                {
                    hostedquizlist && hostedquizlist.map(el => (
                        <Grid item key={el.quizdata.quizname} xs={12} md={6} lg={3} xl={2}>
                            <Card variant='outlined'>
                                <CardContent>
                                    <Typography variant='h5' className='list__quiz__name'>{el.quizdata.quizname}</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button variant='contained' color='primary' onClick={() => { SeeHostedQuiz(el.quizdata.quizname) }}>Show Details</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                }
                {
                    hostedquizlist && hostedquizlist.length === 0 && <Grid container justify='center' style={{ marginTop: '10px', color: '#747474' }}>
                        <Grid item>
                            <Typography variant='h6'>No Quiz Is Hosted Yet.</Typography>
                        </Grid>
                    </Grid>
                }
            </Grid>
        </>
    );
}

const MyModal = ({ showModal, setShowModal, classname }) => {
    const dispatch = useDispatch();
    let error = useSelector(state => state.ClassReducer.error);
    let success = useSelector(state => state.ClassReducer.success);
    let isLoading = useSelector(state => state.ClassReducer.loading);
    const [modalStyle, setModalStyle] = useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const attendanceLimit = useRef();
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

    const TakeAttendance = () => {
        if (attendanceLimit.current.value) {
            let currentTime = new Date().getTime();
            let hostedForTime = attendanceLimit.current.value * (3.6e+6);
            let endTime = currentTime + hostedForTime;
            console.log(`Current Time :- ${currentTime} , Available Till:- ${endTime}`)
            dispatch(action_PostAttendance({ classname, currentTime, endTime }))
        } else alert('Fill Data Properly');
    }
    return (
        <Modal open={open} onClose={() => { setShowModal(false) }}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description">
            <div style={modalStyle} className={classes.paper}>
                <Typography variant='h5'>Attendance Setup</Typography>
                <form noValidate autoComplete="off" className='customTextField'>
                    <TextField id="outlined-basic" label="Time Limit" helperText="Duration of Class(in hrs)" variant="outlined" type='number' fullWidth inputRef={attendanceLimit} InputProps={{ inputProps: { min: 0, max: 10 } }} />
                </form>
                <Button variant='contained' style={{ background: '#F75D59', color: "white", marginTop: "30px" }} onClick={TakeAttendance}>Post Attendance</Button>
                <MyModal />
            </div>
        </Modal>
    )
}

const AttendanceDetailModal = ({ showModal, setShowModal, classname, currentSelectedAttendance }) => {
    const dispatch = useDispatch();
    let error = useSelector(state => state.ClassReducer.error);
    let success = useSelector(state => state.ClassReducer.success);
    let isLoading = useSelector(state => state.ClassReducer.loading);
    const [modalStyle, setModalStyle] = useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    useEffect(() => {
        if (showModal) {
            setOpen(showModal);
            console.log(currentSelectedAttendance)
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
    }));

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
        <Modal open={open} onClose={() => { setShowModal(false) }}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description">
            <div style={modalStyle} className={classes.paper}>
                <Typography variant='h5'>Student's Present</Typography>
                {/* <Typography variant='h5'>{currentSelectedAttendance?.el?.id}</Typography> */}
                <List>
                    {
                        currentSelectedAttendance &&
                        currentSelectedAttendance?.el?.data?.attendanceList?.length > 0 &&
                        currentSelectedAttendance.el?.data?.attendanceList.map((item, index) => {
                            return (
                                <ListItem key={index}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <AccountCircleIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={<Typography variant='subtitle2'>{item.name}</Typography>} />
                                </ListItem>
                            );
                        })
                    }
                </List>
                <AttendanceDetailModal />
            </div>
        </Modal>
    )
}

export default ClassPage
