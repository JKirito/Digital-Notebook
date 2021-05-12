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




export const action_createClass = (class_name) => {
    return async (dispatch, getState) => {
        dispatch({
            type: ActionTypes.createClassFetchRequest,
        });
        db.collection(FirebaseCollections.class).doc(class_name).get().then(docSnapshot => {
            if (docSnapshot.exists) {
                dispatch({
                    type: ActionTypes.createClassFetchError,
                    payload: {
                        code: 'Document Exists',
                        message: 'Already a class with Same name Present. Choose a different name'
                    },
                })
                return;
            } else {
                db.collection(FirebaseCollections.class).doc(class_name).set({
                    owner: auth.currentUser?.email,
                    id: auth.currentUser.uid,
                    enrolled: [],
                    waitinglist: [],
                    classname: class_name,
                }).then(
                    dispatch({
                        type: ActionTypes.createClassFetchSuccess,
                    })
                )
            }
        }).catch(error => {
            dispatch({
                type: ActionTypes.createClassFetchError,
                payload: error,
            })
        });
    };
}

export const action_joinClass = (class_name) => {
    return async (dispatch, getState) => {
        dispatch({
            type: ActionTypes.createClassFetchRequest,
        });
        db.collection(FirebaseCollections.class).doc(class_name).get().then(docSnapshot => {
            if (docSnapshot.exists) {
                let userdata = docSnapshot.data();
                if (userdata.id === auth.currentUser.uid) {
                    dispatch({
                        type: ActionTypes.createClassFetchError,
                        payload: {
                            code: 'You are the Host',
                            message: 'You are the host of this class. Can directly access it from the my-Class Section',
                        }
                    })
                }
                else {
                    let classdata = docSnapshot.data();
                    let present = false;
                    classdata.waitinglist.every((doc, index) => {
                        if (doc.id === auth.currentUser.uid) {
                            // console.log(`user already in list`)
                            present = true;
                            return false;
                        } else return true;
                    })
                    if (!present) {
                        db.collection(FirebaseCollections.class).doc(class_name).update({
                            waitinglist: [...classdata.waitinglist, {
                                id: auth.currentUser.uid,
                                email: auth.currentUser.email,
                            }],
                        })
                        dispatch({
                            type: ActionTypes.createClassFetchSuccess,
                        })
                    } else {
                        dispatch({
                            type: ActionTypes.createClassFetchError,
                            payload: {
                                code: 'Already in Waiting room',
                                message: 'Already present in the Waiting Room for the Class',
                            }
                        })
                    }
                }
            } else {
                dispatch({
                    type: ActionTypes.createClassFetchError,
                    payload: {
                        code: 'no-class-found',
                        message: 'No such class Exists',
                    }
                })
            }
        })
    };
}

