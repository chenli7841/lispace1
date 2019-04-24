import React, {useEffect, useState} from 'react';
import './App.css';
import CommandDialog from "./command/components/command-dialog";
import HtmlEditor from "./html-editor/components/html-editor";
import {Command, CommandType, subscribeToCommand} from "./services/command-service";

export default function App() {

  const [ screenX, setScreenX ] = useState('');
  const [ screenY, setScreenY ] = useState('');

  const onDragOver = (e: any) => {
    e.nativeEvent.preventDefault();
  };

  const onDrop = (e: any) => {
    setScreenX(e.nativeEvent.screenX);
    setScreenY(e.nativeEvent.screenY);
  };

  return <div style={{height: '100%' }} onDragOver={onDragOver}
  onDrop={onDrop}>
    <HtmlEditor />
    <CommandDialog screenX={screenX} screenY={screenY}/>
  </div>
}