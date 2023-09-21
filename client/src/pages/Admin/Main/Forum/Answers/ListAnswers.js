import React, { useContext, useEffect, useState } from 'react'
import styles from "./ListAnswers.module.scss"
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

const ListAnswers = ({handleOpenAlert, changeAlertValues}) => {
  const {cookies} = useContext(UserContext)
  const [answers, setAnswers] = useState()
  const [users, setUsers] = useState()
  const [forums, setForums] = useState()

  const [dialogOpened, setDialogOpened] = useState(false)
  const [answerToDelete, setAnswerToDelete] = useState("")

  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(0)

  const fetchAnswers = async () => {
    const answersRaw = await axios.get('/answer', {headers: {jwt: cookies.token}})
    setAnswers(answersRaw.data)
    setMaxPage(Math.ceil(answersRaw.data?.length / 10) || 0)
  }

  const fetchUsers = async () => {
    const usersRaw = await axios.get('/user', {headers: {jwt: cookies.token}})
    setUsers(usersRaw.data)
  }

  const fetchForums = async () => {
    const forumRaw = await axios.get('/forum', {headers: {jwt: cookies.token}})
    setForums(forumRaw.data)
  }

  useEffect(() => {
    fetchAnswers();
    fetchUsers();
    fetchForums();
  }, [])

  const dialogApears = (answer_id) => {
    setAnswerToDelete(answer_id)
    setDialogOpened(true)
  }

  const deletionComplete = () => {
    setAnswerToDelete("")
    setDialogOpened(false)
  }


  const deleteContent = async () => {
    try {
      await axios.delete(`/answer/${answerToDelete}`, {headers: {jwt: cookies.token}})
      handleOpenAlert()
      changeAlertValues('success', 'Réponse supprimée')
      fetchAnswers();
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
      <h2>Liste des réponses aux forums</h2>
      <TableContainer>
        <Table sx={{ minWidth: "auto" }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight: 'bold'}}>Réponse</TableCell>
              <TableCell className={styles.semi_width_first} sx={{fontWeight: 'bold'}}>Nombre de vote</TableCell>
              <TableCell className={styles.semi_width_second} sx={{fontWeight: 'bold'}}>Auteur</TableCell>
              <TableCell className={styles.semi_width_first} sx={{fontWeight: 'bold'}}>Date d'ajout</TableCell>
              <TableCell className={styles.semi_width_second} sx={{fontWeight: 'bold'}}>Nom du forum</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {answers?.slice((page-1)*nbItemPerPage, page*nbItemPerPage).map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.text?.length > 25 ? `${item.text.substring(0,25)}...` : item.text?.length === 0 ? "-" : item.text}</TableCell>
                <TableCell className={styles.semi_width_first}>{item.vote}</TableCell>
                <TableCell className={styles.semi_width_second}>
                  {item.user_id === "" 
                    ? "-" 
                    : `${users?.filter((usr) => usr._id === item.user_id)[0]?.firstname} ${users?.filter((usr) => usr._id === item.user_id)[0]?.lastname.charAt(0)}.`
                  }
                </TableCell>
                <TableCell className={styles.semi_width_first} >{item.created_at === null ? "-" : new Date(item.created_at).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell className={styles.semi_width_second}>
                  {
                    forums?.filter((fr) => fr._id === item.forum_id)[0]?.title === undefined 
                    ? <span style={{fontStyle: 'italic'}}>Non disponible</span>
                    : `${forums?.filter((fr) => fr._id === item.forum_id)[0]?.title.substring(0,25)}...`

                  }
                </TableCell>
                <TableCell>
                  <Link to={`/forum`} style={{margin: '10px'}}>
                    <Button variant='contained' color="warning">
                      <ArrowForwardRoundedIcon/>
                    </Button>
                  </Link>
                  <Button color='error' sx={{margin: '10px'}} variant="contained" onClick={() => dialogApears(item._id)}><DeleteForeverRoundedIcon/></Button>
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
              Vous allez supprimer définitivement le answer "{
                answers?.filter((us) => us._id === answerToDelete)[0]?.text?.length > 25 ? `${answers?.filter((us) => us._id === answerToDelete)[0]?.text.substring(0,25)}...` : answers?.filter((us) => us._id === answerToDelete)[0]?.text?.length === 0 ? "-" : answers?.filter((us) => us._id === answerToDelete)[0]?.text
              }", confirmez vous ?
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

export default ListAnswers;