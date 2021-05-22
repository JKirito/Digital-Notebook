import { Button, Card, CardActions, CardContent, Grid, IconButton, Paper, Typography } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router'
import NavBar from '../Home/NavBar'
import { action_uploadAssignment } from '../Application/actions';

function SubmitAssignment() {
    let { classname, topic } = useParams();
    let availableAssignment = useSelector(state => state.AssignmentReducer);
    const [filtered, setFiltered] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        let temp = availableAssignment.availableAssignmentList.filter(x => x.data.topic === topic)
        setFiltered(temp[0]);
    }, [availableAssignment])

    const UploadDocument = () => {
        let input = document.createElement('input');
        input.type = 'file';
        // input.accept = 'image/*';
        input.accept = 'application/pdf';
        input.onchange = function () {
            // console.log(input.files[0]);
            if (input.files) {
                setSelectedFile(input.files[0]);
            }
        }
        input.click();
    }
    const FinalUpload = () => {
        dispatch(action_uploadAssignment({
            file: selectedFile,
            classname: classname,
            topic: topic,
        }));
    }
    return (
        <>
            <NavBar />
            <Grid container style={{ margin: "0 auto", width: "90%", marginTop: "60px" }}>
                <Typography variant='h5'>Assignment</Typography>
                <Grid container direction='column'>
                    <Typography variant='h6'>{topic}</Typography>
                    <Grid container direction='column'>
                        {
                            // JSON.stringify(filtered.data.questionList)
                        }
                        {
                            filtered?.data?.questionList?.map((el, index) => (
                                <Grid item key={index}>
                                    <Typography variant='subtitle1' >Q{index + 1}) {el}</Typography>
                                </Grid>
                            ))
                        }
                    </Grid>
                    {
                        selectedFile && <Grid item xs={6} md={4}>
                            <Paper elevation={2}>
                                <Card>
                                    <CardContent>
                                        <Typography variant='subtitle1'>{selectedFile?.name}</Typography>
                                        <Typography variant='subtitle2'>Size:- {(selectedFile?.size / (1024 * 1024)).toFixed(2)} MB</Typography>
                                    </CardContent>
                                    <CardActions>
                                        <IconButton variant='contained' style={{ background: '#FE3B2F', color: 'white' }} disabled={availableAssignment.isLoading} onClick={() => { setSelectedFile(null) }} >
                                            <DeleteIcon />
                                        </IconButton>
                                    </CardActions>
                                </Card>
                            </Paper>
                        </Grid>
                    }
                    <Grid item style={{ marginTop: "10px" }}>
                        <Button style={{ backgroundColor: "#5AAB1B", color: "white", fontWeight: "bold" }} onClick={UploadDocument}>Upload Document</Button>
                    </Grid>
                    <Grid container justify='center' style={{ marginTop: "10px" }}>
                        <Button color="primary" variant='contained' onClick={FinalUpload}>Submit</Button>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default SubmitAssignment
