import React, { useEffect, useState } from 'react'
import styles from './RecentArticle.module.scss'
import { Link } from "react-router-dom"
import axios from 'axios'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';


const RecentArticle = () => {

  const [article, setArticle] = useState()

  
  const fetchData = async () => {
    const articleRaw = await axios.get("/article/lastest-important-article")
    setArticle(articleRaw.data[0])
  } 

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <div className={styles.container}>
        <h2>Article important !</h2>
        
        {
        article === undefined ?
          <div>Il n'y a aucun article important à afficher</div> 
        :
          <Link to={`/article/${article?._id}`}>
            <div className={styles.wrapper}>
              <div className={styles.title}>{article?.title}</div>
              <div className={styles.image}>{article?.image}</div>
              <div className={styles.preview}>{article?.preview}</div>
              <div className={styles.more}>
                  <div>
                    En savoir plus 
                  </div>
                  <ChevronRightRoundedIcon sx={{verticalAlign: 'bottom'}} fontSize="small"/>
              </div>
            </div>
            
          </Link>
        }
      </div>
  )
}

export default RecentArticle