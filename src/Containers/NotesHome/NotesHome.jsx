import { Button, Card, CardActions, CardContent, Grid, IconButton, TextField, Typography } from '@material-ui/core';
import { Add, Delete } from '@material-ui/icons';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { action_CreateNewNotebook, action_DeleteNoteBook, action_FetchNotebooks } from '../Application/actions';
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
                {/* <GroupsContainer /> */}
                <FilesContainer />
                <CreateDocumentButton setShowModal={setShowModal} />
            </div>
        </motion.div>
    )
}

const FilesContainer = () => {
    const g_user = useSelector(state => state.AuthReducer.user);
    const g_userData = useSelector(state => state.UserReducer.userdata);
    const dispatch = useDispatch();
    const history = useHistory();
    const redirectToNotebook = (title) => {
        history.push(`/notebooks/${title}`);
    };
    const DeleteNoteBook = (el) => {
        console.log(el)
        let t = window.confirm(`Are You sure You want to Delete ${el.doc_name}`);
        if (t) {
            dispatch(action_DeleteNoteBook(el));
        } else return;
    }
    const UserDataUI = (props) => {
        if (props) {
            return <Grid container spacing={3}>
                {
                    props.length > 0 && props.map(el => {
                        return <Grid key={el.doc_name} item xs={12} md={6} lg={6}>
                            <Card variant='outlined' >
                                <CardContent>
                                    <Grid container justify='space-between'>
                                        <Grid item>
                                            <Typography variant='h6'>{el.doc_name}</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant='subtitle1'>
                                                CA:- {`${new Date(el.doc_data.createdAt.seconds * 1000).getDate()}/${new Date(el.doc_data.createdAt.seconds * 1000).getDate() + 1}/${new Date(el.doc_data.createdAt.seconds * 1000).getFullYear()}`}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    {/* <File key={el.doc_name} title={el.doc_name} subtitle='Testting' date={el.doc_data.createdAt} /> */}
                                </CardContent>
                                <CardActions>
                                    <IconButton style={{ color: 'red' }} onClick={() => { DeleteNoteBook(el) }}>
                                        <Delete />
                                    </IconButton>
                                    <Button style={{ backgroundColor: "#5AAB1B", color: 'white' }} variant='contained' onClick={() => redirectToNotebook(el.doc_name)}>View</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    })
                }
            </Grid>
        } else {
            return <div>No Notebooks Found</div>;
        }
    }
    return (
        <div className='fileContainer'>
            {/* <div className='fileContainer_title'>Files</div> */}
            <Typography variant='h5'>Files</Typography>
            <div className='files_list'>
                {/* <File title="Heat Transfer" subtitle="Lorem Ipsumaskldnlaknsd asa  asd a sd dnlk" />
                <File title="Machine Design" subtitle="Lorem ipsum dolor sit amet, consectetur tempor sed luctus urna integer....." /> */}
                {UserDataUI(g_userData)}
            </div>
        </div>
    );
}


const CreateDocumentButton = ({ setShowModal }) => {
    const showModal = () => {
        setShowModal(true);
    }
    return (
        <Grid container justify='center'>
            <Grid item>
                <Button color='primary' variant='contained' startIcon={<Add />} onClick={showModal}>Create Document</Button>
            </Grid>
        </Grid>
        // <div className='c-align'>
        //     <button className='home_createDocumentButton' onClick={showModal}>
        //         <div>
        //             <div>
        //                 <i className='fas fa-plus'></i>
        //             </div>
        //             <div>Create Document</div>
        //         </div>
        //     </button>
        // </div>
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
                        <Grid container direction='column' justify='center'>
                            <div className='modal_cross' onClick={closeModal}>
                                <i className='fas fa-times fa-lg'></i>
                            </div>
                            <Grid item style={{ marginTop: '10px' }}>
                                <Typography align='center' variant='h6'>Create Document</Typography>
                            </Grid>
                            {/* <div className="inputcontainer"> */}
                            {/* <label htmlFor="email" className="text">
                                    Document Name
                                </label> */}
                            <Grid container justify='center' direction='column' style={{ width: "90%", margin: '0 auto' }}>
                                <Grid item>
                                    <TextField fullWidth type='text' label='Document Name' inputRef={doc_fieldRef}></TextField>
                                </Grid>
                                <Grid item style={{ margin: '0 auto', marginTop: "20px" }}>
                                    <Button color='primary' variant='contained' onClick={createDocument}>Create Document</Button>
                                </Grid>
                            </Grid>
                            {/* <input type="text" id="doc_field" ref={doc_fieldRef} /> */}
                            {/* </div> */}

                        </Grid>
                    </motion.div>
                </motion.div>
            }
        </AnimatePresence>
    );
}

export default NotesHome
