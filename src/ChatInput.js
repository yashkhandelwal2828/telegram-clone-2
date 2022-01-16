import React, { useState } from 'react';
import { useStateValue } from './StateProvider';
import db, { storage } from './firebase';
import firebase from 'firebase';
import './ChatInput.css';
import { useParams } from 'react-router-dom';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import AddIcon from '@material-ui/icons/Add';
import MicIcon from '@material-ui/icons/Mic';
import { Button } from '@material-ui/core';

function ChatInput() {
	const { userId } = useParams();
	const [ input, setInput ] = useState('');
	const [ { user } ] = useStateValue();
	const [ open, setOpen ] = useState(false);
	const [ image, setImage ] = useState(null);

	const sendMessage = (e) => {
		e.preventDefault();
		if (userId) {
		db.collection('user').onSnapshot((snapshot) => {
			snapshot.docs.map((doc) => {
				if (doc.data().email === user.email) {
					var id = doc.id;
					db
						.collection('user')
						.doc(id)
						.collection('friends')
						.doc(userId)
						.collection('messages')
						.add({
							email: user.email,
							message: input,
							timestamp: firebase.firestore.FieldValue.serverTimestamp(),
							username: user.displayName,
							userImage: user.photoURL,
							image: image!==null ? true : false
						})
						.then((doc) =>
						db.collection('user').doc(id).collection('friends').onSnapshot((snapshot) =>
							snapshot.docs.map((doc) => {
								if (doc.id === userId) {
									var em = doc.data().email;
									db.collection('user').onSnapshot((snapshot) =>
										snapshot.docs.map((doc) => {
										if (doc.data().email === em) {
											console.log('em-->', em);
											var uid = doc.id;
											db.collection('user')
											.doc(uid)
											.collection('friends')
											.onSnapshot((snapshot) =>
												snapshot.docs.map((doc) => {
													if (doc.data().email === user.email) {
														var user__id = doc.id;
														db.collection('user')
														.doc(uid)
														.collection('friends')
														.doc(user__id)
														.collection('messages')
														.add({
															email: user.email,
															message: input,
															timestamp: firebase.firestore.FieldValue.serverTimestamp(),
															username: user.displayName,
															userImage: user.photoURL,
															image: image!==null ? true : false
														});
													}
												})
											);
										}
										})
									);
								}
							})
						)
						
				);
				}
			});
		});
	}

	setInput('');
	setImage(null);
};

	const addEmoji = (e) => {
		let emoji = e.native;
		setInput(input + emoji);
	};

	const handleEmoji = () => {
		if (open) {
			setOpen(false);
		} else {
			setOpen(true);
		}
	};

	const handleChange = (e) => {
		console.log('e is -->', e.target.files[0]);
		if (e.target.files[0]) {
			setImage(e.target.files[0]);
			handleUpload(e.target.files[0]);
		}
	};


	const handleUpload = (image) =>{
		const uploadTask = storage.ref(`images/${image.name}`).put(image);
		uploadTask.on(
			"state_changed",
			(snapshot) =>{
				var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  				console.log('Upload is ' + progress + '% done');
			},
			(error)=>{
				console.log('errror-->', error);
				alert(error.message);
			},
			 () =>{
				storage.ref("images").child(image.name).getDownloadURL().then(url =>
					{
						setInput(url);
					}	
				)
			}
		)
	}

	return (
		<div className="chatInput">
			<div className="chatInput__top">
				<span className={`list ${open && 'emoji'}`}>
					<Picker onSelect={addEmoji} />
				</span>
			</div>
			<div className="chatInput__bottom">
				<form className="form1">
				<InsertEmoticonIcon className="smiley"  onClick={handleEmoji} />
					<input
						value={input}
						onChange={(e) => setInput(e.target.value)}
						type="text"
						placeholder="Type message here"
					/>
					<button type="submit" onClick={sendMessage}>
						Send
					</button>
					<MicIcon className="smiley" />
					<form>
						<label className="custom-file-upload">
							<AddIcon className="smiley" />
							<input type="file" onChange={handleChange} />
						</label>
						<Button onClick={handleUpload} className="upload__button">
							Send
						</Button>
					</form>
				</form>
			</div>
		</div>
	);
}

export default ChatInput;
