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

const ListEvents = ({handleOpenAlert, changeAlertValues}) => {
  const [events, setEvents] = useState()
  const [users, setUsers] = useState()
  const [eventTypes, setEventTypes] = useState()

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

  const fetchEventTypes = async () => {
    const eventTypesRaw = await axios.get('/event-type')
    setEventTypes(eventTypesRaw.data)
    console.log(eventTypesRaw.data)
  }

  useEffect(() => {
    fetchEvents();
    fetchUsers();
    fetchEventTypes();
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
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight: 'bold'}}>Titre</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Description</TableCell> {/* TODO Check */}
              <TableCell sx={{fontWeight: 'bold'}}>Date de début</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Date de fin</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Type</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Créateur de l'évènement</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events?.slice((page-1)*nbItemPerPage, page*nbItemPerPage).map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.title?.length > 25 ? `${item.title.substring(0,25)}...` : item.title?.length === 0 ? "-" : item.title}</TableCell>
                <TableCell>{item.description?.length > 25 ? `${item.description.substring(0,25)}...` : item.description?.length === 0 ? "-" : item.description}</TableCell>
                <TableCell>{item.startDate === null ? "-" : new Date(item.startDate).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>{item.finishDate === null ? "-" : new Date(item.finishDate).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>{eventTypes?.filter((et) => et._id === item.type)[0]?.title === undefined ? <span style={{fontStyle: "italic"}}>Non disponible</span> : eventTypes?.filter((et) => et._id === item.type)[0]?.title}</TableCell>
                 <TableCell>
                  {item.owner === "" 
                    ? "-" 
                    : users?.filter((usr) => usr._id === item.owner)[0]?.firstname === undefined ? <span style={{fontStyle: "italic"}}>Utilisateur non disponible</span>
                    : `${users?.filter((usr) => usr._id === item.owner)[0]?.firstname} ${users?.filter((usr) => usr._id === item.owner)[0]?.lastname.charAt(0)}.`
                  }
                </TableCell>
                <TableCell>
                  <Link to={`/calendar`} style={{marginRight: '10px'}}>
                    <Button variant='contained' color="warning">
                      <ArrowForwardRoundedIcon/>
                    </Button>
                  </Link>
                  <Button color='error' variant="contained" onClick={() => dialogApears(item._id)}><DeleteForeverRoundedIcon/></Button>
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