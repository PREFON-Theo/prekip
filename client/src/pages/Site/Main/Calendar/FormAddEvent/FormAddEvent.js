import React, { useEffect, useState } from 'react'
import styles from "./FormAddEvent.module.scss"

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DateTimeField } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

const FormAddEvent = ({dayInformations}) => {
  const [eventInfo, setEventInfo] = useState({
    title: '',
    description: '',
    startDate: '',
    finishDate: '',
    type: '',
    owner: '',
  })

  console.log(dayInformations)


  useEffect(() => {
    console.log(eventInfo)
  }, [eventInfo])

  const handleLoginSubmit = async () => {
    /*try {
        const {data} = await axios.post('/event', {email, password})
        console.log(data)
        if(data === 'Not found') {
            alert('Login denied');
        }
        else {
            setUser(data);
            alert('Login successful');
            setOpenLoginForm(false);
            setRedirect(true)
            console.log('Login successful');
        }
        //[Alert] : Vous êtes connecté 
    }
    catch (err) {
        alert("login failed")
    }*/
  }


  return (
    <>
      <div className={styles.container}>
          <h1>
            Ajouter un évènement :
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
                <DateTimePicker format="DD/MM/YYYY HH:mm:ss" ampm={false} label="Date de début" defaultValue={dayjs(dayInformations.dateStr)}/>
            </LocalizationProvider>
          {/* </div>
          <div className={styles.input_dates}> */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker format="DD/MM/YYYY HH:mm:ss" ampm={false} label="Date de fin" minDate={dayjs(dayInformations.dateStr)}/>
            </LocalizationProvider>
          </div>

          <div className={styles.button}>
            <Button variant="contained" color='primary' onClick={handleLoginSubmit}>Créer l'évènement</Button>
          </div>

        </div>
      </div>
    </>
  )
}

export default FormAddEvent