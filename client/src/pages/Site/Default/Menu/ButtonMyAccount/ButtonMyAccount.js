import React, { useState } from 'react'
import PersonIcon from '@mui/icons-material/Person';
import { useContext } from 'react';

import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';

import { Link } from "react-router-dom"
import styles from "./ButtonMyAccount.module.scss"

import axios from 'axios';
import { UserContext } from '../../../../../utils/Context/UserContext/UserContext';

const ButtonMyAccount = ({handleOpenAlert, changeAlertValues}) => {

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const {setUser} = useContext(UserContext);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutSubmit = async () => {
    axios.post('/user/logout');
    setUser(null)
    handleOpenAlert();
    changeAlertValues('success', "Vous êtes déconnecté");
}

  return (
    <>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <PersonIcon/>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <div>

            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Avatar fontSize="small" />
              </ListItemIcon>
              <Link to={'/compte'} style={{color: '#000', textDecoration: 'none'}}>
                Mon compte
              </Link>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleClose}>
              <ListItemIcon sx={{color: 'red'}}>
                <Logout fontSize="small" />
              </ListItemIcon>
              <a onClick={handleLogoutSubmit} style={{color: 'red', textDecoration: 'none'}}>
                Déconnexion
              </a>
            </MenuItem>
        </div>

      </Menu>
    </>
  );
}

export default ButtonMyAccount;