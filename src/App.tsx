import React, {useState} from 'react';
import './App.css';
import CommandDialog from "./command/components/command-dialog";
import HtmlEditor from "./html-editor/components/html-editor";
import WordCardEditor from "./word-card-editor/components/word-card-editor";

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

  return <div style={{height: '100%', backgroundImage: `url('./background1.jpg')`, backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover', backgroundPosition: 'center'}} onDragOver={onDragOver}
  onDrop={onDrop}>
    <HtmlEditor />
    <WordCardEditor />
    <CommandDialog screenX={screenX} screenY={screenY}/>
  </div>
}