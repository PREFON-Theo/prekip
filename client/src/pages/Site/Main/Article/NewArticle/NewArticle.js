import React, { useEffect, useState, useContext } from 'react'
import styles from "./NewArticle.module.scss"
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

const rubriquesRaw = await axios.get("/rubrique-type")
const rubriqueList = []
Object.values(rubriquesRaw)[0].filter((rub) => rub.parent === '').map((item) => {
  rubriqueList.push(item)
  Object.values(rubriquesRaw)[0].filter((rubC) => rubC.parent === item._id).map((itemC) => {
    rubriqueList.push(itemC)
  })
})


const NewArticle = ({ handleOpenAlert, changeAlertValues }) => {
  const {user, ready} = useContext(UserContext);

  const [article, setArticle] = useState({
    title: '',
    category: '',
    preview: '',
    content : '',
    author: '',
    file: '',
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

  if(ready) {
    if(!user){
      handleOpenAlert()
      changeAlertValues("error", "Vous n'êtes pas connecté")
      return <Navigate replace to="/"/>
    }
  }

  const handleAddArticle = () => {
    try {
      if(article.title === '' || article.preview === '' || article.category === '' || article.content === '<p></p>') {
        handleOpenAlert()
        changeAlertValues('warning', "Il manque des informations pour ajouter l'article")
      }
      else {
        const formData = new FormData()
        formData.append('title', article.title)
        formData.append('preview', article.preview)
        formData.append('content', article.content)
        formData.append('category', article.category)
        formData.append('author', article.author)
        formData.append('file', article.file)
        axios
          .post('/article', {
            title: article.title,
            preview: article.preview,
            category: article.category,
            content: article.content,
            created_at: new Date(),
            updated_at: new Date(),
            author: user._id,
          })
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

  const changeInputFiles = (e) => {
    let arrFiles = [...e.target.files]
    console.log(typeof arrFiles)
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
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Catégorie de l'article</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={article.type}
              label="Catégorie de l'article"
              onChange={e => setArticle(prevValues => ({...prevValues, category: e.target.value}) )}
            >
              {rubriqueList.map((item, index) => (
                <MenuItem key={index} value={item._id} sx={{textAlign: 'left', paddingLeft: item.parent === '' ? '' : "30px", fontWeight : item.parent === '' ? 'bold' : ''}}>{item.title}</MenuItem>
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

        <Button
          variant="contained"
          component="label"
        >
          Upload File
          <input
            type="file"
            onChange={(e) => setArticle(prevValues => ({...prevValues, file: e.target.files[0]}))}
            hidden
            // accept='.pdf'
          />

        </Button>

        {/* <div>{article.file?.name}</div> */}

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