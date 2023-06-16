import React, { useEffect, useState } from 'react'
import styles from "./FormEditEvent.module.scss"

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import axios from 'axios';

import ListSubheader from '@mui/material/ListSubheader';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import OutlinedInput from '@mui/material/OutlinedInput';



const FormEditEvent = ({idEventToEdit, eventTypes, user, userList, handleCloseForm, handleOpenAlert, changeAlertValues}) => {
  const [eventInfo, setEventInfo] = useState({
    title: '',
    description: '',
    startDate: '',
    finishDate: '',
    type: '',
    owner: user._id,
    usersTagged: []
  })

  const usersTaggedNamed = []


  const fetchData = () => {
    axios.get('/event/' + idEventToEdit).then((res) => 
      setEventInfo({
        title: res.data.title,
        description: res.data.description,
        startDate: res.data.startDate,
        finishDate: res.data.finishDate,
        type: res.data.type,
        owner: res.data.owner,
        usersTagged: res.data.usersTagged
      })
    )
    console.log("Fetched")

  };

  useEffect(() => {
    fetchData();
  }, [])


  useEffect(() => {
    eventInfo.usersTagged.map((item, index) => (
      usersTaggedNamed.push(userList.filter((us) => us._id === item)[0].username)
    ))
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
          .catch((e) => changeAlertValues('error', e))
      }
      else {
        changeAlertValues('error', "Unauthorized")
      }
        //[Alert] : Updated
    }
    catch (err) {
      changeAlertValues('error', err)
    }
  }


  return (
    <>
      <div className={styles.container}>
          <h1>
            Informations de cet évènement de {userList.filter((use) => use._id === eventInfo.owner)[0].username}:
          </h1>
          {
            user._id === eventInfo.owner 
            ?
              <div className={styles.container_inputs}>
                <div className={styles.input_mail}>
                  <TextField value={eventInfo.title} label="Titre" variant="outlined" onChange={e => setEventInfo(prevValues => ({...prevValues, title: e.target.value}) )}/>
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
                <div className={styles.input_password}>
                  <TextField value={eventInfo.description} multiline maxRows={3} label="Description" variant="outlined" onChange={e => setEventInfo(prevValues => ({...prevValues, description: e.target.value}) )}/>
                </div>
                <div className={styles.input_dates}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} sx={{marginRight: "2vh"}}>
                      <DateTimePicker format="DD/MM/YYYY HH:mm:ss" ampm={false} label="Date de début" value={dayjs(eventInfo.startDate)} onChange={e => setEventInfo(prevValues => ({...prevValues, startDate: e}) )} />
                  </LocalizationProvider>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker format="DD/MM/YYYY HH:mm:ss" ampm={false} label="Date de fin" value={dayjs(eventInfo.finishDate)} onChange={e => setEventInfo(prevValues => ({...prevValues, finishDate: e}) )} />
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
                        input={<OutlinedInput sx={{width: '460px', margin: '0 auto'}} label="Utilisateurs dans l'évènement" />}
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

                
                    <div className={styles.button}>
                      <Button variant="contained" color='warning' onClick={handleUpdateEvent}>Modifier l'évènement</Button>
                    </div>
              </div>

            :
              
            <div className={styles.container_inputs}>
              <div className={styles.input_mail}>
                <TextField disabled value={eventInfo.title} label="Titre" variant="outlined" onChange={e => setEventInfo(prevValues => ({...prevValues, title: e.target.value}) )}/>
                <TextField disabled value={eventTypes.filter((typeEvent) => typeEvent._id === eventInfo.type)[0].title} label="Type d'évènement" variant="outlined" onChange={e => setEventInfo(prevValues => ({...prevValues, title: e.target.value}) )}/>
              </div>
              <div className={styles.input_password}>
                <TextField disabled value={eventInfo.description} multiline maxRows={3} label="Description" variant="outlined" onChange={e => setEventInfo(prevValues => ({...prevValues, description: e.target.value}) )}/>
              </div>
              <div className={styles.input_dates}>
                <LocalizationProvider dateAdapter={AdapterDayjs} sx={{marginRight: "2vh"}}>
                    <DateTimePicker disabled format="DD/MM/YYYY HH:mm:ss" ampm={false} label="Date de début" value={dayjs(eventInfo.startDate)} onChange={e => setEventInfo(prevValues => ({...prevValues, startDate: e}) )} />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker disabled format="DD/MM/YYYY HH:mm:ss" ampm={false} label="Date de fin" value={dayjs(eventInfo.finishDate)} onChange={e => setEventInfo(prevValues => ({...prevValues, finishDate: e}) )} />
                </LocalizationProvider>
              </div>

              <div className={styles.tag_users}>
                <Box sx={{ minWidth: 120 }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Utilisateurs dans l'évènement</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-multiple-checkbox"
                      disabled
                      multiple
                      value={eventInfo.usersTagged}
                      onChange={e => setEventInfo(prevValues => ({...prevValues, usersTagged: e.target.value}))}
                      input={<OutlinedInput sx={{width: '460px', margin: '0 auto'}} label="Utilisateurs dans l'évènement" />}
                      renderValue={(selected) => selected.map((item, index) => (
                        index === 0 ? userList.filter((u) => u._id === item)[0].username : `, ${userList.filter((u) => u._id === item)[0].username}`
                      ))}
                    > 
                      {userList.map((item, index) => (
                        <MenuItem key={index} value={item._id} sx={{textAlign: 'left'}} disabled>
                          <Checkbox checked={eventInfo.usersTagged.filter((u) => u === item._id).length > 0 ? true : false} />
                          <ListItemText primary={item.username} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </div>
            </div>
          }

      </div>
    </>
  )
}

export default FormEditEvent