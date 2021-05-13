import { Button, Card, CardActions, CardContent, Fab, Grid, Paper, Typography } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router'
import { action_RejectUserAccessToClass, action_AllowUserAccessToClass, action_SetCurrentQuiz } from '../Application/actions';
import { auth } from '../Application/firebase';
import NavBar from '../Home/NavBar';
import "./ClassPage.css"

function ClassPage() {
    let { classname } = useParams()
    let myclasses = useSelector(state => state.ClassReducer.myclasses)
    let enrolledclasses = useSelector(state => state.ClassReducer.enrolledclasses)
    let quizList = useSelector(state => state.QuizReducer.quizAvailable)
    const [isHost, setIsHost] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    let filteredArray;

    useEffect(() => {
        filteredArray = myclasses?.filter(element => element.classname === classname);
        // console.log(filteredArray)
        setFilteredData(filteredArray);
        if (filteredArray && filteredArray.length > 0) setIsHost(true);
    }, [myclasses, enrolledclasses]);
    return (
        <div>
            <NavBar />
            {/* <h1>Welcome to Class {classname} </h1>
            {JSON.stringify(myClasses)}
            {JSON.stringify(isHost)} */}
            <div style={{ width: '90%', margin: '0 auto', }}>
                <div className='classpageamargintop'>
                    <Typography variant='h4'>Welcome to {classname} class</Typography>
                    {isHost ? <HostDisplayUI myclasses={myclasses} classname={classname} quizList={quizList} filteredData={filteredData} /> : <JoinDisplayUI quizList={quizList} classname={classname} />}
                </div>
            </div>
        </div>
    )
}

const HostDisplayUI = ({ myclasses, classname, filteredData, quizList }) => {
    const dispatch = useDispatch();
    const history = useHistory();
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
    return (
        <div>
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

export default ClassPage
