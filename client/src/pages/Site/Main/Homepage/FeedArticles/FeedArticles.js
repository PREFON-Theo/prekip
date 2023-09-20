import React, { useContext, useEffect, useState } from 'react'
import styles from './FeedArticles.module.scss'

import { Link } from "react-router-dom"
import axios from 'axios'

import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { UserContext } from '../../../../../utils/Context/UserContext/UserContext';



const FeedArticles = () => {
  const {cookies} = useContext(UserContext)
  const [lastArticles,setLastArticles] = useState()

  const fetchData = async ()=> {
    const articlesRaw = await axios.get(('/article/article/last/5'), {headers: {jwt: cookies.token}})
    setLastArticles(articlesRaw.data)
  }

  useEffect(() => {
    fetchData();
  }, [])
  
  return (
    <div className={styles.container}>
      <h2>Derniers articles</h2>
      <div className={styles.articles_menu}>

        <div className={styles.four_articles_items}>
          {lastArticles?.map((item, index) => (
            <Link key={index} to={`/article/${item._id}`} className={styles.box_articles}>
                <div className={styles.articles}>
                  {item.title.length > 50 ? `${item.title.substring(0,50)}...` : item.title}
                </div>
                <div className={styles.info_actu}>Le {new Date(item.created_at).toLocaleDateString('fr-FR')}</div>
            </Link>
          ))}
          <Link to={'/article-list'} className={styles.box_more}>
            <div className={styles.more}>Voir plus <ChevronRightRoundedIcon sx={{verticalAlign: 'bottom'}} fontSize="small"/></div>
          </Link>
        </div>

        <div className={styles.three_articles_items}>
          {lastArticles?.slice(0,3).map((item, index) => (
            <Link key={index} to={`/article/${item._id}`} className={styles.box_articles}>
                <div className={styles.articles}>
                  {item.title.length > 50 ? `${item.title.substring(0,50)}...` : item.title}
                </div>
                <div className={styles.info_actu}>Le {new Date(item.created_at).toLocaleDateString('fr-FR')}</div>
            </Link>
          ))}
          <Link to={'/article-list'} className={styles.box_more}>
            <div className={styles.more}>Voir plus <ChevronRightRoundedIcon sx={{verticalAlign: 'bottom'}} fontSize="small"/></div>
          </Link>
        </div>

        <div className={styles.two_articles_items}>
          {lastArticles?.slice(0,2).map((item, index) => (
            <Link key={index} to={`/article/${item._id}`} className={styles.box_articles}>
                <div className={styles.articles}>
                  {item.title.length > 50 ? `${item.title.substring(0,50)}...` : item.title}
                </div>
                <div className={styles.info_actu}>Le {new Date(item.created_at).toLocaleDateString('fr-FR')}</div>
            </Link>
          ))}
          <Link to={'/article-list'} className={styles.box_more}>
            <div className={styles.more}>Voir plus <ChevronRightRoundedIcon sx={{verticalAlign: 'bottom'}} fontSize="small"/></div>
          </Link>
        </div>

        <div className={styles.one_articles_items}>
          {lastArticles?.slice(0,1).map((item, index) => (
            <Link key={index} to={`/article/${item._id}`} className={styles.box_articles}>
                <div className={styles.articles}>
                  {item.title.length > 50 ? `${item.title.substring(0,50)}...` : item.title}
                </div>
                <div className={styles.info_actu}>Le {new Date(item.created_at).toLocaleDateString('fr-FR')}</div>
            </Link>
          ))}
          <Link to={'/article-list'} className={styles.box_more}>
            <div className={styles.more}>Voir plus <ChevronRightRoundedIcon sx={{verticalAlign: 'bottom'}} fontSize="small"/></div>
          </Link>
        </div>

      </div>
    </div>
  )
}

export default FeedArticles