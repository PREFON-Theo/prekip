import React, { useEffect, useState, useContext } from 'react'
import styles from "./EditArticle.module.scss"
import { Navigate, useParams } from 'react-router-dom';


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
import Switch from '@mui/material/Switch';

const cookieToken = document.cookie.split(';').map(v => v.split('=')).reduce((acc, v) => {
  acc[decodeURIComponent(v[0]?.trim())] = decodeURIComponent(v[1]?.trim() || '');
  return acc;
}, {})

const rubriquesRaw = await axios.get("/rubrique-type", {headers: {jwt: cookieToken.token}})
const rubriqueList = rubriquesRaw.data || []

const EditArticle = ({ handleOpenAlert, changeAlertValues }) => {
  const {user, ready, cookies} = useContext(UserContext);
  const { id } = useParams();

  const [redirection, setRedirection] = useState(false)

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  const fetchArticle = async () => { 
    const articleRaw = await axios.get(`/article/${id}`, {headers: {jwt: cookies.token}})
    setArticle({
      title: articleRaw.data?.title,
      category: articleRaw.data?.category,
      preview: articleRaw.data?.preview,
      content : articleRaw.data?.content,
      important : articleRaw.data?.important,
      author : articleRaw.data?.author,
    })
    
    setEditorState(
      EditorState.createWithContent(
        ContentState.createFromBlockArray(
          convertFromHTML(articleRaw.data?.content)
        )
      )
    )

    if(ready === "no"){
      setRedirection(true)
      handleOpenAlert()
      changeAlertValues("error", "Vous n'êtes pas connecté")
    }
    else if (ready === "yes"){
      if(!user?.roles.includes("Administrateur") && !user?.roles.includes("Modérateur") && user?._id !== articleRaw.data.author){
        console.log("non")
        setRedirection(true)
        handleOpenAlert()
        changeAlertValues("warning", "Vous n'êtes pas autorisé à accédez à cette page")
      }
    }

  }
  
  useEffect(() => {
    fetchArticle()
  }, [ready])

  
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


  if(ready === "no" || (ready === "yes" && !user)) {
      handleOpenAlert()
      changeAlertValues("error", "Vous n'êtes pas connecté")
      return <Navigate replace to="/"/>
  }



  const handleAddArticle = async () => {
    try {
      if(article.title === '' || article.preview === '' || article.category === '' || article.content === '<p></p>') {
        handleOpenAlert()
        changeAlertValues('warning', "Il manque des informations pour modifier l'article")
      }
      else {
        await axios
          .patch(`/article/${id}`, {
            title: article.title,
            preview: article.preview,
            category: article.category,
            content: article.content,
            updated_at: new Date(),
            important: user?.roles.includes('Administrateur') || user?.roles.includes('Modérateur') ? article.important : false,
            updated_by: user._id
          }, {headers: {jwt: cookies.token}})
          handleOpenAlert()
          changeAlertValues('success', 'Article modifié')
          setArticlePosted(true)
        }

    }
    catch (err) {
      handleOpenAlert()
      changeAlertValues('error', err)
    }
  }

  return (
    <>
      {redirection ? <Navigate to={'/'}/> : <></>}
      {articlePosted ? <Navigate to={`/article/${id}`} /> : <></>}
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <h2>Modifier l'article</h2>
          {user?.roles.includes('Administrateur') || user?.roles.includes('Modérateur') ? <div>Article important ? {article.important === true ? "Oui" : "Non" } <Switch checked={article.important} onChange={(e) => setArticle(prev => ({...prev, important: e.target.checked}))}/></div> : <></>}
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
      </div>
    </>
  )
}

export default EditArticle;