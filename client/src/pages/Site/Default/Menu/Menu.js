import React, { useContext, useEffect, useState  } from 'react'
import styles from "./Menu.module.scss"
import {UserContext} from "../../../../utils/Context/UserContext/UserContext"
import { Link, Navigate, createSearchParams, useNavigate, useSearchParams } from "react-router-dom"
import ButtonMyAccount from './ButtonMyAccount/ButtonMyAccount';
import MenuItemLink from "./MenuItemLink/MenuItemLink"

import logo from "../../../../utils/assets/Logo PREKIP.png"

import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import MenuItemLinkDropdown from './MenuItemLink/MenuItemLinkDropdown';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import axios from 'axios';
import { TextField } from '@mui/material';

const RubriquesRaw = await axios.get("/rubrique-type/parents")
const RubriqueList = RubriquesRaw.data

const MenuFct = ({handleOpenLoginForm,  handleOpenAlert, changeAlertValues}) => {
  const {user} = useContext(UserContext)
  const [textToSearch, setTextToSearch] = useState('')

  const navigate = useNavigate()
  

  const searching = async () => {
    if(textToSearch !== ''){
      return navigate({
        pathname: 'search',
        search: `?${createSearchParams({
          q: textToSearch
        })}`
      })
    }
  }

  const handleKeyUp = (e) => {
    if(e.key === "Enter"){
      searching();
    }
  }


  return (
    <>
      <header>

        <nav className={styles.container}>
          <div className={styles.left}>
            <Link to={'/'}>
              <img src={logo} alt="Logo of the website"/>
            </Link>
          </div>


          <div className={styles.middle}>
            <div className={styles.item_middlemenu}>
              <MenuItemLinkDropdown title="Rubrique" list={RubriqueList}/>
            </div>
            <div className={styles.item_middlemenu}>
              <MenuItemLink title="Calendrier" link="/calendar"/>
            </div>
            <div className={styles.item_middlemenu}>
              <MenuItemLink title="Chiffres" link="/stats"/>
            </div>
            <div className={styles.item_middlemenu}>
              <MenuItemLink title="Forum" link="/forum"/>
            </div>
          </div>

          <div className={styles.right}>
           {!!user && (
              <Link to='/new-article'>
                <Button 
                  variant="contained" 
                  color="success" 
                  className={styles.link_login}
                  >

                  <AddIcon/>Contenu
                </Button>
              </Link>
            )}
            <Box sx={{ display: 'flex', alignItems: 'flex-end', margin: '0 15px' }}>

              <TextField
                placeholder="Recherche..."
                variant="standard"
                value={textToSearch}
                onChange={(e) => setTextToSearch(e.target.value)}
                onKeyUp={handleKeyUp}
              />

              <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5, cursor: 'pointer' }} onClick={searching} />

            </Box>
            {!!user && (
              <>
                <div className={styles.account}>
                  <span>Bonjour, {user.firstname} {user.lastname}</span> 
                </div>
              </>
            )}
            {!!user ? 
            <ButtonMyAccount handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>
            :
              //<MenuItem>

                <Button onClick={() => handleOpenLoginForm(true)} variant="contained" color="success" className={styles.link_login}>
                  Connexion
                </Button>

              //</MenuItem>
            }
          </div>

        </nav>
      </header>
    </>
  );
}

export default MenuFct;
