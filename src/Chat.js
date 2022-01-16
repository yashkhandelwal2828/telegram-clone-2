import React, { useState, useEffect } from "react";
import "./Chat.css";
import { useHistory, useParams } from "react-router-dom";
import {
  Avatar,
  Button,
  List,
  ListItem,
  makeStyles,
  SwipeableDrawer,
} from "@material-ui/core";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import db, { auth } from "./firebase";
import Message from "./Message";
import ChatInput from "./ChatInput";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import VideocamIcon from "@material-ui/icons/Videocam";
import { IconButton } from "@material-ui/core";
import FlipMove from "react-flip-move";
import CallIcon from "@material-ui/icons/Call";
import { useStateValue } from "./StateProvider";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
// import MuiAlert from "@material-ui/lab/Alert";
import clsx from "clsx";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
// import { animateScroll as scroll } from 'react-scroll';  

// function Alert(props) {
//   return <MuiAlert elevation={6} variant="filled" {...props} />;
// }

const useStyles = makeStyles((theme) => ({
  modal: {
    backgroundColor: "#1a1e2a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
//   theme.palette.background.paper
  paper: {
    backgroundColor: "#1a1e2a",
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  list: {
    width: 460,
  },
  fullList: {
    width: "auto",
  },
  root: {
    width: "100%",
    // backgroundColor: '#1a1e2a',
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

function Chat() {
  // const [{user}, dispatch] = useStateValue();
  const classes = useStyles();
  const { userId } = useParams();
  const [{ user }] = useStateValue();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const history = useHistory();
  const [userDetails, setUserDetails] = useState(null);
  const [userMessages, setUserMessages] = useState([]);
  // const [success, setSuccess] = useState(false);


  useEffect(() => {
    if (userId) {
      db.collection("user").onSnapshot((snapshot) =>
        snapshot.docs.map((doc) => {
          if (doc.data().email === user.email) {
            var uid = doc.id;
            db.collection("user")
              .doc(uid)
              .collection("friends")
              .doc(userId)
              .onSnapshot((snapshot) => {
                setUserDetails(snapshot.data());
              });
          }
        })
      );

      db.collection("user").onSnapshot((snapshot) =>
        snapshot.docs.map((doc) => {
          if (doc.data().email === user.email) {
            var uid = doc.id;
            db.collection("user")
              .doc(uid)
              .collection("friends")
              .doc(userId)
              .collection("messages")
              .orderBy("timestamp", "asc")
              .onSnapshot((snapshot) => {
                setUserMessages(
                  snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                  }))
                );
              });
            }
          })

      );
    }
  }, [user.email, userId]);
  

  // useEffect(() =>{
  //   // const isImage=(message)=>{
  //   //   var path = message;
  //   //   new Promise(resolve => {
  //   //     const img = new Image();
  //   //     img.onload = () => resolve({path, status: 'ok'}, setSuccess(true));
  //   //     img.onerror = () => resolve({path, status: 'error'}, setSuccess(false));
    
  //   //     img.src = path;
  
  //   //   });
  //   //   if(success === true){
  //   //     return true;
  //   //   }
  //   //   return false;
  
  //   // }
  //   userMessages.forEach(function (element) {
  //     element.data.image = isImage(element.data.message);
  //   });
  // },[userMessages, success])

 
  // console.log('usremessages-->', userMessages);
 
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleRemoveFriend = () => {
    setAnchorEl(null);
    db.collection("user").onSnapshot((snapshot) =>
      snapshot.docs.map((doc) => {
        if (doc.data().email === userDetails?.email) {
          var uid = doc.id;
          db.collection("user")
            .doc(uid)
            .collection("friends")
            .onSnapshot((snapshot) =>
              snapshot.docs.map((doc) => {
                if (doc.data().email === user.email) {
                  var pid = doc.id;
                  // db.collection("user")
                  //   .doc(uid)
                  //   .collection("friends")
                  //   .doc(pid)
                  //   .collection("messages")
                  //   .delete()
                  //   .then(() => {
                  //     console.log("user deleted");
                  //     history.push("/	");
                  //   })
                  //   .catch(() => console.log("Error deleting user"));
                  db.collection("user")
                    .doc(uid)
                    .collection("friends")
                    .doc(pid)
                    .delete()
                    .then(() => {
                      console.log("user deleted");
                      history.push("/	");
                    })
                    .catch(() => console.log("Error deleting user"));
                  
                }
              })
            );
        }
      })
    );
    // 
    // 
    db.collection("user").onSnapshot((snapshot) =>
      snapshot.docs.map((doc) => {
        if (doc.data().email === user.email) {
          var uid = doc.id;
          db.collection("user")
            .doc(uid)
            .collection("friends")
            .doc(userId)
            .delete()
            .then(() => {
              console.log("User Deleted Successfully");
              history.push("/");
            })
            .catch(() => console.log("User not deleted"));
        }
      })
    );
  };

  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  // const handleScroll = () =>{
  //     scroll.scrollToBottom()
  // }

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <div>
        <div className="profile__header">
          <Avatar
            className="profile__header__avatar"
            alt={userDetails?.displayName}
            src={userDetails?.photoURL}
          />
          <h4>{userDetails?.name}</h4>
          <hr />
        </div>
	  	<div className="profile__info">
			  <InfoOutlinedIcon />
			<p style={{marginLeft: "20px"}}>{userDetails?.email}</p>
		</div>
      </div>
    </div>
  );

 


  // useEffect(() =>{
  
  // },[]);
  console.log('usremessages-->', userMessages[0]);
 
  return (
    <div className="chat">
      <div className="chat__container">
        <div className="chat__Header">
          <div onClick={toggleDrawer("right", true)} className="chat__HeaderLeft">
            <Avatar
              className="chat__avatar"
              alt={userDetails?.name}
              src={userDetails?.photoURL}
            />
            <p>
              {userDetails?.name}
              <FiberManualRecordIcon />
            </p>
          </div>
          <SwipeableDrawer
                anchor={"right"}
                open={state["right"]}
                onClose={toggleDrawer("right", false)}
                onOpen={toggleDrawer("right", true)}
              >
                {list("right")}
          </SwipeableDrawer>
          <div className="chat__HeaderRight">
            <IconButton>
              <VideocamIcon className="header__button" />
            </IconButton>
            <IconButton>
              <CallIcon className="header__button" />
            </IconButton>
            <IconButton onClick={handleClick}>
              <MoreHorizIcon className="header__button" />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={toggleDrawer("right", true)}>Profile</MenuItem>
              <SwipeableDrawer
                anchor={"right"}
                open={state["right"]}
                onClose={toggleDrawer("right", false)}
                onOpen={toggleDrawer("right", true)}
              >
                {list("right")}
              </SwipeableDrawer>
              {/* <MenuItem onClick={handleClose}>My account</MenuItem> */}
              <MenuItem onClick={handleRemoveFriend}>Remove Friend</MenuItem>
            </Menu>
          </div>
        </div>
        <div className="chat__messages">
          <div className="chatMesssages__text">
            <FlipMove>
              {userMessages.map((messages) => 
              // console.log(messages?.data),
                <Message
                  key={messages.id}
                  message={messages.data.message}
                  email={messages.data.email}
                  person={userDetails}
                  timestamp={messages.data.timestamp}
                  image={messages?.data?.image && true}
                />
              )}
            </FlipMove>
            {/* <Button onClick={handleScroll}>Scroll to bottom</Button> */}
          </div>
          <div className="chatMessages__input">
            <ChatInput />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
