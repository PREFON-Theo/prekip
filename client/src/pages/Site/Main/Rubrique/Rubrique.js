import React, { useEffect, useState } from 'react';
import styles from "./Rubrique.module.scss"
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

// const allArticlesRaw = await axios.get('/articles')
// const allRubriquesRaw = await axios.get('/rubrique-type')

// let startValueOfRubrique = ''

const Rubrique = () => {
  const { element } = useParams();

  let articles = [];
  const [article, setArticle] = useState([])
  const [rubriqueTypeOfList, setRubriqueTypeOfList] = useState([])

  const fetchData = async () => {
    const rubriqueRaw = await axios.get(`/rubrique-type/link/${element}`)

    
    const rubrique = await axios.get('/rubrique-type')
    const rubriqueTypesRaw = rubrique.data.filter((rub) => rub._id === rubriqueRaw.data[0]?._id || rub.parent === rubriqueRaw.data[0]?._id)
    setRubriqueTypeOfList(rubriqueTypesRaw)

    for (let r = 0; r < rubriqueTypesRaw.length; r++) {
      const articleById = await axios.get(`/article/category/${rubriqueTypesRaw[r]._id}`)
      for (let a = 0; a < articleById.data.length; a++) {
        articles.push(articleById.data[a])   
      }
    }
    setArticle(articles)

  }

  useEffect(() => {
    fetchData();
  }, [element])


  return (
    <>
      <div className={styles.container}>
        <h2>Articles de la rubrique {element}</h2>

        {rubriqueTypeOfList.map((item, index) => (
          <div key={index} className={styles.rubrique}>
            <h3>{item.title}</h3>
            {
              article.length === 0 
              ?
                <div>Il n'y a aucun article dans cette rubrique pour le moment</div>
              :
                <>
                  {article.filter((art) => art.category === item._id).map((itemC, indexC) => (
                    <Link className={styles.article} key={indexC} to={`/article/${itemC._id}`}>
                      <div>{itemC.title}</div>
                    </Link>
                  ))}
                </>
            }
          </div>
        ))}

        
      </div>
    </>
  )
}

export default Rubrique