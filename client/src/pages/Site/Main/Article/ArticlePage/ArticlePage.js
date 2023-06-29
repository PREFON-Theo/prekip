import React, { useContext, useEffect, useState } from 'react'
import styles from "./ArticlePage.module.scss"
import { Link, Navigate, redirect, useParams } from 'react-router-dom'
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
//import Link from '@mui/material/Link';
import { Button } from '@mui/material';
import { UserContext } from '../../../../../utils/Context/UserContext/UserContext';


const usersList = await axios.get('/users')
const rubriquesRaw = await axios.get('/rubrique-types')
const rubriquesList = rubriquesRaw.data
const listOfUsers = usersList.data

const parse = require('html-react-parser');

const ArticlePage = ({ handleOpenAlert, changeAlertValues }) => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [redirectionGoto, setRedirectGoto] = useState(false)
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

  useEffect( () => {
    axios
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
  }, [])

  

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
          Par {article.authorName}, le {article.created_at} {article.created_at !== article.updated_at ? ` et modifié le ${article.updated_at}`: <></>}
        </div>

        <div className={styles.content}>{parse(article.content)}</div>

      </div>
    </>
  )
}

export default ArticlePage;