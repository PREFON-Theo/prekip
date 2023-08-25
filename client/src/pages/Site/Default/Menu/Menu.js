import React, { useContext, useState  } from 'react'
import styles from "./Menu.module.scss"
import {UserContext} from "../../../../utils/Context/UserContext/UserContext"
import { Link, createSearchParams, useNavigate } from "react-router-dom"
import MenuItemLink from "./MenuItemLink/MenuItemLink"

import logo2 from "../../../../utils/assets/Logo PREKIP v2.png"

import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import MenuItemLinkDropdown from './MenuItemLink/MenuItemLinkDropdown';
import SearchIcon from '@mui/icons-material/Search';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import axios from 'axios';

import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import { TextField, Box } from '@mui/material'

const RubriquesRaw = await axios.get("/rubrique-type/parents")
const RubriqueList = RubriquesRaw.data

const MenuFct = ({handleOpenLoginForm,  handleOpenAlert, changeAlertValues}) => {
  const {user, setUser, setReady} = useContext(UserContext)
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

  const handleLogoutSubmit = async () => {
    axios.post('/user/logout');
    setUser(null)
    handleOpenAlert();
    changeAlertValues('success', "Vous êtes déconnecté");
    setReady("no")
}

  return (
    <>
      <header>
        <div className={styles.top_menu}>
          <Link to={'/'}>
            <img src={logo2} alt="Logo de PREKIP" />
          </Link>
          <div>
            {!!user ? 
              <div className={styles.after_connection}>
                <div>
                  <Link to={'/compte'} style={{color: '#000', textDecoration: 'none'}}>
                    <Button variant='contained' color='primary' sx={{height: 'auto', margin: "auto 0"}}><AccountCircleRoundedIcon sx={{verticalAlign:"bottom"}} fontSize='small'/>&nbsp;Compte</Button>
                  </Link>
                </div>
                <div>
                  <Link to={'/new-article'} style={{color: '#000', textDecoration: 'none', margin: "auto 0 auto 20px"}}>
                    <Button variant='contained' color='success' sx={{height: 'auto', margin: "auto 0"}}><AddIcon sx={{verticalAlign:"bottom"}} fontSize='small'/>&nbsp;Contenu</Button>
                  </Link>
                </div>
                {
                user.roles.includes('Administrateur') ?
                  <div>
                    <Link to={'/admin'} style={{color: '#000', textDecoration: 'none', margin: "auto 0 auto 20px"}}>
                      <Button variant='contained' color='warning' sx={{height: 'auto'}}><SecurityRoundedIcon sx={{verticalAlign:"bottom"}} fontSize='small'/>&nbsp;Zone Admin</Button>
                    </Link>
                  </div>
                :
                  <></>
                }
                <div>
                  <Button variant='contained' onClick={handleLogoutSubmit} color='error' sx={{height: 'auto', margin: "auto 0 auto 20px"}}><LogoutRoundedIcon sx={{verticalAlign:"bottom"}} fontSize='small'/>&nbsp;Déconnexion</Button>
                </div>
              </div>
            :
              <Button variant='contained' onClick={() => handleOpenLoginForm(true)} color='success' sx={{height: 'auto', margin: "auto 0"}}><LoginRoundedIcon sx={{verticalAlign:"bottom"}} fontSize='small'/>&nbsp;Se connecter</Button>
            }

          </div>
          
        </div>

        <nav className={styles.nav_menu}>
          <div className={styles.items_menu}>
            <div className={styles.home}>
             <Link to={'/'} style={{display: 'contents'}}>
                <HomeRoundedIcon sx={{margin: "auto 0"}}/>
              </Link>
            </div>
            <div className={styles.item_middlemenu}>
              <MenuItemLinkDropdown title="Rubriques" list={RubriqueList}/>
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
            <div className={styles.search}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', margin: 'auto 15px', height: "fit-content" }}>

                <TextField
                  placeholder="Recherche..."
                  variant="standard"
                  value={textToSearch}
                  onChange={(e) => setTextToSearch(e.target.value)}
                  onKeyUp={handleKeyUp}
                />

                <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5, cursor: 'pointer' }} onClick={searching} />

              </Box>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default MenuFct;
