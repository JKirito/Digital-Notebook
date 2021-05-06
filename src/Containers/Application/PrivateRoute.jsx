import React from 'react'
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

function PrivateRoute({ component: Component, ...rest }) {
    let currentUser = useSelector(state => state.AuthReducer.user);
    return (
        <Route {...rest} render={props => {
            return currentUser ? <Component {...props} /> : <Redirect to='/login' />;
        }}>
        </Route>
    )
}

export default PrivateRoute
