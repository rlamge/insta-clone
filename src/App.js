import React, {useState, useEffect} from 'react';
import './App.css'

import Embedding from './component/Embedding'
import Header from './component/Header'

import Post from './component/Post';
import ImageUpload from './component/ImageUpload';

import { db } from './Firebase';

function App() {

  const [posts, setPosts] = useState([]);
  const [open, setOpen] =  useState(false);
  const [openSignIn, setOpenSignIn] = useState(false)
  const [username, setUsername] =  useState('');
  const [email, setEmail] =  useState('');
  const [password, setPassword] =  useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({id: doc.id, post: doc.data()})));
    })
  }, []);

  return (
    <div className="App">

      {/* Header */}
      <Header 
        user = {user}
        setUser = {setUser}
        username = {username}
        setUsername = {setUsername}
        password = {password}
        setPassword = {setPassword}
        email = {email}
        setEmail = {setEmail}
        openSignIn = {openSignIn}
        setOpenSignIn = {setOpenSignIn}
        open = {open}
        setOpen = {setOpen}
      />

      {/* Posts */}
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

        {/* Embedding */}
        <div className="column app_postsRight">
          <Embedding />
        </div>

      </div>

      {/* Image Upload */}
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