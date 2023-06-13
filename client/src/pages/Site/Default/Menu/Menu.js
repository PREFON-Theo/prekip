import React, { useContext, useState  } from 'react'
import styles from "./Menu.module.scss"
import {UserContext} from "../../../../utils/Context/UserContext/UserContext"
import { Link, useParams } from "react-router-dom"
import ButtonMyAccount from './ButtonMyAccount/ButtonMyAccount';
import MenuItemLink from "./MenuItemLink/MenuItemLink"
import SearchItem from './SearchItem/SearchItem';

import logo from "../../../../utils/assets/Logo PREKIP.png"

import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import MenuItemLinkDropdown from './MenuItemLink/MenuItemLinkDropdown';

const MenuFct = ({handleOpenLoginForm}) => {
  const {user} = useContext(UserContext)


  const content = [
    { title: "Informatique", link: "/hello" },
    { title: "Ressource Humaines", link: "/hello" },
    { title: "Marketing", link: "/hello" },
    { title: "Direction", link: "/hello" },
    { title: "Agence", link: "/hello" },
  ]



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
              <MenuItemLinkDropdown title="Rubrique" list={content}/>
            </div>
            <div className={styles.item_middlemenu}>
              <MenuItemLink title="Calendrier"link="/calendar"/>
            </div>
          </div>

          <div className={styles.right}>
            <SearchItem/>
            {!!user && (
              <>
                <div className={styles.account}>
                  <span>Bonjour, {user.username}</span> 
                </div>
              </>
            )}
            {!!user ? 
            <ButtonMyAccount/>
            :
              <MenuItem>

                <Button onClick={() => handleOpenLoginForm(true)} variant="outlined" color="success" className={styles.link_login}>
                  Connexion
                </Button>

              </MenuItem>
            }
          </div>

        </nav>
      </header>
    </>
  );
}

export default MenuFct;