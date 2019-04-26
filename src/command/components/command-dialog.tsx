import React, {useEffect, useRef, useState} from 'react';
import './command-dialog.css';
import {
    Command,
    CommandText,
    CommandType,
    submitCommand, subscribeToCommand,
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
    const [ initializing, setInitializing ] = useState(true);
    const [ command, setCommand ] = useState('');
    const [ history, setHistory ] = useState(getCommandHistory());
    const ref = useRef(null);
    useEffect(() =>
        {
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
        if (command.type === CommandType.LISTFILES) {
            submitCommand({text: getFileNames().join(' '), type: 'response', id: 0});
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

    const getHistory = () => {
        return history.map(command => {
            if (command.type === 'command') {
                return <div key={command.id}>&gt; {command.text}</div>;
            } else if (command.type === "response") {
                return <div key={command.id}>{command.text}</div>;
            }
        });
    };

    return <div draggable
                onDragStart={onDragStart}
                style={style} className='command-dialog' ref={ref}>
        <div className='command-dialog-header'/>
        <div className='command-dialog-history'>
            {getHistory()}
        </div>
        <div className='command-dialog-input-row'><span>$</span><input type="text" onKeyDown={onSubmit} value={command} onChange={onInput} className='command-dialog-input'/></div>
    </div>
}