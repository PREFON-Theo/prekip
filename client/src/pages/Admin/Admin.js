import styles from "./Admin.module.scss"

import React, {useState, useContext, useEffect} from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import NewspaperRoundedIcon from '@mui/icons-material/NewspaperRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';


import { Routes, Route, Link, Navigate } from 'react-router-dom';
import ListUsers from "./Main/User/ListUsers";
import UserPage from "./Main/User/UserPage";
import ListContents from "./Main/Content/ListContents";
import IndexAdmin from "./Main/IndexAdmin/IndexAdmin";
import NotFoundAdmin from "./Errors/404/NotFoundAdmin";
import NewUser from "./Main/User/NewUser";
import ListForums from "./Main/Forum/ListForums";
import ListEvents from './Main/Events/ListEvents';
import ListRubriqueType from './Main/Content/RubriqueType/ListRubriqueType';
import ListComments from './Main/Content/Comments/ListComments';
import ListAnswers from './Main/Forum/Answers/ListAnswers';
import NewRubrique from "./Main/Content/RubriqueType/NewRubrique";
import { UserContext } from "../../utils/Context/UserContext/UserContext";

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {shouldForwardProp: (prop) => prop !== 'open'})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Admin = ({handleOpenAlert, changeAlertValues}) => {

  const {user, ready} = useContext(UserContext)
  const [redirection, setRedirection] = useState(false);


  useEffect(() => {
    setRedirection(false)
    if((ready === "yes" && !user?.roles.includes("Administrateur")) || ready === "no"){
      setRedirection(true)
      handleOpenAlert()
      changeAlertValues("warning", "Vous n'êtes pas authorisé à accédez à cette page")
    }
  }, [user, ready])



  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerStatus = (state) => {
    setOpen(state);
  };

  return (
    <>
      {redirection ? <Navigate replace to={'/'}/> : <></>}
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open} sx={{backgroundColor: "#757575"}}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => handleDrawerStatus(true)}
              edge="start"
              sx={{ mr: 2, ...(open && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              <Link to="/admin" style={{textDecoration: "none", color:"#fff"}}>
                Zone Administrateur
              </Link>
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <IconButton onClick={() => handleDrawerStatus(false)}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>


          {/* Utilisateurs */}

          <Divider />
          <Typography sx={{margin: "20px 0 0 20px", fontWeight: "bold"}}>Utilisateurs</Typography>
          <List>
            {/* Liste des utilisateurs */}
            <Link to="user/list" style={{textDecoration: "none"}}>
              <ListItem key="contentList" disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <GroupRoundedIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Liste des utilisateurs" sx={{color: "rgb(0,0,0,0.87)"}}/>
                </ListItemButton>
              </ListItem>
            </Link>
          </List>


          {/* Contenus */}

          <Divider />
          <Typography sx={{margin: "20px 0 0 20px", fontWeight: "bold"}}>Contenus</Typography>
          <List>
            {/* Liste des contenus */}
            <Link to="content/list" style={{textDecoration: "none"}}>
              <ListItem key="contentList" disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <NewspaperRoundedIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Liste des contenus" sx={{color: "rgb(0,0,0,0.87)"}}/>
                </ListItemButton>
              </ListItem>
            </Link>
            
            {/* Liste des types de rubriques des contenus */}
            <Link to="rubrique-type/list" style={{textDecoration: "none"}}>
              <ListItem key="rubriqueTypeList" disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <FormatListBulletedRoundedIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Types de rubriques des contenus" sx={{color: "rgb(0,0,0,0.87)"}}/>
                </ListItemButton>
              </ListItem>
            </Link>

            {/* Liste des commentaires sur les contenus */}
            <Link to="comment/list" style={{textDecoration: "none"}}>
              <ListItem key="commentList" disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <ChatBubbleOutlineRoundedIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Commentaires sur les contenus" sx={{color: "rgb(0,0,0,0.87)"}}/>
                </ListItemButton>
              </ListItem>
            </Link>
          </List>


          {/* Forums */}

          <Divider />
          <Typography sx={{margin: "20px 0 0 20px", fontWeight: "bold"}}>Forums</Typography>
          <List>

            {/* Liste des forums */}
            <Link to="forum/list" style={{textDecoration: "none"}}>
              <ListItem key="forumList" disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <ForumRoundedIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Liste des forums" sx={{color: "rgb(0,0,0,0.87)"}}/>
                </ListItemButton>
              </ListItem>
            </Link>

            {/* Liste des réponses aux forums */}
            <Link to="answer/list" style={{textDecoration: "none"}}>
              <ListItem key="forumList" disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <ChatBubbleOutlineRoundedIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Réponses aux forums" sx={{color: "rgb(0,0,0,0.87)"}}/>
                </ListItemButton>
              </ListItem>
            </Link>

          </List>


          {/* Evènements */}

          <Divider />
          <Typography sx={{margin: "20px 0 0 20px", fontWeight: "bold"}}>Evènements</Typography>
          <List>
            {/* Liste des évènements */}
            <Link to="event/list" style={{textDecoration: "none"}}>
              <ListItem key="eventList" disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <EventNoteRoundedIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Liste des évènements" sx={{color: "rgb(0,0,0,0.87)"}}/>
                </ListItemButton>
              </ListItem>
            </Link>
          </List>


          <Divider />
        </Drawer>
        <Main open={open}>
          <DrawerHeader />
          {/* routes ici */}
          <Routes>
            <Route index element={<IndexAdmin handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
            <Route path="user/list" element={<ListUsers handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
            <Route path="user/page/:id" element={<UserPage handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
            <Route path="user/new" element={<NewUser handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>

            <Route path="content/list" element={<ListContents handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>

            <Route path="forum/list" element={<ListForums handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
            <Route path="event/list" element={<ListEvents handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
            <Route path="rubrique-type/list" element={<ListRubriqueType handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
            <Route path="rubrique-type/new" element={<NewRubrique handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
            <Route path="comment/list" element={<ListComments handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
            <Route path="answer/list" element={<ListAnswers handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>

            <Route path='*' element={<NotFoundAdmin/>}/>
          </Routes>
        </Main>
      </Box>
    </>
  );
}

export default Admin;