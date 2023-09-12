import React, { useContext, useEffect, useState } from 'react';
import styles from "./Actualities.module.scss"
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

import Pagination from '@mui/material/Pagination';
import { UserContext } from '../../../../utils/Context/UserContext/UserContext';



const nbItemPerPage = 10;

const Actualities = () => {
  const {cookies} = useContext(UserContext)
  const [actualities, setActulities] = useState([])
  const [users, setUsers] = useState()

  const [maxPage, setMaxPage] = useState(0)
  const [page, setPage] = useState(1)


  const fetchData = async () => {


    const actualitesRaw = await axios.get('/article/type/actuality', {headers: {jwt: cookies.token}})
    setActulities(actualitesRaw.data)
    setMaxPage(Math.ceil(actualitesRaw.data.length / nbItemPerPage))


    const usersRaw = await axios.get('/user', {headers: {jwt: cookies.token}})
    setUsers(usersRaw.data)

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
        <h2>Liste des dernières actualités</h2>

          <div className={styles.rubrique}>
            {
              actualities.length === 0 
              ?
                <div>Il n'y a aucune actualité pour le moment</div>
              :
                <>
                  {actualities.slice((page-1)*nbItemPerPage, page*nbItemPerPage).map((itemC, indexC) => (
                    <Link className={styles.article} key={indexC} to={`/${itemC.type}/${itemC._id}`}>
                      <div className={styles.title}>{itemC.title}</div>
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

export default Actualities