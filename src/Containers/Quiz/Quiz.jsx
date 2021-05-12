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
    let questionno = 2;
    let questionText = 'Lorem ipsum asndlaksndlnas asjbdak dasld asld  sla d';
    const [filteredData, setFilteredData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    let questionList = [];
    // let answers = [];
    useEffect(() => {
        // console.dir(quiz);
    })
    const increaseCurrentIndex = () => {
        let length = quiz.questionlist.length;
        if (currentIndex >= length) {
            return;
        } else {
            let getSelectedValue = document.querySelector('input[name="radio"]:checked')
            if (getSelectedValue) {
                if (answers.some(x => x.question === currentIndex)) {
                    answers[currentIndex] = {
                        question: currentIndex,
                        answer: getSelectedValue.value,
                    }
                } else {
                    setAnswers([...answers, {
                        question: currentIndex,
                        answer: getSelectedValue.value,
                    }]);
                }
            }
            console.log(answers);
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
            setCurrentIndex(currentIndex - 1)
        }
    }
    const submitQuiz = () => {
        dispatch(action_SubmitQuiz({ classname: classname, answers: answers, quizname: quizid }));
        alert('Submission Successful');
    }
    return (
        <div className='quiz__container'>
            <div className='quiz__header'>
                <p>Quiz:- {quizid}</p>
                <p>Time:- 30 min</p>
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
                                                <input type="radio" name="radio" value={el} />
                                                <span className="checkmark"></span>
                                            </label>
                                        </li>
                                    ))
                                }
                                {/* <li>
                            <label className="quiz__options__container" >One
                                <input type="radio" name="radio" />
                                <span className="checkmark"></span>
                            </label>
                        </li>
                        <li>
                            <label className="quiz__options__container" >Two
                                <input type="radio" name="radio" />
                                <span className="checkmark"></span>
                            </label>
                        </li>
                        <li>
                            <label className="quiz__options__container" >Three
                                <input type="radio" name="radio" />
                                <span className="checkmark"></span>
                            </label>
                        </li>
                        <li>
                            <label className="quiz__options__container" >Four
                                <input type="radio" name="radio" />
                                <span className="checkmark"></span>
                            </label>
                        </li> */}
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
