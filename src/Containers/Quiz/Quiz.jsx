import React from 'react'
import './Quiz.css';

function Quiz() {
    let questionno = 2;
    let questionText = 'Lorem ipsum asndlaksndlnas asjbdak dasld asld  sla d';
    const questionList = [];
    return (
        <div className='quiz__container'>
            <div className='quiz__header'>
                <p>Quiz:- Maths</p>
                <p>Time:- 30 min</p>
            </div>
            <div className='quiz__questions__container'>
                <div className='quiz__question'>
                    <p>{questionno} . {questionText}</p>
                </div>
                <div className='quiz__options'>
                    <ul>
                        <li>
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
                        </li>
                    </ul>
                </div>
            </div>
            <div className='quiz__footer'>
                <button id='quizsubmitbutton'>Submit</button>
            </div>
        </div>
    )
}

export default Quiz
