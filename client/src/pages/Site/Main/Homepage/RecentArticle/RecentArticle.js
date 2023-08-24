import React from 'react'
import styles from './RecentArticle.module.scss'
import { Link } from "react-router-dom"
import axios from 'axios'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

const articleRaw = await axios.get("/article/lastest-important-article")
const article = articleRaw.data[0]
console.log(article)

const RecentArticle = () => {
  return (
    <div className={styles.container}>
        <h3>Article important !</h3>
        <Link to={`/article/${article?._id}`}>
          <div className={styles.wrapper}>
            <div className={styles.title}>{article?.title}</div>
            {/* {
              article?.preview.length > 100 ?
              <div className={styles.preview}>{article?.preview.substring(0,100)}...</div>
              : */}
            <div className={styles.image}>{article?.image}</div>
            <div className={styles.preview}>{article?.preview}</div>
            {/* } */}
            <div className={styles.more}>
                <div>
                  En savoir plus 
                </div>
                <ChevronRightRoundedIcon sx={{verticalAlign: 'bottom'}} fontSize="small"/>
            </div>
          </div>
          
        </Link>
      </div>
  )
}

export default RecentArticle