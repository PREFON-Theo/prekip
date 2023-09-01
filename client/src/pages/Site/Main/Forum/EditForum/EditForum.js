import React, { useEffect, useState, useContext } from 'react'
import styles from "./EditForum.module.scss"
import { Navigate, useParams } from 'react-router-dom';


import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";


import { UserContext } from '../../../../../utils/Context/UserContext/UserContext';
import axios from 'axios';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


const EditForum = ({ handleOpenAlert, changeAlertValues }) => {
  const {user, ready} = useContext(UserContext);
  const { id } = useParams();
  let forumRaw = {}

  
  const fetchForum = async () => { 
    forumRaw = await axios.get(`/forum/${id}`)
    setForum(forumRaw.data)
  }
  
  useEffect(() => {
    fetchForum();
  }, [])

  
  const [forumPosted, setForumPosted] = useState(false);
  

  const [forum, setForum] = useState({
    title: '',
    category: '',
    preview: '',
    content : '',
  })
  



  const handleEditForum = () => {
    try {
      if(forum.title === '' || forum.description === '') {
        handleOpenAlert()
        changeAlertValues('warning', "Il manque des informations pour modifier le forum")
      }
      else {
        //if(!!forum && user?._id === forum.author){
        axios
          .patch(`/forum/${id}`, {
            title: forum.title,
            description: forum.description,
            updated_at: new Date(),
          })
          .then(() => handleOpenAlert())
          .then(() => changeAlertValues('success', 'Forum modifié'))
          .then(() => {setForumPosted(true)})
        }
      //}

    }
    catch (err) {
      handleOpenAlert()
      changeAlertValues('error', err)
    }
  }

  return (
    <>
      {forumPosted ? <Navigate to={`/forum`} /> : <></>}
      {        
        ready === "waiting"
        ?
          <>Chargement...</>
        :
        ready === "no"
          ?
            <Navigate to ="/"/>
          :
          user?.roles.includes('Administrateur') || user?.roles.includes('Modérateur') || (!!forum && user?._id === forum.author)
            ?
              <div className={styles.container}>
                <h2>Modifier le forum</h2>
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
                    value={forum.preview}
                    onChange={e => setForum(prevValues => ({...prevValues, description: e.target.value}) )}
                  />
                </div>

                  <div className={styles.button_submit}>
                    <Button variant="contained" color='warning' onClick={handleEditForum}>Modifier le forum</Button>
                  </div>
              </div>
            :
              <Navigate to="/" />
      }
    </>
  )
}

export default EditForum;