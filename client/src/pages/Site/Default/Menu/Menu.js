import React, { useContext, useState } from 'react'
import styles from "./Menu.module.scss"
import {UserContext} from "../../../../utils/Context/UserContext/UserContext"
import { Link, useParams } from "react-router-dom"
import PersonIcon from '@mui/icons-material/Person';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';
import ButtonMyAccount from './ButtonMyAccount/ButtonMyAccount';
import Button from '@mui/material/Button';

const MenuFct = () => {
  const {user} = useContext(UserContext)
  const {subpage} = useParams()
  console.log(subpage)

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  /*const content = [
    { title: "one", link: "/hello" },
    { title: "two", link: "/hello" },
    { title: "three", link: "/hello" },
    { title: "four", link: "/hello" },
  ]*/

  const imageSizes = [
    { name: "horizontal", width: 600, height: 380 },
    { name: "vertical", width: 400, height: 650 },
    { name: "thumbnail", width: 300, height: 300 },
  ];


  return (
    <>
      <nav className={styles.container}>
        <div className={styles.left}>
          <Link to={'/'}>
            <img src="https://placehold.co/200" alt="Logo of the website"/>
          </Link>
        </div>
        <div className={styles.middle}>

          <div className={styles.item_middlemenu}>
            <Link to={"/compte"}>Mon compte</Link>
          </div>
          <div className={styles.item_middlemenu}>
            <Link to={"/homepage"}>homepage</Link>
          </div>
          <div className={styles.item_middlemenu}>
            <Link to={"/second"}>Secondary</Link>
          </div>
          <div className={styles.item_middlemenu}>
          <div>
            <Button
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              Dashboard
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              {imageSizes.map((item) => {
                <MenuItem onClick={handleClose}>{item.height}</MenuItem>
              })}
            </Menu>
          </div>
         </div>

        </div>
        <div className={styles.right}>
          {!!user && (
            <>
              <div className={styles.account}>
                <span>Bonjour, {user.username}</span> 
                  {/* 
                    <Link to={user ? '/compte' : '/auth'}>
                      <PersonIcon/>
                    </Link>
                  */}
              </div>
              {/* <Button variant="contained" className={styles.logout_button} color="error" ><Link to={"/logout"}>Déconnexion</Link></Button> */}
            </>
          )}
          <ButtonMyAccount user={user}/>
        </div>

      </nav>
    </>
  );
}

export default MenuFct;