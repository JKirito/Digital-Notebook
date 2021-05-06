import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { action_CreateNewNotebook, action_FetchNotebooks } from '../../Containers/Application/actions';
import { FirebaseCollections } from '../../Containers/Application/Actiontypes';
import { db } from '../../Containers/Application/firebase';
import "./Notebooks.css";

function Notebooks() {

    // g_<name> represents values from global State.
    const g_user = useSelector(state => state.AuthReducer.user);
    const g_userData = useSelector(state => state.UserReducer.userdata);
    const dispatch = useDispatch();

    // Refs
    const newNotebookRef = useRef();

    const addFirebaseRealtimeListenerToNotebooks = () => {
        // console.dir(g_user.uid);
        db.collection(FirebaseCollections.users).doc(g_user.uid).collection(FirebaseCollections.notebooks).onSnapshot((querySnapshot) => {
            // console.log("Change Occured")
            dispatch(action_FetchNotebooks(g_user.uid));
            // querySnapshot.forEach(doc => {
            //     // console.log(doc.data(), doc.id);
            // });
        });
    }

    useEffect(() => {
        addFirebaseRealtimeListenerToNotebooks();
    }, []);

    useEffect(() => {
        dispatch(action_FetchNotebooks(g_user.uid));
    }, [g_user.uid, dispatch])

    const UserDataUI = (props) => {
        if (props) {
            return <>
                {
                    props.length > 0 && props.map(el => {
                        return <NotebookCard key={el.doc_name} title={el.doc_name} />
                    })
                }
            </>
        } else {
            return <div>No Data Found</div>;
        }
    }
    const createNewNotebook = () => {
        if (newNotebookRef.current.value === '') {
            return;
        }
        dispatch(action_CreateNewNotebook({ notebookname: newNotebookRef.current.value, uid: g_user.uid }));
        newNotebookRef.current.value = '';
    }
    return (
        <div>
            {/* <h1>Available Notebooks</h1> */}
            <div className="note">
                <input type="text" ref={newNotebookRef} className="note1" />
                <NOTEBOOK_BUTTON onClick={createNewNotebook} className="notes">New Document</NOTEBOOK_BUTTON>
            </div>
            <NOTEBOOK_GRIDCONTAINER userData={g_userData}>
                {UserDataUI(g_userData)}
            </NOTEBOOK_GRIDCONTAINER>
        </div>
    );
}


// Styled Components
const NOTEBOOK_CARD = styled.div`
    font-family: 'Roboto', sans-serif;
    border: 1px solid rgba(0,0,0,.125);
    border-radius: .25rem;
    width: 250px;
    height: 300px;
`;
const NOTEBOOK_BUTTON = styled.button`
    border: none;
    background: #53B5E6;
    padding: 1.2rem;
    font-size: 1rem;
    font-family: 'Roboto', sans-serif;
    color: white;
    border-radius: 2px;
`;
const NOTEBOOK_IMGCONATINER = styled.div`
    // width: 100%;
    height: 60%;
    display: flex;
    justify-content: center;
    align-items-center;
`;
const NOTEBOOK_BOTTOMCONTAINER = styled.div`
    height: 40%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
`;
const NOTEBOOK_IMG = styled.img`
    object-fit: cover;
    width: 100%;
    height: 100%;
`;
const NOTEBOOK_TITLE = styled.h2`
    font-size: 1rem;
    font-family: 'Roboto', sans-serif;
`;
const NOTEBOOK_CARDCONTENT = styled.div`
    width: 80%;
`;

const NOTEBOOK_GRIDCONTAINER = styled.div`
    display: grid;
    grid-template-columns: ${props => {
        if (props.userData) return `repeat(4,1fr)`
        else return `1fr`;
    }};
    grid-gap: 14px;
    place-items: center;
    width: 90%;
    margin: auto;
}
    @media only screen and (max-width: 1114px) {
    grid-template-columns :${props => {
        if (props.userData) return `repeat(3,1fr)`
        else return `1fr`;
    }}
    }
    @media only screen and (max-width: 880px) {
    grid-template-columns :${props => {
        if (props.userData) return `repeat(2,1fr)`
        else return `1fr`;
    }}
    }
    @media only screen and (max-width: 570px) {
        grid-template-columns :${props => {
        if (props.userData) return `repeat(1,1fr)`
        else return `1fr`;
    }}
    }
`;

const NotebookCard = ({ title }) => {
    return (
        <NOTEBOOK_CARD>
            <NOTEBOOK_IMGCONATINER>
                <NOTEBOOK_IMG src="https://www.printonweb.in/images/notebook1.jpg" />
            </NOTEBOOK_IMGCONATINER>
            <NOTEBOOK_BOTTOMCONTAINER>
                <NOTEBOOK_CARDCONTENT>
                    <NOTEBOOK_TITLE>{title}</NOTEBOOK_TITLE>
                </NOTEBOOK_CARDCONTENT>
                <Link to={`/notebooks/${title}`}>
                    <NOTEBOOK_BUTTON>Open Notebook</NOTEBOOK_BUTTON>
                </Link>
            </NOTEBOOK_BOTTOMCONTAINER>
        </NOTEBOOK_CARD>
    );
}

export default Notebooks
