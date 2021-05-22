import { Button, Card, CardActions, CardContent, Grid, TextField, Typography } from '@material-ui/core';
import React, { useRef, useState } from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import { useParams } from 'react-router'
import NavBar from '../Home/NavBar';
import { action_PostAssignment } from '../Application/actions';
import { useDispatch } from 'react-redux';;

function Assignment() {
    const { classname } = useParams();
    const questionFieldRef = useRef();
    const assignmentTopicRef = useRef();
    const datePickerRef = useRef();
    const dispatch = useDispatch();
    const [questionList, setQuestionList] = useState({
        list: [],
    });

    const handleAddQuestion = () => {
        if (!questionFieldRef.current.value) {
            alert('Field Can\'t be empty');
            return;
        };
        setQuestionList({
            list: [...questionList.list, questionFieldRef.current.value],
        });
        questionFieldRef.current.value = '';
    }
    const deleteQuestion = (el, index) => {
        // let ind = questionList.list.findIndex(el);
        let temp = questionList.list;
        temp.splice(index, 1);
        setQuestionList({
            list: temp,
        })
    }
    const postAssignment = () => {
        if (!assignmentTopicRef.current.value) {
            alert(`Please Provide Assignment Name/Topic`)
            return;
        }
        if (!datePickerRef.current.value) {
            alert(`Please Pick a valid Due Date`);
            return;
        }
        console.log(datePickerRef.current.value);

        dispatch(action_PostAssignment({ classname: classname, topic: assignmentTopicRef.current.value, questionList: questionList.list, dueDate: datePickerRef.current.value }));
    }
    return (
        <>
            <NavBar />
            <Grid container justify='center' style={{ width: '90%', margin: '0 auto', marginTop: '60px' }}>
                <Grid item>
                    <Typography variant='h5'>Assignment Setup</Typography>
                </Grid>
                <Grid container alignItems='center'>
                    <Grid item xs={8} md={10} lg={11}>
                        <TextField
                            id="standard-multiline-flexible"
                            label="Assignment Name/Topic"
                            inputRef={assignmentTopicRef} />
                    </Grid>
                    <Grid item xs={4} md={2} lg={1}>
                        <Typography variant='subtitle2' style={{ color: "#757575" }}>Due Date</Typography>
                        <input type="date" ref={datePickerRef} style={{ padding: '0.6rem' }} />
                    </Grid>
                </Grid>
                <Grid container justify='center' >
                    <Grid item xs={12} md={6}>
                        <Grid container direction='column' justify='space-between' style={{ width: '95%' }}>
                            <Grid container justify='center'>
                                <Grid item>
                                    <Typography variant='subtitle1'>Question</Typography>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <TextField
                                    id="standard-multiline-flexible"
                                    label="Question"
                                    multiline
                                    fullWidth
                                    inputRef={questionFieldRef}
                                // rowsMax={4}
                                // value={value}
                                // onChange={handleChange}
                                />
                            </Grid>
                            <Grid item style={{ marginTop: "10px" }}>
                                <Button variant='contained' onClick={handleAddQuestion} style={{ background: "#3EAA2C", color: "white" }}>Add Question</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={6} >
                        <Grid container justify='center'>
                            <Grid container justify='center'>
                                <Grid item>
                                    <Typography variant='subtitle1'>Preview</Typography>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}>
                                {
                                    questionList && questionList?.list && questionList.list.map((el, index) => {
                                        return <Grid key={index} item xs={12}>
                                            <Card >
                                                <CardContent >
                                                    <Typography variant='subtitle1'>{index + 1}) {el}</Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <Button variant='contained' startIcon={<DeleteIcon />} style={{ background: '#FF4747', color: "white" }} onClick={() => { deleteQuestion(el, index) }}>Delete</Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    })
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item style={{ margin: "10px 0" }}>
                    <Button variant='contained' color='primary' onClick={postAssignment}>Post Assignment</Button>
                </Grid>
            </Grid>
        </>
    )
}

export default Assignment
