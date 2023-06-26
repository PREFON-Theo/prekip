import React from 'react'
import styles from "./LatestArticles.module.scss"
import { Link } from 'react-router-dom'

const content = [
  "http://prekip.prefon.local/sites/default/files/styles/large/public/field/image/tirage.jpg?itok=_ATmbKU2",
  "http://prekip.prefon.local/sites/default/files/styles/large/public/field/image/photo_prefon_trophee.jpg?itok=wut-gjBK",
  "http://prekip.prefon.local/sites/default/files/styles/large/public/field/image/miniature_3.png?itok=_ZrmRwzc",
  "http://prekip.prefon.local/sites/default/files/styles/large/public/field/image/photo_equipe.jpg?itok=H59HvJYc",
] 

const LatestArticles = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.list_container}>
          {content.map((item, index) => (
            <Link to='/' 
            /*style={{
              backgroundImage: `url(${item})`
            }}*/
            >
              <img src={item} key={index} alt='photo'/>
              <div className={styles.title}>Ceci est lmk mlk mlkkklkmpiop uoiun texte</div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

export default LatestArticles;