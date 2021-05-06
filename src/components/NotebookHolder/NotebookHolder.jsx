import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { action_setNotebookToNotebookReducer } from '../../Containers/Application/actions';
import DrawingPoint2 from '../canvasDrawing/DrawingPoint2'
function NotebookHolder({ match }) {
    let notebookData = useSelector(state => {
        let tstate = state.UserReducer.userdata;
        if (tstate) {
            // console.dir(tstate);
            let res = tstate.filter(el => el.doc_name === match.params.name);
            // console.log(res[0].doc_data)
            return res[0];
        }
    });
    const dispatch = useDispatch();
    useEffect(() => {
        // console.dir(notebookData);
        dispatch(action_setNotebookToNotebookReducer({
            doc_name: notebookData.doc_name,
            current_page: notebookData.doc_data.notebook_currentpage,
            total_page: notebookData.doc_data.notebook_totalpage,
            notebook_data: notebookData.doc_data.notebook_data,
        }));
    })

    const saveNotebook = () => {
        console.log("Saving Notebook");
    }

    return (
        <>
            <DrawingPoint2 />
        </>
    )
}

export default NotebookHolder
