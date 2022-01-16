import React from 'react';
import './Sidebar.css';
import Avatar from '@material-ui/core/Avatar';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import CallIcon from '@material-ui/icons/Call';
import PersonIcon from '@material-ui/icons/Person';
import ChatBubbleRoundedIcon from '@material-ui/icons/ChatBubbleRounded';
import GroupRoundedIcon from '@material-ui/icons/GroupRounded';
import SpeakerPhoneIcon from '@material-ui/icons/SpeakerPhone';
import SidebarOption from './SidebarOption';
import SettingsIcon from '@material-ui/icons/Settings';
import { useStateValue } from './StateProvider';
import { Button } from '@material-ui/core';
import { actionTypes } from './reducer';
import { slide as Menu } from "react-burger-menu";
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

 
function Sidebar() {
	const [{user}, dispatch] = useStateValue();
	const [checked, setChecked] = React.useState(false);

	const toggleChecked = () => {
	  setChecked((prev) => !prev);
	};

	const logout =() =>{
		localStorage.setItem('user', JSON.stringify(null));
		dispatch({
			type: actionTypes.SET_USER,
		 	user: null
		})
	}

	
	return (
		// <div className="sidebar">
			<Menu>
				<div className="sidebar__top">
				<Avatar className="header__avatar" alt={user?.displayName} src={user?.photoURL} />
					<h4>
						{user?.displayName}
						<FiberManualRecordIcon />
					</h4>
				</div>
				<hr />
				<div className="sidebar__middle">
					<SidebarOption Icon={ChatBubbleRoundedIcon} text="Messages" selected />
					<SidebarOption Icon={CallIcon} text="Calls" />
					<SidebarOption Icon={PersonIcon} text="Add a Friend" />
					<SidebarOption Icon={GroupRoundedIcon} text="New Group" />
					<SidebarOption Icon={SpeakerPhoneIcon} text="New Channel" />
					
				</div>
				<hr />
				<div className="sidebar__setting">
					<SidebarOption Icon={SettingsIcon} text="Settings" />
					<div className="sidebar__darkMode">
						
						{/* <p>{" "}</p> */}
						{/* <FormGroup> */}
						{/* <h5>Dark Mode</h5> */}
							{/* <FormControlLabel
								control={<Switch size="small" checked={checked} onChange={toggleChecked} />}
								label="Dark Mode"
							/>
						</FormGroup> */}
					</div>
				</div>
				<hr className="bottom" />
				<div className="sidebar__bottom">
					<div className="sidebarBottom__connection">
						<h5>Connection</h5>
					</div>
					<div className="sidebarBottom__copyright">
						<p>Telegram Desktop</p>
						<p>Version 3.0</p>
					</div>
					<Button className="bottom__button" onClick={logout}>Logout</Button>
				</div>
			</Menu>
		//  </div>
	);
}

export default Sidebar;