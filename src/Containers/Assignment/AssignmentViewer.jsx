import { Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Paper, Typography } from '@material-ui/core'
import { CloudDownloadRounded } from '@material-ui/icons';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router'
import NavBar from '../Home/NavBar'

function AssignmentViewer() {
    let { classname, topic } = useParams();
    let assignmentReducerList = useSelector(state => state.AssignmentReducer);
    const [filtered, setFiltered] = useState({});

    useEffect(() => {
        let t = assignmentReducerList?.assignmentList.filter(x => x?.data?.topic === topic);
        setFiltered(t[0]);
    }, [assignmentReducerList])
    return (
        <div>
            <NavBar />
            <Grid container direction='column' style={{ margin: "0 auto", marginTop: "60px", width: "90%" }}>
                <Grid item>
                    <Typography variant='h5'>Viewing Details for {topic}</Typography>
                </Grid>
                <Grid item>
                    <Typography variant='h6'>Users</Typography>
                </Grid>
                <Grid container>
                    <Grid item xs={12}>
                        <List>
                            <Grid container spacing={3}>
                                {
                                    filtered && filtered?.data?.submissions?.map((el, index) => (
                                        <Grid item key={index} xs={12} md={6} lg={4}>
                                            <Paper elevation={3}>
                                                <ListItem >
                                                    <ListItemText>
                                                        <Typography variant='subtitle1'>{el.displayName}</Typography>
                                                    </ListItemText>
                                                    <ListItemSecondaryAction>

                                                        <IconButton edge="end" aria-label="download" onClick={() => {
                                                            window.open(el.url);
                                                        }}>
                                                            <CloudDownloadRounded />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            </Paper>
                                        </Grid>
                                    ))
                                }
                                {
                                    !filtered && <Grid container>
                                        <Grid item>
                                            <Typography variant='h6'>No Submissions Yet</Typography>
                                        </Grid>
                                    </Grid>
                                }
                            </Grid>
                        </List>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}

export default AssignmentViewer
