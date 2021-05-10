import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { action_CreateNewNotebook, action_FetchNotebooks } from '../Application/actions';
import { FirebaseCollections } from '../Application/Actiontypes';
import { db, timestamp } from '../Application/firebase';
import NavBar from '../Home/NavBar'
import "./NotesHome.css";

function NotesHome() {
    const g_user = useSelector(state => state.AuthReducer.user);
    const g_userData = useSelector(state => state.UserReducer.userdata);
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);

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
            display: "flex",
            justifyContent: "space-evenly",
            marginTop: "40px",
            transform: 0,
        }}
            id='NotesHomeContainer'
            initial="out"
            animate="in"
            exit="out"
            variants={pageTransition}
            transition={pagetransitions}
        >
            <Modal showModal={showModal} setShowModal={setShowModal} g_user={g_user} />
            <NavBar />
            <div className='noteshomelayout'>
                <GroupsContainer />
                <FilesContainer />
                <CreateDocumentButton setShowModal={setShowModal} />
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
                        return <File key={el.doc_name} title={el.doc_name} subtitle='Testting' date={el.doc_data.createdAt} />
                    })
                }
            </>
        } else {
            return <div>No Notebooks Found</div>;
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

const File = ({ title, subtitle, date }) => {
    const history = useHistory();
    const redirectToNotebook = () => {
        history.push(`/notebooks/${title}`);
    };
    let t = date.seconds;
    let x = new Date(t * 1000);

    return (
        <div style={{ marginTop: "5px" }} className='NotesHome_file' onClick={redirectToNotebook}>
            <div className="upper">
                <div className='title'>{title}</div>
                <div>
                    {/* {new Date().toLocaleDateString()} */}
                    {`${x.getDate()}/${x.getMonth() + 1}/${x.getFullYear()}`}
                </div>
            </div>
            <div className='lower'>
                <div>{subtitle}</div>
                <div>
                    <i className='fas fa-trash hell'></i>
                </div>
            </div>
        </div>
    );
}

const CreateDocumentButton = ({ setShowModal }) => {
    const showModal = () => {
        setShowModal(true);
    }
    return (
        <div className='c-align'>
            <button className='home_createDocumentButton' onClick={showModal}>
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

const backdropAnim = {
    visible: {
        opacity: 1,
    },
    hidden: {
        opacity: 0,
    },
}
const modalAnim = {
    in: {
        y: "100px",
    },
    out: {
        y: 0,
    },
    exit: {
        y: "500px",
        // transition: { delay: 0.5 },
    }
}
const Modal = ({ showModal, setShowModal, g_user }) => {
    const doc_fieldRef = useRef();
    const dispatch = useDispatch();
    const createDocument = () => {
        if (doc_fieldRef.current.value === '') {
            return;
        }
        dispatch(action_CreateNewNotebook({ notebookname: doc_fieldRef.current.value, uid: g_user.uid }));
        doc_fieldRef.current.value = '';
        setShowModal(false);
    }
    const closeModal = () => {
        setShowModal(false);
    }
    return (
        <AnimatePresence exitBeforeEnter>
            {
                showModal && <motion.div className="backdrop" variants={backdropAnim} initial="hidden" animate="visible" exit="hidden">
                    <motion.div className="modal_design" variants={modalAnim} initial="in" animate="out" exit='exit'>
                        <div className='modal_cross' onClick={closeModal}>
                            <i className='fas fa-times fa-lg'></i>
                        </div>
                        <div className="modal_createDocument">Create Document</div>
                        <div className="modal_content">
                            <div className="inputcontainer">
                                <label htmlFor="email" className="text">
                                    Document Name
                                </label>
                                <input type="text" id="doc_field" ref={doc_fieldRef} />
                            </div>
                            <button className="document_button" onClick={createDocument}>Create Document</button>
                        </div>
                    </motion.div>
                </motion.div>
            }
        </AnimatePresence>
    );
}

export default NotesHome
