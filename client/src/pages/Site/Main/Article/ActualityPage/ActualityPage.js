import React, { useContext, useEffect, useState } from 'react'
import styles from "./ActualityPage.module.scss"
import { Link, Navigate, redirect, useParams } from 'react-router-dom'
import axios from 'axios';
import dayjs from 'dayjs';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
//import Link from '@mui/material/Link';
import { Button } from '@mui/material';
import { UserContext } from '../../../../../utils/Context/UserContext/UserContext';

import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';

import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';


const usersList = await axios.get('/user')
const rubriquesRaw = await axios.get('/rubrique-type')
const rubriquesList = rubriquesRaw.data
const listOfUsers = usersList.data

const parse = require('html-react-parser');

const ActualityPage = ({ handleOpenAlert, changeAlertValues }) => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [redirectionGoto, setRedirectGoto] = useState(false)
  const [articleLiked, setArticleLiked] = useState(false)
  const [nbLike, setNbLike] = useState(0)
  const [listOfLikes, setListOfLikes] = useState()
  const [commentText, setCommentText] = useState('')
  const [redirectionError, setRedirectionError] = useState(false)

  const [article, setArticle] = useState(
    {
      id: "",
      title: "",
      preview: "",
      content: "",
      category: "",
      author: "",
      created_at: "",
      updated_at: ""
    },
  )
  const [comments, setComments] = useState()

  useEffect( () => {
    fetchData();

    getLikes();

    
     
  }, [])

  const fetchData = async () => {
    const articleData = await axios
      .get(`/article/${id}`)

      console.log(articleData.data)
      articleData.data.type === 'actuality' ? <></> : setRedirectionError(true)
      setArticle({
        id: articleData.data._id,
        title: articleData.data.title,
        preview: articleData.data.preview,
        content: articleData.data.content,
        category: articleData.data.category,
        author: articleData.data.author,
        image: articleData.data.image,
        file: articleData.data.file,
        important: articleData.data.important,
        authorName: `${listOfUsers.filter((usr) => usr._id === articleData.data.author)[0]?.firstname} ${listOfUsers.filter((usr) => usr._id === articleData.data.author)[0]?.lastname}`,
        created_at: new Date(articleData.data.created_at).toLocaleDateString('fr-FR'),
        updated_at: new Date(articleData.data.updated_at).toLocaleDateString('fr-FR')
      });

    const commentData = await axios.get(`/comment/article/${id}`)
    setComments(commentData.data);
  }

  const getLikes = async () => {
    let list = await axios.get(`/like/article/${id}`)
    setListOfLikes(list.data)
    setNbLike(list.data.length)
    console.log(list.data)
  }

  useEffect(() => {
    if(user){
      console.log(user)
      for (let l = 0; l < listOfLikes?.length; l++) {
        if(listOfLikes[l].user_id === user._id){
          setArticleLiked(true);
          break;
        }
      }

    }
  }, [listOfLikes, user])


  const handleLikeArticle = async () => {
    try {
      if(user){
        if(articleLiked) {
          setNbLike(nbLike-1)
          setArticleLiked(false)
          await axios.delete(`/like/${user._id}/${id}`)
          console.log("deleted")
        }
        else {
          setNbLike(nbLike+1)
          setArticleLiked(true)
          await axios.post('/like', {
            user_id: user._id,
            article_id: id
          })
          console.log("created")
        }
      }
      else {
        handleOpenAlert()
        changeAlertValues('warning', "Connectez-vous pour pouvoir aimer ce poste")
      }
    }
    catch (err) {
      handleOpenAlert()
      changeAlertValues('error', err)
    }
  }

  const handleAddComment = async () => {
    try {
      await axios
        .post(`/comment/`, {
          text: commentText,
          user_id: user,
          article_id: id,
          date: new Date()
        })
        handleOpenAlert()
        changeAlertValues('success', 'Commentaire ajouté')
        fetchData()
        setCommentText('')
    }
    catch (err) {
      handleOpenAlert()
      changeAlertValues('error', err)
    }
  }

  

  return (
    <>
      {redirectionGoto ? <Navigate to={`/rubrique/${rubriquesList.filter((rub) => rub._id === article.category)[0]?.link}`} /> : <></>}
      {redirectionError ? <Navigate to='/404error' replace /> : <></>}
      <div className={styles.breadcrumbs}>
        <Breadcrumbs aria-label="breadcrumb">
        </Breadcrumbs>
        {
          user ?
            article.author === user?._id ?
            <div>
              <Link to={`/edit-article/${id}`} style={{marginRight: '10px'}}>
                <Button variant='contained' color='warning'>Modifier l'actualité</Button>
              </Link>
              <Button variant='contained' color='error' onClick={() => {
                axios.delete(`/article/${id}`)
                setRedirectGoto(true)
                handleOpenAlert()
                changeAlertValues('success', 'Actualité supprimé')
              }}>Supprimer l'actualité</Button>
            </div>
            :
              <></>
          :
          <></>
        }
      </div>
      <div className={styles.container}>

        <div className={styles.article_title}>{article.title}</div>

        <div className={styles.article_author_informations}>
          <div className={styles.author}>
            Par {article.authorName}, le {article.created_at} {article.created_at !== article.updated_at ? ` et modifié le ${article.updated_at}`: <></>}
          </div>
          <div className={styles.likes}>
          
            <IconButton aria-label="delete" color='error' onClick={() => handleLikeArticle()}>
            {articleLiked ?
              <FavoriteRoundedIcon/>
            :
              <FavoriteBorderRoundedIcon/>
            }
            </IconButton>
            <div className={styles.number}>{nbLike}</div>
          </div>
        </div>

        <div className={styles.content}>{parse(article.content)}</div>

        
        <div className={styles.comments}>
          {
            user ?
              <div className={styles.add_com}>
                <TextField
                  id="outlined-basic"
                  label="Ajoutez votre commentaire..."
                  variant="outlined"
                  sx={{width: '100%', marginBottom: '20px'}}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Button variant='contained' color='primary' onClick={() => handleAddComment()}>Ajouter</Button>
              </div>
            :
            <></>
          }

          {comments?.map((item, index) => (
            
              item.user_id === user?._id ?
              <>
                <div className={styles.item_com} key={index}>
                  <div className={styles.second}></div>
                  <div className={styles.text}>
                    <div className={styles.t}>{item.text}</div>
                    <div className={styles.a}>
                      Par {`${listOfUsers.filter((usr) => usr._id === item.user_id)[0]?.firstname} ${listOfUsers.filter((usr) => usr._id === item.user_id)[0]?.lastname}`} le {new Date(item.date).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
              </>
              :
                <>
                  <div className={styles.item_com} key={index}>
                    <div className={styles.text}>
                      <div className={styles.t}>{item.text}</div>
                      <div className={styles.a}>
                        Par {`${listOfUsers.filter((usr) => usr._id === item.user_id)[0]?.firstname} ${listOfUsers.filter((usr) => usr._id === item.user_id)[0]?.lastname}`} le {new Date(item.date).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div className={styles.second}></div>
                  </div>
                </>
          ))}
        </div>

      </div>
    </>
  )
}

export default ActualityPage;