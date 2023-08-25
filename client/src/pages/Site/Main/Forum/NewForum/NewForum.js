import React, { useEffect, useState, useContext } from 'react'
import styles from "./NewForum.module.scss"
import { Navigate } from 'react-router-dom';


import { Editor } from "react-draft-wysiwyg";
import { EditorState } from 'draft-js';
import { convertToHTML } from 'draft-convert'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";


import { UserContext } from '../../../../../utils/Context/UserContext/UserContext';
import axios from 'axios';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';



const NewForum = ({ handleOpenAlert, changeAlertValues }) => {
  const {user, ready} = useContext(UserContext);

  const [forum, setForum] = useState({
    title: '',
    description: '',
    author: '',
  })

  const [idForum, setIdForum] = useState(null);
  const [forumPosted, setForumPosted] = useState(false);


  useEffect(() => {
    setForum(prev => ({...prev, author: user?._id}))
  }, [user])

  if(ready === "yes") {
    if(!user){
      handleOpenAlert()
      changeAlertValues("error", "Vous n'êtes pas connecté")
      return <Navigate replace to="/"/>
    }
  }

  const handleAddForum = () => {
    try {
      if(forum.title === '' || forum.description === '') {
        handleOpenAlert()
        changeAlertValues('warning', "Il manque des informations pour ajouter le forum")
      }
      else {

        axios
          .post('/forum', forum)
          .then((res) => setIdForum(res.data._id))
          .then(() => handleOpenAlert())
          .then(() => changeAlertValues('success', 'Article ajouté'))
          .then(() => {setForumPosted(true)})
          .catch((e) => changeAlertValues('error', e)) 
      }

    }
    catch (err) {
      handleOpenAlert()
      changeAlertValues('error', err)
    }
  }

  return (
    <>
      {forumPosted ? <Navigate to={`/forum`} /> : <></>}
      <div className={styles.container}>
        <h2>Ajouter un forum</h2>
        <div className={styles.preview}>
          <TextField
            required
            label="Titre du forum"
            sx={{width: '100%'}}
            value={forum.title}
            onChange={e => setForum(prevValues => ({...prevValues, title: e.target.value}) )}
          />
        </div>

        <div className={styles.preview}>
          <TextField
            required
            label="Description du forum"
            sx={{width: '100%'}}
            value={forum.description}
            onChange={e => setForum(prevValues => ({...prevValues, description: e.target.value}) )}
          />
        </div>

        
        <div className={styles.button_submit}>
          <Button variant="contained" color='primary' onClick={handleAddForum}>Ajouter le forum</Button>
        </div>

      </div>
    </>
  )
}

export default NewForum;