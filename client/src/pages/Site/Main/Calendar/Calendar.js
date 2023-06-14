import React, { useEffect, useState } from 'react'
import styles from "./Calendar.module.scss"
import "./Calendar.css"


import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from "@fullcalendar/timegrid"
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import axios from 'axios';
import FormAddEvent from './FormAddEvent/FormAddEvent'
import FormEditEvent from "./FormEditEvent/FormEditEvent"

import Dialog from '@mui/material/Dialog';

const typeOfEvent = {
  Teletravail: "grey",
  Global: "red",
  Personnel: "blue"
}


const Calendar = () => {

  
  const [events, setEvents] = useState([])
  const [openAddEvent, setOpenAddEvent] = useState(false)
  const [dayInformations, setDayInformations] = useState()
  const [openEvent, setOpenEvent] = useState(false)
  const [idEventToEdit, setIdEventToEdit] = useState("")
  
  useEffect(() => {
    const fetchData = async () => {
      setEvents([])
      axios
        .get('events')
        .then((res) => {
          //console.log(res.data[0]._id)
          res.data.map((item) => (
            setEvents((eve) => [...eve, {
              eventId: item._id,
              title: item.title,
              start: item.startDate,
              end: item.finishDate,
              description: item.description,
              color: typeOfEvent[item.type]
            }])
            ))
          })
        };
        fetchData();
        
      },[])
      
  useEffect(() => {
    //document.getElementsByClassName('fc-daygrid-day-frame').cursor = 'pointer';
  }, [])

  const handleFormAddEvent = (day) => {
    console.log(day)
    setDayInformations(day)
    setOpenAddEvent(true)
    /* add axios */
  }


  const handleEditFormEvent = (day) => {
    console.log(day.event._def.extendedProps.eventId)
    setIdEventToEdit(day.event._def.extendedProps.eventId)
    setOpenEvent(true)
  }


  return (
    <>
      <div className={styles.container}>
        <div className={styles.edit_event_form}>
          <Dialog
            open={openEvent}
            onClose={() => setOpenEvent(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <FormEditEvent idEventToEdit={idEventToEdit}/>
          </Dialog>
        </div>

        <div className={styles.new_event_form}>
          <Dialog
            open={openAddEvent}
            onClose={() => setOpenAddEvent(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <FormAddEvent dayInformations={dayInformations}/>  
          </Dialog>
        </div>


        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          weekends={true}
          events={events}
          //eventColor={'#378006'}
          headerToolbar={{
            start: "today prev,next",
            center: "title",
            end: "dayGridMonth, timeGridWeek, timeGridDay"
          }}
          firstDay={1}
          buttonText={{
            today: "Aujourd'hui",
            month:    'Par mois',
            week:     'Par semaine',
            day:      'Par jour',
            list:     'Liste'
          }}
          titleFormat={
            { year: 'numeric', month: 'long', day: 'numeric' }
          }
          dateClick={(e) => handleFormAddEvent(e)}
          dayCellClassNames={"event_case"}
          locale= 'fr'

          eventClick={(e) => handleEditFormEvent(e)}
        />
      </div>
    </>
  )
}

export default Calendar

