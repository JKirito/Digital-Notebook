import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router'
import NavBar from '../Home/NavBar';

function HostedQuizControl() {
    let { classname, quizname } = useParams();
    let quizDetails = useSelector(state => state.QuizReducer.hostedQuiz);
    const [filteredData, setFilteredData] = useState([]);
    useEffect(() => {
        let data = quizDetails?.filter(x => x.id === quizname);
        setFilteredData(data[0]);
    }, [quizDetails])
    return (
        <>
            <NavBar />
            <Grid container style={{ marginTop: "60px" }} justify='center' >
                <Grid item xs={11}>
                    <Typography variant='h4'>Showing Data for Quiz :- {quizname}</Typography>
                </Grid>
            </Grid>
            {/* {JSON.stringify(filteredData)} */}
            <div>
                <Grid container justify='center'>
                    <Grid item xs={11}>
                        <Typography variant='h5'>Students Submission List</Typography>
                    </Grid>
                    <Typography variant='h6'>Total Submissions :- {filteredData?.quizdata?.studentAnswers?.length}</Typography>
                </Grid>
                <Grid container spacing={3} justify='center'>
                    {
                        filteredData?.quizdata?.studentAnswers?.map((student, index) => (
                            <Grid item key={index} xs={11} >
                                <Card>
                                    <CardContent>
                                        <Grid container justify='space-between'>
                                            <Grid item>
                                                <Typography variant='h6'>{student?.displayName} ( {student?.email} ) </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant='h6'>Correct Answers :- {student?.correct}/{student?.total}</Typography>
                                            </Grid>
                                        </Grid>
                                        {/* <Typography variant='h6' className='hosted__quiz__control__studentList__email'>{student?.email} <span>Correct Answers :- {student?.correct}/{student?.total}</span> </Typography> */}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    }
                </Grid>
            </div>
        </>
    )
}

export default HostedQuizControl
