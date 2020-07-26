import React, {useState, useEffect} from 'react';
import './App.css';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {Button, Input} from '@material-ui/core';

import InstagramEmbed from 'react-instagram-embed';

import Post from './component/Post';
import ImageUpload from './component/ImageUpload';

import { db, auth } from './Firebase';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: '60vw',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  
}));

function App() {


  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] =  useState(false);
  const [openSignIn, setOpenSignIn] = useState(false)
  const [username, setUsername] =  useState('');
  const [email, setEmail] =  useState('');
  const [password, setPassword] =  useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if (authUser) {
        // Logged in
        console.log(authUser)
        setUser(authUser)
      } else {
        // Logged out
        setUser(null);
      }
    })

    return () => {
      unsubscribe();
    }
  }, [user, username])

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({id: doc.id, post: doc.data()})));
    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));

    setOpen(false);
  }

  const signIn = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))

    setOpenSignIn(false);
  }

  return (
    <div className="App">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img 
                className="app__headerImage" 
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png">
              </img>
            </center>
            <Input
                placeholder="username"
                type="text"
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
            />

            <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
            />

            <Input
                placeholder="password"
                type="text"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
            />
            <Button onClick={signUp}>Sign up</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img 
                className="app__headerImage" 
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png">
              </img>
            </center>

            <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
            />

            <Input
                placeholder="password"
                type="text"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
            />
            <Button onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>
      <div className="app__header"> 
        <img 
          className="app__headerImage" 
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png">
        </img>  
        {
          user ? (
            <Button onClick={() => auth.signOut()} >Logout</Button>
          ) : (
            <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)} >Sign In</Button>
            <Button onClick={() => setOpen(true)} >Sign up</Button>
            </div>
          )
        }
      </div>

      <div className="app__posts">
        <div className="column app__postsLeft">
          {
            posts.map(({id, post}) => (
              <Post 
              key={id}
              postId={id}
              user={user}
              username={post.username} 
              caption={post.caption} 
              imageUrl={post.imageUrl}
              />
            ))
          }
        </div>
        <div className="column app_postsRight">
          <InstagramEmbed
            url='https://www.instagram.com/p/CDEi1aoBIFZ/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />

          <InstagramEmbed
            url='https://www.instagram.com/p/CDBwMX1BzSb/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />

          <InstagramEmbed
            url='https://www.instagram.com/p/CDF8AN4Im5Q/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>
      
      {user?.displayName ?
      (
      <ImageUpload username={user.displayName}/>
      ) : (
        <h3 className='app__loginmessage'>Sign In to upload Image</h3> 
      )}
    </div>
  );
}

export default App;