import React, {useEffect, useState} from 'react';
import './word-card-editor.css'
import Button2 from "../../components/button2";
import {Command, CommandType, getLastCommand, subscribeToCommand} from "../../services/command-service";
import {getRandomQuestion, loadDictionary, Question, Word} from "../../repositories/word-repository";

export default function WordCardEditor() {
    const [top, setTop] = useState(40);
    const [left, setLeft] = useState(540);
    const [width, setWidth] = useState(300);
    const [height, setHeight] = useState(350);
    const [header, setHeader] = useState('deutsch-worte');
    const [questionObj, setQuestionObj] = useState<Question|undefined>(undefined);
    const [show, setShow] = useState(false);
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

    const getAnswer = (question: Question|undefined) => {
        if (showAnswer && question) {
            const word: Word = question.answer;
            if (word.type === 'noun') {
                const answerText = `${word.article} ${word.singular}, die ${word.plural}`;
                return <p className='card-editor-answer-paragraph'>{answerText}</p>
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
            <br/>
            <div className='card-editor-body'>
                <div>{getQuestion(questionObj)}</div>
                <div style={{width: '100%', height: '1px', backgroundColor: '#aaa'}} />
                <br/>
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