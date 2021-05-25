import { ActionTypes, FirebaseCollections } from "../Actiontypes";
import { auth, db, storage, timestamp } from "../firebase";
import { Schema } from "./DataSchema";
import { jsPDF } from "jspdf";

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

export const action_Signup = (username, password, displayName) => {
    return async (dispatch, getState) => {
        dispatch({
            type: ActionTypes.fetchSignupRequest,
        })
        await auth.createUserWithEmailAndPassword(username, password).then(cred => {
            let tuser = new Schema.UserSchema({ email: cred.user.email, displayName: displayName });
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

export const action_updateDisplayName = (displayName) => {
    return async (dispatch, getState) => {
        let user = auth?.currentUser;
        user?.updateProfile({
            displayName: displayName,
        });
    }
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

export const action_SetCurrentNotebookPage = ({ page, current_notebook_name }) => {
    return async (dispatch, getState) => {
        db.collection(FirebaseCollections.users).doc(auth.currentUser.uid).collection(FirebaseCollections.notebooks).doc(current_notebook_name).set({
            notebook_currentpage: page,
        }, { merge: true });
    }
}

export const action_CreateNewNotebook = ({ notebookname, uid }) => {
    return (dispatch, getState) => {
        // console.log(name);
        db.collection(FirebaseCollections.users).doc(uid).collection(FirebaseCollections.notebooks).doc(notebookname).set({
            notebook_currentpage: 1,
            notebook_totalpage: 1,
            notebook_data: [
                {
                    data: [],
                    page: 1,
                }
            ],
            createdAt: timestamp.fromDate(new Date()),
        });
    };
}

// Currently Working for One Page only.
export const action_SaveNotebook = ({ data, current_page, doc_name, doc_data, total_page }) => {
    return (dispatch, getState) => {
        // console.dir(data);
        // console.dir(JSON.stringify(doc_data));
        let index = data.findIndex(el => el.page === current_page);
        // console.dir(index);
        if (index >= 0) {
            // console.log('Found And Updating')
            data[index].data = JSON.stringify(doc_data);
        }
        // console.log(data);
        db.collection(FirebaseCollections.users).doc(auth.currentUser.uid).collection(FirebaseCollections.notebooks).doc(doc_name).set({
            notebook_currentpage: current_page,
            notebook_totalpage: total_page,
            notebook_data: data,
        }, { merge: true });
    };
}

export const action_AddPage = ({ total_page, current_notebook_data, doc_name }) => {
    return async (dispatch, getState) => {
        current_notebook_data.push({
            page: total_page + 1,
            data: [],
        })
        db.collection(FirebaseCollections.users).doc(auth.currentUser.uid).collection(FirebaseCollections.notebooks).doc(doc_name).set({
            notebook_totalpage: total_page + 1,
            notebook_data: current_notebook_data,
        }, { merge: true });
        // dispatch({
        //     type: ActionTypes.setNotebookTotalPage,
        //     payload: total_page + 1,
        // })
    }
}
export const action_DeleteNoteBook = (el) => {
    return async (dispatch, getState) => {
        await db.collection(FirebaseCollections.users).doc(auth.currentUser.uid).collection(FirebaseCollections.notebooks).doc(el.doc_name).delete();
        alert('Delete Successful')
    }
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
                                displayName: auth.currentUser.displayName,
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
            let quizlist = [];
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

                            // Triggering Update Will cause data to be written twice in the quizlist :ERROR XXXXX :: SOLVED
                            db.collection(FirebaseCollections.class).doc(el.id).collection(FirebaseCollections.quiz).onSnapshot(querySnapshot => {
                                // console.log('Some Update happened in quiz collection')
                                querySnapshot.docs.map(doc => {
                                    let index = quizlist.findIndex(x => x.id === doc.id);
                                    // console.dir(`Index of doc id :- ${index}`)
                                    // console.dir(`Comparing ${doc.id} with ${quizlist[0]?.id}`)
                                    if (index !== -1) {
                                        // console.log("Updating")
                                        quizlist[index] = {
                                            id: doc.id,
                                            quizdata: doc.data(),
                                        }
                                    }
                                    else {
                                        // console.log("Pushing")
                                        quizlist.push({
                                            id: doc.id,
                                            quizdata: doc.data(),
                                        })
                                    }
                                })
                                // console.dir(quizlist)
                                dispatch({
                                    type: ActionTypes.setHostedQuiz,
                                    payload: quizlist,
                                })
                                // quizlist = [];
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
                            db.collection(FirebaseCollections.class).doc(el.id).collection(FirebaseCollections.quiz).onSnapshot(querySnapshot => {
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

export const action_SetCurrentQuiz = (currentdata) => {
    return async (dispatch, getState) => {
        dispatch({
            type: ActionTypes.setCurrentQuiz,
            payload: currentdata,
        })
    };
}

export const action_PostQuiz = ({ classname, quizdata, quizname }) => {
    return async (dispatch, getState) => {
        let present = false;
        db.collection(FirebaseCollections.class).doc(classname).collection(FirebaseCollections.quiz).get().then(querySnapshot => {
            querySnapshot.docs.map(doc => {
                if (doc.id === quizname) {
                    present = true;
                }
            })
            if (present) {
                alert('Quiz With Same Name Already Exists, Choose a different Name');
            } else {
                db.collection(FirebaseCollections.class).doc(classname).collection(FirebaseCollections.quiz).doc(quizname).set({
                    questionlist: quizdata,
                    quizname: quizname,
                    studentAnswers: [],
                }, { merge: true })
                alert('Quiz Posted Sucessfully');
            }
        })
    }
}

export const action_SubmitQuiz = ({ classname, answers, quizname, correct, total }) => {
    return async (dispatch, getState) => {
        db.collection(FirebaseCollections.class).doc(classname).collection(FirebaseCollections.quiz).doc(quizname).get().then(querySnapshot => {
            let prevStudentAnswers = querySnapshot.data().studentAnswers;
            let present = prevStudentAnswers?.findIndex(x => x.id === auth.currentUser.uid);
            console.log(prevStudentAnswers)
            if (present !== -1) {
                alert('Already Submitted Once Cant be Done Again');
            }
            else {
                db.collection(FirebaseCollections.class).doc(classname).collection(FirebaseCollections.quiz).doc(quizname).set({
                    studentAnswers: [...prevStudentAnswers, {
                        id: auth.currentUser.uid,
                        email: auth.currentUser.email,
                        displayName: auth.currentUser.displayName,
                        answers: [...answers],
                        correct: correct,
                        total: total,
                    }],
                }, { merge: true });
                alert('Submission Successful');
            }
        })

    }
}

export const action_PostAttendance = ({ classname, currentTime, endTime }) => {
    return async (dispatch, getState) => {
        // db.collection;
        // console.log(`${classname} is Found`)
        // console.log(`Current Time: -  ${currentTime}  End TIme:- ${endTime}`)
        db.collection(FirebaseCollections.class).doc(classname).collection(FirebaseCollections.attendance).doc(`${currentTime}`).set({
            isActive: true,
            attendanceList: [],
            startTime: currentTime,
            endTime: endTime,
        }, { merge: true });
    }
}

export const action_MarkAttendance = ({ id, classname }) => {
    return async (dispatch, getState) => {
        db.collection(FirebaseCollections.class).doc(classname).collection(FirebaseCollections.attendance).doc(id).get().then(querySnapshot => {
            if (querySnapshot) {
                let data = querySnapshot.data();
                let fdata = data.attendanceList.findIndex(x => x.id === auth.currentUser.uid);
                if (fdata !== -1) {
                    // console.log(`Already Present , Updating Status`);
                    alert(`Attendance has Already been marked`);
                } else {
                    console.log(`Not Present Adding to present List`);
                    let newList = [...data.attendanceList]
                    newList.push({
                        id: auth.currentUser.uid,
                        name: auth.currentUser.displayName,
                    })
                    db.collection(FirebaseCollections.class).doc(classname).collection(FirebaseCollections.attendance).doc(id).set({
                        attendanceList: newList,
                    }, { merge: true });
                }
            }
        })
    }
}

export const action_PostAssignment = ({ classname, topic, questionList, dueDate }) => {
    return async (dispatch, getState) => {
        db.collection(FirebaseCollections.class).doc(classname).collection(FirebaseCollections.assignment).add({
            questionList: questionList,
            topic: topic,
            createdAt: new Date().getTime(),
            dueDate: dueDate,
            submissions: [],
        })
    }
}

export const action_uploadAssignment = ({ file, classname, topic }) => {
    return async (dispatch, getState) => {
        dispatch({
            type: ActionTypes.setAssignmentLoading,
            payload: true,
        })
        let snapshot = await db.collection(FirebaseCollections.class).doc(classname).collection(FirebaseCollections.assignment).where('topic', '==', topic).get();
        if (snapshot.empty) return;
        let docid = snapshot.docs[0].id;
        let submissions = snapshot.docs[0].data().submissions;
        // console.log(submissions)
        if (submissions.length > 0) {
            let t = submissions.filter(x => x.id === auth.currentUser.uid);
            if (t) {
                // console.log('Already Submitted, cant do twice')
                alert('Already Submitted, cant do twice')
                dispatch({
                    type: ActionTypes.setAssignmentError,
                    payload: {
                        code: 'Submission Already Present',
                        message: 'Already Submitted, cant do twice',
                    },
                })
                return;
            }
        }
        let ref = storage.ref();
        let fileRef = ref.child(file.name)
        await fileRef.put(file)
        const fileURL = await fileRef.getDownloadURL();
        console.log(fileURL);
        submissions.push({
            id: auth.currentUser.uid,
            url: fileURL,
            displayName: auth.currentUser.displayName,
        })
        console.log(`Submissions Are :- ${submissions}`)
        db.collection(FirebaseCollections.class).doc(classname).collection(FirebaseCollections.assignment).doc(docid).set({
            submissions: submissions,
        }, { merge: true });
        dispatch({
            type: ActionTypes.setAssignmentLoading,
            payload: false,
        })
        dispatch({
            type: ActionTypes.setAssignmentError,
            payload: null,
        })
        alert('Assignment Submitted Successfully')
        // console.log(snapshot.docs[0].data())
    }
}


export const action_ExportNotebook = (data, canvasReducerData, doc_name) => {
    return async (dispatch, getState) => {
        // console.dir(data)
        // console.dir(canvasReducerData.canvasOperations)
        let doc;
        if (canvasReducerData.canvasWidth < 500) {
            doc = new jsPDF("p", "px", [canvasReducerData.canvasHeight, canvasReducerData.canvasWidth]);
        } else {
            doc = new jsPDF("l", "px", [canvasReducerData.canvasHeight, canvasReducerData.canvasWidth]);
        }
        let width = doc.internal.pageSize.getWidth();
        let height = doc.internal.pageSize.getHeight();

        for (let i = 0; i < data.length; i++) {
            let imgData = await DrawDataToCanvas(data[i].data, canvasReducerData);
            // await AddDataToPdf(doc, i, data.length, imgData, doc_name);
            doc.addImage(imgData, "JPEG", 0, 0);
            if (i !== data.length - 1) {
                doc.addPage();
            }
        }
        doc.save(doc_name);
    }
}
// const AddDataToPdf = async (doc, i, length, imgData, doc_name) => {
//     // return async (dispatch, getState) => {
//     doc.addImage(imgData, "jpeg", 0, 0);
//     if (i !== length - 1) {
//         doc.addPage();
//     }
//     // }
// }

const DrawDataToCanvas = async (drawingData, canvasReducerData) => {
    let drawCanvas = document.createElement('canvas');
    let drawCanvasctx = drawCanvas.getContext("2d")
    drawCanvas.width = canvasReducerData.canvasWidth;
    drawCanvas.height = canvasReducerData.canvasHeight;
    drawCanvasctx.fillStyle = "white";
    drawCanvasctx.fillRect(0, 0, canvasReducerData.canvasWidth, canvasReducerData.canvasHeight);

    // console.log(`Type:- ${typeof (drawingData)}`);
    if (typeof (drawingData) === "string") {
        // console.log("Parsing Data")
        drawingData = JSON.parse(drawingData);
    } else {
        drawingData = drawingData;
        // console.log("NO Parsing Needed")
    }
    // console.log("Data:- ", drawingData);
    // console.log(canvasReducerData);
    drawCanvasctx.clearRect(0, 0, canvasReducerData.canvasWidth, canvasReducerData.canvasHeight);
    drawCanvasctx.fillStyle = "white";
    drawCanvasctx.fillRect(0, 0, canvasReducerData.canvasWidth, canvasReducerData.canvasHeight);
    if (drawingData?.length > 0) {
        drawingData.forEach((ele) => {
            let pointData = ele.pointData;
            // console.dir(ele);
            drawCanvasctx.lineWidth = ele.brushRadius;
            drawCanvasctx.strokeStyle = ele.brushColor;
            // console.log(ele.canvasOperation);
            if (ele.canvasOperation === canvasReducerData.canvasOperations.draw) {
                // console.log("Converting to Drawing", ele.canvasOperation, canvasOperation.draw)
                drawCanvasctx.globalCompositeOperation = canvasReducerData.canvasCompositeOperations.draw;
            } else if (ele.canvasOperation === canvasReducerData.canvasOperations.erase) {
                // console.log("Converting to Eraser", ele.canvasOperation, canvasOperation.draw)
                drawCanvasctx.globalCompositeOperation = canvasReducerData.canvasCompositeOperations.eraser;
            }
            // console.log(canvasCompositeOperation.draw, ele.canvasOperation);
            // console.log(drawCanvasctx.globalCompositeOperation);
            drawCanvasctx.lineJoin = "round";
            drawCanvasctx.lineCap = "round";
            drawCanvasctx.beginPath();
            let p1 = pointData[0];
            let p2 = pointData[1];
            // console.log(DrawingData)
            if (p1) {
                drawCanvasctx.beginPath();
                drawCanvasctx.moveTo(p1.x, p1.y);
                for (let i = 1, len = pointData.length; i < len; i++) {
                    // we pick the point between pi+1 & pi+2 as the
                    // end point and p1 as our control point
                    let midPoint = midPointBtw(p1, p2);
                    drawCanvasctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
                    p1 = pointData[i];
                    p2 = pointData[i + 1];
                }
                drawCanvasctx.lineTo(p1.x, p1.y);
                drawCanvasctx.stroke();
            }
            drawCanvasctx.closePath();
        })
    }
    // let templink = document.createElement('image');
    let img = drawCanvas.toDataURL("image/jpeg", 0.5);
    return img;
    // templink.download = "page.png"
    // templink.src = img;
    // let doc = new jsPDF();
    // doc.addImage(img, "PNG", 0, 0);
    // doc.save("Page.pdf")
    // templink.click();

}

function midPointBtw(p1, p2) {
    return {
        x: p1.x + (p2.x - p1.x) / 2,
        y: p1.y + (p2.y - p1.y) / 2
    };
}
// export const action_


