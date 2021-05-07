import { motion } from 'framer-motion';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { action_FetchNotebooks } from '../Application/actions';
import { FirebaseCollections } from '../Application/Actiontypes';
import { db } from '../Application/firebase';
import NavBar from '../Home/NavBar'
import "./NotesHome.css";

function NotesHome() {
    const g_user = useSelector(state => state.AuthReducer.user);
    const g_userData = useSelector(state => state.UserReducer.userdata);
    const dispatch = useDispatch();

    const addFirebaseRealtimeListenerToNotebooks = () => {
        // console.dir(g_user.uid);
        db.collection(FirebaseCollections.users).doc(g_user.uid).collection(FirebaseCollections.notebooks).onSnapshot((querySnapshot) => {
            dispatch(action_FetchNotebooks(g_user.uid));
        });
    }
    useEffect(() => {
        addFirebaseRealtimeListenerToNotebooks();
    }, []);

    useEffect(() => {
        dispatch(action_FetchNotebooks(g_user.uid));
    }, [g_user.uid, dispatch])

    const pageTransition = {
        initial: {
            opacity: 0,
            y: '-100vh',
        },
        in: {
            opacity: 1,
            y: '-45px',
        },
        out: {
            opacity: 0,
            y: '100vw',
        },
    }
    const pagetransitions = {
        duration: 0.5,
    };



    return (
        <motion.div style={{
            width: "100vw", display: "flex",
            justifyContent: "space-evenly",
            marginTop: "40px",
        }}
            id='NotesHomeContainer'
            initial="out"
            animate="in"
            exit="out"
            variants={pageTransition}
            transition={pagetransitions}
        >
            <NavBar />
            <div className='noteshomelayout'>
                <GroupsContainer />
                <FilesContainer />
                <CreateDocumentButton />
            </div>
        </motion.div>
    )
}

const GroupsContainer = () => {
    return (
        <div className='groupsContainer'>
            <div className='groupsContainer_title'>Groups</div>
            <div className='grouplist'>
                <div className='group'>
                    <span>Mechanical</span>
                    <span>Engineering</span>
                </div>
                <div className='group'>
                    <span>Civil</span>
                    <span>Engineering</span>
                </div>
            </div>
        </div >
    );
}
const FilesContainer = () => {
    const g_user = useSelector(state => state.AuthReducer.user);
    const g_userData = useSelector(state => state.UserReducer.userdata);
    const UserDataUI = (props) => {
        if (props) {
            return <>
                {
                    props.length > 0 && props.map(el => {
                        return <File key={el.doc_name} title={el.doc_name} subtitle='Testting' />
                    })
                }
            </>
        } else {
            return <div>No Data Found</div>;
        }
    }
    return (
        <div className='fileContainer'>
            <div className='fileContainer_title'>Files</div>
            <div className='files_list'>
                {/* <File title="Heat Transfer" subtitle="Lorem Ipsumaskldnlaknsd asa  asd a sd dnlk" />
                <File title="Machine Design" subtitle="Lorem ipsum dolor sit amet, consectetur tempor sed luctus urna integer....." /> */}
                {UserDataUI(g_userData)}
            </div>
        </div>
    );
}

const File = ({ title, subtitle }) => {
    const history = useHistory();
    const redirectToNotebook = () => {
        history.push(`/notebooks/${title}`);
    };
    return (
        <div style={{ marginTop: "5px" }} className='NotesHome_file' onClick={redirectToNotebook}>
            <div className="upper">
                <div className='title'>{title}</div>
                <div>{new Date().toLocaleDateString()}</div>
            </div>
            <div className='lower'>
                <div>{subtitle}</div>
                <div>
                    <i className='fas fa-trash'></i>
                </div>
            </div>
        </div>
    );
}

const CreateDocumentButton = () => {
    return (
        <div className='c-align'>
            <button className='home_createDocumentButton'>
                <div>
                    <div>
                        <i className='fas fa-plus'></i>
                    </div>
                    <div>Create Document</div>
                </div>
            </button>
        </div>
    );
}

export default NotesHome
