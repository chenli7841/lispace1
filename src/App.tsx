import React, {useEffect, useState} from 'react';
import './App.css';
import CommandDialog from "./command/components/command-dialog";
import HtmlEditor from "./html-editor/components/html-editor";
import WordCardEditor from "./word-card-editor/components/word-card-editor";
import {Command, CommandType, subscribeToCommand} from "./services/command-service";
import {getImageCount} from "./services/image-service";
import {
  getCategoryStore,
  getImageIndexStore,
  setCategoryStore,
  setImageIndexStore
} from "./repositories/image-repository";
import VerseNoteEditor from "./verse-note-editor/components/verse-note-editor";

export default function App() {

  const [ screenX, setScreenX ] = useState('');
  const [ screenY, setScreenY ] = useState('');
  const [ imageCategory, setImageCategory ] = useState('');
  const [ imageIndex, setImageIndex ] = useState(0);

  useEffect(() => {
    subscribeToCommand(onNewCommand);
    setImageCategory(getCategoryStore()!);
    setImageIndex(getImageIndexStore());
  }, []);

  const onNewCommand = (command: Command) => {
    let count: number | undefined;
    let index: number;
    switch (command.type) {
      case CommandType.GOTO:
        count = getImageCount(command.args);
        if (count) {
          setImageCategory(command.args);
          setCategoryStore(command.args);
          index = Math.ceil(Math.random()*count);
          setImageIndex(index);
          setImageIndexStore(index);
        }
        break;
      case CommandType.NEXTIMAGE:
        count = getImageCount(getCategoryStore()!);
        index = Math.ceil(Math.random()*count!);
        while (index === getImageIndexStore()) {
          index = Math.ceil(Math.random()*count!);
        }
        setImageIndex(index);
        setImageIndexStore(index);
        break;
    }
  };

  const onDragOver = (e: any) => {
    e.nativeEvent.preventDefault();
  };

  const onDrop = (e: any) => {
    setScreenX(e.nativeEvent.screenX);
    setScreenY(e.nativeEvent.screenY);
  };

  return <div style={{height: '100%', backgroundImage: `url('./${imageCategory}/${imageIndex}.jpg')`, backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover', backgroundPosition: 'center'}} onDragOver={onDragOver}
  onDrop={onDrop}>
    <HtmlEditor />
    <WordCardEditor />
    <VerseNoteEditor />
    <CommandDialog screenX={screenX} screenY={screenY}/>
  </div>
}