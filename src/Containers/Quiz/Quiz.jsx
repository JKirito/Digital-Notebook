import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { action_SubmitQuiz } from '../Application/actions';
import './Quiz.css';

function Quiz() {
    let quiz = useSelector(state => state.QuizReducer.currentQuiz.quizdata);
    let quizid = useSelector(state => state.QuizReducer.currentQuiz.id);
    const dispatch = useDispatch();
    let { quizname, classname } = useParams();
    const [filteredData, setFilteredData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({
        answers: [],
    });
    let questionList = [];
    // let answers = [];
    useEffect(() => {
        // console.dir(quiz);
    })
    const increaseCurrentIndex = () => {
        let length = quiz.questionlist.length;
        if (currentIndex >= length - 1) {
            return;
        } else {
            var ele = document.getElementsByName("radio");
            for (var i = 0; i < ele.length; i++)
                ele[i].checked = false;
            setCurrentIndex(currentIndex + 1)
        }
    }
    const decreaseCurrentIndex = () => {
        let length = quiz.questionlist.length;
        if (currentIndex <= 0) {
            return;
        } else {
            var ele = document.getElementsByName("radio");
            for (var i = 0; i < ele.length; i++)
                ele[i].checked = false;
            setCurrentIndex(currentIndex - 1)
        }
    }
    const updateAnswers = () => {
        let getSelectedValue = document.querySelector('input[name="radio"]:checked')
        if (getSelectedValue) {
            if (answers.answers.some(x => x.question === currentIndex)) {
                console.log('already present Updating it')
                let tempanswers = answers.answers;
                tempanswers[currentIndex] = {
                    question: currentIndex,
                    answer: getSelectedValue.value,
                }
                setAnswers({
                    answers: tempanswers,
                });
                // console.log(answers);
            } else {
                console.log('not present adding it')
                // setAnswers([...answers, {
                //     question: currentIndex,
                //     answer: getSelectedValue.value,
                // }]);
                setAnswers({
                    answers: [...answers.answers, {
                        question: currentIndex,
                        answer: getSelectedValue.value,
                    }]
                })
                // console.log(answers);
            }
        }
    }
    const submitQuiz = () => {
        let length = quiz.questionlist.length;
        let total = quiz.questionlist.length;
        let correct = 0;
        console.log(quiz)
        console.log(answers.answers)
        answers.answers.map(el => {
            let correctoption = quiz.questionlist[el.question].correctoption;
            let correctAnswer = quiz.questionlist[el.question].options[correctoption - 1];
            console.log(el.answer, correctAnswer)
            if (el.answer === correctAnswer) {
                console.log('Answer is Correct')
                correct++;
            } else {
                console.log('Wrong Answer')
            }
            // console.log(el.question,el.answer)
        })

        console.log(`Correct Answers :- ${correct}/${total}`)
        if (answers.answers.length !== length) {
            console.log(`comparing ${answers.length} with ${length - 1}`)
            alert('Fill The rest of the Quiz before Submission')
        }
        else {
            dispatch(action_SubmitQuiz({ classname: classname, answers: answers.answers, quizname: quizid, correct: correct, total: total }));
        }
    }
    return (
        <div className='quiz__container'>
            <div className='quiz__header'>
                <p>Quiz:- {quizid}</p>
                <div>
                    <p>Time:- 30 min</p>
                    <p>Total Questions:- {quiz?.questionlist?.length}</p>
                </div>
            </div>
            <div className='quiz__questions__container'>
                {
                    quiz && quiz.questionlist[currentIndex] && <div>
                        <div className='quiz__question'>
                            <p>{currentIndex + 1} . {quiz.questionlist[currentIndex].question}</p>
                        </div>
                        <div className='quiz__options'>
                            <ul>
                                {
                                    quiz.questionlist[currentIndex].options.map((el, index) => (
                                        <li key={index}>
                                            <label className="quiz__options__container" >{el}
                                                <input type="radio" name="radio" value={el} onChange={updateAnswers} />
                                                <span className="checkmark"></span>
                                            </label>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                }
            </div>
            <div>
                <button onClick={decreaseCurrentIndex}>Previous</button>
                <button onClick={increaseCurrentIndex}>Next</button>
            </div>
            <div className='quiz__footer'>
                <button id='quizsubmitbutton' onClick={submitQuiz}>Submit</button>
            </div>
        </div>
    )
}

export default Quiz
