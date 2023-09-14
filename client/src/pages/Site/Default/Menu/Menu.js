import React, { useContext, useEffect, useState  } from 'react'
import styles from "./Menu.module.scss"
import {UserContext} from "../../../../utils/Context/UserContext/UserContext"
import { Link, createSearchParams, useNavigate } from "react-router-dom"
import MenuItemLink from "./MenuItemLink/MenuItemLink"

import logo2 from "../../../../utils/assets/Logo PREKIP v2.png"

import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import MenuItemLinkDropdown from './MenuItemLink/MenuItemLinkDropdown';
import SearchIcon from '@mui/icons-material/Search';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import axios from 'axios';

import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import { TextField, Box } from '@mui/material'

import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import Dialog from '@mui/material/Dialog';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import ListRoundedIcon from '@mui/icons-material/ListRounded';


const MenuFct = ({handleOpenLoginForm,  handleOpenAlert, changeAlertValues}) => {
  const {user, setUser, setReady, cookies} = useContext(UserContext)
  const [textToSearch, setTextToSearch] = useState('')
  const [openSearch, setOpenSearch] = useState(false)

  const [rubriqueList, setRubriqueList] = useState();

  const [anchorElLeft, setAnchorElLeft] = React.useState(null);
  const openLeft = Boolean(anchorElLeft);
  const handleClickLeft = (event) => {
    setAnchorElLeft(event.currentTarget);
  };
  const handleCloseLeft = () => {
    setAnchorElLeft(null);
  };

  const fetchRubriques = async () => {
    const rubriquesRaw = await axios.get("/rubrique-type/parents", {headers: {jwt: cookies.token}})
    setRubriqueList(rubriquesRaw.data)
  }

  const [anchorElRight, setAnchorElRight] = React.useState(null);
  const openRight = Boolean(anchorElRight);
  const handleClickRight = (event) => {
    setAnchorElRight(event.currentTarget);
  };
  const handleCloseRight = () => {
    setAnchorElRight(null);
  };

  const navigate = useNavigate()
  

  const searching = async () => {
    setOpenSearch(false)
    if(textToSearch !== ''){
      return navigate({
        pathname: 'search',
        search: `?${createSearchParams({
          q: textToSearch
        })}`
      })
    }
  }

  const handleKeyUp = (e) => {
    if(e.key === "Enter"){
      searching();
    }
  }

  const handleLogoutSubmit = async () => {
    await axios.post('/user/logout');
    setUser(null)
    handleOpenAlert();
    changeAlertValues('success', "Vous êtes déconnecté");
    setReady("no")
  }


  useEffect(() => {
    fetchRubriques();
  }, [])

  return (
    <>
      <header>
        <div className={styles.top_menu}>
          <Link to={'/'}>
            <img src={logo2} alt="Logo de PREKIP" />
          </Link>
          <div>
            {!!user ? 
              <div className={styles.after_connection}>

                {/* Au dessus de 940px */}
                <div className={styles.accountFullWidth}>
                  <Link to={'/compte'} style={{color: '#000', textDecoration: 'none'}}>
                    <Button variant='contained' size="small" color='primary' sx={{height: 'auto', margin: "auto 0"}}><AccountCircleRoundedIcon sx={{verticalAlign:"bottom"}} fontSize='small'/>&nbsp;Compte</Button>
                  </Link>
                </div>
                <div className={styles.contentFullWidth}>
                  <Link to={'/new-article'} style={{color: '#000', textDecoration: 'none', margin: "auto 0 auto 20px"}}>
                    <Button variant='contained' size="small" color='success' sx={{height: 'auto', margin: "auto 0"}}><AddIcon sx={{verticalAlign:"bottom"}} fontSize='small'/>&nbsp;Contenu</Button>
                  </Link>
                </div>

                {/* En dessous de 940px */}
                <div className={styles.accountSemiWidth}>
                  <Link to={'/compte'} style={{color: '#000', textDecoration: 'none'}}>
                    <Button variant='contained' size="small" color='primary' sx={{height: 'auto', margin: "auto 0"}}><AccountCircleRoundedIcon sx={{verticalAlign:"bottom"}} fontSize='small'/></Button>
                  </Link>
                </div>
                <div className={styles.contentSemiWidth}>
                  <Link to={'/new-article'} style={{color: '#000', textDecoration: 'none', margin: "auto 0 auto 20px"}}>
                    <Button variant='contained' size="small" color='success' sx={{height: 'auto', margin: "auto 0"}}><AddIcon sx={{verticalAlign:"bottom"}} fontSize='small'/></Button>
                  </Link>
                </div>
                                
                {
                user.roles.includes('Administrateur') ?
                <>
                  <div className={styles.adminFullWidth}>
                    <Link to={'/admin'} style={{color: '#000', textDecoration: 'none', margin: "auto 0 auto 20px"}}>
                      <Button variant='contained' size="small" color='warning' sx={{height: 'auto'}}><SecurityRoundedIcon sx={{verticalAlign:"bottom"}} fontSize='small'/>&nbsp;Zone Admin</Button>
                    </Link>
                  </div>
                  <div className={styles.adminSemiWidth}>
                  <Link to={'/admin'} style={{color: '#000', textDecoration: 'none', margin: "auto 0 auto 20px"}}>
                    <Button variant='contained' size="small" color='warning' sx={{height: 'auto'}}><SecurityRoundedIcon sx={{verticalAlign:"bottom"}} fontSize='small'/></Button>
                  </Link>
                </div>
                </>
                :
                  <></>
                }
                <div className={styles.logoutFullWidth}>
                  <Button variant='contained' size="small" onClick={handleLogoutSubmit} color='error' sx={{height: 'auto', margin: "auto 0 auto 20px"}}><LogoutRoundedIcon sx={{verticalAlign:"bottom"}} fontSize='small'/>&nbsp;Déconnexion</Button>
                </div>
                <div className={styles.logoutSemiWidth}>
                  <Button variant='contained' size="small" onClick={handleLogoutSubmit} color='error' sx={{height: 'auto', margin: "auto 0 auto 20px"}}><LogoutRoundedIcon sx={{verticalAlign:"bottom"}} fontSize='small'/></Button>
                </div>
              </div>
            :
              <>
                {/* <Button className={styles.loginFullWidth} size="small"variant='contained' onClick={() => handleOpenLoginForm(true)} color='success' sx={{height: 'auto', margin: "auto 0"}}><LoginRoundedIcon sx={{verticalAlign:"bottom"}} fontSize='small'/>&nbsp;Se connecter</Button> */}
                <Button className={styles.loginSemiWidth} size="small" variant='contained' onClick={() => handleOpenLoginForm(true)} color='success' sx={{height: 'auto', margin: "auto 0"}}><LoginRoundedIcon sx={{verticalAlign:"bottom"}} fontSize='small'/></Button>
              </>
            }

          </div>
          
        </div>

        <nav className={styles.nav_menu}>
          <div className={styles.items_menu_full_width}>
            <div className={styles.home}>
             <Link to={'/'} style={{display: 'contents'}}>
                <HomeRoundedIcon sx={{margin: "auto 0"}}/>
              </Link>
            </div>
            <div className={styles.item_middlemenu}>
              <MenuItemLinkDropdown title="Rubriques" mobile={false} list={rubriqueList}/>
            </div>
            <div className={styles.item_middlemenu}>
              <MenuItemLink title="Calendrier" link="/calendar"/>
            </div>
            <div className={styles.item_middlemenu}>
              <MenuItemLink title="Chiffres" link="/stats"/>
            </div>
            <div className={styles.item_middlemenu}>
              <MenuItemLink title="Forum" link="/forum"/>
            </div>
            <div className={styles.search}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', margin: 'auto 15px', height: "fit-content" }}>

                <TextField
                  placeholder="Recherche..."
                  variant="standard"
                  value={textToSearch}
                  onChange={(e) => setTextToSearch(e.target.value)}
                  onKeyUp={handleKeyUp}
                />

                <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5, cursor: 'pointer' }} onClick={searching} />

              </Box>
            </div>
          </div>

          <div className={styles.items_menu_semi_width}>

            <Button
              id="basic-button"
              aria-controls={openLeft ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openLeft ? 'true' : undefined}
              onClick={handleClickLeft}
              sx={{color: 'black', fontWeight: "600", margin: "auto 0", textTransform: "uppercase"}}
            >
              Rubriques
              <KeyboardArrowDownRoundedIcon sx={{verticalAlign: 'bottom'}} fontSize="small"/>
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorElLeft}
              open={openLeft}
              onClose={handleCloseLeft}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <span>
                {rubriqueList?.map((item, index) => (
                  <Link to={`rubrique/${item.link}`} key={index} style={{textDecoration: "none"}}>
                    <MenuItem onClick={handleCloseLeft} sx={{color: "#000"}}>
                      {item.title}
                    </MenuItem>
                  </Link>
                ))}
              </span>
            </Menu>


            <Button
              id="basic-button"
              aria-controls={openRight ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openRight ? 'true' : undefined}
              onClick={handleClickRight}
              sx={{color: 'black', fontWeight: "600", margin: "auto 0", textTransform: "uppercase"}}
            >
              Autre
              <KeyboardArrowDownRoundedIcon sx={{verticalAlign: 'bottom'}} fontSize="small"/>
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorElRight}
              open={openRight}
              onClose={handleCloseRight}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <span>
                  <Link to={`/calendar`} style={{textDecoration: "none"}}>
                    <MenuItem onClick={handleCloseRight} sx={{color: "#000"}}>
                      Calendrier
                    </MenuItem>
                  </Link>

                  <Link to={`/stats`} style={{textDecoration: "none"}}>
                    <MenuItem onClick={handleCloseRight} sx={{color: "#000"}}>
                      Chiffres PREFON
                    </MenuItem>
                  </Link>

                  <Link to={`/forum`} style={{textDecoration: "none"}}>
                    <MenuItem onClick={handleCloseRight} sx={{color: "#000"}}>
                      Forum
                    </MenuItem>
                  </Link>

              </span>
            </Menu>

            <Button
              sx={{color: 'black', fontWeight: "600", margin: "auto 0", textTransform: "uppercase"}}
              onClick={() => setOpenSearch(true)}
            >
              <SearchIcon/>
            </Button>

              

            <Dialog
              open={openSearch}
              onClose={() => setOpenSearch(false)}
            >
              <div className={styles.wrapper_mobile_search}>
                <div className={styles.container_inputs_max}>
                  <TextField value={textToSearch} onChange={(e) => setTextToSearch(e.target.value)} sx={{marginRight: '20px'}} label="Champ à rechercher..." variant="outlined"/>
                  <Button variant="contained" color='success' onClick={searching}>Rechercher</Button>
                </div>
                <div className={styles.container_inputs_min}>
                  <TextField value={textToSearch} sx={{width: "100%"}} onChange={(e) => setTextToSearch(e.target.value)} label="Champ à rechercher..." variant="outlined"/>
                  <Button variant="contained" sx={{marginTop: "20px", width: "100%"}} color='success' onClick={searching}>Rechercher</Button>
                </div>
              </div>
                    
            </Dialog>
          </div>

        </nav>
      </header>
    </>
  );
}

export default MenuFct;
