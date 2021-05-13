import { Button, Card, CardActions, CardContent, Grid, TextField, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { action_PostQuiz } from '../Application/actions';
import NavBar from '../Home/NavBar';

function CreateQuiz() {
    const { classname } = useParams();
    const quiznameRef = useRef();
    const questionFieldRef = useRef();
    const questionFieldOption1Ref = useRef();
    const questionFieldOption2Ref = useRef();
    const questionFieldOption3Ref = useRef();
    const questionFieldOption4Ref = useRef();
    const questionAnswerFeildRef = useRef();
    const [quizData, setQuizData] = useState([]);
    const dispatch = useDispatch();
    // const quizData = [];
    const AddDataToQuiz = () => {
        if (questionFieldRef.current.value && questionFieldOption1Ref.current.value && questionFieldOption2Ref.current.value && questionFieldOption3Ref.current.value && questionFieldOption4Ref.current.value && questionAnswerFeildRef.current.value) {
            let questionData = {
                question: questionFieldRef.current.value,
                options: [questionFieldOption1Ref.current.value, questionFieldOption2Ref.current.value, questionFieldOption3Ref.current.value, questionFieldOption4Ref.current.value],
                correctoption: questionAnswerFeildRef.current.value,
            };
            let tempdata = [...quizData];
            tempdata = tempdata.concat(questionData);
            setQuizData([...tempdata]);
            // console.dir(tempdata)
            questionFieldRef.current.value = '';
            questionFieldOption1Ref.current.value = '';
            questionFieldOption2Ref.current.value = '';
            questionFieldOption3Ref.current.value = '';
            questionFieldOption4Ref.current.value = '';
            questionAnswerFeildRef.current.value = '';
        } else {
            // console.log('Invalid data')
            alert(`FIll All the data Properly`);
        }
    }

    const PostQuiz = () => {
        if (quizData.length === 0) {
            alert('Quiz Should Have at least 1 Question.')
        } else {
            if (quiznameRef.current.value === '') {
                quiznameRef.current.focus();
                alert('Please Enter a Quiz Name')
            }
            else {
                dispatch(action_PostQuiz({ classname: classname, quizname: quiznameRef.current.value, quizdata: quizData }));
            }
        }
        // console.log(quizData)
    }
    return (
        <div>
            <NavBar />
            <Grid container justify='center' style={{ marginTop: '60px' }}>
                <Grid item>
                    <Typography variant='h4'>Quiz Setup</Typography>
                </Grid>
            </Grid>
            <Grid container className='quizlayout' justify='center'>
                <Grid item className='quizlayout__left' xs={12} md={6}>
                    <Grid container justify='center'>
                        <form noValidate autoComplete="off" className='customTextField'>
                            <TextField id="outlined-basic" label="Quiz Name" variant="outlined" fullWidth inputRef={quiznameRef} />
                        </form>
                    </Grid>
                    <Grid container direction='column' justify='center' alignItems='center'>
                        <Typography variant='h7' style={{ color: '#777777' }}>Fill the details properly</Typography>
                        <form noValidate autoComplete="off" className='customTextField'>
                            <TextField id="outlined-basic" label="Enter Question Here" variant="outlined" fullWidth inputRef={questionFieldRef} />
                        </form>
                        <form noValidate autoComplete="off" className='customTextField'>
                            <TextField id="outlined-basic" label="Option 1" variant="outlined" fullWidth inputRef={questionFieldOption1Ref} />
                        </form>
                        <form noValidate autoComplete="off" className='customTextField'>
                            <TextField id="outlined-basic" label="Option 2" variant="outlined" fullWidth inputRef={questionFieldOption2Ref} />
                        </form>
                        <form noValidate autoComplete="off" className='customTextField'>
                            <TextField id="outlined-basic" label="Option 3" variant="outlined" fullWidth inputRef={questionFieldOption3Ref} />
                        </form>
                        <form noValidate autoComplete="off" className='customTextField'>
                            <TextField id="outlined-basic" label="Option 4" variant="outlined" fullWidth inputRef={questionFieldOption4Ref} />
                        </form>
                        <form noValidate autoComplete="off" className='customTextField'>
                            <TextField id="outlined-basic" label="Correct Option Number" variant="outlined" fullWidth inputRef={questionAnswerFeildRef} />
                        </form>
                        <Grid container justify='center' style={{ marginTop: '20px' }}>
                            <Button variant='contained' style={{ marginRight: '0', color: "white", background: "#0E897A" }} onClick={AddDataToQuiz}>Add</Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item justify='center' xs={10} md={5}>
                    <Grid container justify='center'>
                        <Typography variant='h6'>Quiz Preview</Typography>
                    </Grid>
                    <div>
                        <QuizPreviewPanel quizData={quizData} setQuizData={setQuizData} />
                    </div>
                </Grid>
            </Grid>
            <Grid container justify='center' style={{ marginTop: '20px' }}>
                <Button variant='contained' color='primary' onClick={PostQuiz}>Post Quiz</Button>
            </Grid>
        </div >
    )
}
const QuizPreviewPanel = ({ quizData, setQuizData }) => {
    // useEffect(() => {
    //     // console.dir(quizData);
    // })
    const removeThisQuestion = (question) => {
        let newArray = quizData;
        let index = newArray.indexOf(x => x.question === question);
        newArray.splice(index, 1);
        // console.log(newArray);
        setQuizData([...newArray]);
    }
    return (
        <>
            {
                quizData && quizData.map(question => (
                    <Card key={question.question} className='preview__card'>
                        <CardContent>
                            <p>Question :- {question.question}</p>
                            <p>Options</p>
                            {
                                question.options.map((option, index) => {
                                    return <p key={index}>{index + 1} ) {option}</p>
                                })
                            }
                            <p>Correct Answer:- {question.correctoption}</p>
                        </CardContent>
                        <CardActions>
                            <Button variant='contained' style={{ background: '#FE3B2F', color: 'white' }} startIcon={<DeleteIcon />} onClick={() => { removeThisQuestion(question.question) }}>Delete</Button>
                        </CardActions>
                    </Card>
                ))
            }
        </>
    )
}
export default CreateQuiz
