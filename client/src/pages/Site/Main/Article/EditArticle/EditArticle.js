import React, { useEffect, useState, useContext } from 'react'
import styles from "./EditArticle.module.scss"
import { Navigate, useParams, redirect } from 'react-router-dom';


import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
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

const rubriquesRaw = await axios.get("/rubrique-types")
const rubriqueList = rubriquesRaw.data
//let articleGet = false;

const EditArticle = ({ handleOpenAlert, changeAlertValues }) => {
  const {user, ready} = useContext(UserContext);
  const { id } = useParams();
  let articleRaw = {}

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  const fetchArticle = async () => { 
    articleRaw = await axios.get(`/article/${id}`)
    //console.log("author: ", articleRaw.data.author)
    setArticle({
      title: articleRaw.data?.title,
      category: articleRaw.data?.category,
      preview: articleRaw.data?.preview,
      content : articleRaw.data?.content,
    })
    
    setEditorState(
      EditorState.createWithContent(
        ContentState.createFromBlockArray(
          convertFromHTML(articleRaw.data?.content)
        )
      )
    )

    //articleGet = true;
    //console.log(articleGet)
  }
  
  useEffect(() => {
    fetchArticle();
  }, [])

  
  const [articlePosted, setArticlePosted] = useState(false);
  

  const [article, setArticle] = useState({
    title: '',
    category: '',
    preview: '',
    content : '',
  })
  

  useEffect(() => {
    let html = convertToHTML(editorState.getCurrentContent());
    setArticle(prevValues => ({...prevValues, content: html}))
  }, [editorState]);


  if(ready) {
    //console.log(ready)
    //console.log(articleGet)
    if(!user){
      handleOpenAlert()
      changeAlertValues("error", "Vous n'êtes pas connecté")
      return <Navigate replace to="/"/>
    }
    /*if(articleGet){
      console.log(articleRaw)
      if (user?._id !== articleRaw.data?.author){
        console.log(user?._id)
        console.log("author: ", articleRaw.data?.author)
        handleOpenAlert()
        changeAlertValues("error", "Vous n'êtes pas authorisé à modifier cet article")
        return <Navigate replace to="/"/>
      }
    }*/
  }



  const handleAddArticle = () => {
    try {
      if(article.title === '' || article.preview === '' || article.category === '' || article.content === '<p></p>') {
        handleOpenAlert()
        changeAlertValues('warning', "Il manque des informations pour ajouter l'article")
      }
      else {
        //if(user?._id !== articleRaw.data?.author){
        axios
          .patch(`/article/${id}`, {
            title: article.title,
            preview: article.preview,
            category: article.category,
            content: article.content,
            updated_at: new Date(),
          })
          .then(() => handleOpenAlert())
          .then(() => changeAlertValues('success', 'Article modifié'))
          .then(() => {setArticlePosted(true)})
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
      {articlePosted ? <Navigate to={`/article/${id}`} /> : <></>}
      <div className={styles.container}>
        <h2>Modifier l'article</h2>
        <div className={styles.title}>
          <TextField
            required
            label="Titre de l'article"
            sx={{width: '100%'}}
            value={article.title}
            onChange={e => setArticle(prevValues => ({...prevValues, title: e.target.value}) )}
          />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Catégorie de l'article</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={article.category}
              label="Catégorie de l'article"
              onChange={e => setArticle(prevValues => ({...prevValues, category: e.target.value}) )}
            >
              {rubriqueList.map((item, index) => (
                item.parent === "" 
                ? 
                  <MenuItem key={index} value={item._id} sx={{textAlign: 'left', fontWeight: 'bold'}}>{item.title}</MenuItem>
                :
                  <MenuItem key={index} value={item._id} sx={{textAlign: 'left', paddingLeft: "30px"}}>{item.title}</MenuItem>

              ))}
            </Select>
          </FormControl>
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
            defaultEditorState={article.content}
            editorState={editorState}
            onEditorStateChange={setEditorState}
            placeholder='Reseignez votre article ici'
          />
        </div>
          <div className={styles.button_submit}>
            <Button variant="contained" color='warning' onClick={handleAddArticle}>Modifier l'article</Button>
          </div>
      </div>
    </>
  )
}

export default EditArticle;