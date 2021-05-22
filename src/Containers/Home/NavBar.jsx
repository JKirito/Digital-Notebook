import { Typography } from '@material-ui/core';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router';
import { action_Logout } from '../Application/actions';
const NavBar = () => {
    const dispatch = useDispatch();
    let user = useSelector(state => state.AuthReducer.user)
    const history = useHistory();
    const handlelogout = (e) => {
        dispatch(action_Logout());
        history.push('/');
    }
    const toggleSidebar = () => {
        let sidebar = document.getElementById('home_sidebar');
        let homeHamburgerMenu = document.getElementById('home_hamburger_menu');
        if (sidebar.classList.contains('home_sidebar_active')) {
            sidebar.classList.remove("home_sidebar_active");
            homeHamburgerMenu.classList.remove("color_white");
        } else {
            sidebar.classList.add("home_sidebar_active");
            homeHamburgerMenu.classList.add("color_white");
        }
    }
    const goToHome = () => {
        history.push('/')
    }
    const goToAttendance = () => {
        history.push('/attendance');
    }
    const goToQuiz = () => {
        history.push('/quiz');
    }
    return (
        <nav className="home_navbar">
            <div className='home_sidebar' id="home_sidebar">
                <div className='home_sidebar_insidecontainer'>
                    <div className='home_sidebar_insideusercontainer ml_20'>
                        <div className="hamburger_usericoncontainer">
                            <img src="https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png" alt="Avatar" />
                        </div>
                        <div className="hamburger_userdatacontainer">
                            {/* <div className='hamburger_userdatatitle'>{user?.displayName}</div> */}
                            <Typography variant='subtitle1'>{user?.displayName}</Typography>
                            <Typography variant='subtitle2'>{user?.email}</Typography>
                            {/* <div className='hamburger_userdatasubtitle' style={{ fontSize: "0.9rem" }}>{user?.email}</div> */}
                        </div>
                    </div>
                    <div className='hamburger_list' style={{ userSelect: "none" }}>
                        <ul>
                            <li className='ml_20' onClick={goToHome}><Typography variant='h6'>Home</Typography> </li>
                            {/* <li className='ml_20' onClick={goToAttendance}><Typography variant='h6'>Attendance</Typography> </li> */}
                            {/* <li className='ml_20' onClick={goToQuiz}>Quiz</li> */}
                            <li className='ml_20' onClick={handlelogout}><Typography variant='h6'>Logout</Typography></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="home_hamburger_menu left" id="home_hamburger_menu" onClick={toggleSidebar}>
                <i className="fas fa-bars fa-2x"></i>
            </div>
        </nav>
    );
};

export default NavBar;