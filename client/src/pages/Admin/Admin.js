import styles from "./Admin.module.scss"

import * as React from 'react';
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


import { Routes, Route, Link } from 'react-router-dom';
import ListUsers from "./Main/User/ListUsers";
import UserPage from "./Main/User/UserPage";
import ListContents from "./Main/Content/ListContents";
import ContentPage from "./Main/Content/ContentPage";
import IndexAdmin from "./Main/IndexAdmin/IndexAdmin";
import NotFoundAdmin from "./Errors/404/NotFoundAdmin";
import NewUser from "./Main/User/NewUser";

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
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerStatus = (state) => {
    setOpen(state);
  };

  return (
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

        <Divider />
        <Typography sx={{margin: "20px 0 0 20px", fontWeight: "bold"}}>Utilisateurs</Typography>
        <List>
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

        <Divider />
        <Typography sx={{margin: "20px 0 0 20px", fontWeight: "bold"}}>Contenus</Typography>
        <List>
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
          <Route path="content/page/:id" element={<ContentPage handleOpenAlert={handleOpenAlert} changeAlertValues={changeAlertValues}/>}/>
          <Route path='*' element={<NotFoundAdmin/>}/>
        </Routes>
      </Main>
    </Box>
  );
}

export default Admin;