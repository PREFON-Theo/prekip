import React from 'react'
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const MenuItemLink = ({title, link}) => {
    
    
    return (
        <>
            <Button
              id="basic-button"
              sx={{fontWeight: "600", color: 'black', textTransform: 'none', margin: "auto 0", textTransform: "uppercase"}}
              >
                <Link to={link}>
                  {title}
                </Link>
            </Button>
        </>
    );

}

export default MenuItemLink;