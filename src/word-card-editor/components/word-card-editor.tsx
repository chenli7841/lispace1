import React, {useEffect, useState} from 'react';
import './word-card-editor.css'
import Button2 from "../../components/button2";
import {Command, CommandType, getLastCommand, subscribeToCommand} from "../../services/command-service";

export default function WordCardEditor() {
    const [top, setTop] = useState(40);
    const [left, setLeft] = useState(540);
    const [width, setWidth] = useState(300);
    const [height, setHeight] = useState(350);
    const [header, setHeader] = useState('deutsch-worte');
    const [question, setQuestion] = useState(['bean']);
    const [answer, setAnswer] = useState(['die Bohne, die Bohnen']);
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
            }
        }
    }, []);

    const onNewCommand = (command: Command) => {
        switch (command.type) {
            case CommandType.CLOSE:
                setShow(false);
                break;
        }
    };

    const onShowAnswer = () => {
        setShowAnswer(true);
    };

    const getQuestion = (paragraphs: string[]) => paragraphs
        .map((p, i) =>
            <p className='card-editor-question-paragraph' key={i}>{p}</p>
        );

    const getAnswer = (paragraphs: string[]) => {
        if (showAnswer) {
            return paragraphs
                .map((p, i) =>
                    <p className='card-editor-answer-paragraph' key={i}>{p}</p>
                );
        } else
            return null;
    };

    if (true)
        return <div style={{left: left + 'px', top: top + 'px', width: width + 'px', height: height + 'px'}}
                    className='card-editor-box'>
            <h2 className='card-editor-title'>{header}</h2>
            <br/>
            <div className='card-editor-body'>
                <div>{getQuestion(question)}</div>
                <div style={{width: '100%', height: '1px', backgroundColor: '#aaa'}} />
                <br/>
                <div>{getAnswer(answer)}</div>
            </div>
            <div className='card-editor-button-bar'>
                <Button2 text='Check' onClick={onShowAnswer}/>
                <Button2 text='Next' onClick={onShowAnswer}/>
            </div>
        </div>;
    else
        return null;
}