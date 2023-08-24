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
import Switch from '@mui/material/Switch';


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
  const [contentType, setContentType] = useState('');

  const [article, setArticle] = useState({
    title: '',
    category: '',
    preview: '',
    content : '',
    author: '',
    file: '',
    image: '',
    important: false
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


  if(ready === "no"){
    handleOpenAlert()
    changeAlertValues("error", "Vous n'êtes pas connecté")
    return <Navigate replace to="/"/>
  }

  const handleAddArticle = async () => {
    try {
      if(ready === "no"){
        handleOpenAlert()
        changeAlertValues("error", "Vous n'êtes pas connecté")
        return <Navigate replace to="/"/>
      }
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
        formData.append('image', article.image)
        formData.append('image', article.file)
        formData.append('type', contentType)
        formData.append('important', article.important)
        formData.append('created_at', new Date())
        formData.append('updated_at', new Date())

        const newArticle = await axios
          .post('/article/with-file', 
          formData, 
          {
            headers: {
              'content-type': 'multipart/form-data'
            }
          })
          setIdArticle(newArticle.data._id)
          handleOpenAlert()
          changeAlertValues('success', 'Article ajouté')
          setArticlePosted(true)
      }

    }
    catch (err) {
      handleOpenAlert()
      changeAlertValues('error', err)
    }
  }

  const handleAddActuality = async () => {
    try {
      if(ready === "no"){
        handleOpenAlert()
        changeAlertValues("error", "Vous n'êtes pas connecté")
        return <Navigate replace to="/"/>
      }
      if(article.title === '' || article.content === '<p></p>') {
        handleOpenAlert()
        changeAlertValues('warning', "Il manque des informations pour ajouter l'article")
      }
      else {
        const newActuality = await axios
          .post('/article', 
          {
            title: article.title,
            content: article.content,
            author: article.author,
            created_at: new Date(),
            updated_at: new Date(),
            type: contentType,
            important: article.important,
          })
          setIdArticle(newActuality.data._id)
          handleOpenAlert()
          changeAlertValues('success', 'Actualité ajoutée')
          setArticlePosted(true)
          console.log("4")

      }

    }
    catch (err) {
      handleOpenAlert()
      changeAlertValues('error', err)
    }
  }

  const handleAddReference = async () => {
    try {
      if(ready === "no"){
        handleOpenAlert()
        changeAlertValues("error", "Vous n'êtes pas connecté")
        return <Navigate replace to="/"/>
      }
      if(article.title === '' || article.category === '' || article.content === '<p></p>') {
        handleOpenAlert()
        changeAlertValues('warning', "Il manque des informations pour ajouter l'article")
      }
      else {
        const formData = new FormData()
        formData.append('title', article.title)
        formData.append('content', article.content)
        formData.append('category', article.category)
        formData.append('author', article.author)
        formData.append('image', article.file)
        formData.append('type', contentType)
        formData.append('created_at', new Date())
        formData.append('updated_at', new Date())

        const newArticle = await axios
          .post('/article/with-file', 
          formData, 
          {
            headers: {
              'content-type': 'multipart/form-data'
            }
          })
          setIdArticle(newArticle.data._id)
          handleOpenAlert()
          changeAlertValues('success', 'Contenu de référence ajouté')
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
      {articlePosted && contentType === 'article' ? 
        <Navigate to={`/article/${idArticle}`} />
      : articlePosted && contentType === 'actuality' ? 
        <Navigate to={`/actuality/${idArticle}`} />
      : articlePosted && contentType === 'reference' ? 
      <Navigate to={`/reference/${idArticle}`} />
      :
      <></>
      }
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <h2>Ajouter un article</h2>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Type de contenu</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={contentType}
              label="Type de contenu"
              onChange={e => setContentType(e.target.value)}
            >
                <MenuItem key={1} value={'article'} sx={{textAlign: 'left'}}>Article</MenuItem>
                <MenuItem key={2} value={'actuality'} sx={{textAlign: 'left'}}>Actualité</MenuItem>
                <MenuItem key={3} value={'reference'} sx={{textAlign: 'left'}}>Contenu de référence statique</MenuItem>
            </Select>
          </FormControl>
          {
            contentType === "article" ?
            <>
              <div>Article important ?  <Switch checked={article.important} onChange={(e) => setArticle(prev => ({...prev, important: e.target.checked}))}/></div>
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
                Ajouter un fichier
                <input
                  type="file"
                  onChange={(e) => setArticle(prevValues => ({...prevValues, file: e.target.files[0]}))}
                  hidden
                  accept='.pdf'
                />

              </Button>

              <div>{article.file?.name}</div>

              <Button
                variant="contained"
                component="label"
              >
                Ajouter une image
                <input
                  type="file"
                  onChange={(e) => setArticle(prevValues => ({...prevValues, image: e.target.files[0]}))}
                  hidden
                  accept='.jpg, .jpeg, .png'
                />

              </Button>

              <div>{article.image?.name}</div>

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
            </>
            : contentType === 'actuality' ?
              <>
                <div className={styles.preview}>
                  <TextField
                    required
                    label="Titre de l'actualité"
                    sx={{width: '100%'}}
                    value={article.title}
                    onChange={e => setArticle(prevValues => ({...prevValues, title: e.target.value}) )}
                  />
                </div>

                {/*<Button
                  variant="contained"
                  component="label"
                >
                  Ajouter un fichier
                  <input
                    type="file"
                    onChange={(e) => setArticle(prevValues => ({...prevValues, file: e.target.files[0]}))}
                    hidden
                    accept='.pdf'
                  />

                </Button>

                <div>{article.file?.name}</div>

                <Button
                  variant="contained"
                  component="label"
                >
                  Ajouter une image
                  <input
                    type="file"
                    onChange={(e) => setArticle(prevValues => ({...prevValues, image: e.target.files[0]}))}
                    hidden
                    accept='.jpg, .jpeg, .png'
                  />

                </Button>

                <div>{article.image?.name}</div>*/}

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
                  <Button variant="contained" color='primary' onClick={handleAddActuality}>Ajouter l'actualité</Button>
                </div>
              </>
              :
              contentType === 'reference' ?
              <>
                <div className={styles.title}>
                  <TextField
                    required
                    label="Titre du contenu"
                    sx={{width: '100%'}}
                    value={article.title}
                    onChange={e => setArticle(prevValues => ({...prevValues, title: e.target.value}) )}
                  />
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Catégorie du contenu</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={article.type}
                      label="Catégorie du contenu"
                      onChange={e => setArticle(prevValues => ({...prevValues, category: e.target.value}) )}
                    >
                      {rubriqueList.map((item, index) => (
                        <MenuItem key={index} value={item._id} sx={{textAlign: 'left', paddingLeft: item.parent === '' ? '' : "30px", fontWeight : item.parent === '' ? 'bold' : ''}}>{item.title}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <Button
                  variant="contained"
                  component="label"
                >
                  Ajouter un fichier
                  <input
                    type="file"
                    onChange={(e) => {
                      setArticle(prevValues => ({...prevValues, file: e.target.files[0]}))
                      console.log(e.target.files)
                    }}
                    hidden
                    accept='.pdf'
                  />

                </Button>

                <div>{article.file?.name}</div>


                <div className={styles.content}>
                  <Editor
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    editorState={editorState}
                    onEditorStateChange={setEditorState}
                    placeholder='Reseignez les informations ici'
                  />
                </div>
                
                <div className={styles.button_submit}>
                  <Button variant="contained" color='primary' onClick={handleAddReference}>Ajouter le contenu de référence</Button>
                </div>
              </>
              :
              <>
              </>
          }
        
        </div>
      </div>
    </>
  )
}

export default NewArticle;