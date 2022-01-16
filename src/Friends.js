import React, { useEffect, useState } from 'react';
import './Friends.css';
import SearchIcon from '@material-ui/icons/Search';
import db, { auth } from './firebase';
import Fuse from 'fuse.js';
import { useStateValue } from './StateProvider';
import FriendList from './FriendList';
import Sidebar from './Sidebar';

function Friends() {
	const [ { user } ] = useStateValue();
	const [ users, setUsers ] = useState([]);
	const [ query, setQuery ] = useState('');

	

	useEffect(
		() => {
			if (user) {
				const email = user.email;

				db.collection('user').where('email', '==', email).get().then((snapshot) => {
					if (snapshot.empty) {
						db.collection('user').add({
							name: user.displayName,
							email: user.email,
							photoURL: user.photoURL
						});
					} else {
						return user;
					}
				});
			}
		},
		[ user ]
	);

	useEffect(() => {
		db.collection('user').onSnapshot((snapshot) => 
			snapshot.docs.map((doc) =>{
				if(doc.data().email === user.email ){
					var uid = doc.id;
					// console.log('user.email-->', user.email)
					db.collection('user').doc(uid).collection("friends").onSnapshot(snapshot =>
						setUsers(
							snapshot.docs.map((doc) => ({
								id: doc.id,
								photoURL: doc.data().photoURL,
								name: doc.data().name
							}))
						)
					)
				}
			})
			
		);
	}, []);

	const fuse = new Fuse(users, {
		keys: [ 'name' ]
	});

	const results = fuse.search(query);
	const searchResults = query ? results.map((result) => result.item) : users;

	const handleChange = ({ currentTarget = {} }) => {
		const { value } = currentTarget;
		setQuery(value);
	};

	//  console.log('users-->',users);

	return (
		<div className="friends">
			<div className="friends__header">
				<div className="friends__search">
					<input type="text" placeholder="search" value={query} onChange={handleChange} />
					<SearchIcon className="chat__friends__searchIcon" />
				</div>
			</div>
			<Sidebar />

			{/* <hr /> */}
			{searchResults.map((person) => (
				<FriendList
					key={person.id}
					username={person.name}
					userImage={person.photoURL}
					id={person.id}
				/>
			))}
		</div>
	);
}

export default Friends;
