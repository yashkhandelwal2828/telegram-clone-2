import React, { useState } from 'react';
import './Login2.css';
import { Button, Link } from '@material-ui/core';
import { auth, provider } from './firebase';
import { useStateValue } from './StateProvider';

function Login2() {
    const [username,setUsername] = useState('');
	const [password, setPassword] = useState('');
	const[state ,dispatch] = useStateValue();

	const handleLogin = () =>{
		auth
		.signInWithPopup(provider)
		.then((result) => {
				dispatch({
					type: 'SET_USER',
					user: result.user
				});
		})
		.catch((err) => alert(err.message));
	}

	const handleOfflineLogin = (e) =>{
		e.preventDefault();
		dispatch({
			type: 'SET_USER',
			user: {
				displayName: username,
				email: '',
				photoURL: '',
			}
		})
	}

	return (
		<div className="login">
			<div className="login__container">
				<h1>LOGIN</h1>
					<label>
						USERNAME:
						<input value={username} type="text" placeholder="USERNAME" onChange={e =>  setUsername(e.target.value)} />
					</label>
					<label>
						PASSWORD:
						<input password={password} type="password" placeholder="PASSWORD" onChange={e => setPassword(e.target.value)} />
					</label>
					<Button  onClick={handleOfflineLogin} type="submit" variant="contained" color="secondary">
						Sign In
					</Button>
                    <Link color="secondary" href='/'>Forgot your password? Click here</Link>
                    <Link  color="secondary" onClick={handleLogin}>Or Sign In with Google</Link>

			</div>
		</div>
	);
}

export default Login2;
