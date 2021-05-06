import React from 'react'
import Login from '../Login/Login.jsx';
import Signup from '../Signup/Signup.jsx';
import AuthProvider from './AuthProvider.jsx';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from '../Home/Home.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import NotebookHolder from '../../components/NotebookHolder/NotebookHolder.jsx';

function Application() {

    return (
        // Handling Routing
        <Router>
            <AuthProvider>
                <Switch>
                    {/* NOW ALL ANY CHILD AND THE GLOBAL STATE WILL BE AVAILABLE. ALL FUNCITONALITIES */}
                    <PrivateRoute exact path='/' component={Home} />
                    <PrivateRoute exact path='/notebooks/:name' component={NotebookHolder} />
                    {/* <Route path='/notebooks' component={NotebookHolder} /> */}
                    <Route path='/signup' component={Signup} />
                    <Route path='/login' component={Login} />
                </Switch>
            </AuthProvider>
        </Router >
    )
}



export default Application
