import React, {useEffect, useRef, useState} from 'react';
import './command-dialog.css';
import {
    Command,
    CommandText,
    CommandType,
    getLastCommand, sampleCommand,
    submitCommand,
    subscribeToCommand,
    subscribeToCommandHistory
} from "../../services/command-service";
import {getCommandHistory} from "../../repositories/command-repository";
import {getFileNames} from "../../repositories/file-repository";

interface Param {
    screenX: string,
    screenY: string
}

export default function CommandDialog(param: Param) {
    const [ dialogLeft, setDialogLeft ] = useState(0);
    const [ dialogTop, setDialogTop ] = useState(0);
    const [ initialX, setInitialX ] = useState(0);
    const [ initialY, setInitialY ] = useState(0);
    const [ style, setStyle ] = useState({});
    const [ minimize, setMinimize ] = useState(false);
    const [ showSample, setShowSample ] = useState(false);
    const [ initializing, setInitializing ] = useState(true);
    const [ command, setCommand ] = useState('');
    const [ history, setHistory ] = useState(getCommandHistory());
    const ref = useRef(null);
    useEffect(() => {
            if (ref.current) {
                const elem: HTMLDivElement = ref.current!;
                setDialogLeft(elem.offsetLeft);
                setDialogTop(elem.offsetTop);
                const newStyle = {
                    left: elem.offsetLeft + 'px',
                    top: elem.offsetTop + 'px'
                };
                setStyle(newStyle);
            }
            subscribeToCommandHistory(onUpdateHistory);
            subscribeToCommand(onNewCommand);
            const command: Command | undefined = getLastCommand();
            if (command) {
                switch (command.type) {
                    case CommandType.HIDEHISTORY:
                        setMinimize(true);
                        break;
                    case CommandType.SHOWHISTORY:
                        setMinimize(false);
                        break;
                }
            }
        },
        /*
        Empty array means only after initial render
        https://stackoverflow.com/questions/53120972/how-to-call-loading-function-with-react-useeffect-only-once
        */
        []);

    useEffect(() => {
        if (initializing) {
            return;
        }
        const newLeft = dialogLeft + (param.screenX === '' ? 0 : parseInt(param.screenX)) - initialX;
        setDialogLeft(newLeft);
        const newTop = dialogTop + (param.screenY === '' ? 0 : parseInt(param.screenY)) - initialY;
        setDialogTop(newTop);
        setStyle({
            left: newLeft + 'px',
            top: newTop + 'px'
        });
    }, [param.screenX, param.screenY]);

    const onNewCommand = (command: Command) => {
        switch (command.type) {
            case CommandType.LISTFILES:
                submitCommand({text: getFileNames().join(' '), type: 'response', id: 0});
                break;
            case CommandType.HIDEHISTORY:
                setMinimize(true);
                break;
            case CommandType.SHOWHISTORY:
                setMinimize(false);
                break;
        }
    };

    const onDragStart = (e: any) => {
        setInitializing(false);
        setInitialX(parseInt(e.nativeEvent.screenX));
        setInitialY(parseInt(e.nativeEvent.screenY));
    };

    const onSubmit = (e: any) => {
        if (e.nativeEvent.code === 'Enter') {
            submitCommand({text: command, type: "command", id: 0});
            setCommand('');
        }
    };

    const onInput = (e: React.FormEvent<HTMLInputElement>) => {
        setCommand(e.currentTarget.value);
    };

    const onUpdateHistory = (history: CommandText[]) => {
        setHistory(history);
    };

    const toggleListSampleCommand = () => {
        setShowSample(!showSample);
    };

    const onSelectSampleCommand = (cmd: string) => () => {
        setCommand(cmd);
        setShowSample(false);
    };

    const getListItems = () => {
        if (showSample) {
            return <div className='command-dialog-list-items'>
                {
                    sampleCommand.map((cmd, i) =>
                        <div key={i} className='command-dialog-list-item' onClick={onSelectSampleCommand(cmd)}>{cmd}</div>)
                }
            </div>;
        } else {
            return null;
        }
    };

    const getHistory = () => {
        const getItems = () => {
            return history.map(command => {
                if (command.type === 'command') {
                    return <div key={command.id}>&gt; {command.text}</div>;
                } else if (command.type === "response") {
                    return <div key={command.id}>{command.text}</div>;
                }
            });
        };
        if (minimize)
            return null;
        else
            return <div className='command-dialog-history'>{getItems()}</div>;
    };

    return <div draggable
                onDragStart={onDragStart}
                style={style} className='command-dialog' ref={ref}>
        {getHistory()}
        <div className='command-dialog-input-row'>
            <span>$</span>
            <input type="text" onKeyDown={onSubmit} value={command} onChange={onInput} className='command-dialog-input'/>
            <button className='command-dialog-list-button' onClick={toggleListSampleCommand}>&#9660;</button>
            {getListItems()}
        </div>
    </div>
}