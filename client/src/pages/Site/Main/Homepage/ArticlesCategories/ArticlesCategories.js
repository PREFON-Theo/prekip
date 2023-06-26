import React from 'react'
import styles from "./ArticlesCategories.module.scss"
import { Link } from 'react-router-dom'

const content = [
  {
    title:"lkj",
    link:""
  },
]


const ArticlesCategories = ({title, itemImg, itemArticle}) => {
  return (
    <>
        <div className={styles.container}>
          <div className={styles.title}>{title}</div>

          <div className={styles.wrapper}>
            <div className={styles.left}>
              <Link to='/'>
                <img src={itemImg.img} alt={itemImg.alt} />
                <div>Qualifications EHF Euro 2022 France-Ukraine - Le Havre</div>
              </Link>
            </div>
            <div className={styles.middle}>

              <div className={styles.item}>
                <Link>{itemArticle[0].title}</Link>
              </div>

              <div className={styles.fill}></div>

              <div className={styles.item}>
                <Link>{itemArticle[1].title}</Link>
              </div>

              <div className={styles.fill}></div>

              <div className={styles.item}>
                <Link>{itemArticle[2].title}</Link>
              </div>

            </div>
            <div className={styles.right}>

              <div className={styles.item}>
                <Link>{itemArticle[3].title}</Link>
              </div>

              <div className={styles.fill}></div>

              <div className={styles.item}>
                <Link>{itemArticle[4].title}</Link>
              </div>

              <div className={styles.fill}></div>

              <div className={styles.item}>
                <Link>{itemArticle[5].title}</Link>
              </div>

            </div>
          </div>
        </div>
    </>
  )
}

export default ArticlesCategories