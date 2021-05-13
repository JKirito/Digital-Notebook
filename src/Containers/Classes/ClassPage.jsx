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
            <div className='classpageamargintop'>
                <div>Welcome to class {classname}</div>
                {isHost ? <HostDisplayUI myclasses={myclasses} classname={classname} quizList={quizList} filteredData={filteredData} /> : <JoinDisplayUI quizList={quizList} classname={classname} />}
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
            <h3>Only Visible To Host</h3>
            <div>Assignments</div>
            <div>Attendance</div>
            <div>Hosted Quiz List Will be shown Here</div>
            <div>
                <HostedQuizzesList classname={classname} />
            </div>
            <div>
                <button className='list__quiz__takebutton' onClick={createQuiz}>Create Quiz</button>
            </div>
            <div className='classpage__waitinglist'>
                <p className='heading'>Waiting List</p>
                <div>
                    {
                        myclasses && filteredData && filteredData[0].waitinglist.map(el => (
                            <div key={el.email} className='classpage__waitinglist__user'>
                                <div >
                                    <p >{el.email}</p>
                                </div>
                                <div className='classpage__waitinglist__buttons'>
                                    <button><i className='fas fa-check' onClick={() => { allowUserAccessToClass(el) }}></i></button>
                                    <button> <i className='fas fa-times' onClick={() => { rejectUserAccessToClass(el) }}></i> </button>
                                </div>
                            </div>
                        ))
                    }
                </div>
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
            <div>
                <div>
                    Only Visible to Joined Users
                </div>
                <div className='list__quiz__container'>
                    {
                        quizList && quizList.map(el => (
                            <div className='list__quiz__item' key={el.quizdata.quizname}>
                                <p className='list__quiz__name'>{el.quizdata.quizname}</p>
                                <button className='list__quiz__takebutton' onClick={() => { takeQuiz(el.quizdata.quizname) }}>Start Quiz</button>
                            </div>
                        ))
                    }
                </div>
            </div>
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
            <div className='list__quiz__container'>
                {
                    hostedquizlist && hostedquizlist.map(el => (
                        <div className='list__quiz__item' key={el.quizdata.quizname}>
                            <p className='list__quiz__name'>{el.quizdata.quizname}</p>
                            <button className='list__quiz__takebutton' onClick={() => { SeeHostedQuiz(el.quizdata.quizname) }}>Show Details</button>
                        </div>
                    ))
                }
            </div>
        </>
    );
}

export default ClassPage
