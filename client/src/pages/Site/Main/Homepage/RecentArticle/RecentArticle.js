import React, { useContext, useEffect, useState } from 'react'
import styles from './RecentArticle.module.scss'
import { Link } from "react-router-dom"
import axios from 'axios'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { UserContext } from '../../../../../utils/Context/UserContext/UserContext';


const RecentArticle = () => {
  const {cookies} = useContext(UserContext)
  const [article, setArticle] = useState()

  
  const fetchData = async () => {
    const articleRaw = await axios.get("/article/lastest-important-article", {headers: {jwt: cookies.token}})
    setArticle(articleRaw.data === null ? {} : articleRaw?.data[0])
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

              {
                article.image ?
                <div style={{display: 'flex'}}>
                  <div className={styles.left}>
                        <img src={`${process.env.REACT_APP_URL}:4000/${article.image.path}`} alt="img" />
                  </div>
                  <div className={styles.right}>
                    <div className={styles.preview}>{article?.preview}</div>
                    <div className={styles.more}>
                        <div>
                          En savoir plus 
                        </div>
                        <ChevronRightRoundedIcon sx={{verticalAlign: 'bottom'}} fontSize="small"/>
                    </div>
                  </div>

                </div>
              :
                <>
                  <div className={styles.preview} style={{paddingLeft: article.image ? "20px" : "0px"}}>{article?.preview}</div>
                  <div className={styles.more}>
                    <div>
                      En savoir plus 
                    </div>
                    <ChevronRightRoundedIcon sx={{verticalAlign: 'bottom'}} fontSize="small"/>
                  </div>
                </>
              }

            </div>
            
          </Link>
        }
      </div>
  )
}

export default RecentArticle