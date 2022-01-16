import React, { useEffect } from 'react';
import './App.css';
import Friends from './Friends';
import Chat from './Chat';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useStateValue } from './StateProvider';
import Login2 from './Login2';

// const useStyles = makeStyles({
// 	root:{
// 		height: "100vh",
// 		backgroundColor: "#292f47",
// 		color: "white"
// 	}
// })


function App() {
	const [ { user } ] = useStateValue();
	// const classes = useStyles();



	useEffect(() => {
		if (user) {
			localStorage.setItem('user', JSON.stringify(user));
		}
	});

	// const theme = createMuiTheme({
	// 	palette: {

	// 	// primary: green,
	// 	// secondary: green,
	// 	primary:{
	// 		main: '#1a1e2a'
	// 	}
	// }
	// });
	return (
		// <ThemeProvider>
		// <Paper style={{ height: '100vh' }}>
		<div>
			<Router>
				{!user ? (
					<Login2 />
				) : (
					<div className="app">
						{/* <div className="app__left">
							<Sidebar />
						</div>	 */}
						<div className="app__middle">
							<Friends />
						</div>
						<div className="app__right">
							<Switch>
								<Route path="/chat/:userId">
									<Chat />
								</Route>
								<Route path="/">
									<h1>Please click on your friends name and start chatting</h1>
								</Route>
							</Switch>
						</div>
					</div>
				)}
			</Router>
		</div>
		// </Paper>
		// </ThemeProvider>
	);
}

export default App;
