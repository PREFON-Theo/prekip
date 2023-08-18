import React, { useEffect, useState } from 'react'
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

const ListAnswers = ({handleOpenAlert, changeAlertValues}) => {
  const [answers, setAnswers] = useState()
  const [users, setUsers] = useState()
  const [forums, setForums] = useState()

  const [dialogOpened, setDialogOpened] = useState(false)
  const [answerToDelete, setAnswerToDelete] = useState("")

  const fetchAnswers = async () => {
    const answersRaw = await axios.get('/answer')
    setAnswers(answersRaw.data)
  }

  const fetchUsers = async () => {
    const usersRaw = await axios.get('/user')
    setUsers(usersRaw.data)
  }

  const fetchForums = async () => {
    const forumRaw = await axios.get('/forum')
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
      await axios.delete(`/answer/${answerToDelete}`)
      handleOpenAlert()
      changeAlertValues('success', 'Réponse supprimée')
      fetchAnswers();
      deletionComplete();
    }
    catch (err) {
      handleOpenAlert()
      changeAlertValues('error', err)
    }
  
  }

  return (
    <div className={styles.container}>
      <h2>Liste des réponses aux forums</h2>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight: 'bold'}}>Réponse</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Nombre de vote</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Auteur</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Date d'ajout</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Nom du forum</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {answers?.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.text?.length > 25 ? `${item.text.substring(0,25)}...` : item.text?.length === 0 ? "-" : item.text}</TableCell>
                <TableCell>{item.vote}</TableCell>
                <TableCell>
                  {item.user_id === "" 
                    ? "-" 
                    : `${users?.filter((usr) => usr._id === item.user_id)[0]?.firstname} ${users?.filter((usr) => usr._id === item.user_id)[0]?.lastname.charAt(0)}.`
                  }
                </TableCell>
                <TableCell>{item.created_at === null ? "-" : new Date(item.created_at).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>
                  {
                    forums?.filter((fr) => fr._id === item.forum_id)[0]?.title === undefined 
                    ? <span style={{fontStyle: 'italic'}}>Non disponible</span>
                    : forums?.filter((fr) => fr._id === item.forum_id)[0]?.title

                  }
                </TableCell>
                <TableCell>
                  <ButtonGroup variant="contained">
                    <Link to={`/forum`}>
                      <Button variant='contained' color="warning">
                        <ArrowForwardRoundedIcon/>
                      </Button>
                    </Link>
                    <Button color='error' onClick={() => dialogApears(item._id)}><DeleteForeverRoundedIcon/></Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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