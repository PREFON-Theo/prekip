import React, { useEffect, useState, useContext } from 'react'
import styles from "./NewArticle.module.scss"
import { Navigate } from 'react-router-dom';


import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';


import { UserContext } from '../../../../../utils/Context/UserContext/UserContext';
import axios from 'axios';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import Switch from '@mui/material/Switch';


const NewArticle = ({ handleOpenAlert, changeAlertValues }) => {
  const {user, ready, cookies} = useContext(UserContext);
  const [contentType, setContentType] = useState('');
  const sizeMax = 3;

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

  const [fileError, setFileError] = useState("")
  const [imageError, setImageError] = useState("")

  const [rubrique, setRubrique] = useState();
  
  const fetchRubriques = async () => {
    const rubriqueRaw = await axios.get('/rubrique-type', {headers: {jwt: cookies.token}});
    const rubriqueList = []
    rubriqueRaw.data?.filter((rl) => rl.parent === '').map((item) => {
      if(user?.roles.includes("Administrateur") || user?.roles.includes("Modérateur") || user?.divisions.includes(item._id)){
          rubriqueList.push(item)
          rubriqueRaw.data?.filter((srl) => srl.parent === item._id).map((subItem) => rubriqueList.push(subItem))
      }
    })
    setRubrique(rubriqueList);
  }

  useEffect(() => {
    fetchRubriques();
  },[])

  useEffect(() => {
    let html = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    setArticle(prevValues => ({...prevValues, content: html}))
  }, [editorState]);

  useEffect(() => {
    setArticle(prev => ({...prev, author: user?._id}))
  }, [user])


  if(ready === "no" || (ready === "yes" && !user)) {
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
        formData.append('important', user?.roles.includes('Administrateur') ? article.important : false)
        formData.append('created_at', new Date())
        formData.append('updated_at', new Date())
        formData.append('fileName', article.file.name)
        formData.append('imageName', article.image.name)

        console.log(formData)

        const newArticle = await axios
          .post('/article/with-file', 
          formData, 
          {
            headers: {
              'content-type': 'multipart/form-data',
              jwt: cookies.token
            }
          })
          setIdArticle(newArticle.data._id)
          handleOpenAlert()
          changeAlertValues('success', 'Article ajouté')
          setArticlePosted(true)
      }

    }
    catch (err) {
      //handleOpenAlert()
      //changeAlertValues('error', err)
      console.log(err)
    }
  }

  const checkIfFileIsCorrect = (file, type) => {
    console.log(file)
    if(type === 'image'){
      setImageError('')
      if(file?.size / 1000000 > sizeMax){
        setImageError((prev) => `${prev} L'image est trop lourde: (${file.size/1000000}Mo). `)
      }
      else if (!["image/png", "image/jpg", "image/jpeg"].includes(file?.type)){
        setImageError((prev) => `${prev} L'image doit être une image type: '.png', '.jpg' ou '.jpeg'.`)
      }
      else {
        setArticle(prevValues => ({...prevValues, image: file}))
      }
    }
    else if (type === "file") {
      setFileError('')
      if(file?.size / 1000000 > sizeMax){
        setFileError((prev) => `${prev} Le fichier est trop lourd: (${file.size/1000000}Mo). `)
      }
      else if (![
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ].includes(file?.type)) {
        setFileError((prev) => `${prev} Le fichier doit être du type : '.pdf', '.pptx', '.docx' ou '.xlsx'.`)
      }
      else {
        setArticle(prevValues => ({...prevValues, file: file}))
      }
    }
    else {
      handleOpenAlert()
      changeAlertValues('error', `Error: type = ${type}`)
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
        changeAlertValues('warning', "Il manque des informations pour ajouter l'actualité")
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
            important: user?.roles.includes('Administrateur') ? article.important : false,
          }, {headers: {jwt: cookies.token}})
          setIdArticle(newActuality.data._id)
          handleOpenAlert()
          changeAlertValues('success', 'Actualité ajoutée')
          setArticlePosted(true)

      }

    }
    catch (err) {
      //handleOpenAlert()
      //changeAlertValues('error', err)
      console.log(err)
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
        changeAlertValues('warning', "Il manque des informations pour ajouter le contenu de référence")
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
        formData.append('fileName', article.file.name)

        const newArticle = await axios
          .post('/article/with-file', 
          formData, 
          {
            headers: {
              'content-type': 'multipart/form-data',
              jwt: cookies.token
            }
          })
          setIdArticle(newArticle.data._id)
          handleOpenAlert()
          changeAlertValues('success', 'Contenu de référence ajouté')
          setArticlePosted(true)
      }

    }
    catch (err) {
      //handleOpenAlert()
      //changeAlertValues('error', err)
      console.log(err)
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
          <h2>Ajouter {contentType === "article" ? "un article" : contentType === "actuality" ? "une actualité" : contentType === 'reference' ? "un contenu de référence" : ""}</h2>

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
              {user?.roles.includes('Administrateur') ? <div>Article important ?  <Switch checked={article.important} onChange={(e) => setArticle(prev => ({...prev, important: e.target.checked}))}/></div> : <></>}
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
                    {rubrique?.map((item, index) => (
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
                  onChange={(e) => checkIfFileIsCorrect(e.target.files[0], "file")}
                  hidden
                  accept='.pdf, .pptx, .xlsx, .docx'
                />

              </Button>

              <div>La taille du fichier ne doit pas dépasser {sizeMax}Mo</div>

              <div>Fichier chargé: {article.file?.name || <span style={{fontStyle: "italic", color: "grey"}}>Aucun fichier chargé</span>}</div>

              <div style={{color: "red"}}>{fileError}</div>
              
              <Button
                variant="contained"
                component="label"
              >
                Ajouter une image
                <input
                  type="file"
                  onChange={(e) => checkIfFileIsCorrect(e.target.files[0], "image")}
                  hidden
                  accept='.jpg, .jpeg, .png'
                />

              </Button>

              <div>La taille de l'image ne doit pas dépasser {sizeMax}Mo, la taille affichée maximale sera de 450px</div>

              <div>Image chargée: {article.image?.name || <span style={{fontStyle: "italic", color: "grey"}}>Aucune image chargée</span>}</div>

              <div style={{color: "red"}}>{imageError}</div>

              <div className={styles.content}>
                <Editor
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="wrapperClassName"
                  editorClassName="editorClassName"
                  editorState={editorState}
                  onEditorStateChange={setEditorState}
                  placeholder='Renseignez votre article ici'
                />
              </div>
              
              <div className={styles.button_submit}>
                <Button variant="contained" color='success' onClick={handleAddArticle}>Ajouter l'article</Button>
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

                <div className={styles.content}>
                  <Editor
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    editorState={editorState}
                    onEditorStateChange={setEditorState}
                    placeholder='Renseignez votre article ici'
                  />
                </div>
                
                <div className={styles.button_submit}>
                  <Button variant="contained" color='success' onClick={handleAddActuality}>Ajouter l'actualité</Button>
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
                        {rubrique?.map((item, index) => (
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
                    onChange={(e) => checkIfFileIsCorrect(e.target.files[0], "file")}
                    hidden
                    accept='.pdf, .pptx, .xlsx, .docx'
                  />

                </Button>

                <div>La taille du fichier ne doit pas dépasser {sizeMax}Mo</div>

                <div>Fichier chargé: {article.file?.name || <span style={{fontStyle: "italic", color: "grey"}}>Aucun fichier chargé</span>}</div>

                <div style={{color: "red"}}>{fileError}</div>


                <div className={styles.content}>
                  <Editor
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    editorState={editorState}
                    onEditorStateChange={setEditorState}
                    placeholder='Renseignez les informations ici'
                  />
                </div>
                
                <div className={styles.button_submit}>
                  <Button variant="contained" color='success' onClick={handleAddReference}>Ajouter le contenu de référence</Button>
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