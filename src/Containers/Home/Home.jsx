import { motion } from 'framer-motion';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import Notebooks from '../../components/Notebooks/Notebooks';
import { action_Logout } from '../Application/actions';
import { ActionTypes } from '../Application/Actiontypes';
import { LOGOUT_BUTTON } from '../Styled/components';
// import { db } from '../Application/firebase';
import "./Home.css";
import NavBar from './NavBar';

function Home() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.AuthReducer.user);


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

    const pageTransition = {
        initial: {
            opacity: 0,
            x: '100vw'
        },
        in: {
            opacity: 1,
            x: '0',
        },
        out: {
            opacity: 0,
            x: '-100vw',
        },
    }
    const pagetransitions = {
        duration: 0.5,
    };

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageTransition}
            transition={pagetransitions}
        >
            {/* <h1>Welcome {user && user.email}</h1> */}
            {/* {useSelector(state => state.AuthReducer.isLoggedIn) && <LOGOUT_BUTTON onClick={handlelogout} className="logoutbutton ">Log Out</LOGOUT_BUTTON>} */}

            {/* <h1>UID:- {user && user.uid}</h1> */}
            {/* <Notebooks /> */}
            <NavBar />
            <section className="home_section_container" id="home_section_container">
                <div className="home_box_container">
                    <Link to='/notebooks' className='a_prop'>
                        <div className="home_section_box">
                            <div className="home_section_img_container">
                                <img src="https://www.artnews.com/wp-content/uploads/2021/01/AdobeStock_29234518.jpeg?w=682" alt="" />
                            </div>
                            <h2>Notes</h2>
                        </div>
                    </Link>
                    <Link to='/class' className='a_prop'>
                        <div className="home_section_box">
                            <div className="home_section_img_container">
                                <img src="https://i.cbc.ca/1.5721290.1612919866!/fileImage/httpImage/image.JPG_gen/derivatives/16x9_780/back-to-school-wexford-collegiate.JPG" alt="" />
                            </div>
                            <h2>Class</h2>
                        </div>
                    </Link>
                </div>
            </section>
            <footer className="home_footer">
                <div className="home_footer_icon_container">
                    <div className="home_icon_back">
                        <i className="fas fa-user fa-2x"></i>
                    </div>
                    <div className="home_icon_back">
                        <i className="fas fa-bell fa-2x"></i>
                    </div>
                    <div className="home_icon_back">
                        <i className="fas fa-sign-out-alt fa-2x"></i>
                    </div>
                    <div className="home_icon_back">
                        <i className="fas fa-cog fa-2x"></i>
                    </div>
                </div>
            </footer>
        </motion.div>
    )
}



export default Home
