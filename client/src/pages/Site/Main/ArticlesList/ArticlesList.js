import React, { useContext, useEffect, useState } from 'react';
import styles from "./ArticlesList.module.scss"
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

import Pagination from '@mui/material/Pagination';
import { UserContext } from '../../../../utils/Context/UserContext/UserContext';



const nbItemPerPage = 10;

const ArticlesList = () => {
  const {cookies} = useContext(UserContext)
  const [actualities, setActulities] = useState([])
  const [users, setUsers] = useState()
  const [rubriques, setRubriques] = useState()

  const [maxPage, setMaxPage] = useState(0)
  const [page, setPage] = useState(1)


  const fetchData = async () => {

    const actualitesRaw = await axios.get('/article/type/article', {headers: {jwt: cookies.token}})
    setActulities(actualitesRaw.data)
    setMaxPage(Math.ceil(actualitesRaw.data.length / nbItemPerPage))


    const usersRaw = await axios.get('/user', {headers: {jwt: cookies.token}})
    setUsers(usersRaw.data)

    const rubriquesRaw = await axios.get('/rubrique-type', {headers: {jwt: cookies.token}})
    setRubriques(rubriquesRaw.data)
    
  }

  useEffect(() => {
    fetchData();
  }, [])

  const handleChangePage = (event, value) => {
    setPage(value)
  }

  return (
    <>
      <div className={styles.container}>
        <h2>Liste des derniers articles</h2>

          <div className={styles.rubrique}>
            {
              actualities.length === 0 
              ?
                <div style={{fontStyle: "italic", color: "grey"}}>Il n'y a aucun article pour le moment</div>
              :
                <>
                  {actualities.slice((page-1)*nbItemPerPage, page*nbItemPerPage).map((itemC, indexC) => (
                    <Link className={styles.article} key={indexC} to={`/${itemC.type}/${itemC._id}`}>
                      <div className={styles.title}>
                        <div>{itemC.title}</div>
                        <div style={{color: "#b81717"}}>{rubriques?.filter((item) => item._id === itemC.category)[0]?.title || <span style={{fontStyle: 'italic', color:"grey"}}>Non disponible</span>}</div>
                      </div>
                      <div className={styles.infos}>par {users?.filter((us) => us._id === itemC.author)[0]?.firstname} {users?.filter((us) => us._id === itemC.author)[0]?.lastname} <br/> le {new Date(itemC.created_at).toLocaleDateString('fr-FR')}</div>
                    </Link>
                  ))}
                  <div className={styles.pagination}>
                    <Pagination count={maxPage} color="primary" value={page} onChange={handleChangePage}/> 
                  </div> 
                </>
            }
          </div>
        
      </div>
    </>
  )
}

export default ArticlesList