import React, {useEffect} from 'react';
import './quiz-input.css';

interface Param {
    text: string,
    onChange: (e: string) => void
}

export default function QuizInput(param: Param) {

    const inputElementRefs: HTMLInputElement[] = [];

    useEffect(() => {
        inputElementRefs.forEach(elem => elem.value = '');
    }, [param.text]);

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.currentTarget.value.length === 1) {
            if (e.key !== 'Backspace' && e.key !== 'Tab') {
                e.preventDefault();
            }
        }
    };

    const onChange = (i: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.value.length === 1) {
            if (i < inputElementRefs.length - 1) {
                inputElementRefs[i + 1].focus();
            }
        }
        param.onChange(getUserInput());
    };

    const getUserInput = (): string => {
        const result = inputElementRefs.map(i => i.value).join('');
        return result;
    };

    const getInputElements = () => {
        return Array.from(param.text).map((c, i) => {
            if (c === ' ') {
                return <input type='text' key={i} className='quiz-input-single-char-disabled' value=' ' disabled={true}
                ref={(input) => {inputElementRefs.push(input!)}} />;
            }
            else {
                return <input type='text' className='quiz-input-single-char' key={i} size={1}
                ref={(input) => {inputElementRefs.push(input!)}} onKeyDown={onKeyDown} onChange={onChange(i)}/>;
            }
        })
    };

    return <div>{getInputElements()}</div>;
}