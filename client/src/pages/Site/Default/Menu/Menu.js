import React, { useContext, useState  } from 'react'
import styles from "./Menu.module.scss"
import {UserContext} from "../../../../utils/Context/UserContext/UserContext"
import { Link } from "react-router-dom"
import ButtonMyAccount from './ButtonMyAccount/ButtonMyAccount';
import MenuItemLink from "./MenuItemLink/MenuItemLink"
import SearchItem from './SearchItem/SearchItem';

import logo from "../../../../utils/assets/Logo PREKIP.png"

import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import MenuItemLinkDropdown from './MenuItemLink/MenuItemLinkDropdown';
import axios from 'axios';

const RubriquesRaw = await axios.get("/rubrique-type/parents")
const RubriqueList = RubriquesRaw.data

const MenuFct = ({handleOpenLoginForm,  handleOpenAlert, changeAlertValues}) => {
  const {user} = useContext(UserContext)


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
              <MenuItemLink title="Chiffres PREFON" link="/stats"/>
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

                  <AddIcon/>Article
                </Button>
              </Link>
            )}
            <SearchItem/>
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
