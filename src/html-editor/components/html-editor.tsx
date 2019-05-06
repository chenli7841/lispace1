import React, {useEffect, useState} from 'react';
import './html-editor.css';
import {Command, CommandType, getLastCommand, subscribeToCommand} from "../../services/command-service";
import {addNewFile, File, getFileContent, updateFileContent} from "../../repositories/file-repository";

export default function HtmlEditor() {

    const [file, setFile] = useState({title: '', paragraphs: []} as File);
    const [top, setTop] = useState(40);
    const [left, setLeft] = useState(40);
    const [width, setWidth] = useState(400);
    const [height, setHeight] = useState(650);
    const [show, setShow] = useState(false);
    const [edit, setEdit] = useState(false);
    const [newInput, setNewInput] = useState('');

    useEffect(() => {
        subscribeToCommand(onNewCommand);
        const lastCommand = getLastCommand();
        let paragraphs: string[] | undefined = undefined;
        if (lastCommand) {
            switch (lastCommand.type) {
                case CommandType.OPEN:
                    paragraphs = getFileContent(lastCommand.args.fileName);
                    if (paragraphs) {
                        setShow(true);
                        setFile({title: lastCommand.args.fileName, paragraphs: paragraphs!});
                    }
                    break;
                case CommandType.SETWIDTH:
                    setWidth(lastCommand.args.width);
                    break;
                case CommandType.SETHEIGHT:
                    setHeight(lastCommand.args.height);
                    break;
                case CommandType.EDIT:
                    paragraphs = getFileContent(lastCommand.args.fileName);
                    if (paragraphs) {
                        setFile({title: lastCommand.args.fileName, paragraphs: paragraphs!});
                        setEdit(true);
                        setShow(true);
                    }
                    break;
                case CommandType.CLOSE:
                    setShow(false);
                    break;
            }
        }

    }, []);

    const onNewCommand = (command: Command) => {
        let paragraphs: string[] | undefined = undefined;
        switch (command.type) {
            case CommandType.CREATE:
                if (command.args.ext === undefined || command.args.ext === 'txt') {
                    addNewFile({title: command.args.fileName, paragraphs: []});
                    setFile({title: command.args.fileName, paragraphs: []});
                    setEdit(true);
                    setShow(true);
                }
                break;
            case CommandType.OPEN:
                if (command.args.ext === undefined || command.args.ext === 'txt') {
                    paragraphs = getFileContent(command.args.fileName);
                    if (paragraphs) {
                        setFile({title: command.args.fileName, paragraphs: paragraphs!});
                        setEdit(false);
                        setShow(true);
                    }
                }
                break;
            case CommandType.EDIT:
                paragraphs = getFileContent(command.args.fileName);
                if (paragraphs) {
                    setFile({title: command.args.fileName, paragraphs: paragraphs!});
                    setEdit(true);
                    setShow(true);
                }
                break;
            case CommandType.SETWIDTH:
                setWidth(command.args.width);
                break;
            case CommandType.SETHEIGHT:
                setHeight(command.args.height);
                break;
            case CommandType.CLOSE:
                setShow(false);
                break;
        }
    };

    const getParagraphs = (paragraphs: string[]) => paragraphs
        .map((p, i) =>
            <p className='html-editor-paragraph'
               onBlur={onUpdateParagraph(i)} onClick={onEditParagraph} contentEditable={false} key={i}>{p}</p>
        );

    const onUpdateParagraph = (i: number) => (e: React.FormEvent<HTMLParagraphElement>) => {
        e.currentTarget.contentEditable = 'false';
        const newFile = {...file};
        newFile.paragraphs = [...file.paragraphs];
        newFile.paragraphs[i] = e.currentTarget.innerText;
        updateFileContent(newFile.title, newFile.paragraphs);
        setFile(newFile);
    };

    const onEditParagraph = (e: React.FormEvent<HTMLParagraphElement>) => {
        e.currentTarget.contentEditable = 'true';
    };

    const onInputChange = (e: React.FormEvent<HTMLDivElement>) => {
        const text = e.currentTarget.innerText;
        setNewInput(text);
    };

    const onTypeEnter = (e: React.FormEvent<HTMLDivElement>) => {
        const event: any = e.nativeEvent;
        if (event.key !== 'Enter') return;
        e.nativeEvent.preventDefault();
        if (newInput.trim() === '') return;
        const allContent = updateFileContent(file.title, [...file.paragraphs, newInput]);
        if (allContent) {
            setFile({title: file.title, paragraphs: allContent!});
            setNewInput('');
            e.currentTarget.innerText = '';
        }
    };

    const getEditor = () => {
        if (edit) {
            return <div className='html-editor-input' contentEditable={true} onKeyUp={onInputChange} onKeyDown={onTypeEnter} />;
        } else {
            return null;
        }
    };

    const render = () => {
        if (show) return <div style={{left: left + 'px', top: top + 'px', width: width + 'px', height: height + 'px'}} className='html-editor-box'>
            <h2>{file.title}</h2>
            <div>
                {getParagraphs(file.paragraphs)}
                {getEditor()}
            </div>
        </div>;
        else return null;
    };

    return render();
}