import React, {useEffect, useState} from 'react';
import './verse-note-editor.css';
import {getVerseNotesStore, VerseNote} from "../../repositories/verse-note-repository";
import {Command, CommandType, getLastCommand, subscribeToCommand} from "../../services/command-service";
import {addNewFile, File, updateFileContent} from "../../repositories/file-repository";
import {isNumeric} from "../../utils/utils";

export default function VerseNoteEditor() {

    const [file, setFile] = useState({title: '', paragraphs: []} as File<VerseNote[]>);
    const [top, setTop] = useState(40);
    const [left, setLeft] = useState(40);
    const [width, setWidth] = useState(400);
    const [height, setHeight] = useState(650);
    const [newInput, setNewInput] = useState('');
    const [edit, setEdit] = useState(true);
    const [show, setShow] = useState(false);

    useEffect(() => {
        subscribeToCommand(onNewCommand);
        const lastCommand = getLastCommand();
        let verseNotes: VerseNote[] | undefined = undefined;
        if (lastCommand) {
            switch (lastCommand.type) {
                case CommandType.OPEN:
                    if (lastCommand.args.ext === 'verse') {
                        verseNotes = getVerseNotesStore(lastCommand.args.fileName);
                        if (verseNotes) {
                            setShow(true);
                            setFile({title: lastCommand.args.fileName, paragraphs: verseNotes!});
                        }
                    }
                    break;
                case CommandType.EDIT:
                    verseNotes = getVerseNotesStore(lastCommand.args.fileName);
                    if (verseNotes) {
                        setFile({title: lastCommand.args.fileName, paragraphs: verseNotes!});
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
        let verses: VerseNote[] | undefined = undefined;
        switch (command.type) {
            case CommandType.CREATE:
                if (command.args.ext === 'verse') {
                    addNewFile({title: command.args.fileName, paragraphs: []});
                    setFile({title: command.args.fileName, paragraphs: []});
                    setEdit(true);
                    setShow(true);
                }
                break;
            case CommandType.OPEN:
                if (command.args.ext === 'verse') {
                    verses = getVerseNotesStore(command.args.fileName);
                    if (verses) {
                        setFile({title: command.args.fileName, paragraphs: verses!});
                        setEdit(false);
                        setShow(true);
                    }
                }
                break;
            case CommandType.EDIT:
                if (command.args.ext === 'verse') {
                    verses = getVerseNotesStore(command.args.fileName);
                    if (verses) {
                        setFile({title: command.args.fileName, paragraphs: verses!});
                        setEdit(true);
                        setShow(true);
                    }
                }
                break;
            case CommandType.CLOSE:
                setShow(false);
                break;
        }
    };

    const onNewInputChange = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const text = e.currentTarget.innerText;
        setNewInput(text);
    };

    const onKeyDownNewInput = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        if (newInput.trim() === '') return;
        let verse: number|undefined = undefined;
        let chapter: number|undefined = undefined;
        const positionText = newInput.split(' ')[0];
        if (positionText !== undefined) {
            const chapterText = positionText.split(':')[0];
            const verseText = positionText.split(':')[1];
            if (isNumeric(chapterText) && isNumeric(verseText)) {
                chapter = parseInt(chapterText);
                verse = parseInt(verseText);
            }
        }
        const newVerseNote: VerseNote = { text: newInput, notes: [], chapter: chapter, verse: verse };
        const allContent = updateFileContent(file.title, [...file.paragraphs, newVerseNote]);
        if (allContent) {
            setFile({title: file.title, paragraphs: allContent});
            setNewInput('');
            e.currentTarget.innerText = '';
        }
    };

    const getVerseNotesElement = () => file.paragraphs.map((n, i) => {
        return <p key={i}>{n.text}</p>;
    });

    const getNewVerseInputElement = () => {
        if (edit) {
            return <div className='verse-note-editor-input' contentEditable={true} onKeyUp={onNewInputChange} onKeyDown={onKeyDownNewInput} />;
        } else {
            return null;
        }
    };

    if (show) {
        return <div style={{left: left + 'px', top: top + 'px', width: width + 'px', height: height + 'px'}}
                    className='verse-note-editor-box'>
            <h2>{file.title}</h2>
            {getVerseNotesElement()}
            {getNewVerseInputElement()}
        </div>
    } else
        return null;
}