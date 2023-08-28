import React, { useState } from 'react'
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

import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';


import dayjs from 'dayjs';
import axios from 'axios';
import 'dayjs/locale/fr'

const workingDays = [
  {
    label: "Lundi",
    internalName: 'lun',
    value: 1
  },
  {
    label: "Mardi",
    internalName: 'mar',
    value: 2
  }, 
  {
    label: "Mercredi",
    internalName: 'mer',
    value: 3
  },
  {
    label: "Jeudi",
    internalName: 'jeu',
    value: 4
  },
  {
    label: "Vendredi",
    internalName: 'ven',
    value: 5
  }
];

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
  const [typeOfTT, setTypeOfTT] = useState('')

  const [customizedChoiceOfDays, setCustomizedChoiceOfDays] = useState([])

  const [missingElement, setMissingElement] = useState(false)

  const [dateStartRecurrence, setDateStartRecurrence] = useState(dayjs(dayInformations.dateStr))
  const [dateEndRecurrence, setDateEndRecurrence] = useState(dayjs(dayInformations.dateStr))

  const choiceTypeOfEvent = async () => {
    setMissingElement(false)
    if(eventTypeSelected === "reunion_entreprise"){
      handleAddEvent();
    }
    else if (eventTypeSelected === "teletravail"){
      if(typeOfTT === "once"){
        handleAddEvent();
      }
      else if (typeOfTT === "allDays"){
        try {
          let listOfEvents = []
          let startDate = dateStartRecurrence
          let endDate = dateEndRecurrence
          // du lundi au vendredi
          // à partir de starDate jusqu'à finishDate
          // sauf date.getDay() === 6 (samedi) et 0 (dimanche)

          while(new Date(startDate) <= new Date(endDate)){
            if(new Date(startDate).getDay() !== 6 && new Date(startDate).getDay() !== 0){
              listOfEvents.push({
                ...eventInfo,
                type: 'teletravail',
                startDate: startDate.hour(9),
                finishDate: startDate.hour(18)
              })
            }
            startDate = startDate.date(startDate.date()+1)
          }

          await axios
            .post('/event/many', listOfEvents)
            handleOpenAlert()
            handleCloseForm()
            changeAlertValues('success', 'Évènement(s) ajouté(s)')
            actualisateData()
        }
        catch (err) {
          handleOpenAlert()
          changeAlertValues('error', err)
        }
        
      } 
      else if (typeOfTT === "customized"){
        if(customizedChoiceOfDays.length > 0){
          try {
  
            let listOfEvents = []
            let startDate = dateStartRecurrence
            let endDate = dateEndRecurrence
            // du selon les jours sélectionnés
            // à partir de starDate jusqu'à finishDate
            // sauf date.getDay() === 6 (samedi) et 0 (dimanche)
  
            while(new Date(startDate) <= new Date(endDate)){
              if(customizedChoiceOfDays.includes(workingDays.filter((wd) => wd.value === new Date(startDate).getDay())[0]?.label)){
                listOfEvents.push({
                  ...eventInfo,
                  type: 'teletravail',
                  startDate: startDate.hour(9),
                  finishDate: startDate.hour(18)
                })
              }
              startDate = startDate.date(startDate.date()+1)
            }
  
            await axios
              .post('/event/many', listOfEvents)
              handleOpenAlert()
              handleCloseForm()
              changeAlertValues('success', 'Évènement(s) ajouté(s)')
              actualisateData()
          }
          catch (err) {
            handleOpenAlert()
            changeAlertValues('error', err)
          }
        }
        else {
          setMissingElement(true)
        }
  
      }
      else {
        setMissingElement(true)
      }
    }
    else {
      setMissingElement(true)
    }
  }
  
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

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setCustomizedChoiceOfDays(typeof value === 'string' ? value.split(',') : value);
  };

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
                  <MenuItem value={"teletravail"} sx={{textAlign: 'left'}}>Télétravail</MenuItem>
                  {
                  user?.roles.includes("Administrateur") ?                 
                    <MenuItem value={"reunion_entreprise"} sx={{textAlign: 'left'}}>Réunion d'entreprise</MenuItem>
                  : 
                    <></>
                  }
                </Select>
              </FormControl>
            </Box>
          </div>
          
          {
            eventTypeSelected === "teletravail" ?
            <>
              <div className={styles.input_dates_tt}>
                <LocalizationProvider dateAdapter={AdapterDayjs} sx={{marginRight: "2vh"}} adapterLocale='fr'>
                  <div className={styles.firstLine}>
                    <FormControl sx={{width:"48%"}}>
                      <InputLabel id="select-label">Type de récurence</InputLabel>
                      <Select
                        labelId="select-label"
                        value={typeOfTT}
                        label="Type de récurence"
                        onChange={e =>  setTypeOfTT(e.target.value)}
                      >
                        <MenuItem value={"once"} sx={{textAlign: 'left'}}>Une fois</MenuItem>
                        <MenuItem value={"allDays"} sx={{textAlign: 'left'}}>Du lundi au vendredi</MenuItem>
                        <MenuItem value={"customized"} sx={{textAlign: 'left'}}>Personnalié</MenuItem>
                        {/* <MenuItem value={"onceAMonth"} sx={{textAlign: 'left'}}>Tous les mois</MenuItem> */}
                        {/* <MenuItem value={"onceAYear"} sx={{textAlign: 'left'}}>Tous les ans</MenuItem> */}
                      </Select>
                    </FormControl>
                    {
                    typeOfTT === "once" ?
                      <DatePicker sx={{width: "48%"}} label="Date de l'absence" format="DD/MM/YYYY" value={dayjs(eventInfo.startDate)} onChange={e => setEventInfo(prevValues => ({...prevValues, startDate: e}) )}/>
                    :
                    typeOfTT === "customized" ?
                      <FormControl sx={{width: "48%"}}>
                        <InputLabel id="demo-multiple-checkbox-label">Sélectionnez les jours</InputLabel>
                        <Select
                          labelId="demo-multiple-checkbox-label"
                          id="demo-multiple-checkbox"
                          multiple
                          value={customizedChoiceOfDays}
                          onChange={handleChange}
                          input={<OutlinedInput label="Sélectionnez les jours" />}
                          renderValue={(selected) => selected.join(', ')}
                          required
                        >
                          {workingDays.map((item, index) => (
                            <MenuItem key={index} value={item.label} label={item.label}>
                              <Checkbox checked={customizedChoiceOfDays.indexOf(item.label) > -1} />
                              <ListItemText primary={item.label} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    :
                      <></>
                    }
                  </div>

                  <div className={styles.secondLine}>
                  {
                  typeOfTT === '' || typeOfTT === 'once' ?
                    <></>
                  :
                      <>
                        <DatePicker sx={{width: "48%"}} label="Date de début" format="DD/MM/YYYY" maxDate={dayjs(dateEndRecurrence)} value={dayjs(dateStartRecurrence)} onChange={e => setDateStartRecurrence(e)}/>
                        <DatePicker sx={{width: "48%"}} label="Date de fin" format="DD/MM/YYYY" minDate={dayjs(dateStartRecurrence)} value={dayjs(dateEndRecurrence)} onChange={e => setDateEndRecurrence(e)}/>
                      </>
                    }
                  </div>
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
                  <div className={styles.input_dates_re}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} sx={{marginRight: "2vh"}} adapterLocale='fr'>
                        <DateTimePicker format="DD/MM/YYYY HH:mm:ss" ampm={false} label="Date de début" maxDate={dayjs(eventInfo.finishDate)} value={dayjs(eventInfo.startDate)} onChange={e => setEventInfo(prevValues => ({...prevValues, startDate: e}) )} />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='fr'>
                        <DateTimePicker format="DD/MM/YYYY HH:mm:ss" ampm={false} label="Date de fin" minDate={dayjs(dayInformations.dateStr)} value={dayjs(eventInfo.finishDate)} onChange={e => setEventInfo(prevValues => ({...prevValues, finishDate: e}) )} />
                    </LocalizationProvider>
                  </div>
                </>
            :
              <div style={{marginBottom: '2vh'}}>Sélectionnez un type d'évènement</div>
          }

          {
          missingElement ?
            <div style={{margin: "0 0 20px 0", color: "red"}}>Veuillez renseigner tous les éléments</div>
          :
            <></>
          }

          {
          (eventTypeSelected === "teletravail" && typeOfTT !== "") || eventTypeSelected === "reunion_entreprise" ?
            <div className={styles.button}>
              <Button variant="contained" color='primary' onClick={choiceTypeOfEvent}>Créer l'évènement</Button>
            </div>
          :
            <></>
          }

        </div>
      </div>
    </>
  )
}

export default FormAddEvent