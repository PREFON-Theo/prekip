import React, { useEffect, useState } from 'react'
import styles from "./FormEditEvent.module.scss"

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DateTimeField } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import axios from 'axios';

const FormEditEvent = ({idEventToEdit}) => {
  const [eventInfo, setEventInfo] = useState({
    title: '',
    description: '',
    startDate: '',
    finishDate: '',
    type: '',
    owner: '',
  })

  useEffect(() => {
    console.log(idEventToEdit)
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
    console.log(eventInfo)
  }, [eventInfo])

  const handleLoginSubmit = async () => {
    try {
        await axios.patch('/event' + idEventToEdit, eventInfo).then(() => console.log("Updated")).catch((e) => alert(e))
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
            <TextField value={eventInfo.title} label="Titre" variant="outlined" onChange={e => setEventInfo({ title: e.target.value})}/>
          </div>
          <div className={styles.input_password}>
            <TextField value={eventInfo.description} label="Description" variant="outlined" onChange={e => setEventInfo({description: e.target.value})}/>
          </div>
          <div className={styles.input_dates}>
            <LocalizationProvider dateAdapter={AdapterDayjs} sx={{marginRight: "2vh"}}>
                <DateTimePicker format="DD/MM/YYYY HH:mm:ss" ampm={false} label="Date de début" value={dayjs(eventInfo.startDate)} onChange={e => setEventInfo({startDate: e.target.value})}/>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker format="DD/MM/YYYY HH:mm:ss" ampm={false} label="Date de fin" value={dayjs(eventInfo.finishDate)} onChange={e => setEventInfo({finishDate: e.target.value})}/>
            </LocalizationProvider>
          </div>

          <div className={styles.button}>
            <Button variant="contained" color='warning' onClick={handleLoginSubmit}>Modifier l'évènement</Button>
          </div>

        </div>
      </div>
    </>
  )
}

export default FormEditEvent