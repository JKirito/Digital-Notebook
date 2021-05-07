import { ActionTypes, FirebaseCollections } from "../Actiontypes";
import { auth, db, timestamp } from "../firebase";
import { Schema } from "./DataSchema";

export const action_AutomaticDetectLogin = (user) => {
    return async (dispatch, getState) => {
        if (user) {
            dispatch({
                type: ActionTypes.setLoggedInTrue,
            })
            dispatch({
                type: ActionTypes.setLoggedInUser,
                payload: user,
            })
        } else {
            dispatch({
                type: ActionTypes.setLoggedInFalse,
            })
        }
    };
}

export const action_Login = (username, password) => {
    return async (dispatch, getState) => {
        dispatch({
            type: ActionTypes.fetchLoginRequest,
        })
        await auth.signInWithEmailAndPassword(username, password).then(cred => {
            // db.collection(FirebaseCollections.users).doc(cred.user.email).set({
            //     email: cred.user.email,
            //     data: ["Testing Overriting 2"],
            // }, { merge: true });
            // No need to add User Here Already Done in AuthReducer
            dispatch({
                type: ActionTypes.fetchLoginSuccess,
                // payload: user,
            })
        }).catch((error) => {
            dispatch({
                type: ActionTypes.fetchLoginFailure,
                payload: error,
            })
        })

    }
}

export const action_Signup = (username, password) => {
    return async (dispatch, getState) => {
        dispatch({
            type: ActionTypes.fetchSignupRequest,
        })
        await auth.createUserWithEmailAndPassword(username, password).then(cred => {
            let tuser = new Schema.UserSchema({ email: cred.user.email });
            db.collection(FirebaseCollections.users).doc(cred.user.uid).set(tuser.getUserData());
            dispatch({
                type: ActionTypes.fetchSignupSuccess,
                payload: {
                    success: true,
                },
            })
        }).catch((error) => {
            dispatch({
                type: ActionTypes.fetchSignupFailure,
                payload: {
                    error,
                    success: false,
                },
            })
        })
    };
}

export const action_Logout = () => {
    return async (dispatch, getState) => {
        await auth.signOut();
        dispatch({
            type: ActionTypes.setLoggedInUser,
            payload: null,
        })
        dispatch({
            type: ActionTypes.setLoggedInFalse,
            payload: null,
        })
        dispatch({
            type: ActionTypes.removeUserReducerData,
        })
    };
}

export const action_FetchNotebooks = (uid) => {
    return async (dispatch, getState) => {
        dispatch({
            type: ActionTypes.fetchUserDataRequest,
        });
        await db.collection(FirebaseCollections.users).doc(uid).collection(FirebaseCollections.notebooks).get().then(res => {
            let documents = [];
            res.docs.forEach(doc => {
                documents.push({
                    doc_name: doc.id,
                    doc_data: doc.data(),
                });
            })
            // console.dir(documents);
            if (documents.length > 0) {
                dispatch({
                    type: ActionTypes.fetchUserDataSuccess,
                    payload: documents,
                })
            } else {
                dispatch({
                    type: ActionTypes.fetchUserDataFailure,
                    payload: {
                        code: 'warning/notebook_collection-not-available',
                        messgage: 'Notebook collection not available in the present user',
                    }
                })
            }
        }
        ).catch(error => {
            dispatch({
                type: ActionTypes.fetchUserDataFailure,
                payload: error,
            })
        });
    }
};

export const action_CreateNewNotebook = ({ notebookname, uid }) => {
    return (dispatch, getState) => {
        // console.log(name);
        db.collection(FirebaseCollections.users).doc(uid).collection(FirebaseCollections.notebooks).doc(notebookname).set({
            notebook_currentpage: 1,
            notebook_totalpage: 1,
            notebook_data: [
                {
                    data: [],
                    page: null,
                }
            ],
            createdAt: timestamp.fromDate(new Date()),
        });
    };
}

// Currently Working for One Page only.
export const action_SaveNotebook = ({ data, current_page, doc_name }) => {
    return (dispatch, getState) => {
        // console.dir(current_page);
        // console.dir(data);
        db.collection(FirebaseCollections.users).doc(auth.currentUser.uid).collection(FirebaseCollections.notebooks).doc(doc_name).set({
            notebook_currentpage: current_page,
            notebook_data: [
                {
                    data: data,
                    page: current_page,
                }
            ],
        }, { merge: true });
    };
}

export const action_WriteDataToNotebook = ({ data, page, doc_name }) => {
    return async (dispatch, getState) => {
        dispatch({
            type: ActionTypes.writeDataToNotebook,
            payload: {
                doc_name: doc_name,
                page: page,
                data: data,
            }
        })
    };
}

export const action_setNotebookToNotebookReducer = ({ doc_name, current_page, total_page, notebook_data }) => {
    return async (dispatch, getState) => {
        // console.log(getState());
        dispatch({
            type: ActionTypes.setNotebookToNotebookReducer,
            payload: {
                doc_name: doc_name,
                current_page: current_page,
                total_page: total_page,
                notebook_data: notebook_data,
            },
        })
    }
}
// export const action_
