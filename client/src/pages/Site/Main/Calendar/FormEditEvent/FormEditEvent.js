import React, { useEffect, useState } from 'react'
import styles from "./FormEditEvent.module.scss"

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import axios from 'axios';


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

const FormEditEvent = ({idEventToEdit, user, userList, handleCloseForm, handleOpenAlert, changeAlertValues, actualisateData}) => {
  const [eventInfo, setEventInfo] = useState({
    title: '',
    description: '',
    startDate: '',
    finishDate: '',
    type: '',
    owner: '',
  })

  const [authorizedToEdit, setAuthorizedToEdit] = useState(false)

  const [eventTypeSelected, setEventTypeSelected] = useState('')


  const fetchData = async () => {
    const eventData = await axios.get('/event/' + idEventToEdit)
    setEventInfo({
      title: eventData.data.title,
      description: eventData.data.description,
      startDate: dayjs(eventData.data.startDate),
      finishDate: dayjs(eventData.data.finishDate),
      type: eventData.data.type,
      owner: eventData.data.owner
    })
    setEventTypeSelected(eventData.data.type)

    if(user){
      if(eventData.data.owner === user._id || user.roles.includes('Modérateur') || user.roles.includes('Administrateur')){
        setAuthorizedToEdit(true)
      }
      else {
        setAuthorizedToEdit(false)
      }
    }


  };

  useEffect(() => {
    fetchData();
  }, [])

  const handleUpdateEvent = async () => {
    try {
      if(authorizedToEdit){
        await axios
          .patch(`/event/${idEventToEdit}` , {
            ...eventInfo,
            type: eventTypeSelected,
            title: eventTypeSelected === "teletravail" ? "" : eventInfo.title,
            description: eventTypeSelected === "teletravail" ? "" : eventInfo.description
          })
          handleOpenAlert()
          handleCloseForm()
          changeAlertValues('success', 'Évènement modifié')
          actualisateData()
      }
      else {
        changeAlertValues('error', "Unauthorized")
      }
    }
    catch (err) {
      changeAlertValues('error', err)
    }
  }

  const handleDeleteEvent = async () => {
    try {
      if(authorizedToEdit){
        await axios
          .delete('/event/' + idEventToEdit)
          handleOpenAlert()
          handleCloseForm()
          changeAlertValues('success', 'Évènement supprimé')
          actualisateData()
      }
    }
    catch (err) {
      changeAlertValues('error', err)
    }
  }


  return (
    <>
      <div className={styles.container}>
        <h1>
          Informations de l'évènement :&nbsp;
          {eventTypesList?.filter((et) => et.internalName === eventInfo.type)[0]?.title === undefined ?
            <span style={{fontStyle: "italic"}}>type inconnu</span> 
          : eventTypesList?.filter((et) => et.internalName === eventInfo.type)[0]?.title}
            &nbsp;de&nbsp;
          {userList?.filter((et) => et._id === eventInfo.owner)[0]?.firstname === undefined ? 
              <span style={{fontStyle: "italic"}}>Utilisateur inconnu</span>
            : 
              `${userList?.filter((et) => et._id === eventInfo.owner)[0]?.firstname} ${userList?.filter((et) => et._id === eventInfo.owner)[0]?.lastname}`
          }
        </h1>
        <div className={styles.container_inputs}>
          <div className={styles.input_event_type}>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="select-label">Type d'évènement</InputLabel>
                <Select
                  labelId="select-label"
                  value={eventTypeSelected}
                  label="Type d'évènement"
                  onChange={e =>  setEventTypeSelected(e.target.value)}
                  disabled={!authorizedToEdit}
                >
                  {eventTypesList.map((item, index) => (
                    <MenuItem key={index} value={item.internalName} sx={{textAlign: 'left'}}>{item.title}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </div>

          {
            eventTypeSelected === '' ?
              <div style={{marginBottom: '2vh'}}>Sélectionnez un type d'évènement</div>
            :
            eventTypeSelected === "teletravail" ?
              <>
                <div className={styles.input_dates}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} sx={{marginRight: "2vh"}}>
                      <DatePicker label="Date de l'absence" disabled={!authorizedToEdit} format="DD/MM/YYYY" value={dayjs(eventInfo.startDate)} onChange={e => setEventInfo(prevValues => ({...prevValues, startDate: e}) )}/>
                  </LocalizationProvider>
                </div>
              </>
            :
            eventTypeSelected === "reunion_entreprise" ?
              <>
                <div className={styles.input_title}>
                  <TextField value={eventInfo.title} label="Titre" disabled={!authorizedToEdit} variant="outlined" onChange={e => setEventInfo(prevValues => ({...prevValues, title: e.target.value}) )}/>
                </div>
                <div className={styles.input_description}>
                  <TextField value={eventInfo.description} disabled={!authorizedToEdit} multiline maxRows={3} label="Description" variant="outlined" onChange={e => setEventInfo(prevValues => ({...prevValues, description: e.target.value}) )}/>
                </div>
                <div className={styles.input_dates}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} sx={{marginRight: "2vh"}}>
                      <DateTimePicker format="DD/MM/YYYY HH:mm:ss" disabled={!authorizedToEdit} ampm={false} label="Date de début" maxDate={dayjs(eventInfo.finishDate)} value={dayjs(eventInfo.startDate)} onChange={e => setEventInfo(prevValues => ({...prevValues, startDate: e}) )} />
                  </LocalizationProvider>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker format="DD/MM/YYYY HH:mm:ss" disabled={!authorizedToEdit} ampm={false} label="Date de fin" minDate={dayjs(eventInfo.startDate)} value={dayjs(eventInfo.finishDate)} onChange={e => setEventInfo(prevValues => ({...prevValues, finishDate: e}) )} />
                  </LocalizationProvider>
                </div>
              </>
            :
              <></>
          }
          { 
            user && user._id === eventInfo.owner ?
              <div className={styles.button}>
                <Button variant="contained" color='warning' onClick={handleUpdateEvent}>Modifier l'évènement</Button>
                <Button variant="contained" color='error' onClick={handleDeleteEvent}>Supprimer l'évènement</Button>
              </div>
            :
              <></>  
          }

        </div>

      </div>
    </>
  )
}

export default FormEditEvent