import React, { useEffect, useState } from 'react'
import styles from "./FormAddEvent.module.scss"

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


const FormAddEvent = ({dayInformations, user, handleCloseForm, handleOpenAlert, changeAlertValues, actualisateData}) => {
  const [eventInfo, setEventInfo] = useState({
    title: '',
    description: '',
    startDate: dayjs(dayInformations.dateStr),
    finishDate: '',
    type: '',
    owner: user._id,
  })
  const [eventTypeSelected, setEventTypeSelected] = useState('')
  
  const handleAddEvent = async () => {
    try {
        await axios
          .post('/event', {
            ...eventInfo,
            type: eventTypeSelected,
            startDate: eventTypeSelected === "teletravail" ? eventInfo.startDate.hour(9) : eventInfo.startDate,
            finishDate: eventTypeSelected === "teletravail" ? eventInfo.startDate.hour(18) : eventInfo.finishDate
          })
          handleOpenAlert()
          handleCloseForm()
          changeAlertValues('success', 'Évènement ajouté')
          actualisateData()
    }
    catch (err) {
      handleOpenAlert()
      changeAlertValues('error', err)
    }
  }

  return (
    <>
      <div className={styles.container}>
        <h1>
          Ajouter un évènement :
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
                >
                  {eventTypesList.map((item, index) => (
                    <MenuItem key={index} value={item.internalName} sx={{textAlign: 'left'}}>{item.title}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </div>
          
          {
            eventTypeSelected === "teletravail" ?
            <>
              <div className={styles.input_dates}>
                <LocalizationProvider dateAdapter={AdapterDayjs} sx={{marginRight: "2vh"}}>
                    <DatePicker label="Date de l'absence" format="DD/MM/YYYY" value={dayjs(eventInfo.startDate)} onChange={e => setEventInfo(prevValues => ({...prevValues, startDate: e}) )}/>
                </LocalizationProvider>
              </div>
            </>
            :
            eventTypeSelected === "reunion_entreprise" ?
                <>
                  <div className={styles.input_title}>
                    <TextField value={eventInfo.title} label="Titre" variant="outlined" onChange={e => setEventInfo(prevValues => ({...prevValues, title: e.target.value}) )}/>
                  </div>
                  <div className={styles.input_description}>
                    <TextField value={eventInfo.description} multiline maxRows={3} label="Description" variant="outlined" onChange={e => setEventInfo(prevValues => ({...prevValues, description: e.target.value}) )}/>
                  </div>
                  <div className={styles.input_dates}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} sx={{marginRight: "2vh"}}>
                        <DateTimePicker format="DD/MM/YYYY HH:mm:ss" ampm={false} label="Date de début" maxDate={dayjs(eventInfo.finishDate)} value={dayjs(eventInfo.startDate)} onChange={e => setEventInfo(prevValues => ({...prevValues, startDate: e}) )} />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker format="DD/MM/YYYY HH:mm:ss" ampm={false} label="Date de fin" minDate={dayjs(dayInformations.dateStr)} value={dayjs(eventInfo.finishDate)} onChange={e => setEventInfo(prevValues => ({...prevValues, finishDate: e}) )} />
                    </LocalizationProvider>
                  </div>
                </>
            :
              <div style={{marginBottom: '2vh'}}>Sélectionnez un type d'évènement</div>
          }


          <div className={styles.button}>
            <Button variant="contained" color='primary' onClick={handleAddEvent}>Créer l'évènement</Button>
          </div>

        </div>
      </div>
    </>
  )
}

export default FormAddEvent