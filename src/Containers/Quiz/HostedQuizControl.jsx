import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router'

function HostedQuizControl() {
    let { classname, quizname } = useParams();
    let quizDetails = useSelector(state => state.QuizReducer.hostedQuiz);
    const [filteredData, setFilteredData] = useState([]);
    useEffect(() => {
        let data = quizDetails?.filter(x => x.id === quizname);
        setFilteredData(data[0]);
    }, [quizDetails])
    return (
        <div>
            <h3>Showing Details for {quizname}</h3>
            {/* {JSON.stringify(filteredData)} */}
            <div>
                <h3>Students Submission List</h3>
                <p>Total Submissions :- {filteredData?.quizdata?.studentAnswers?.length}</p>
                <div className='hosted__quiz__control__studentList__container'>
                    {
                        filteredData?.quizdata?.studentAnswers?.map((student, index) => (
                            <div key={index} className='hosted__quiz__control__studentList'>
                                <p className='hosted__quiz__control__studentList__email'>{student?.email} <span>Correct Answers :- {student?.correct}/{student?.total}</span> </p>
                            </div>
                        ))
                    }
                </div>
            </div>
            {
                console.log(filteredData.id, filteredData?.quizdata?.studentAnswers)
            }
        </div>
    )
}

export default HostedQuizControl
