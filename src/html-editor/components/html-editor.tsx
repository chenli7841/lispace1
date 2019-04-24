import React, {useEffect, useState} from 'react';
import './html-editor.css';
import {Command, CommandType, getLastCommand, subscribeToCommand} from "../../services/command-service";
import {addNewFile, File, getFileContent} from "../../repositories/file-repository";

export default function HtmlEditor() {

    const [file, setFile] = useState({title: '', paragraphs: []} as File);
    const [top, setTop] = useState(40);
    const [left, setLeft] = useState(40);
    const [show, setShow] = useState(false);

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
        switch (command.type) {
            case CommandType.CREATE:
                addNewFile({title: command.args.fileName, paragraphs: []});
                setFile({title: command.args.fileName, paragraphs: []});
                break;
            case CommandType.OPEN:
                const paragraphs: string[] | undefined = getFileContent(command.args.fileName);
                if (paragraphs) {
                    setShow(true);
                    setFile({title: command.args.fileName, paragraphs: paragraphs!});
                }
                break;
        }
    };

    const getParagraphs = (paragraphs: string[]) => paragraphs.map((p, i) => <p key={i}>{p}</p>);

    const render = () => {
        if (show) return <div style={{left: left + 'px', top: top + 'px'}} className='html-editor-box'>
            <h3>{file.title}</h3><div>{getParagraphs(file.paragraphs)}</div>
        </div>;
        else return null;
    };

    return render();
}