import React from 'react'
import styles from './RecentArticle.module.scss'
import { Link } from "react-router-dom"
import axios from 'axios'

const articleRaw = await axios.get("/article/last/1")
const article = articleRaw.data[0]

const RecentArticle = () => {
  return (
    <div className={styles.container}>
        <h2>Dernière actualité</h2>
        <Link to={`/article/${article?._id}`}>
          <div className={styles.wrapper}>
            <div className={styles.title}>{article?.title}</div>
            {
              article?.preview.length > 100 ?
              <div className={styles.preview}>{article?.preview.substring(0,100)}...</div>
              :
              <div className={styles.preview}>{article?.preview}</div>
            }
            <div className={styles.more}>
                En savoir plus
            </div>
          </div>
          
        </Link>
      </div>
  )
}

export default RecentArticle