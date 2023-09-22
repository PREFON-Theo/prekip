import React, { useEffect, useState } from 'react'
import styles from "./ArticlesCategories.module.scss"
import { Link } from 'react-router-dom'


const ArticlesCategories = ({item}) => {

  const [firstSemiLength, setFirstSemiLength] = useState(0)
  const [secondSemiLength, setFSecondSemiLength] = useState(0)
  
  useEffect(() => {
    if(item.reference !== undefined){
      if(item.reference?.length > 0){
        setFirstSemiLength(item.reference?.length % 2 > 0 ? (item.reference?.length/2) +0.5 : item.reference?.length/2)
        setFSecondSemiLength(item.reference?.length % 2 > 0 ? (item.reference?.length/2) -0.5 : item.reference?.length/2)
      }
    }
  }, [item.reference])

  useEffect(() => {
  }, [firstSemiLength, secondSemiLength])

  return (
    <>
        <div className={styles.container}>
          <h2>{item.title}</h2>

          <div className={styles.wrapper}>
            <div className={styles.left}>
              <img src={item.imgLink || "https://placehold.co/400"} style={{width: "100%"}} alt={`img ${item.link}`} />
            </div>


            {item.reference !== undefined ?
              item.reference?.length > 0 ?
                <>
                  <div className={styles.middle}>
                    {item.reference?.slice(0, firstSemiLength).map((item, index) => (
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
                    {item.reference?.slice(firstSemiLength, item.reference?.length).map((item, index) => (
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
                </>
              :
              <>
                <div className={styles.middle}>Aucun contenu.</div>
                <div className={styles.right}></div>
              </>
            :
              <>
                <div className={styles.middle}>Chargement...</div>
                <div className={styles.right}></div>
              </>
            }

          </div>
        </div>
    </>
  )
}

export default ArticlesCategories