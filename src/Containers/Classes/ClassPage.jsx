import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router'
import NavBar from '../Home/NavBar';
import "./ClassPage.css"

function ClassPage() {
    let { classname } = useParams()
    let myclasses = useSelector(state => state.ClassReducer.myclasses)
    let enrolledclasses = useSelector(state => state.ClassReducer.enrolledclasses)
    const [isHost, setIsHost] = useState(false);

    useEffect(() => {
        let filteredArray1 = myclasses?.filter(element => element.classname === classname);
        if (filteredArray1.length > 0) setIsHost(true);
    }, [myclasses, enrolledclasses]);
    return (
        <div>
            <NavBar />
            {/* <h1>Welcome to Class {classname} </h1>
            {JSON.stringify(myClasses)}
            {JSON.stringify(isHost)} */}
            <div className='classpageamargintop'>
                {isHost ? <HostDisplayUI /> : <JoinDisplayUI />}
            </div>
        </div>
    )
}

const HostDisplayUI = () => {
    return (
        <div>
            <h3>Only Visible To Host</h3>
            <div className='classpage__waitinglist'>
                <p>Waiting List</p>
                <div>
                    List of Users
                    <UserListItem />
                </div>
            </div>
        </div>
    );
};

const JoinDisplayUI = () => {
    return (
        <div>Only Visible to Joined Users</div>
    );
};

const UserListItem = () => {
    return (
        <div className='classpage__waitinglist__user'>
            <div>Username</div>
            <div>
                <button>Accept</button>
                <button>Reject</button>
            </div>
        </div>
    );
}
export default ClassPage
