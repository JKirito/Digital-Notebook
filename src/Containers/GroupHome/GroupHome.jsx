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

function GroupHome() {
    const [showModal, setShowModal] = useState(false)
    const [currentModal, setCurrentModal] = useState(modalTypes.join);
    let myclasses = useSelector(state => state.ClassReducer.myclasses);
    let enrolledclasses = useSelector(state => state.ClassReducer.enrolledclasses);
    // const [myclassdata, setmyclassdata] = useState(classData);
    const dispatch = useDispatch();
    const history = useHistory();
    let currentData;

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
            <div className='grouphome_classbox'>
                <h3 className='title'>{name}</h3>
                <p className='description'>Student's Enrolled:-</p>
                <button className='joinButton' onClick={changeRouteToClass}>Enter Class</button>
            </div>
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
            { showModal && <Modal showModal={showModal} setShowModal={setShowModal} currentModal={currentModal} />}
            <div className="grouphome">
                <div className="grouphome_header">
                    <h3>Classes</h3>
                    <div>
                        <button className='grouphome_createbutton' onClick={joinClass}>Join Class</button>
                        <button className='grouphome_createbutton' onClick={createClass}>Create Class</button>
                    </div>
                </div>
                <div className='grouphome_header verticalflex'>
                    <h3 className='grouphome_list_headline'>My Classes</h3>
                    {/* <h3>List of classes</h3> */}
                    {myclasses && <div className="grouphome_section">
                        {
                            myclasses.map(el => (
                                <ClassBox key={el.classname} name={el.classname} />
                            ))
                        }
                    </div>
                    }
                    <h3 className='grouphome_list_headline'>Enrolled Classes</h3>
                    {/* <h3>List of classes</h3> */}
                    {enrolledclasses && <div className="grouphome_section">
                        {/* <EnrolledClasses /> */}
                        {
                            enrolledclasses.map(el => (
                                <ClassBox key={el.classname} name={el.classname} />
                            ))
                        }
                    </div>
                    }
                </div>
            </div>
        </div>
    )
}

const Modal = ({ showModal, setShowModal, currentModal }) => {
    const createClassFieldRef = useRef();
    const dispatch = useDispatch();
    let error = useSelector(state => state.ClassReducer.error);
    let success = useSelector(state => state.ClassReducer.success);
    let isLoading = useSelector(state => state.ClassReducer.loading);
    const createClass = () => {
        if (createClassFieldRef.current.value !== '')
            dispatch(action_createClass(createClassFieldRef.current.value));
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
        dispatch(action_joinClass(createClassFieldRef.current.value));
    }
    return (
        <AnimatePresence exitBeforeEnter>
            <motion.div className='grouphome_overlay'>
                <div className='grouphome_content'>
                    <div className='grouphome_overlaycross' onClick={() => { setShowModal(false) }}>
                        <i className='fas fa-times fa-lg'></i>
                    </div>
                    <div>
                        <span> Class Name</span>
                        <input type="text" ref={createClassFieldRef} />
                    </div>
                    {error && <p style={{ color: "red" }}>{error.message}</p>}
                    {success && (currentModal === modalTypes.create) && <p style={{ color: "green" }}>Class has been created Successfully</p>}
                    {success && (currentModal === modalTypes.join) && <p style={{ color: "green" }}>Added to the waiting list. Class host will confirm your identity and let you in.</p>}
                    {(currentModal === modalTypes.create) ?
                        <button className='joinButton' onClick={createClass}><div>Create Class</div>{isLoading && <div id="loading"></div>} </button>
                        :
                        <button className='joinButton' onClick={joinClass}><div>Enter Class</div> {isLoading && <div id="loading"></div>} </button>}
                </div>
            </motion.div>
        </AnimatePresence >
    )
}

export default GroupHome
