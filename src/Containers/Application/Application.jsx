import React, { useEffect } from 'react'
import Login from '../Login/Login.jsx';
import Signup from '../Signup/Signup.jsx';
import AuthProvider from './AuthProvider.jsx';
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom'
import Home from '../Home/Home.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import NotebookHolder from '../../components/NotebookHolder/NotebookHolder.jsx';
import { AnimatePresence, motion } from 'framer-motion';
import NotesHome from '../NotesHome/NotesHome.jsx';
import GroupHome from '../GroupHome/GroupHome.jsx';
import ClassPage from '../Classes/ClassPage.jsx';
import Quiz from '../Quiz/Quiz.jsx';
import CreateQuiz from '../Quiz/CreateQuiz.jsx';

function Application() {
    return (
        // Handling Routing
        <Router>
            <AuthProvider>
                <App />
            </AuthProvider>
        </Router >
    )
}

const App = () => {
    const location = useLocation();
    return (
        <AnimatePresence exitBeforeEnter>
            <Switch location={location} key={location.pathname} >
                {/* NOW ALL ANY CHILD AND THE GLOBAL STATE WILL BE AVAILABLE. ALL FUNCITONALITIES */}
                <PrivateRoute exact path='/' component={Home} />
                <PrivateRoute exact path='/notebooks/:name' component={NotebookHolder} />
                <PrivateRoute exact path='/notebooks' component={NotesHome} />
                {/* <Route path='/notebooks' component={NotebookHolder} /> */}
                <Route path='/signup' component={Signup} />
                <Route path='/login' component={Login} />
                <Route path='/quiz' component={Quiz} />
                <Route exact path='/class/:classname/quiz/:quizname' component={Quiz} />
                <Route path='/class/createquiz/:classname' component={CreateQuiz} />
                <Route exact path='/class' component={GroupHome} />
                <Route exact path='/class/:classname' component={ClassPage} />
            </Switch>
        </AnimatePresence>
    );
};


export default Application
