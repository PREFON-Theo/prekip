import React, { useContext, useState  } from 'react'
import styles from "./Menu.module.scss"
import {UserContext} from "../../../../utils/Context/UserContext/UserContext"
import { Link, useParams } from "react-router-dom"
import ButtonMyAccount from './ButtonMyAccount/ButtonMyAccount';
import MenuItemLink from "./MenuItemLink/MenuItemLink"

import logo from "../../../../utils/assets/Logo PREKIP.png"
import SearchItem from './SearchItem/SearchItem';

const MenuFct = () => {
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
      <nav className={styles.container}>
        <div className={styles.left}>
          <Link to={'/'}>
            <img src={logo} alt="Logo of the website"/>
          </Link>
        </div>


        <div className={styles.middle}>
          <div className={styles.item_middlemenu}>
            <MenuItemLink title="Rubrique" list={content}/>
          </div>
          <div className={styles.item_middlemenu}>
            <MenuItemLink title="Calendrier"/>
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
          <ButtonMyAccount user={user}/>
        </div>

      </nav>
    </>
  );
}

export default MenuFct;