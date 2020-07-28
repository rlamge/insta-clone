import React, {useState} from 'react';
import '../component/ImageUpload.css'
import firebase from "firebase";

import Modal from '@material-ui/core/Modal';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Fab from '@material-ui/core/Fab';

import { makeStyles } from '@material-ui/core/styles';
import {Button, Input} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';


import { db, storage } from '../Firebase';

const useStyles = makeStyles((theme) => ({

    appBar: {
        position:'sticky',
        top: 'auto',
        bottom: 0,
    },

    fabButton: {
        backgroundTint: 'blue',
        background:'transparent',
        boxShadow: 'none',
        position: 'absolute',
        zIndex: 1,
        left: 0,
        right: 0,
        margin: '0 auto',
    },

    paper: {
        position: 'absolute',
        width: '60vw',
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
      },
  }));

function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

function ImageUpload({username}) {

    const classes = useStyles();
    const [openUpload, setOpenUpload] = useState(false); 
    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState(null);

    const [modalStyle] = useState(getModalStyle);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = (e) => {
        e.preventDefault();
        const uploadTask = storage.ref(`/images/${image.name}`).put(image);
        
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.byteTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                if (image.name===null) {
                    alert('Null')
                }
                console.log(error);
                alert(error.message);
            },
            () => {
                storage
                .ref('images')
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username: username
                    });

                setProgress(0);
                setCaption("");
                setImage(null);
                setOpenUpload(false);

                })
            }
        )
    }

    return (
        <>
            <AppBar position="sticky" className={classes.appBar}>
                <Toolbar style={{background:"white" , borderTop: "1px solid lightgray"}}>
                    <Fab style={{backgroundColor:'transparent'}} color="secondary" aria-label="add" className={classes.fabButton}>
                        <AddIcon onClick={() => setOpenUpload(true)} style={{ color:'#0095F6'}}/>
                    </Fab>
                </Toolbar>
            </AppBar>

            <Modal
            open={openUpload}
            onClose={() => setOpenUpload(false)}
            >
                <div style={modalStyle} className={classes.paper}>
                    <div className="imageupload">
                        <center>
                            <img 
                                style={{marginBottom:"10px"}}
                                className="imageuplaod__headerImage" 
                                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png">
                            </img>
                        </center>
                        <progress style={{color:'green'}} className="imageupload__progress" value={progress} max="100" > </progress>
                        <Input
                            placeholder="Enter a caption..."
                            type="text"
                            value={caption}
                            onChange={event => setCaption(event.target.value)}
                        />
                        <Input
                            type="file"
                            onChange={handleChange}
                        />
                        <Button 
                            style={{marginTop:"10px"}}
                            onClick={handleUpload}>
                            Upload
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default ImageUpload
