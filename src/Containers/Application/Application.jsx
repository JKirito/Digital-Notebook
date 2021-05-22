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
import HostedQuizControl from '../Quiz/HostedQuizControl.jsx';
import Assignment from '../Assignment/Assignment.jsx';
import SubmitAssignment from '../Assignment/SubmitAssignment.jsx';
import AssignmentViewer from '../Assignment/AssignmentViewer.jsx';

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
                <Route exact path='/signup' component={Signup} />
                <Route exact path='/login' component={Login} />
                <PrivateRoute exact path='/quiz' component={Quiz} />
                <PrivateRoute exact path='/class/:classname/quiz/:quizname' component={Quiz} />
                <PrivateRoute exact path='/class/:classname/control/:quizname' component={HostedQuizControl} />
                <PrivateRoute exact path='/class/createquiz/:classname' component={CreateQuiz} />
                <PrivateRoute exact path='/class/createassignment/:classname' component={Assignment} />
                <PrivateRoute exact path='/class' component={GroupHome} />
                <PrivateRoute exact path='/class/:classname' component={ClassPage} />
                <PrivateRoute exact path='/class/:classname/assignment/:topic' component={SubmitAssignment} />
                <PrivateRoute exact path='/class/:classname/assignment/detail/:topic' component={AssignmentViewer} />
            </Switch>
        </AnimatePresence>
    );
};

export default Application
