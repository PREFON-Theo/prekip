import React from 'react';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
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

import { Link, useLocation } from 'react-router-dom';


const ListLeftboard = () => {


  return (
    <>
      <Divider />
      <Typography sx={{margin: "20px 0 0 20px", fontWeight: "bold"}}>Utilisateurs</Typography>
      <List>
        {/* Liste des utilisateurs */}
        <Link to="user/list" style={{textDecoration: "none"}}>
          <ListItem key="contentList" disablePadding sx={{borderRight: useLocation().pathname === "/admin/user/list" ? "2px black solid" : ""}}>
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
          <ListItem key="contentList" disablePadding sx={{borderRight: useLocation().pathname === "/admin/content/list" ? "2px black solid" : ""}}>
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
          <ListItem key="rubriqueTypeList" disablePadding sx={{borderRight: useLocation().pathname === "/admin/rubrique-type/list" ? "2px black solid" : ""}}>
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
          <ListItem key="commentList" disablePadding sx={{borderRight: useLocation().pathname === "/admin/comment/list" ? "2px black solid" : ""}}>
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
          <ListItem key="forumList" disablePadding sx={{borderRight: useLocation().pathname === "/admin/forum/list" ? "2px black solid" : ""}}>
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
          <ListItem key="forumList" disablePadding sx={{borderRight: useLocation().pathname === "/admin/answer/list" ? "2px black solid" : ""}}>
            <ListItemButton>
              <ListItemIcon>
                <ChatBubbleOutlineRoundedIcon/>
              </ListItemIcon>
              <ListItemText primary="Réponses aux forums" sx={{color: "rgb(0,0,0,0.87)"}}/>
            </ListItemButton>
          </ListItem>
        </Link>

      </List>


      {/* Évènements */}

      <Divider />
      <Typography sx={{margin: "20px 0 0 20px", fontWeight: "bold"}}>Évènements</Typography>
      <List>
        {/* Liste des évènements */}
        <Link to="event/list" style={{textDecoration: "none"}}>
          <ListItem key="eventList" disablePadding sx={{borderRight: useLocation().pathname === "/admin/event/list" ? "2px black solid" : ""}}>
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
    </>
  );
}

export default ListLeftboard;