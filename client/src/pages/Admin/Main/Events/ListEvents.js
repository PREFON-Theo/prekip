import React, { useEffect, useState } from 'react'
import styles from "./ListEvents.module.scss"
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

const nbItemPerPage = 10;
const eventTypesList = [
  {
    title: "Télétravail",
    internalName: "teletravail",
  },
  {
    title: "Réunion d'entreprise",
    internalName: "reunion_entreprise",
  }
]

const ListEvents = ({handleOpenAlert, changeAlertValues}) => {
  const [events, setEvents] = useState()
  const [users, setUsers] = useState()

  const [dialogOpened, setDialogOpened] = useState(false)
  const [eventToDelete, setEventToDelete] = useState("")

  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(0)

  const fetchEvents = async () => {
    const eventsRaw = await axios.get('/event')
    setEvents(eventsRaw.data)
    setMaxPage(Math.ceil(eventsRaw.data.length / 10))
  }

  const fetchUsers = async () => {
    const usersRaw = await axios.get('/user')
    setUsers(usersRaw.data)
  }

  useEffect(() => {
    fetchEvents();
    fetchUsers();
  }, [])

  const dialogApears = (event_id) => {
    setEventToDelete(event_id)
    setDialogOpened(true)
  }

  const deletionComplete = () => {
    setEventToDelete("")
    setDialogOpened(false)
  }


  const deleteContent = async () => {
    try {
      await axios.delete(`/event/${eventToDelete}`)
      handleOpenAlert()
      changeAlertValues('success', 'Évènement supprimé')
      fetchEvents();
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
      <h2>Liste des évènements</h2>
      <TableContainer>
        <Table sx={{ minWidth: "auto" }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight: 'bold'}}>Titre</TableCell>
              <TableCell className={styles.semi_width_first} sx={{fontWeight: 'bold'}}>Description</TableCell>{/* TODO Check */}
              <TableCell className={styles.semi_width_second} sx={{fontWeight: 'bold'}}>Date de début</TableCell>
              <TableCell className={styles.semi_width_second} sx={{fontWeight: 'bold'}}>Date de fin</TableCell>
              <TableCell className={styles.semi_width_first} sx={{fontWeight: 'bold'}}>Type</TableCell>
              <TableCell className={styles.semi_width_second} sx={{fontWeight: 'bold'}}>Créateur de l'évènement</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events?.slice((page-1)*nbItemPerPage, page*nbItemPerPage).map((item, index) => (
              <TableRow key={index}>
                <TableCell >{item.title?.length > 25 ? `${item.title.substring(0,25)}...` : item.title?.length === 0 ? "-" : item.title}</TableCell>
                <TableCell className={styles.semi_width_first}>{item.description?.length > 25 ? `${item.description.substring(0,25)}...` : item.description?.length === 0 ? "-" : item.description}</TableCell>
                <TableCell className={styles.semi_width_second}>{item.startDate === null ? "-" : `${new Date(item.startDate).toLocaleDateString('fr-FR')} ${new Date(item.startDate).toLocaleTimeString('fr-FR')}`}</TableCell>
                <TableCell className={styles.semi_width_second}>{item.finishDate === null ? "-" : `${new Date(item.finishDate).toLocaleDateString('fr-FR')} ${new Date(item.finishDate).toLocaleTimeString('fr-FR')}`}</TableCell>
                <TableCell className={styles.semi_width_first}>{eventTypesList?.filter((et) => et.internalName === item.type)[0]?.title === undefined ? <span style={{fontStyle: "italic"}}>Non disponible</span> : eventTypesList?.filter((et) => et.internalName === item.type)[0]?.title}</TableCell>
                 <TableCell className={styles.semi_width_second}>
                  {item.owner === "" 
                    ? "-" 
                    : users?.filter((usr) => usr._id === item.owner)[0]?.firstname === undefined ? <span style={{fontStyle: "italic"}}>Utilisateur non disponible</span>
                    : `${users?.filter((usr) => usr._id === item.owner)[0]?.firstname} ${users?.filter((usr) => usr._id === item.owner)[0]?.lastname.charAt(0)}.`
                  }
                </TableCell>
                <TableCell>
                  <Link to={`/calendar`} style={{margin: '10px'}}>
                    <Button variant='contained' color="warning">
                      <ArrowForwardRoundedIcon/>
                    </Button>
                  </Link>
                  <Button color='error' sx={{margin: "10px"}} variant="contained" onClick={() => dialogApears(item._id)}><DeleteForeverRoundedIcon/></Button>
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
              Vous allez supprimer définitivement l'évènement "{events?.filter((us) => us._id === eventToDelete)[0]?.title}", confirmez vous ?
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

export default ListEvents;