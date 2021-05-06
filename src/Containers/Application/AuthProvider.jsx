import React, { useEffect, useState } from 'react'
import { createStore, applyMiddleware } from "redux";
import { Provider, useDispatch } from "react-redux"
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import allReducers from './reducers/index.jsx'
import { auth } from "./firebase"
import { action_AutomaticDetectLogin } from './actions/index.jsx';

function AuthProvider({ children }) {
    const store = createStore(allReducers, composeWithDevTools(
        applyMiddleware(thunk)
    ));
    return (
        <div>
            <Provider store={store}>
                <SProvider children={children} />
            </Provider>
        </div>
    )
}
const SProvider = ({ children }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            // If Logged in user Available Then Manage the State Accordingly
            if (user) {
                dispatch(action_AutomaticDetectLogin(user));
                setLoading(false);
            }
        }, error => {
            console.log(error);
        });
        return unsubscribe;
    }, [dispatch])
    return <>
        { !loading && children}
    </>
}

// REFERENCE FOR LATER
// state will get all the reducers then access data using state.<ReducerName>.<data>
// const Test = () => {
//     const dim = useSelector(state => state.UserReducer.user)
//     return <React.Fragment >
//         <h1>{dim}</h1>

//     </React.Fragment>
// }
export default AuthProvider
