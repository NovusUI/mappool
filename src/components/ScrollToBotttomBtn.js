import React from 'react'


const ScrollToBotttomBtn =({ chatAreaRef }) => {
    const scrollToBottom = () => {
        
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    };
  
    return (
        <button className='chat-focus-btn' onClick={scrollToBottom}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 9l6 6 6-6"/>
            <path d="M6 16l6 6 6-6"/>
        </svg>
       </button>
    );
  };

export default ScrollToBotttomBtn
