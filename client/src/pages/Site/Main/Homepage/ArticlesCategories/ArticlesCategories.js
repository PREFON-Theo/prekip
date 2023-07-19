import React, { useEffect, useState } from 'react'
import styles from "./ArticlesCategories.module.scss"
import { Link } from 'react-router-dom'

const content = [
  {
    title:"lkj",
    link:""
  },
]


const ArticlesCategories = ({title, itemImg, itemArticle}) => {

  const [firstSemiLength, setFirstSemiLength] = useState(0)
  const [secondSemiLength, setFSecondSemiLength] = useState(0)
  
  useEffect(() => {
    if(itemArticle !== undefined){
      // console.log(title, " ", itemArticle)
      if(itemArticle?.length > 0){
        setFirstSemiLength(itemArticle.length % 2 > 0 ? (itemArticle.length/2) +0.5 : itemArticle.length/2)
        setFSecondSemiLength(itemArticle.length % 2 > 0 ? (itemArticle.length/2) -0.5 : itemArticle.length/2)
      }
    }
  }, [itemArticle])

  useEffect(() => {
    // console.log(title, ' ', firstSemiLength, ' ', secondSemiLength)
  }, [firstSemiLength, secondSemiLength])

  return (
    <>
        <div className={styles.container}>
          <h2>{title}</h2>

          <div className={styles.wrapper}>
            <div className={styles.left}>
              <Link to='/'>
                <img src={itemImg?.img} alt={itemImg?.alt} />
                <div>Qualifications EHF Euro 2022 France-Ukraine - Le Havre</div>
              </Link>
            </div>


            {itemArticle !== undefined ?
              itemArticle.length > 0 ?
                <>
                  <div className={styles.middle}>
                    {itemArticle?.slice(0, firstSemiLength).map((item, index) => (
                      <div key={index} className={styles.item}>
                        <Link to={`/reference/${item._id}`}>
                          {item.title}
                          </Link>
                        {index+1 === firstSemiLength ?
                          <></>
                        :
                          <div className={styles.fill}></div>
                        }
                      </div>
                    ))}
                  </div>
                  <div className={styles.right}>
                    {itemArticle?.slice(firstSemiLength, itemArticle.length).map((item, index) => (
                      <div key={index} className={styles.item}>
                        <Link>{item.title}</Link>
                        {index+1 === firstSemiLength ?
                          <></>
                        :
                          <div className={styles.fill}></div>
                        }
                      </div>
                    ))}
                  </div>
                </>
              :
              <>
                <div className={styles.middle}>Rien à afficher</div>
                <div className={styles.right}></div>
              </>
            :
              <>
                <div className={styles.middle}>Chargement</div>
                <div className={styles.right}></div>
              </>
            }

          </div>
        </div>
    </>
  )
}

export default ArticlesCategories