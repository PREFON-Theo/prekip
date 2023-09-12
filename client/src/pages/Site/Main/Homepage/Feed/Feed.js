import React, { useContext, useEffect, useState } from 'react'
import styles from './Feed.module.scss'

import { Link } from "react-router-dom"
import axios from 'axios'

import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { UserContext } from '../../../../../utils/Context/UserContext/UserContext';



const Feed = () => {
  const {cookies} = useContext(UserContext)
  const [lastArticles,setLastArticles] = useState()

  const fetchData = async ()=> {
    const articlesRaw = await axios.get(('/article/actuality/last/4'), {headers: {jwt: cookies.token}})
    setLastArticles(articlesRaw.data)
  }

  useEffect(() => {
    fetchData();
  }, [])
  return (
    <div className={styles.container}>
      <div className={styles.actualities_menu}>

        <div className={styles.four_actualities_items}>
          {lastArticles?.map((item, index) => (
            <Link key={index} to={`/actuality/${item._id}`} className={styles.box_actualities}>
                <div className={styles.actualities}>
                  {item.title.length > 50 ? `${item.title.substring(0,50)}...` : item.title}
                </div>
                <div className={styles.info_actu}>Le {new Date(item.created_at).toLocaleDateString('fr-FR')}</div>
            </Link>
          ))}
          <Link to={'/actuality-list'} className={styles.box_more}>
            <div className={styles.more}>Voir plus <ChevronRightRoundedIcon sx={{verticalAlign: 'bottom'}} fontSize="small"/></div>
          </Link>
        </div>

        <div className={styles.three_actualities_items}>
          {lastArticles?.slice(0,3).map((item, index) => (
            <Link key={index} to={`/actuality/${item._id}`} className={styles.box_actualities}>
                <div className={styles.actualities}>
                  {item.title.length > 50 ? `${item.title.substring(0,50)}...` : item.title}
                </div>
                <div className={styles.info_actu}>Le {new Date(item.created_at).toLocaleDateString('fr-FR')}</div>
            </Link>
          ))}
          <Link to={'/actuality-list'} className={styles.box_more}>
            <div className={styles.more}>Voir plus <ChevronRightRoundedIcon sx={{verticalAlign: 'bottom'}} fontSize="small"/></div>
          </Link>
        </div>

        <div className={styles.two_actualities_items}>
          {lastArticles?.slice(0,2).map((item, index) => (
            <Link key={index} to={`/actuality/${item._id}`} className={styles.box_actualities}>
                <div className={styles.actualities}>
                  {item.title.length > 50 ? `${item.title.substring(0,50)}...` : item.title}
                </div>
                <div className={styles.info_actu}>Le {new Date(item.created_at).toLocaleDateString('fr-FR')}</div>
            </Link>
          ))}
          <Link to={'/actuality-list'} className={styles.box_more}>
            <div className={styles.more}>Voir plus <ChevronRightRoundedIcon sx={{verticalAlign: 'bottom'}} fontSize="small"/></div>
          </Link>
        </div>

        <div className={styles.one_actualities_items}>
          {lastArticles?.slice(0,1).map((item, index) => (
            <Link key={index} to={`/actuality/${item._id}`} className={styles.box_actualities}>
                <div className={styles.actualities}>
                  {item.title.length > 50 ? `${item.title.substring(0,50)}...` : item.title}
                </div>
                <div className={styles.info_actu}>Le {new Date(item.created_at).toLocaleDateString('fr-FR')}</div>
            </Link>
          ))}
          <Link to={'/actuality-list'} className={styles.box_more}>
            <div className={styles.more}>Voir plus <ChevronRightRoundedIcon sx={{verticalAlign: 'bottom'}} fontSize="small"/></div>
          </Link>
        </div>

      </div>
    </div>
  )
}

export default Feed