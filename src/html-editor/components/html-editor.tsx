import React, {useEffect, useState} from 'react';
import './html-editor.css';
import {Command, CommandType, getLastCommand, subscribeToCommand} from "../../services/command-service";
import {addNewFile, File, getFileContent, updateFileContent} from "../../repositories/file-repository";

export default function HtmlEditor() {

    const [file, setFile] = useState({title: '', paragraphs: []} as File);
    const [top, setTop] = useState(40);
    const [left, setLeft] = useState(40);
    const [show, setShow] = useState(false);
    const [edit, setEdit] = useState(false);
    const [newInput, setNewInput] = useState('');

    useEffect(() => {
        subscribeToCommand(onNewCommand);
        const lastCommand = getLastCommand();
        if (lastCommand) {
            switch (lastCommand.type) {
                case CommandType.CREATE:
                    addNewFile({title: lastCommand.args.fileName, paragraphs: []});
                    setFile({title: lastCommand.args.fileName, paragraphs: []});
                    break;
                case CommandType.OPEN:
                    const paragraphs: string[] | undefined = getFileContent(lastCommand.args.fileName);
                    if (paragraphs) {
                        setShow(true);
                        setFile({title: lastCommand.args.fileName, paragraphs: paragraphs!});
                    }
                    break;
            }
        }

    }, []);

    const onNewCommand = (command: Command) => {
        let paragraphs: string[] | undefined = undefined;
        switch (command.type) {
            case CommandType.CREATE:
                addNewFile({title: command.args.fileName, paragraphs: []});
                setFile({title: command.args.fileName, paragraphs: []});
                setEdit(true);
                setShow(true);
                break;
            case CommandType.OPEN:
                paragraphs = getFileContent(command.args.fileName);
                if (paragraphs) {
                    setFile({title: command.args.fileName, paragraphs: paragraphs!});
                    setEdit(false);
                    setShow(true);
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
        }
    };

    const getParagraphs = (paragraphs: string[]) => paragraphs.map((p, i) => <p key={i}>{p}</p>);

    const onInputChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
        setNewInput(e.currentTarget.value);
    };

    const onTypeEnter = (e: React.FormEvent<HTMLTextAreaElement>) => {
        const event: any = e.nativeEvent;
        if (event.key !== 'Enter') return;
        e.nativeEvent.preventDefault();
        if (newInput.trim() === '') return;
        const allContent = updateFileContent(file.title, [...file.paragraphs, newInput]);
        console.log(allContent);
        if (allContent) {
            setFile({title: file.title, paragraphs: allContent!});
            setNewInput('');
        }
    };

    const getEditor = () => {
        if (edit) {
            return <textarea className='html-editor-input' value={newInput} onChange={onInputChange} onKeyDown={onTypeEnter} />;
        } else {
            return null;
        }
    };

    const render = () => {
        if (show) return <div style={{left: left + 'px', top: top + 'px'}} className='html-editor-box'>
            <h3>{file.title}</h3>
            <div>
                {getParagraphs(file.paragraphs)}
                {getEditor()}
            </div>
        </div>;
        else return null;
    };

    return render();
}