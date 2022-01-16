import React, { useEffect, useState } from 'react';
import './SidebarOption.css';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import { Avatar, Button, IconButton } from '@material-ui/core';
import db from './firebase';
import { auth } from './firebase';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import clsx from 'clsx';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	paper: {
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3)
	},
	list: {
		width: 250
	},
	fullList: {
		width: 'auto'
	},
	root: {
		width: '100%',
		'& > * + *': {
			marginTop: theme.spacing(2)
		}
	}
}));

function SidebarOption({ Icon, text, selected }) {
	const [ email, setEmail ] = useState('');
	const classes = useStyles();
	const [ open, setOpen ] = React.useState(false);
	const currUser = auth.currentUser;
	// const [ identity, setIdentity ] = useState(null);
	const [ o, setO ] = useState(false);
	const [requests, setRequests] = useState([]);
	const [ state, setState ] = React.useState({
		top: false
	});
	// console.log('currUSer email is-->', currUser.email);

	useEffect(() =>{
		db.collection("user").onSnapshot(snapshot =>
			snapshot.docs.map((doc) =>{
				if(doc.data().email === currUser?.email){
					var uid = doc.id;
					db.collection("user").doc(uid).collection("requests").onSnapshot(snapshot=>
						setRequests(snapshot.docs.map(doc => doc.data()))
					)
				}
			})
			)
	},[currUser])

	const handleOpen = () => {
		console.log('open');
		if (text === 'Add a Friend') {
			setOpen(true);
		}
	};

	const handleClose = () => {
		setOpen(false);
	};

	const toggleDrawer = (anchor, open) => (event) => {
		if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
			return;
		}
		setState({ ...state, [anchor]: open });
	};

	const handleClose1 = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setO(false);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setO(true);
		handleClose();
		db.collection('user').onSnapshot((snapshot) =>
		snapshot.docs.map((doc) => {
			if (doc.data().email === email) {
				// console.log(doc.id);
				var uid = doc.id;
				 db.collection('user').doc(uid).collection('requests').add({
					// name: currUser.name,
					email: currUser.email,
					photo: currUser.photoURL,
					username: currUser.displayName
				 })
			} 
		})
	);

 
	};

	const handleTick = (em) =>{
		db.collection("user").onSnapshot(snapshot =>
			snapshot.docs.map((doc) =>{
				if(doc.data().email === currUser?.email){
					var uid = doc.id;
					db.collection("user").doc(uid).collection("requests").onSnapshot(snapshot=>
						snapshot.docs.map(doc => {
							if(doc.data().email === em){
								var _id = doc.id;
								db.collection("user").doc(uid).collection("requests").doc(_id).delete().then(() =>{
									console.log('item deleted successfully!!!');
									
								}).catch(() => console.log('deletion failure!'));
							}
						})
					)
				}
			})
			)
			db.collection('user').onSnapshot((snapshot) =>
			snapshot.docs.map(async (doc) => {
				if (doc.data().email === em) {
					// console.log('user is -->', doc.data());
					var f = doc.data();
					db.collection('user').onSnapshot((snapshot) =>
						snapshot.docs.map((doc) => {
							if (doc.data().email === currUser.email) {
								console.log('current user-->', doc.email);
								// setIdentity(doc.id);
								var uid = doc.id;
								console.log('friend is==>', f);
								db.collection('user').doc(uid).collection('friends').add({
									email: f.email,
									name: f.name,
									photoURL: f.photoURL
								});
							}
						})
					);
				} else {
					console.log('no user');
				}
			})
		
		);
		console.log('currUser is -->', currUser);
		db.collection("user").onSnapshot(snapshot => 
			snapshot.docs.map(doc =>{
				if(doc.data().email === em){
					var _id = doc.id;
					db.collection("user").doc(_id).collection("friends").add({
						email: currUser.email,
						name: currUser.displayName,
						photoURL: currUser.photoURL
					})
				}
			})	
			)
	};
	const handleCross = (em) =>{
		db.collection("user").onSnapshot(snapshot =>
			snapshot.docs.map((doc) =>{
				if(doc.data().email === currUser?.email){
					var uid = doc.id;
					db.collection("user").doc(uid).collection("requests").onSnapshot(snapshot=>
						snapshot.docs.map(doc => {
							if(doc.data().email === em){
								var _id = doc.id;
								db.collection("user").doc(uid).collection("requests").doc(_id).delete().then(() =>{
									console.log('item deleted successfully!!!');
								}).catch(() => console.log('deletion failure!'));
							}
						})
					)
				}
			})
			)
	}

	const list = (anchor) => (
		<div
			className={clsx(classes.list, {
				[classes.fullList]: anchor === 'top' || anchor === 'bottom'
			})}
			role="presentation"
			onClick={toggleDrawer(anchor, false)}
			onKeyDown={toggleDrawer(anchor, false)}
		>
			{requests.length > 0 ? (
				<List>
				{requests.map(request => (
						 <ListItem key={request.email}>
						 <ListItemIcon><Avatar src={request.photo} /></ListItemIcon>							
						 <ListItemText primary={request.username} />
						 <ListItemIcon><IconButton onClick={() => handleTick(request.email)} ><CheckCircleIcon fontSize="large" style={{"color": 'green'}} /></IconButton></ListItemIcon>
						 <ListItemIcon><IconButton onClick={() => handleCross(request.email)} ><CancelIcon fontSize="large" style={{"color": 'red'}}/></IconButton></ListItemIcon>
					 </ListItem>
				))}
				
			</List>
			) : (
				<h3>No requests pending</h3>
			)}
			
		 
		</div>
	);

	return (
		<div>
			<div className={`sideBarOption ${selected && 'sideBarOption-selected'}`} onClick={handleOpen}>
				<Icon />
				<h5>{text}</h5>
			</div>
			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				className={classes.modal}
				open={open}
				onClose={handleClose}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500
				}}
			>
				<Fade in={open}>
					<div className={classes.paper}>
						<form className={classes.root} noValidate autoComplete="off">
							<TextField
								id="standard-basic"
								label="Enter Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>{' '}
							<Button type="submit" variant="contained" onClick={(e) => handleSubmit(e)}>
								Add
							</Button>
						</form>
					
						<Button type="submit" variant="contained" color="primary" onClick={toggleDrawer('top', true)}>
							Friend Requests
						</Button>
						<SwipeableDrawer
							anchor={'top'}
							open={state['top']}
							onClose={toggleDrawer('top', false)}
							onOpen={toggleDrawer('top', true)}
						>
							{list('top')}
						</SwipeableDrawer>
					</div>
				</Fade>
			</Modal>
			<Snackbar open={o} autoHideDuration={6000} onClose={handleClose1}>
				<Alert onClose={handleClose1} severity="success">
					Friend Request Sent!
				</Alert>
			</Snackbar>
		</div>
	);
}

export default SidebarOption;
