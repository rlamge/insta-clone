import React, {useState, useEffect} from 'react';
import Modal from '@material-ui/core/Modal';
import {Button, Input} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import './Header.css'
import { auth } from '../Firebase';

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

export default function Header({user, 
                                setUser, 
                                email, 
                                setEmail, 
                                username, 
                                setUsername, 
                                password, 
                                setPassword, 
                                open, 
                                setOpen, 
                                openSignIn, 
                                setOpenSignIn}) {

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

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    return (
        <>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
            >
                <div style={modalStyle} className={classes.paper}>
                    <form className="header__signup">
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
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <Input
                            placeholder="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Input
                            placeholder="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                    <form className="header__signup">
                        <center>
                        <img 
                            className="app__headerImage" 
                            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png">
                        </img>
                        </center>

                        <Input
                            placeholder="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Input
                            placeholder="password"
                            type="password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                        />
                        <Button style={{}} onClick={signIn}>Sign In</Button>
                    </form>
                </div>
            </Modal>

            <nav className="header"> 
                <img 
                    className="header__image" 
                    src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png">
                </img>  
                {
                user ? (
                    <Button style={{color: '#0095F6'}} onClick={() => auth.signOut()}>Logout</Button>
                ) : (
                    <div className="header__loginContainer">
                        <Button variant="contained" style={{backgroundColor: '#0095F6', color:'white', marginRight:'5px'}} onClick={() => setOpenSignIn(true)}>Sign In</Button>
                        <Button style={{color: '#0095F6'}} onClick={() => setOpen(true)}>Sign up</Button>
                    </div>
                )
                }
            </nav>
        </>
    )
}
