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

const FormEditEvent = ({idEventToEdit, eventTypes}) => {
  const [eventInfo, setEventInfo] = useState({
    title: '',
    description: '',
    startDate: '',
    finishDate: '',
    type: '',
    owner: '',
  })

  useEffect(() => {
    const fetchData = () => {
      axios.get('/event/' + idEventToEdit).then((res) => 
        //console.log(res)
        setEventInfo({
          title: res.data.title,
          description: res.data.description,
          startDate: res.data.startDate,
          finishDate: res.data.finishDate,
          type: res.data.type,
          owner: res.data.owner,
        })
      )

    };
    fetchData();
  }, [])


  useEffect(() => {
  }, [eventInfo])

  const handleUpdateEvent = async () => {
    try {
        await axios.patch('/event/' + idEventToEdit, eventInfo).then(() => console.log("Updated")).catch((e) => alert(e))
        //[Alert] : Updated
    }
    catch (err) {
        alert(err)
    }
  }


  return (
    <>
      <div className={styles.container}>
          <h1>
            Informations de cet évènement :
          </h1>
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

          <div className={styles.button}>
            <Button variant="contained" color='warning' onClick={handleUpdateEvent}>Modifier l'évènement</Button>
          </div>

        </div>
      </div>
    </>
  )
}

export default FormEditEvent