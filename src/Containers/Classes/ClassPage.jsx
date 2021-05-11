import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router'
import { action_RejectUserAccessToClass, action_AllowUserAccessToClass } from '../Application/actions';
import { auth } from '../Application/firebase';
import NavBar from '../Home/NavBar';
import "./ClassPage.css"

function ClassPage() {
    let { classname } = useParams()
    let myclasses = useSelector(state => state.ClassReducer.myclasses)
    let enrolledclasses = useSelector(state => state.ClassReducer.enrolledclasses)
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
                {isHost ? <HostDisplayUI myclasses={myclasses} classname={classname} filteredData={filteredData} /> : <JoinDisplayUI />}
            </div>
        </div>
    )
}

const HostDisplayUI = ({ myclasses, classname, filteredData }) => {
    const dispatch = useDispatch();
    const rejectUserAccessToClass = (el) => {
        let index = filteredData[0].waitinglist.findIndex(x => x.id === el.id)
        let newArray = filteredData[0].waitinglist;
        newArray.splice(index, 1);
        console.log(index, newArray)
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
    return (
        <div>
            <h3>Only Visible To Host</h3>
            <div>Assignments</div>
            <div>Attendance</div>
            <div>Quiz</div>
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

const JoinDisplayUI = () => {
    return (
        <div>
            <div>Only Visible to Joined Users</div>
        </div>
    );
};


export default ClassPage
