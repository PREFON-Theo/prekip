import styles from "./EditArticle.module.scss"
import React, { useEffect, useState, useContext } from 'react'
import { Navigate, useParams } from 'react-router-dom';


import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertFromHTML, convertToRaw } from 'draft-js';
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


const EditArticle = ({ handleOpenAlert, changeAlertValues }) => {
  const {user, ready, cookies} = useContext(UserContext);
  const [contentType, setContentType] = useState('');
  const sizeMax = 3;
  const { id } = useParams();

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
  const [articlePosted, setArticlePosted] = useState(false);

  const [originalFileImported, setOriginalFileImported] = useState()
  const [originalImageImported, setOriginalImageImported] = useState()

  const [fileName, setFileName] = useState('')
  const [imageName, setImageName] = useState('')

  const [fileError, setFileError] = useState("")
  const [imageError, setImageError] = useState("")

  const [rubrique, setRubrique] = useState();
  const [redirection, setRedirection] = useState(false)
  
  /*const fetchRubriques = async () => {
    const rubriqueRaw = await axios.get('/rubrique-type', {headers: {jwt: cookies.token}});
    let rubriqueList = []
    if(user?.roles.includes("Administrateur") || user?.roles.includes("Modérateur")){
      setRubrique(rubriqueRaw.data)
    }
    else {
      user?.divisions.map((item) => rubriqueList.push(rubriqueRaw.data?.filter((rl) => rl._id === item)[0]))
      setRubrique(rubriqueList);
    }
  }*/

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

  const fetchArticle = async () => {
    const articleRaw = await axios.get(`/article/${id}`, {headers: {jwt: cookies.token}})
    setArticle({
      title: articleRaw.data?.title,
      category: articleRaw.data?.category,
      preview: articleRaw.data?.preview,
      content : articleRaw.data?.content,
      important : articleRaw.data?.important,
      author : articleRaw.data?.author,
      type: articleRaw.data?.type,
      image: articleRaw.data?.image,
      file: articleRaw.data?.file,
    })
    console.log(!!articleRaw.data.file?.originalname)
    setFileName(articleRaw.data.file?.originalname)
    setImageName(articleRaw.data.image?.originalname)

    if(!!articleRaw.data?.file){
      setOriginalFileImported({
        ...articleRaw.data?.file,
        name: articleRaw.data?.file?.originalname,
        type: articleRaw.data?.file?.mimetype,
        size: articleRaw.data?.file?.size,
      })
    }

    if(!!articleRaw.data?.image){
      setOriginalImageImported({
        ...articleRaw.data?.image,
        name: articleRaw.data?.image?.originalname,
        type: articleRaw.data?.image?.mimetype,
        size: articleRaw.data?.image?.size,
      })
    }

    setContentType(articleRaw.data?.type)
    
    setEditorState(
      EditorState.createWithContent(
        ContentState.createFromBlockArray(
          convertFromHTML(articleRaw.data?.content)
        )
      )
    )


    if(!user?.roles.includes("Administrateur") && !user?.roles.includes("Modérateur") && user?._id !== articleRaw.data.author){
      setRedirection(true)
      handleOpenAlert()
      changeAlertValues("warning", "Vous n'êtes pas autorisé à accédez à cette page")
    }

  }

  useEffect(() => {
    console.log(originalFileImported)
  }, [originalFileImported])

  useEffect(() => {
    fetchRubriques();
    fetchArticle();
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
        setImageName(file.name)
      }
    }
    else if (type === "file") {
      setFileError('')
      if(file === undefined){
        setArticle(prevValues => ({...prevValues, file: file}))
        setFileName(undefined)
      }
      else if(file?.size / 1000000 > sizeMax){
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
        setFileName(file.name)
      }
    }
    else {
      handleOpenAlert()
      changeAlertValues('error', `Error: type = ${type}`)
    }
  }

  const handleEditArticle = async () => {
    try {
      if(ready === "no"){
        handleOpenAlert()
        changeAlertValues("error", "Vous n'êtes pas connecté")
        return <Navigate replace to="/"/>
      }
      if(article.title === '' || article.preview === '' || article.category === '' || article.content === '<p></p>') {
        handleOpenAlert()
        changeAlertValues('warning', "Il manque des informations pour modifier l'article")
      }
      else {
        let imageToEdit = false;
        let fileToEdit = false;

        if(originalFileImported?.name === article.file?.name){
          console.log("pas modif")
        }
        else {
          console.log("modif")
          fileToEdit = true;
        }

        if(originalImageImported?.name === article.image?.name){
          console.log("pas modif")
        }
        else {
          console.log("modif")
          imageToEdit = true;
        }

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
        formData.append('imagePath', article.image?.path || '')
        formData.append('filePath', article.file?.path || '')
        formData.append('imageToEdit', imageToEdit)
        formData.append('fileToEdit', fileToEdit)
        formData.append('fileName', fileName)
        formData.append('imageName', imageName)
        formData.append('originalFileImported', originalFileImported?.path || '')
        formData.append('originalImageImported', originalImageImported?.path || '')

        console.log(formData)

        await axios
          .patch(`/article/with-file/${id}`,
          formData,
          {
            headers: {
              'content-type': 'multipart/form-data',
              jwt: cookies.token
            }
          })
          handleOpenAlert()
          changeAlertValues('success', 'Article modifié')
          setArticlePosted(true)
      }

    }
    catch (err) {
      // handleOpenAlert()
      // changeAlertValues('error', err)
      console.log(err)
    }
  }

  const handleEditActuality = async () => {
    try {
      if(ready === "no"){
        handleOpenAlert()
        changeAlertValues("error", "Vous n'êtes pas connecté")
        return <Navigate replace to="/"/>
      }
      if(article.title === '' || article.content === '<p></p>') {
        handleOpenAlert()
        changeAlertValues('warning', "Il manque des informations pour modifier l'actualité")
      }
      else {
        await axios
          .patch(`/article/${id}`, 
          {
            title: article.title,
            content: article.content,
            author: article.author,
            created_at: new Date(),
            updated_at: new Date(),
            type: contentType,
            important: user?.roles.includes('Administrateur') ? article.important : false,
          }, {headers: {jwt: cookies.token}})
          handleOpenAlert()
          changeAlertValues('success', 'Actualité modifiée')
          setArticlePosted(true)

      }

    }
    catch (err) {
      //handleOpenAlert()
      //changeAlertValues('error', err)
      console.log(err)
    }
  }

  const handleEditReference = async () => {
    try {
      if(ready === "no"){
        handleOpenAlert()
        changeAlertValues("error", "Vous n'êtes pas connecté")
        return <Navigate replace to="/"/>
      }
      if(article.title === '' || article.category === '' || article.content === '<p></p>') {
        handleOpenAlert()
        changeAlertValues('warning', "Il manque des informations pour modifier le contenu de référence")
      }
      else {
        let fileToEdit = false;

        if(originalFileImported?.name === article.file?.name){
          console.log("pas modif")
        }
        else {
          console.log("modif")
          fileToEdit = true;
        }

        const formData = new FormData()
        formData.append('title', article.title)
        formData.append('content', article.content)
        formData.append('category', article.category)
        formData.append('author', article.author)
        formData.append('image', article.file, {contentType: "text/plain;charset=utf-8"})
        formData.append('type', contentType)
        formData.append('created_at', new Date())
        formData.append('updated_at', new Date())
        formData.append('filePath', article.file?.path || '')
        formData.append('fileToEdit', fileToEdit)
        formData.append('fileName', fileName)
        formData.append('originalFileImported', originalFileImported?.path || '')
        
        await axios
          .patch(`/article/with-file/${id}`, 
          formData, 
          {
            headers: {
              'content-type': 'multipart/form-data',
              jwt: cookies.token
            }
          })
          handleOpenAlert()
          changeAlertValues('success', 'Contenu de référence modifié')
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
        <Navigate to={`/article/${id}`} />
      : articlePosted && contentType === 'actuality' ? 
        <Navigate to={`/actuality/${id}`} />
      : articlePosted && contentType === 'reference' ? 
      <Navigate to={`/reference/${id}`} />
      :
      <></>
      }
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <h2>Modifier {contentType === "article" ? "un article" : contentType === "actuality" ? "une actualité" : contentType === 'reference' ? "un contenu de référence" : ""}</h2>
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
                color="warning"
              >
                Modifier le fichier
                <input
                  type="file"
                  onChange={(e) => checkIfFileIsCorrect(e.target.files[0], "file")}
                  hidden
                  accept='.pdf, .pptx, .xlsx, .docx'
                />

              </Button>

              <div>La taille du fichier ne doit pas dépasser {sizeMax}Mo</div>

              <div>Fichier chargé: {fileName || <span style={{fontStyle: "italic", color: "grey"}}>Aucun fichier chargé</span>}</div>

              <div style={{color: "red"}}>{fileError}</div>
              
              <Button
                variant="contained"
                component="label"
                color="warning"
              >
                Modifier l'image
                <input
                  type="file"
                  onChange={(e) => checkIfFileIsCorrect(e.target.files[0], "image")}
                  hidden
                  accept='.jpg, .jpeg, .png'
                />

              </Button>

              <div>La taille de l'image ne doit pas dépasser {sizeMax}Mo, la taille affichée maximale sera de 450px</div>

              <div>Image chargée: {imageName || <span style={{fontStyle: "italic", color: "grey"}}>Aucune image chargée</span>}</div>

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
                <Button variant="contained" color='warning' onClick={handleEditArticle}>Modifier l'article</Button>
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
                  <Button variant="contained" color='warning' onClick={handleEditActuality}>Modifier l'actualité</Button>
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
                    color="warning"
                  >
                    Modifier le fichier
                    <input
                    type="file"
                    onChange={(e) => checkIfFileIsCorrect(e.target.files[0], "file")}
                    hidden
                    accept='.pdf, .pptx, .xlsx, .docx'
                  />

                </Button>

                <div>La taille du fichier ne doit pas dépasser {sizeMax}Mo</div>

                <div>Fichier chargé: {fileName || <span style={{fontStyle: "italic", color: "grey"}}>Aucun fichier chargé</span>}</div>

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
                  <Button variant="contained" color='warning' onClick={handleEditReference}>Modifier le contenu de référence</Button>
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

export default EditArticle;