import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Notebooks from '../../components/Notebooks/Notebooks';
import { action_Logout } from '../Application/actions';
import { ActionTypes } from '../Application/Actiontypes';
import { LOGOUT_BUTTON } from '../Styled/components';
// import { db } from '../Application/firebase';
import "./Home.css";

function Home() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.AuthReducer.user);

    const handlelogout = (e) => {
        dispatch(action_Logout());
    }
    // const fetchData = () => {
    //     db.collection('school').onSnapshot((querySnapshot) => {
    //         querySnapshot.forEach(doc => {
    //             console.log(doc.data());
    //         });
    //     });
    // }
    useEffect(() => {
        dispatch({
            type: ActionTypes.setNotebookToNotebookReducer,
            payload: {
                doc_name: null,
                current_page: null,
                total_page: null,
                notebook_data: null,
            }
        })
    }, [dispatch]);
    return (
        <div>
            <div className="sameline">
                <h1>Welcome {user && user.email}</h1>
                {useSelector(state => state.AuthReducer.isLoggedIn) && <LOGOUT_BUTTON onClick={handlelogout} className="right1">Log Out</LOGOUT_BUTTON>}
            </div>

            <h1>UID:- {user && user.uid}</h1>
            <Notebooks />

        </div>
    )
}



export default Home
