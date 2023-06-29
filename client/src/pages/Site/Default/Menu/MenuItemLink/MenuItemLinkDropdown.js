import React from 'react'
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { Link, Navigate } from 'react-router-dom';

const MenuItemLinkDropdown = ({title,list}) => {
    
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
    
    return (
        <>
          <div>
            <Button
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              sx={{color: 'black', textTransform: 'none'}}
              >
              {title}
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
                <span>
                  {list.map((item, index) => (
                    <Link to={`rubrique/${item.link}`} key={index} style={{textDecoration: "none"}}>
                      <MenuItem onClick={handleClose} sx={{color: "#000"}}>
                        {item.title}
                      </MenuItem>
                    </Link>
                  ))}
                </span>
              </Menu>
          </div>
        </>
    );

}

export default MenuItemLinkDropdown;