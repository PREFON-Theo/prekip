import React, { useEffect, useState } from 'react'
import styles from './Feed.module.scss'

import { Link } from "react-router-dom"
import axios from 'axios'

import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';



const Feed = () => {
  const [lastArticles,setLastArticles] = useState()

  const fetchData = async ()=> {
    const articlesRaw = await axios.get(('/article/actuality/last/4'))
    setLastArticles(articlesRaw.data)
  }

  useEffect(() => {
    fetchData();
  }, [])
  return (
    <div className={styles.container}>
      <div className={styles.actualities_menu}>
        <div className={styles.actualities_items}>
          {/* 4 dernières actus */}
          {/* voir plus */}
          {lastArticles?.map((item, index) => (
            <Link key={index} to={`/actuality/${item._id}`} className={styles.box_actualities}>
                <div className={styles.actualities}>
                  {item.title.length > 50 ? `${item.title.substring(0,50)}...` : item.title}
                </div>
                <div className={styles.info_actu}>Le {new Date(item.created_at).toLocaleDateString('fr-FR')}</div>
            </Link>
          ))}
          <Link to={'/'} className={styles.box_more}>
            <div className={styles.more}>Voir plus <ChevronRightRoundedIcon sx={{verticalAlign: 'bottom'}} fontSize="small"/></div>
          </Link>
        </div>
      </div>

      {/* <h2>Fil d'actualités</h2>
      <div className={styles.list_item_feed}>

        {lastArticles?.map((item, index) => (
          <div className={styles.item_feed} key={index}>
            <div className={styles.text}>{item.title}</div>
            <div className={styles.link}>
              <Link to={`/actuality/${item._id}`}> Voir l'article</Link>
            </div>
          </div>
        ))}

      </div> */}
    </div>
  )
}

export default Feed