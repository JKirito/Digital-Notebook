import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { action_PostQuiz } from '../Application/actions';

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
        dispatch(action_PostQuiz({ classname: classname, quizname: quiznameRef.current.value, quizdata: quizData }));
        // console.log(quizData)
    }
    return (
        <div>
            <div className='quizlayout'>
                <div className='quizlayout__left'>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: 'center', justifyContent: 'space-between' }}>
                        <p>Quiz Name:-</p>
                        <input type="text" ref={quiznameRef} placeholder='Enter Quiz Name Here' />
                    </div>
                    <div>
                        <h3>Enter Question to add to Quiz</h3>
                        <div style={{ display: "flex", flexDirection: "row", alignItems: 'center', justifyContent: 'space-between' }}>
                            <p>Question:- </p><input type="text" ref={questionFieldRef} placeholder='Enter Question Here' />
                        </div>
                        <div style={{ display: "flex", flexDirection: "row", alignItems: 'center', justifyContent: 'space-between' }}>
                            <p>Option 1:- </p><input type="text" ref={questionFieldOption1Ref} placeholder='Enter Option 1 Here' />
                        </div>
                        <div style={{ display: "flex", flexDirection: "row", alignItems: 'center', justifyContent: 'space-between' }}>
                            <p>Option 2:- </p><input type="text" ref={questionFieldOption2Ref} placeholder='Enter Option 2 Here' />
                        </div>
                        <div style={{ display: "flex", flexDirection: "row", alignItems: 'center', justifyContent: 'space-between' }}>
                            <p>Option 3:- </p><input type="text" ref={questionFieldOption3Ref} placeholder='Enter Option 3 Here' />
                        </div>
                        <div style={{ display: "flex", flexDirection: "row", alignItems: 'center', justifyContent: 'space-between' }}>
                            <p>Option 4:- </p><input type="text" ref={questionFieldOption4Ref} placeholder='Enter Option 4 Here' />
                        </div>
                        <div style={{ display: "flex", flexDirection: "row", alignItems: 'center', justifyContent: 'space-between' }}>
                            <p>Answer:- </p><input type="text" ref={questionAnswerFeildRef} placeholder='Which Option is Correct?' />
                        </div>
                        <div style={{ display: "flex", flexDirection: "row", alignItems: 'center', justifyContent: 'center' }}>
                            <button className='list__quiz__takebutton' style={{ marginRight: '0' }} onClick={AddDataToQuiz}>Add</button>
                        </div>
                    </div>
                </div>
                <div className='quizlayout__right'>
                    <h3>Quiz Preview Will Show Here</h3>
                    <div className='preview__container'>
                        <QuizPreviewPanel quizData={quizData} setQuizData={setQuizData} />
                    </div>
                </div>
            </div>
            <div>
                <button className='list__quiz__takebutton' style={{ background: '#215ac1', margin: '0 auto' }} onClick={PostQuiz}>Post Quiz</button>
            </div>
        </div>
    )
}
const QuizPreviewPanel = ({ quizData, setQuizData }) => {
    useEffect(() => {
        // console.dir(quizData);
    })
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
                    <div key={question.question} className='preview__card'>
                        <p>Question :- {question.question}</p>
                        <p>Options</p>
                        {
                            question.options.map((option, index) => {
                                return <p key={index}>{index + 1} ) {option}</p>
                            })
                        }
                        <p>Correct Answer:- {question.correctoption}</p>
                        <button onClick={() => { removeThisQuestion(question.question) }}>Remove this Question</button>
                    </div>
                ))
            }
        </>
    )
}
export default CreateQuiz
