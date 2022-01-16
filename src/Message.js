import React, { forwardRef, useEffect, useRef } from 'react';
import './Message.css';
import { useStateValue } from './StateProvider';

const Message = forwardRef(({ person, message, timestamp, email,image },ref)  => {
	const [ { user } ] = useStateValue();
	const isNotUser = person?.email === email;
	const isNotMessage = email !== user?.email && email !== person?.email;

	const messagesEndRef = useRef(null)
	
	
	const scrollToBottom = () => {
		messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
	}
	useEffect(scrollToBottom, [message]);

 
	return (
			<div>
				{!isNotUser ? (
					<div ref={ref} className="message">
						<span style={{marginLeft: "auto"}} className="message__timestamp">{new Date(timestamp?.seconds * 1000).toUTCString()}</span>
						{image === null ? <p className={`mesg ${!isNotUser && 'message__user'} ${isNotMessage && 'message_notUser'}`}>
							{message}
						</p> : 
							<img src={message} alt="" className="chat__image" />
						}
					</div>
				) : (
					<div ref={ref} className="message">
						{' '}
						{image === null ? <p  className={`mesg ${!isNotUser && 'message__user'} ${isNotMessage && 'message_notUser'}`}>
							{message}
						</p>: 
							<img src={message} alt="" className="chat__image" />
						}
						<span style={{marginRight: "auto"}} className="message__timestamp">{new Date(timestamp?.seconds * 1000).toUTCString()}</span>
					</div>
				)}

			<div ref={messagesEndRef} />
		</div>			
	);
});

export default Message;
