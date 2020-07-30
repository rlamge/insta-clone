import React, {useState, useEffect} from 'react';
import firebase from "firebase";
import Avatar from '@material-ui/core/Avatar';
import '../component/Post.css'

import {db} from '../Firebase'

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {Button} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

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

    root: {
        '& > *': {
          margin: theme.spacing(1),
          fontWeight: 'bolder'
        },
      },

      child: {   
          marginLeft: "100px",
          fontSize: '10px',
        },

      small: {
        width: theme.spacing(3.5),
        height: theme.spacing(3.5),
        marginLeft: '5px',
      },

      delbutton: {
        margin: theme.spacing(0),
        width: theme.spacing(0),
        height: theme.spacing(0),
        color:'#0095F6'
      }

  }));

function Post({postId, username, caption, imageUrl, user}) {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [openDeletePost, setOpenDeletePost] =  useState(false);

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe=db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot)=>{
                    setComments(snapshot.docs.map((doc)=>doc.data()));
            });
        }
        return () => {
            unsubscribe();
        };
    }, [postId]);

    const postComment = (event) => {
        event.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }

    const deletePost = () => {
            db.collection("posts").doc(postId).delete()
            .then(function() {
                alert("Post successfully deleted!");
            }).catch(function(error) {
                alert("Error deleting post");
            });

            setOpenDeletePost(false);
    }

    return (
        <div className="post">
            <Modal
                open={openDeletePost}
                onClose={() => setOpenDeletePost(false)}
            >
                <div style={modalStyle} className={classes.paper}>
                    <div className="post__parentdelete">
                        <h4 className="post__deletemessage">This post will be permanently deleted. Do you want to continue?</h4>
                        <Button size= "small" color="primary" className={classes.root} onClick={deletePost}>Delete</Button>
                    </div>
                </div>
            </Modal>

            <div className="post__header">
                <div className="post__headerleft">
                    <Avatar className={classes.small}
                        alt= "" 
                        src="/static/images/avatar/1.jpg" 
                        />
                    <h4 className="post__username"> {username} </h4>
                </div>

                <div className="post__deletebutton">
                    {user?.displayName===username &&
                        (
                            <IconButton className={classes.delbutton} onClick={() => setOpenDeletePost(true)} aria-label="delete">
                                <DeleteIcon fontSize="small"/>
                            </IconButton>
                        // {/* <Button className={classes.child} disabled={user.displayName!==username} onClick={() => setOpenDeletePost(true)}>Delete</Button> */}
                    )}
                </div>
            </div>
            
            <img className="post__image" src={imageUrl}></img>

            <h4 style={{color:'#454545'}} className="post__text"><strong className="post__captionusername">{username} </strong> {caption}</h4>

            <div className="post__comments">
                {
                comments.map((comment) => (
                        <p style={{color:'#454545', marginBottom:"5px"}}>
                             <strong className="post__commentusername">{comment.username}</strong> {comment.text}
                        </p>
                    ))  
                }
            </div>

            {user && (
                <form className="post__commentBox">
                    <input
                    className="post__input"
                    type="text"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    >
                    </input>

                    <button 
                    className="post__button"
                    disabled={!comment}
                    type="submit"
                    onClick={postComment}
                    >
                    Post    
                    </button>
                </form>
            )}

        </div>
    )
}

export default Post