import React, { useEffect, useState, useContext } from 'react'
import styles from "./NewArticle.module.scss"
import { redirect, Navigate } from 'react-router-dom';


import { Editor } from "react-draft-wysiwyg";
import { EditorState } from 'draft-js';
import { convertToHTML } from 'draft-convert'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";


import { UserContext } from '../../../../../utils/Context/UserContext/UserContext';
import axios from 'axios';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


const NewArticle = ({ handleOpenAlert, changeAlertValues }) => {
  const {user} = useContext(UserContext);
  const [article, setArticle] = useState({
    title: '',
    category: '',
    preview: '',
    content : '',
    author: '',
  })
  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );
  const [idArticle, setIdArticle] = useState(null);
  const [articlePosted, setArticlePosted] = useState(false);

  useEffect(() => {
    let html = convertToHTML(editorState.getCurrentContent());
    setArticle(prevValues => ({...prevValues, content: html}))
  }, [editorState]);

  useEffect(() => {
    setArticle(prev => ({...prev, author: user?._id}))
  }, [user])

  const handleAddArticle = () => {
    try {
      if(article.title === '' || article.preview === '' || article.category === '' || article.content === '<p></p>') {
        handleOpenAlert()
        changeAlertValues('warning', "Il manque des informations pour ajouter l'article")
      }
      else {
        axios
          .post('/article', article)
          .then((res) => setIdArticle(res.data._id))
          .then(() => handleOpenAlert())
          .then(() => changeAlertValues('success', 'Article ajouté'))
          .then(() => {setArticlePosted(true)})
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
      {articlePosted ? <Navigate to={`/article/${idArticle}`} /> : <></>}
      <div className={styles.container}>
        <h2>Ajouter un article</h2>
        <div className={styles.title}>
          <TextField
            required
            label="Titre de l'article"
            sx={{width: '100%'}}
            value={article.title}
            onChange={e => setArticle(prevValues => ({...prevValues, title: e.target.value}) )}
          />
          <TextField
            required
            label="Catégorie de l'article"
            sx={{width: '100%'}}
            value={article.category}
            onChange={e => setArticle(prevValues => ({...prevValues, category: e.target.value}) )}
          />
        </div>

        <div className={styles.preview}>
          <TextField
            required
            label="Introduction de l'article"
            sx={{width: '100%'}}
            value={article.preview}
            onChange={e => setArticle(prevValues => ({...prevValues, preview: e.target.value}) )}
          />
        </div>

        <div className={styles.content}>
          <Editor
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            editorState={editorState}
            onEditorStateChange={setEditorState}
            placeholder='Reseignez votre article ici'
          />
        </div>
        
        <div className={styles.button_submit}>
          <Button variant="contained" color='primary' onClick={handleAddArticle}>Ajouter l'article</Button>
        </div>

      </div>
    </>
  )
}

export default NewArticle;