import React, { useEffect, useState } from 'react'
import styles from "./ArticlePage.module.scss"
import { useParams } from 'react-router-dom'
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { Button } from '@mui/material';


const usersList = await axios.get('/users')
const listOfUsers = usersList.data

const parse = require('html-react-parser');

const ArticlePage = ({ handleOpenAlert, changeAlertValues }) => {
  const { id } = useParams();
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
        authorName: listOfUsers.filter((usr) => usr._id === res.data.author)[0]?.username,
        created_at: new Date(res.data.created_at).toLocaleDateString('fr-FR'),
        updated_at: new Date(res.data.updated_at).toLocaleDateString('fr-FR')
      }));
  }, [])

  /*useEffect(() => {
    console.log(new Date(article.created_at).toDateString())
  }, [article])*/

  /*const handleClick = () => {
    handleOpenAlert(true)
    changeAlertValues('success', "Bravo vous savez cliquer")
  }*/

  return (
    <>
      <div className={styles.breadcrumbs}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            Rubriques
          </Link>
          <Link underline="hover" color="inherit" href="/">
            RH
          </Link>
          <Typography color="text.primary">Article</Typography>
        </Breadcrumbs>
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