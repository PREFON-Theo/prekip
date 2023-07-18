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

import ListSubheader from '@mui/material/ListSubheader';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import OutlinedInput from '@mui/material/OutlinedInput';



const FormEditEvent = ({idEventToEdit, eventTypes, user, userList, handleCloseForm, handleOpenAlert, changeAlertValues, actualisateData}) => {
  const [eventInfo, setEventInfo] = useState({
    title: '',
    description: '',
    startDate: '',
    finishDate: '',
    type: '',
    owner: '',
    usersTagged: []
  })
  const [parentType, setParentType] = useState('')
  const [typeOfAbs, setTypeOfAbs] = useState('')
  const usersTaggedNamed = []

  const fetchData = async () => {
    const eventData = await axios.get('/event/' + idEventToEdit)
    setEventInfo({
      title: eventData.data.title,
      description: eventData.data.description,
      startDate: dayjs(eventData.data.startDate),
      finishDate: dayjs(eventData.data.finishDate),
      type: eventData.data.type,
      owner: eventData.data.owner,
      usersTagged: eventData.data.usersTagged
    })
  };

  useEffect(() => {
    fetchData();
  }, [])


  useEffect(() => {
    eventInfo.usersTagged.map((item, index) => (
      usersTaggedNamed.push(`${userList.filter((us) => us._id === item)[0]?.firstname} ${userList.filter((us) => us._id === item)[0]?.lastname}`)
    ))
    eventInfo.startDate !== '' ? 
      setTypeOfAbs(
        eventInfo.startDate?.hour() <= 9 && eventInfo.finishDate?.hour() >= 18 ?
      1
      :
      eventInfo.startDate?.hour() <= 9 && eventInfo.finishDate?.hour() === 12 ?
      2
      :
      eventInfo.startDate?.hour() === 12 && eventInfo.finishDate?.hour() >= 18 ?
      3
      :
      ''
      )
      : <></>
  }, [eventInfo])




  const handleUpdateEvent = async () => {
    try {
      if(user._id === eventInfo.owner){
        await axios
          .patch('/event/' + idEventToEdit, eventInfo)
          .then(() => console.log("Updated"))
          .then(() => handleOpenAlert())
          .then(() => handleCloseForm())
          .then(() => changeAlertValues('success', 'Evenement modifié'))
          .then(() => actualisateData())
          .catch((e) => changeAlertValues('error', e))
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
      if(user._id === eventInfo.owner){
        axios
          .delete('/event/' + idEventToEdit)
          .then(() => console.log(`Event ${idEventToEdit} deleted`))
          .then(() => handleOpenAlert())
          .then(() => handleCloseForm())
          .then(() => changeAlertValues('success', 'Evenement supprimé'))
          .then(() => actualisateData())
          .catch((e) => changeAlertValues('error', e))
      }
    }
    catch (err) {
      changeAlertValues('error', err)
    }
  }

  const handleChangeTypeOfAbs = (t) => {
    setTypeOfAbs(t)
    console.log(eventInfo.startDate.hour())
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
          Informations de cet évènement de {userList.filter((use) => use._id === eventInfo.owner)[0]?.firstname} {userList.filter((use) => use._id === eventInfo.owner)[0]?.lastname}:
        </h1>
        <div className={styles.container_inputs}>

          {

            user && user._id === eventInfo.owner ?

              parentType === undefined ?
                <div style={{marginBottom: '2vh'}}>Sélectionnez un type d'évènement</div>
              :
                parentType === "Absences" ?
                  <>
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
                    <div className={styles.button}>
                      <Button variant="contained" color='warning' onClick={handleUpdateEvent}>Modifier l'évènement</Button>
                      <Button variant="contained" color='error' onClick={handleDeleteEvent}>Supprimer l'évènement</Button>
                    </div>
                  </>
                :
                  parentType === "Global" ?
                      <>
                        <div className={styles.input_event_type}>
                          <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">Type d'évènement</InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={eventInfo.type}
                                label="Type d'évènement"
                                onChange={e => setEventInfo(prevValues => ({...prevValues, type: e.target.value}) )}
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
                              <DateTimePicker format="DD/MM/YYYY HH:mm:ss" ampm={false} label="Date de fin" minDate={dayjs(eventInfo.startDate)} value={dayjs(eventInfo.finishDate)} onChange={e => setEventInfo(prevValues => ({...prevValues, finishDate: e}) )} />
                          </LocalizationProvider>
                        </div>                
                        <div className={styles.button}>
                          <Button variant="contained" color='warning' onClick={handleUpdateEvent}>Modifier l'évènement</Button>
                          <Button variant="contained" color='error' onClick={handleDeleteEvent}>Supprimer l'évènement</Button>
                        </div>
                      </>
                  :
                  parentType === "Equipe" ?
                    <>
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
                            <DateTimePicker format="DD/MM/YYYY HH:mm:ss" ampm={false} label="Date de fin" minDate={dayjs(eventInfo.startDate)} value={dayjs(eventInfo.finishDate)} onChange={e => setEventInfo(prevValues => ({...prevValues, finishDate: e}) )} />
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
                                index === 0 ? `${userList.filter((u) => u._id === item)[0]?.firstname} ${userList.filter((u) => u._id === item)[0]?.lastname}`  : `, ${userList.filter((u) => u._id === item)[0]?.firstname} ${userList.filter((u) => u._id === item)[0]?.lastname}`
                              ))}
                            >
                              {userList.map((item, index) => (
                                <MenuItem key={index} value={item._id} sx={{textAlign: 'left'}}>
                                  <Checkbox checked={eventInfo.usersTagged.filter((u) => u === item._id).length > 0 ? true : false} />
                                  <ListItemText primary={`${item?.firstname} ${item?.lastname}`} />
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                      </div>

                        
                      <div className={styles.button}>
                        <Button variant="contained" color='warning' onClick={handleUpdateEvent}>Modifier l'évènement</Button>
                        <Button variant="contained" color='error' onClick={handleDeleteEvent}>Supprimer l'évènement</Button>
                      </div>
                    </>
                  :

                    <></>

                :
              //TODO
              parentType === undefined ?
                <div style={{marginBottom: '2vh'}}>Sélectionnez un type d'évènement</div>
              :
              parentType === "Absences" ?
                <>
                  {/* Change type event */}
                  <div className={styles.input_event_type}>
                  <TextField disabled value={eventTypes.filter((et) => et._id === eventInfo.type)[0]?.title} label="Type d'évènement" variant="outlined"/>
                  </div>
                  {/* Dates absences */}
                  <div className={styles.input_dates}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} sx={{marginRight: "2vh"}}>
                        <DatePicker label="Date de l'absence" disabled format="DD/MM/YYYY" value={dayjs(eventInfo.startDate)}/>
                    </LocalizationProvider>
                    <TextField disabled value={typeOfAbs === 1 ? 'Toute la journée' : typeOfAbs === 2 ? 'La matinée' : "L'après-midi"} label="Période" variant="outlined"/>
                  </div>
                </>
              :
              parentType === "Global" ?
                <>
                  <div className={styles.input_event_type}>
                    <TextField disabled value={eventTypes.filter((et) => et._id === eventInfo.type)[0]?.title} label="Type d'évènement" variant="outlined"/>
                  </div>

                  <div className={styles.input_title}>
                    <TextField value={eventInfo.title} disabled label="Titre" variant="outlined"/>
                  </div>
                  <div className={styles.input_description}>
                    <TextField value={eventInfo.description} disabled multiline maxRows={3} label="Description" variant="outlined"/>
                  </div>
                  <div className={styles.input_dates}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} sx={{marginRight: "2vh"}}>
                        <DateTimePicker format="DD/MM/YYYY HH:mm:ss" disabled ampm={false} label="Date de début" value={dayjs(eventInfo.startDate)}/>
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker format="DD/MM/YYYY HH:mm:ss" disabled ampm={false} label="Date de fin" value={dayjs(eventInfo.finishDate)}/>
                    </LocalizationProvider>
                  </div>                
                </>
              :
              parentType === "Equipe" ?
                <>
                  <div className={styles.input_event_type}>
                    <TextField disabled value={eventTypes.filter((et) => et._id === eventInfo.type)[0]?.title} label="Type d'évènement" variant="outlined"/>
                  </div>

                  <div className={styles.input_title}>
                    <TextField value={eventInfo.title} disabled label="Titre" variant="outlined"/>
                  </div>
                  <div className={styles.input_description}>
                    <TextField value={eventInfo.description} disabled multiline maxRows={3} label="Description" variant="outlined"/>
                  </div>
                  <div className={styles.input_dates}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} sx={{marginRight: "2vh"}}>
                        <DateTimePicker format="DD/MM/YYYY HH:mm:ss" disabled ampm={false} label="Date de début" value={dayjs(eventInfo.startDate)}/>
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker format="DD/MM/YYYY HH:mm:ss" disabled ampm={false} label="Date de fin" value={dayjs(eventInfo.finishDate)}/>
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
                          disabled
                          input={<OutlinedInput sx={{width: '100%', color: "#00000061"}} label="Utilisateurs dans l'évènement" />}
                          renderValue={(selected) => selected.map((item, index) => (
                            index === 0 ? `${userList.filter((u) => u._id === item)[0]?.firstname} ${userList.filter((u) => u._id === item)[0]?.lastname}`  : `, ${userList.filter((u) => u._id === item)[0]?.firstname} ${userList.filter((u) => u._id === item)[0]?.lastname}`
                          ))}
                        >
                        </Select>
                      </FormControl>
                    </Box>
                  </div>
                </>
              :
                <></>
          }
        </div>

      </div>
    </>
  )
}

export default FormEditEvent