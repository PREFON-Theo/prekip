import React, { useContext, useEffect, useState } from 'react'
import styles from "./ListForums.module.scss"
import axios from 'axios'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { Dialog } from '@mui/material';
import { Link } from 'react-router-dom';

import Pagination from '@mui/material/Pagination';
import { UserContext } from '../../../../utils/Context/UserContext/UserContext';

const nbItemPerPage = 10;

const ListForums = ({handleOpenAlert, changeAlertValues}) => {
  const {cookies} = useContext(UserContext)
  const [forums, setForums] = useState()
  const [users, setUsers] = useState()

  const [dialogOpened, setDialogOpened] = useState(false)
  const [forumToDelete, setForumToDelete] = useState("")

  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(0)

  const fetchForums = async () => {
    const forumsRaw = await axios.get('/forum', {headers: {jwt: cookies.token}})
    setForums(forumsRaw.data)
    setMaxPage(Math.ceil(forumsRaw.data?.length / nbItemPerPage))
  }

  const fetchUsers = async () => {
    const usersRaw = await axios.get('/user', {headers: {jwt: cookies.token}})
    setUsers(usersRaw.data)
  }

  useEffect(() => {
    fetchForums();
    fetchUsers();
  }, [])

  const dialogApears = (forum_id) => {
    setForumToDelete(forum_id)
    setDialogOpened(true)
  }

  const deletionComplete = () => {
    setForumToDelete("")
    setDialogOpened(false)
  }


  const deleteContent = async () => {
    try {
      await axios.delete(`/answer/forum/${forumToDelete}`, {headers: {jwt: cookies.token}})
      await axios.delete(`/forum/${forumToDelete}`, {headers: {jwt: cookies.token}})
      handleOpenAlert()
      changeAlertValues('success', 'Forum supprimé')
      fetchForums();
      deletionComplete();
    }
    catch (err) {
      //handleOpenAlert()
      //changeAlertValues('error', err)
      console.log(err)
    }
  
  }
  
  const handleChangePage = (event, value) => {
    setPage(value)
  }

  return (
    <div className={styles.container}>
      <h2>Liste des forums</h2>
      <TableContainer>
        <Table sx={{ minWidth: 'auto' }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight: 'bold'}}>Titre</TableCell>
              <TableCell className={styles.semi_width_first} sx={{fontWeight: 'bold'}}>Description</TableCell>
              <TableCell className={styles.semi_width_second} sx={{fontWeight: 'bold'}}>Date d'ajout</TableCell>
              <TableCell className={styles.semi_width_second} sx={{fontWeight: 'bold'}}>Créateur</TableCell>
              <TableCell className={styles.semi_width_first} sx={{fontWeight: 'bold'}}>Contient un fichier joint ?</TableCell>
              <TableCell className={styles.semi_width_first} sx={{fontWeight: 'bold'}}>Contenu important ?</TableCell>
              <TableCell className={styles.semi_width_first} sx={{fontWeight: 'bold'}}>Etat</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {forums?.slice((page-1)*nbItemPerPage, page*nbItemPerPage).map((item, index) => (
              <TableRow key={index}>
                <TableCell sx={{filter: item.closed ? "opacity(50%)" : ""}}>{item.title?.length > 25 ? `${item.title.substring(0,25)}...` : item.title?.length === 0 ? "-" : item.title}</TableCell>
                <TableCell className={styles.semi_width_first} sx={{filter: item.closed ? "opacity(50%)" : ""}}>{item.description?.length > 25 ? `${item.description.substring(0,25)}...` : item.description?.length === 0 ? "-" : item.description}</TableCell>
                <TableCell className={styles.semi_width_second} sx={{filter: item.closed ? "opacity(50%)" : ""}}>{item.created_at === null ? "-" : new Date(item.created_at).toLocaleDateString('fr-FR')}</TableCell>
                 <TableCell className={styles.semi_width_second} sx={{filter: item.closed ? "opacity(50%)" : ""}}>
                  {item.author === "" 
                    ? "-" 
                    : `${users?.filter((usr) => usr._id === item.author)[0]?.firstname} ${users?.filter((usr) => usr._id === item.author)[0]?.lastname.charAt(0)}.`
                  }
                </TableCell>
                <TableCell className={styles.semi_width_first} sx={{filter: item.closed ? "opacity(50%)" : ""}}>{item.file !== undefined ? "Oui" : "Non"}</TableCell> {/* TODO Check*/}
                <TableCell className={styles.semi_width_first} sx={{filter: item.closed ? "opacity(50%)" : ""}}>{item.important === true ? "Oui ": "Non" }</TableCell>
                <TableCell className={styles.semi_width_first} sx={{filter: item.closed ? "opacity(50%)" : ""}}>{item.closed === true ? "Fermé ": "Ouvert" }</TableCell>
                <TableCell>
                  <Link to={`/forum`} style={{margin: '10px'}}>
                    <Button variant='contained' color="warning">
                      <ArrowForwardRoundedIcon/>
                    </Button>
                  </Link>
                  <Button color='error' sx={{margin: '10px'}} variant='contained' onClick={() => dialogApears(item._id)}><DeleteForeverRoundedIcon/></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className={styles.pagination}>
        <Pagination count={maxPage} color="primary" value={page} onChange={handleChangePage}/> 
      </div>

      <div className={styles.dialog_delete}>
        <Dialog
          open={dialogOpened}
          onClose={() => setDialogOpened(false)}
        >
          <div style={{padding: "50px"}}>
            <div>
              Vous allez supprimer définitivement le forum "{forums?.filter((us) => us._id === forumToDelete)[0]?.title}", confirmez vous ?
            </div>
            <div style={{margin: "20px 0 0 auto"}}>
              <ButtonGroup sx={{width: '100%'}}>
                <Button variant='outlined' sx={{width: '50%'}} onClick={() => deletionComplete()}>Annuler</Button>
                <Button variant='contained' sx={{width: '50%'}} color="error" onClick={() => deleteContent()}>Supprimer</Button>
              </ButtonGroup>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
}

export default ListForums;