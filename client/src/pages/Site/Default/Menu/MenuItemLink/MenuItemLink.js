import React from 'react'
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { Link, Navigate } from 'react-router-dom';

const MenuItemLink = ({title, link}) => {
    
    
    return (
        <>
            <Button
              id="basic-button"
              sx={{color: 'black', textTransform: 'none'}}
              >
                <Link to='/calendar'>
                  {title}
                </Link>
            </Button>
        </>
    );

}

export default MenuItemLink;