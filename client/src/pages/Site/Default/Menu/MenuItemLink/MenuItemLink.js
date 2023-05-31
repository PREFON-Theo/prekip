import React from 'react'
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';

const MenuItemLink = ({title,list}) => {
    
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
            {!!list ?
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

                    {list?.map((item, index) => (
                      <Link to={item.link}  style={{textDecoration: "none"}}>
                        <MenuItem onClick={handleClose} key={index} sx={{color: "#000"}}>
                          {item.title}
                        </MenuItem>
                      </Link>
                    ))}
                  </span>
              </Menu>
              :
              <>
              </>
            }
          </div>
        </>
    );

}

export default MenuItemLink;