import React, {useRef} from 'react';
import './button2.css';

interface Param {
    text: string,
    onClick: () => void
}

export default function Button2(param: Param) {

    const btnRef = useRef(null);
    const circleRef = useRef(null);
    let circleElem: HTMLSpanElement = circleRef.current!;

    const onClick = (e: React.MouseEvent) => {
        const btnElem: HTMLButtonElement = btnRef.current!;
        let x = e.pageX - btnElem.getBoundingClientRect().left;
        let y = e.pageY - btnElem.getBoundingClientRect().top;
        if (!circleElem) {
            circleElem = circleRef.current!;
        }
        circleElem.style.left = x + 'px';
        circleElem.style.top = y + 'px';
        if (circleElem.className.indexOf(' button2-is-active') === -1) {
            setTimeout(() => {
                circleElem.className += ' button2-is-active';
            }, 10);
        }
        param.onClick();
    };

    const onAnimationEnd = () => {
        circleElem.className = circleElem.className.replace(' button2-is-active', '');
    };

    return <button className='button2' type='button' ref={btnRef}>
        <div className='button2-ripple' onClick={onClick} onAnimationEnd={onAnimationEnd}>
            <span className='button2-ripple-circle' ref={circleRef} />
        </div>
        {param.text}
    </button>
}