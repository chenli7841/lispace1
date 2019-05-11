import React, {useEffect, useState} from 'react';
import './word-card-editor.css'
import Button2 from "../../components/button2";
import {Command, CommandType, getLastCommand, subscribeToCommand} from "../../services/command-service";
import {getRandomQuestion, loadDictionary, Question, Word} from "../../repositories/word-repository";
import QuizInput from "../../components/quiz-input";

export default function WordCardEditor() {
    const [top, setTop] = useState(40);
    const [left, setLeft] = useState(540);
    const [width, setWidth] = useState(300);
    const [height, setHeight] = useState(450);
    const [header, setHeader] = useState('deutsch-worte');
    const [questionObj, setQuestionObj] = useState<Question|undefined>(undefined);
    const [show, setShow] = useState(false);
    const [userSingularAnswer, setUserSingularAnswer] = useState('');
    const [userPluralAnswer, setUserPluralAnswer] = useState('');
    const [showAnswer, setShowAnswer] = useState(false);

    useEffect(() => {
        subscribeToCommand(onNewCommand);
        const lastCommand = getLastCommand();
        if (lastCommand) {
            switch (lastCommand.type) {
                case CommandType.CLOSE:
                    setShow(false);
                    break;
                case CommandType.OPEN:
                    if (lastCommand.args.ext === 'dict') {
                        loadDictionary(lastCommand.args.fileName);
                        setQuestionObj(getRandomQuestion());
                        setShow(true);
                    }
                    break;
            }
        }
    }, []);

    const onNewCommand = (command: Command) => {
        switch (command.type) {
            case CommandType.CLOSE:
                setShow(false);
                break;
            case CommandType.OPEN:
                if (command.args.ext === 'dict') {
                    loadDictionary(command.args.fileName);
                    setQuestionObj(getRandomQuestion());
                    setShow(true);
                }
                break;
        }
    };

    const onShowAnswer = () => {
        setShowAnswer(true);
    };

    const onNext = () => {
        setShowAnswer(false);
        setQuestionObj(getRandomQuestion());
    };

    const getQuestion = (question: Question|undefined) => {
        if (question) {
            return <p className='card-editor-question-paragraph'>{question.ask}</p>;
        } else {
            return null;
        }
    };

    const getTestArea = () => {
        if (!questionObj) {
            return null;
        }

        const onUserSingularAnswerChange = (e: string) => {
            setUserSingularAnswer(e);
        };

        const onUserPluralAnswerChange = (e: string) => {
            setUserPluralAnswer(e);
        };

        const getSingular = () => {
            if (questionObj && questionObj.answer.singular) {
                return  <div className='word-card-editor-quiz-row'>
                    Singular:
                    {questionObj.answer.singular ? <QuizInput text={`${questionObj.answer.article!} ${questionObj.answer.singular}`}
                    onChange={onUserSingularAnswerChange}/> : null}
                </div>
            } else return null;
        };

        const getPlural = () => {
            if (questionObj && questionObj.answer.plural) {
                return <div className='word-card-editor-quiz-row'>
                    Plural:
                    {questionObj.answer.plural? <QuizInput text={`die ${questionObj.answer.plural}`}
                    onChange={onUserPluralAnswerChange}/> : null}
                </div>
            }
        };

        return <div style={{paddingBottom: '15px'}}>
            {getSingular()}
            {getPlural()}
        </div>
    };

    const getAnswer = (question: Question|undefined) => {
        if (showAnswer && question) {
            const word: Word = question.answer;
            if (word.type === 'noun') {
                const answerText = `${word.article} ${word.singular}, die ${word.plural}`;
                return <div>
                    <div style={{width: '100%', height: '2px', backgroundColor: '#aaa'}} />
                    <p className='card-editor-answer-paragraph'>{answerText}</p>
                </div>
            } else {
                return null;
            }
        } else
            return null;
    };

    if (show)
        return <div style={{left: left + 'px', top: top + 'px', width: width + 'px', height: height + 'px'}}
                    className='card-editor-box'>
            <h2 className='card-editor-title'>{header}</h2>
            <div className='card-editor-body'>
                <div>{getQuestion(questionObj)}</div>
                <div style={{width: '100%', height: '1px', backgroundColor: '#aaa'}} />
                <br/>
                {getTestArea()}
                <div>{getAnswer(questionObj)}</div>
            </div>
            <div className='card-editor-button-bar'>
                <Button2 text='Check' onClick={onShowAnswer}/>
                <Button2 text='Next' onClick={onNext}/>
            </div>
        </div>;
    else
        return null;
}