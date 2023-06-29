import React, { useEffect, useState } from 'react'
import styles from './Feed.module.scss'

import { Link } from "react-router-dom"
import axios from 'axios'



const Feed = () => {
  const [lastArticles,setLastArticles] = useState()

  const fetchData = async ()=> {
    const articlesRaw = await axios.get(('/last-articles/5'))
    setLastArticles(articlesRaw.data)
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <div className={styles.container}>
      <h2>Fil d'actualités</h2>
      <div className={styles.list_item_feed}>

        {lastArticles?.map((item, index) => (
          <div className={styles.item_feed} key={index}>
            <div className={styles.text}>{item.title}</div>
            <div className={styles.link}>
              <Link to={`/article/${item._id}`}> Voir l'article</Link>
            </div>
          </div>
        ))}

      </div>
    </div>
  )
}

export default Feed