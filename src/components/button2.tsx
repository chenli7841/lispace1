import React, {useRef} from 'react';
import './button2.css';

export default function Button2() {

    const btnRef = useRef(null);
    const circleRef = useRef(null);
    const circleElem: HTMLSpanElement = circleRef.current!;

    const onClick = (e: React.MouseEvent) => {
        const btnElem: HTMLButtonElement = btnRef.current!;
        let x = e.pageX - btnElem.getBoundingClientRect().left;
        let y = e.pageY - btnElem.getBoundingClientRect().top;
        circleElem.style.left = x + 'px';
        circleElem.style.top = y + 'px';
        if (circleElem.className.indexOf(' button2-is-active') === -1) {
            setTimeout(() => {
                circleElem.className += ' button2-is-active';
            }, 10);
        }
    };

    const onAnimationEnd = (e: React.AnimationEvent) => {
        circleElem.className = circleElem.className.replace(' button2-is-active', '');
    };

    return <button className='button2' type='button' ref={btnRef}>
        <div className='button2-ripple' onClick={onClick} onAnimationEnd={onAnimationEnd}>
            <span className='button2-ripple-circle' ref={circleRef} />
        </div>
        Next
    </button>
}