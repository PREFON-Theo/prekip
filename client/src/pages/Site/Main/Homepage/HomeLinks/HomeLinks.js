import React, { useEffect, useState } from 'react'
import style from "./HomeLinks.module.scss"
import { Link } from 'react-router-dom'
import axios from 'axios'
import EditRoundedIcon from '@mui/icons-material/EditRounded';


const HomeLinks = () => {
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
    <div className={style.container}>
      <div className={style.title}>
        <h2>Liens utils</h2>
        <Link to="edit-static-link">
          <EditRoundedIcon color='primary'/>
        </Link>
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