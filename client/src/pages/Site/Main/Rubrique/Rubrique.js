import React, { useContext, useEffect, useState } from 'react';
import styles from "./Rubrique.module.scss"
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

import Pagination from '@mui/material/Pagination';
import { UserContext } from '../../../../utils/Context/UserContext/UserContext';

import GppMaybeRoundedIcon from '@mui/icons-material/GppMaybeRounded';


// const allArticlesRaw = await axios.get('/articles')
// const allRubriquesRaw = await axios.get('/rubrique-type')

// let startValueOfRubrique = ''

// const nbItemPerPage = 5;

const Rubrique = () => {
  const { element } = useParams();
  const {cookies} = useContext(UserContext)

  let articles = [];
  const [article, setArticle] = useState([])
  const [rubriqueTypeOfList, setRubriqueTypeOfList] = useState([])
  const [users, setUsers] = useState()

  //const [maxPage, setMaxPage] = useState(0)
  //const [page, setPage] = useState(1)


  const fetchData = async () => {
    const rubriqueRaw = await axios.get(`/rubrique-type/link/${element}`, {headers: {jwt: cookies.token}})

    
    const rubrique = await axios.get('/rubrique-type', {headers: {jwt: cookies.token}})
    const rubriqueTypesRaw = rubrique.data?.filter((rub) => rub._id === rubriqueRaw.data[0]?._id || rub.parent === rubriqueRaw.data[0]?._id)
    setRubriqueTypeOfList(rubriqueTypesRaw)

    for (let r = 0; r < rubriqueTypesRaw?.length; r++) {
      const articleById = await axios.get(`/article/type/article/category/${rubriqueTypesRaw[r]._id}`, {headers: {jwt: cookies.token}})
      for (let a = 0; a < articleById.data?.length; a++) {
        articles.push(articleById.data[a])   
      }
    }
    setArticle(articles)
    // setMaxPage(Math.ceil(articles.length / nbItemPerPage))


    const usersRaw = await axios.get('/user', {headers: {jwt: cookies.token}})
    setUsers(usersRaw.data)

  }

  useEffect(() => {
    fetchData();
  }, [element])

  /*const handleChangePage = (event, value) => {
    setPage(value)
  }*/

  return (
    <>
      <div className={styles.container}>
        <h2>Articles de la rubrique {element}</h2>

        {
          !!rubriqueTypeOfList 
          ?
          rubriqueTypeOfList?.map((item, index) => (
            <div key={index} className={styles.rubrique}>
              <h3>{item.title}</h3>
              {
                article.filter((art) => art.category === item._id).length === 0 
                ?
                  <div style={{fontStyle: "italic", color: "grey"}}>Il n'y a aucun article dans cette rubrique pour le moment</div>
                :
                  <>
                    {article.filter((art) => art.category === item._id)
                    /*.slice((page-1)*nbItemPerPage, page*nbItemPerPage)*/
                    .map((itemC, indexC) => (
                      <Link className={styles.article} key={indexC} to={`/${itemC.type}/${itemC._id}`}>
                        
                        <div className={styles.title}>{itemC.important ? <GppMaybeRoundedIcon sx={{verticalAlign:"bottom", marginRight: "10px", color: "gold"}} fontSize='small'/> : <></>}{itemC.title}</div>
                        
                        <div className={styles.infos}>
                          <div>par {users?.filter((us) => us._id === itemC.author)[0]?.firstname} {users?.filter((us) => us._id === itemC.author)[0]?.lastname}, le {new Date(itemC.created_at).toLocaleDateString('fr-FR')}</div>
                        </div>
                      </Link>
                    ))}
                    {/* <div className={styles.pagination}>
                      <Pagination count={maxPage} color="primary" value={page} onChange={handleChangePage}/> 
                    </div>  */}
                  </>
              }
            </div>
          ))
          :
             <div style={{fontStyle: "italic", color: "grey"}}>Aucune rubrique disponible</div>
        }

        
      </div>
    </>
  )
}

export default Rubrique