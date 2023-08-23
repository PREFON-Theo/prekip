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
        <div className={styles.top_menu}>
          <Link to={'/'}>
            <img src={logo2} alt="Logo de PREKIP" />
          </Link>
          <div>
            <Button variant='contained' color='success' sx={{height: 'auto', margin: "auto 0"}}>Se connecter</Button>
          </div>
        </div>

        <nav 
          className={styles.nav_menu}
          //style={{boxShadow: useLocation().pathname === "/" ? "0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1)" : ""}}
        >
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
              <Link to={'/search'} style={{display: 'contents'}}>
                <SearchIcon sx={{margin: "auto 0"}}/>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* <header>

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
      </header> */}
    </>
  );
}

export default MenuFct;
