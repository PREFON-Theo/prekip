import React from 'react'
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import ListRoundedIcon from '@mui/icons-material/ListRounded';

const MenuItemLinkDropdown = ({title, list, mobile}) => {
    
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
            <Button
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              sx={{color: 'black', fontWeight: "600", margin: "auto 0", textTransform: "uppercase"}}
              >
              {mobile ? <ListRoundedIcon/> : title}

              <KeyboardArrowDownRoundedIcon sx={{verticalAlign: 'bottom'}} fontSize="small"/>
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
                {
                  !!list ?
                    list?.map((item, index) => (
                      <Link to={`rubrique/${item.link}`} key={index} style={{textDecoration: "none"}}>
                        <MenuItem onClick={handleClose} sx={{color: "#000"}}>
                          {item.title}
                        </MenuItem>
                      </Link>
                    ))
                  :
                    <MenuItem disabled sx={{color: "#000"}}>
                      Il n'y a pas de rubrique disponible...
                    </MenuItem>
                }
              </span>
            </Menu>
        </>
    );

}

export default MenuItemLinkDropdown;