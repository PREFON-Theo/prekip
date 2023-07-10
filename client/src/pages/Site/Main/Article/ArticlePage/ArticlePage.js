import React, { useContext, useEffect, useState } from 'react'
import styles from "./ArticlePage.module.scss"
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


const usersList = await axios.get('/user')
const rubriquesRaw = await axios.get('/rubrique-type')
const rubriquesList = rubriquesRaw.data
const listOfUsers = usersList.data

const parse = require('html-react-parser');

const ArticlePage = ({ handleOpenAlert, changeAlertValues }) => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [redirectionGoto, setRedirectGoto] = useState(false)
  const [articleLiked, setArticleLiked] = useState(false)
  const [nbLike, setNbLike] = useState(0)
  const [listOfLikes, setListOfLikes] = useState()
  const [commentText, setCommentText] = useState('')
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
    await axios
      .get(`/article/${id}`)
      //.then((res) => console.log(res.data))
      .then((res) => setArticle({
        id: res.data._id,
        title: res.data.title,
        preview: res.data.preview,
        content: res.data.content,
        category: res.data.category,
        author: res.data.author,
        authorName: `${listOfUsers.filter((usr) => usr._id === res.data.author)[0]?.firstname} ${listOfUsers.filter((usr) => usr._id === res.data.author)[0]?.lastname}`,
        created_at: new Date(res.data.created_at).toLocaleDateString('fr-FR'),
        updated_at: new Date(res.data.updated_at).toLocaleDateString('fr-FR')
      }));

    await axios
      .get(`/comment/article/${id}`)
      .then((res) => setComments(res.data));
  }

  const getLikes = async () => {
    let list = await axios.get(`/like-of-article/${id}`)
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


  const handleLikeArticle = () => {
    if(articleLiked) {
      setNbLike(nbLike-1)
      setArticleLiked(false)
      axios.delete(`/like/${user._id}/${id}`).then(() => console.log("deleted"))
    }
    else {
      setNbLike(nbLike+1)
      setArticleLiked(true)
      axios.post('/like', {
        user_id: user._id,
        article_id: id
      }).then(() => console.log("created"))
    }
  }

  const handleAddComment = () => {
    axios
      .post(`/comment/`, {
        text: commentText,
        user_id: user,
        article_id: id,
        date: new Date()
      })
      .then(() => handleOpenAlert())
      .then(() => changeAlertValues('success', 'Commentaire ajouté'))
      .then(() => fetchData())
      .then(() => setCommentText(''))
  }

  

  return (
    <>
      {redirectionGoto ? <Navigate to={`/rubrique/${rubriquesList.filter((rub) => rub._id === article.category)[0]?.link}`} /> : <></>}
      <div className={styles.breadcrumbs}>
        <Breadcrumbs aria-label="breadcrumb">
          <Typography>Rubriques</Typography>
          <Link to={`/rubrique/${rubriquesList.filter((rub) => rub._id === article.category)[0]?.link}`} className={styles.link_to_rubrique}>
            {rubriquesList.filter((rub) => rub._id === article.category)[0]?.title}
          </Link>
          <Typography color="text.primary">Article</Typography>
        </Breadcrumbs>
        {
          article.author === user?._id ?
          <div>
            <Link to={`/edit-article/${id}`} style={{marginRight: '10px'}}>
              <Button variant='contained' color='warning'>Modifier l'article</Button>
            </Link>
            <Button variant='contained' color='error' onClick={
              () => axios.delete(`/article/${id}`)
                .then(() => setRedirectGoto(true))
                .then(() => handleOpenAlert())
                .then(() => changeAlertValues('success', 'Article supprimé'))
              }>Supprimer l'article</Button>
          </div>
          :
            <></>
        }
      </div>
      <div className={styles.container}>

        <div className={styles.article_title}>{article.title}</div>

        <div className={styles.article_preview}>{article.preview}</div>

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

export default ArticlePage;