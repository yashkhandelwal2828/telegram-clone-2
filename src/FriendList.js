import React, { useEffect, useState } from 'react';
import { Avatar } from '@material-ui/core';
import './FriendList.css';
import { useStateValue } from './StateProvider';
import { useHistory } from 'react-router-dom';
import db from './firebase';

function FriendList({ username, userImage, id }) {
	const [ { user } ] = useStateValue();
	const [ message, setMessage ] = useState('');
	const history = useHistory();
	const [selected, setSelected] = useState(false);

	useEffect(() => {
		db.collection('user').onSnapshot((snapshot) =>
			snapshot.docs.map((doc) => {
				if (doc.data().email === user.email) {
					var uid = doc.id;
					db
						.collection('user')
						.doc(uid)
						.collection('friends')
						.doc(id)
						.collection('messages')
						.orderBy('timestamp', 'desc')
						.onSnapshot((snapshot) =>
							// snapshot.docs.map(doc => console.log('messages are ', doc.data().message))
							setMessage(snapshot?.docs[0]?.data()?.message)
						);
				}
			})
		);
	}, [id, user.email]);

	const selectUser = () => {
		if (id) {
			history.push(`/chat/${id}`);
			setSelected(true);
		}
	};

	const isUser = user.photoURL === userImage;
	return (
		<div onClick={selectUser} className={`friendList ${isUser && 'none'}`}>
			<Avatar className="friendList__avatar" alt={username} src={userImage} />
			<div className="friendList__header">
				<h4>{username}</h4>
				<p className="friendList__message">{message}</p>
			</div>
		</div>
	);
}

export default FriendList;
