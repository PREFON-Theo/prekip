import React, { useEffect, useState, useContext } from 'react'
import styles from "./HomeLinks.module.scss"
import { Link } from 'react-router-dom'
import axios from 'axios'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { UserContext } from '../../../../../utils/Context/UserContext/UserContext';


const HomeLinks = () => {
  const { user } = useContext(UserContext)
  const [links, setLinks] = useState()

  const fetchDataLink = async () => {
    const LinkRaw = await axios
      .get('/homelink')
    setLinks(LinkRaw.data)
  }

  useEffect(() => {
    fetchDataLink();
  }, [])

  return (
    <>
    <div className={styles.container}>
      <div className={styles.title}>
        <h2>Liens utiles</h2>
        {
        !!user && user.roles.includes("Administrateur") ?
          <Link to="edit-static-link">
            <DriveFileRenameOutlineIcon color='action'/>
          </Link>
        :
          <></>
        }
      </div>
      <ul>
        {links?.length === 0 ?
          "Il n'y a pas de lien, ajoutez-en"
        :
          links?.map((item, index) => (
            <li key={index}>
              <Link to={item.link} target='_blank'>{item.text}</Link>
            </li>
          ))
        }
      </ul>
    </div>
    </>
  )
}

export default HomeLinks