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

import ListSubheader from '@mui/material/ListSubheader';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import OutlinedInput from '@mui/material/OutlinedInput';


const FormAddEvent = ({dayInformations, eventTypes, user, userList, handleCloseForm, handleOpenAlert, changeAlertValues, actualisateData}) => {
  const [eventInfo, setEventInfo] = useState({
    title: '',
    description: '',
    startDate: dayjs(dayInformations.dateStr),
    finishDate: '',
    type: '',
    owner: user._id,
    usersTagged: []
  })
  const [parentType, setParentType] = useState('')
  const [typeOfAbs, setTypeOfAbs] = useState('')
  
  const handleAddEvent = async () => {
    try {
        await axios
          .post('/event', eventInfo)
          .then(() => console.log("Added"))
          .then(() => handleOpenAlert())
          .then(() => handleCloseForm())
          .then(() => changeAlertValues('success', 'Evenement ajouté'))
          .then(() => actualisateData())
          .catch((e) => changeAlertValues('error', e))
    }
    catch (err) {
      changeAlertValues('error', err)
    }
  }

  const handleChangeTypeOfAbs = (t) => {
    console.log(eventInfo.startDate.hour)
    setTypeOfAbs(t)
    if(t === 1){
      setEventInfo(prevValues => ({...prevValues, startDate: eventInfo.startDate.hour(9), finishDate: eventInfo.startDate.hour(18)}))
    }
    else if (t === 2) {
      setEventInfo(prevValues => ({...prevValues, startDate: eventInfo.startDate.hour(9), finishDate: eventInfo.startDate.hour(12)}))
    }
    else if (t === 3) {
      setEventInfo(prevValues => ({...prevValues, startDate: eventInfo.startDate.hour(12), finishDate: eventInfo.startDate.hour(18)}))
    }
  }

  const handleChangeTypeOfEvent = (eve) => {
    setEventInfo(prevValues => ({...prevValues, type: eve}) )
    parentType === "Absences" 
    ?
      setEventInfo(prevValues => ({...prevValues, title: '', description: '', usersTagged: []}))
    :
    parentType === "Global"
    ?
      setEventInfo(prevValues => ({...prevValues, usersTagged: []}))
    :
      console.log("rien")
  }

  useEffect(() =>{
    setParentType(eventTypes.filter((e) => e._id === eventTypes.filter((et) => et._id === eventInfo.type)[0]?.parent)[0]?.title)
  }, [eventInfo.type])


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
                <InputLabel id="demo-simple-select-label">Type d'évènement</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={eventInfo.type}
                  label="Type d'évènement"
                  onChange={e => handleChangeTypeOfEvent(e.target.value)}
                >
                  {eventTypes.map((item, index) => (
                    item.parent === "" 
                    ? 
                      <ListSubheader key={index} >{item.title}</ListSubheader>
                    :
                      <MenuItem key={index} value={item._id} sx={{textAlign: 'left'}}>{item.title}</MenuItem>

                  ))}
                </Select>
              </FormControl>
            </Box>
          </div>
          {/* {console.log(eventTypes.filter((e) => e._id === eventTypes.filter((et) => et._id === eventInfo.type)[0]?.parent)[0]?.title)} */}
          
          {
            parentType === undefined ?
            <div style={{marginBottom: '2vh'}}>Sélectionnez un type d'évènement</div>
            :
            parentType === "Absences" ?
            <>
              <div className={styles.input_dates}>
                <LocalizationProvider dateAdapter={AdapterDayjs} sx={{marginRight: "2vh"}}>
                    <DatePicker label="Date de l'absence" format="DD/MM/YYYY" value={dayjs(eventInfo.startDate)} onChange={e => setEventInfo(prevValues => ({...prevValues, startDate: e}) )}/>
                </LocalizationProvider>
                <FormControl>
                  <InputLabel id="demo-simple-select-label">Période</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={typeOfAbs}
                    label="Période"
                    onChange={e => handleChangeTypeOfAbs(e.target.value)}
                  >
                    <MenuItem key={1} value={1} sx={{textAlign: 'left'}}>Toute la journée</MenuItem>
                    <MenuItem key={2} value={2} sx={{textAlign: 'left'}}>La matinée</MenuItem>
                    <MenuItem key={3} value={3} sx={{textAlign: 'left'}}>L'après-midi</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </>
            :
            parentType === "Global" ?
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
            parentType === "Equipe" ?
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

                <div className={styles.tag_users}>
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Utilisateurs dans l'évènement</InputLabel>
                      <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={eventInfo.usersTagged}
                        onChange={e => setEventInfo(prevValues => ({...prevValues, usersTagged: e.target.value}))}
                        input={<OutlinedInput sx={{width: '100%'}} label="Utilisateurs dans l'évènement" />}
                        renderValue={(selected) => selected.map((item, index) => (
                          index === 0 ? userList.filter((u) => u._id === item)[0].username : `, ${userList.filter((u) => u._id === item)[0].username}`
                        ))}
                      >
                        {userList.map((item, index) => (
                          <MenuItem key={index} value={item._id} sx={{textAlign: 'left'}}>
                            <Checkbox checked={eventInfo.usersTagged.filter((u) => u === item._id).length > 0 ? true : false} />
                            <ListItemText primary={item.username} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </div>
              </>
            :
              <></>
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