export const action_addRealTimeListener = () => {
    return async (dispatch, getState) => {
        if (auth?.currentUser?.uid) {
            let documentList = [];
            let myClassList = [];
            let myEnrolledClassList = [];
            const classCollection = db.collection(FirebaseCollections.class).onSnapshot(classSnapshot => {
                const documents = db.collection(FirebaseCollections.class).where('id', '==', `${auth.currentUser.uid}`).get();
                if (!documents.empty) {
                    documents.then(doc => {
                        doc.docs.forEach(el => {
                            // console.dir(el.id);
                            db.collection(FirebaseCollections.class).doc(el.id).onSnapshot(querySnapshot => {
                                // console.log(`Data Changed`);
                                // console.log(querySnapshot.data().id);
                                let test = myClassList.findIndex(x => x.classname === querySnapshot.data().classname);
                                if (test === -1) {
                                    // console.log(`pushing ${documentList.findIndex(x => x.classname === querySnapshot.data().classname)}`)
                                    myClassList.push(querySnapshot.data());
                                } else {
                                    // console.log('Updating')
                                    let index = myClassList.findIndex(x => x.classname == querySnapshot.data().classname);
                                    myClassList[index] = querySnapshot.data();
                                    // console.dir(documentList[index]);
                                }
                                dispatch({
                                    type: ActionTypes.setMyClasses,
                                    payload: myClassList,
                                })
                            })
                        })
                    })
                }
                const enrolledDocuments = db.collection(FirebaseCollections.class).where('enrolled', 'array-contains', `${auth.currentUser.uid}`).get();
                if (!enrolledDocuments.empty) {
                    enrolledDocuments.then(doc => {
                        doc.docs.forEach(el => {
                            db.collection(FirebaseCollections.class).doc(el.id).onSnapshot(querySnapshot => {
                                // console.log(`Data Changed`);
                                // console.log(querySnapshot.data().id);
                                let test = myEnrolledClassList.findIndex(x => x.classname === querySnapshot.data().classname);
                                if (test === -1) {
                                    // console.log(`pushing ${documentList.findIndex(x => x.classname === querySnapshot.data().classname)}`)
                                    myEnrolledClassList.push(querySnapshot.data());
                                } else {
                                    // console.log('Updating')
                                    let index = myEnrolledClassList.findIndex(x => x.classname == querySnapshot.data().classname);
                                    myEnrolledClassList[index] = querySnapshot.data();
                                    // console.dir(documentList[index]);
                                }
                                dispatch({
                                    type: ActionTypes.setEnrolledClasses,
                                    payload: myEnrolledClassList,
                                })
                            })
                            db.collection(FirebaseCollections.class).doc(el.id).collection('quiz').onSnapshot(querySnapshot => {
                                // console.log('Some Update happened in quiz collection')
                                let quizlist = [];
                                querySnapshot.docs.map(doc => {
                                    quizlist.push({
                                        id: doc.id,
                                        quizdata: doc.data(),
                                    })
                                })
                                // console.dir(quizlist)
                                dispatch({
                                    type: ActionTypes.fetchRequestAllAvailableQuiz,
                                    payload: quizlist,
                                })
                            })
                        })
                    })
                }
                // dispatch({
                //     type: ActionTypes.setClassData,
                //     payload: documentList,
                // })
            }, (error) => {
                console.log(error);
            });

        }
    }
}

export const action_fetchClasses = () => {
    return async (dispatch, getState) => {
        if (auth.currentUser?.uid) {
            const documents = db.collection(FirebaseCollections.class).where('id', '==', `${auth.currentUser.uid}`).get();
            if (!documents.empty) {

                documents.then(doc => {

                    let tempdocumentlist = [];
                    if (doc.docs.length > 0) {
                        doc.docs.forEach(el => {
                            tempdocumentlist.push(el.data());
                        })
                    }
                    dispatch({
                        type: ActionTypes.setMyClasses,
                        payload: tempdocumentlist,
                    });
                })
            }
            const enrolledDocuments = db.collection(FirebaseCollections.class).where('enrolled', 'array-contains', `${auth.currentUser.uid}`).get();
            if (!enrolledDocuments.empty) {
                enrolledDocuments.then(doc => {
                    let tempdocumentlist = [];
                    if (doc.docs.length > 0) {
                        doc.docs.forEach(el => {
                            tempdocumentlist.push(el.data());
                        })
                    }
                    dispatch({
                        type: ActionTypes.setEnrolledClasses,
                        payload: tempdocumentlist,
                    });
                })
            }
        }
    };
}

export const action_RejectUserAccessToClass = ({ classname, user, data }) => {
    return async (dispatch, getState) => {
        // console.log(waitinglist)
        console.dir(data);
        db.collection(FirebaseCollections.class).doc(classname).update({
            waitinglist: data,
        });
    }
}
export const action_AllowUserAccessToClass = ({ classname, user, data }) => {
    return async (dispatch, getState) => {
        // console.log(waitinglist)
        console.dir(data);
        db.collection(FirebaseCollections.class).doc(classname).update({
            enrolled: data,
        });
        // dispatch(action_RejectUserAccessToClass({ classname: classname, user: user, data: data }));
    }
}

// export const action_


