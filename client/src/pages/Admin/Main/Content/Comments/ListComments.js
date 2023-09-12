import React, { useContext, useEffect, useState } from 'react'
import styles from "./ListComments.module.scss"
import axios from 'axios'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Dialog } from '@mui/material';
import { Link } from 'react-router-dom';

import Pagination from '@mui/material/Pagination';
import { UserContext } from '../../../../../utils/Context/UserContext/UserContext';

const nbItemPerPage = 10;

const ListComments = ({handleOpenAlert, changeAlertValues}) => {
  const {cookies} = useContext(UserContext)
  const [comments, setComments] = useState()
  const [users, setUsers] = useState()
  const [contents, setContents] = useState()

  const [dialogOpened, setDialogOpened] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState("")

  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(0)

  const fetchComments = async () => {
    const commentsRaw = await axios.get('/comment')
    setComments(commentsRaw.data)
    setMaxPage(Math.ceil(commentsRaw.data.length / 10))
  }

  const fetchUsers = async () => {
    const usersRaw = await axios.get('/user', {headers: {jwt: cookies.token}})
    setUsers(usersRaw.data)
  }

  const fetchContents = async () => {
    const contentsRaw = await axios.get('/article')
    setContents(contentsRaw.data)
  }

  useEffect(() => {
    fetchComments();
    fetchUsers();
    fetchContents();
  }, [])

  const dialogApears = (comment_id) => {
    setCommentToDelete(comment_id)
    setDialogOpened(true)
  }

  const deletionComplete = () => {
    setCommentToDelete("")
    setDialogOpened(false)
  }


  const deleteContent = async () => {
    try {
      await axios.delete(`/comment/${commentToDelete}`)
      handleOpenAlert()
      changeAlertValues('success', 'Comment supprimé')
      fetchComments();
      deletionComplete();
    }
    catch (err) {
      handleOpenAlert()
      changeAlertValues('error', err)
    }
  
  }

  const handleChangePage = (event, value) => {
    setPage(value)
  }

  return (
    <div className={styles.container}>
      <h2>Liste des commentaires sur les contenus</h2>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight: 'bold'}}>Commentaire</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Auteur du commentaire</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Date d'ajout</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {comments?.slice((page-1)*nbItemPerPage, page*nbItemPerPage).map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.text?.length > 25 ? `${item.text.substring(0,25)}...` : item.text?.length === 0 ? "-" : item.text}</TableCell>
                <TableCell>
                  {item.user_id === "" 
                    ? "-" 
                    : `${users?.filter((usr) => usr._id === item.user_id)[0]?.firstname} ${users?.filter((usr) => usr._id === item.user_id)[0]?.lastname.charAt(0)}.`
                  }
                </TableCell>
                <TableCell>{item.date === null ? "-" : new Date(item.date).toLocaleDateString('fr-FR')}</TableCell>

                <TableCell>
                  <Link to={`/${contents?.filter((cont) => cont._id === item.article_id)[0]?.type}/${item.article_id}`} style={{marginRight: '10px'}}>
                    <Button variant='contained' color="warning">
                      <ArrowForwardRoundedIcon/>
                    </Button>
                  </Link>
                    <Button color='error' variant='contained' onClick={() => dialogApears(item._id)}><DeleteForeverRoundedIcon/></Button>
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
              Vous allez supprimer définitivement le comment "{comments?.filter((us) => us._id === commentToDelete)[0]?.title}", confirmez vous ?
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

export default ListComments;