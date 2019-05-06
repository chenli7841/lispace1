import React, {useEffect, useState} from 'react';
import './card-editor.css'
import Button2 from "../../components/button2";
import {Command, CommandType, getLastCommand, subscribeToCommand} from "../../services/command-service";

export default function CardEditor() {
    const [top, setTop] = useState(40);
    const [left, setLeft] = useState(540);
    const [width, setWidth] = useState(300);
    const [height, setHeight] = useState(250);
    const [header, setHeader] = useState('deutsch-worte');
    const [question, setQuestion] = useState(['bean']);
    const [answer, setAnswer] = useState(['die Bohne, die Bohnen']);
    const [show, setShow] = useState(false);

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

    const getQuestion = (paragraphs: string[]) => paragraphs
        .map((p, i) =>
            <p className='card-editor-question-paragraph' key={i}>{p}</p>
        );

    const getAnswer = (paragraphs: string[]) => paragraphs
        .map((p, i) =>
            <p className='card-editor-answer-paragraph' key={i}>{p}</p>
        );
    if (show)
        return <div style={{left: left + 'px', top: top + 'px', width: width + 'px', height: height + 'px'}}
                    className='card-editor-box'>
            <h2 className='card-editor-title'>{header}</h2>
            <div className='card-editor-body'>
                <div>{getQuestion(question)}</div>
                <div>{getAnswer(answer)}</div>
            </div>
            <div className='card-editor-button-bar'>
                <Button2/>
            </div>
        </div>;
    else
        return null;
}