import React from 'react';
import './Login.css';
import { Button } from '@material-ui/core';
import { auth, provider } from './firebase';
import { useStateValue } from './StateProvider';
import { actionTypes } from './reducer';

function Login() {
	const [ state, dispatch ] = useStateValue();

	const signIn = () => {
		auth
			.signInWithPopup(provider)
			.then((result) => {
					dispatch({
						type: actionTypes.SET_USER,
						user: result.user
					});
			})
			.catch((err) => alert(err.message));
	};
	return (
		<div className="login">
			<div className="login__container">
				<img src="https://cdn.mos.cms.futurecdn.net/SDDw7CnuoUGax6x9mTo7dd-1024-80.jpg.webp" alt="" />
				<h1>Sign in to Yash Programmer HQ</h1>
				<Button onClick={signIn} className="button">
					Sign in with Google
				</Button>
			</div>
		</div>
	);
}

export default Login;
