import React, { useEffect, useState, useContext } from 'react'
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

import { UserContext } from "../../../../utils/Context/UserContext/UserContext"

const mmtypeOfEvent = {
  Teletravail: "grey",
  Global: "red",
  Personnel: "blue"
}

const eventTypes = await axios.get('/event-types')
const listEvenTypes = eventTypes.data

const usersList = await axios.get('/users')
const listOfUsers = usersList.data

const Calendar = () => {

  
  const { user } = useContext(UserContext)

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
              title: `${item.title} par ${listOfUsers.filter((u) => u._id === item.owner)[0].username}`,
              start: item.startDate,
              end: item.finishDate,
              description: item.description,
              color: listEvenTypes.filter((i) => i._id === item.type)[0].color 
            }])
            ))
          })
        };
        fetchData();
        
      },[])


  const handleFormAddEvent = (day) => {
    setDayInformations(day)
    setOpenAddEvent(true)
  }


  const handleEditFormEvent = (day) => {
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
            <FormEditEvent idEventToEdit={idEventToEdit} eventTypes={listEvenTypes}/>
          </Dialog>
        </div>

        <div className={styles.new_event_form}>
          <Dialog
            open={openAddEvent}
            onClose={() => setOpenAddEvent(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <FormAddEvent dayInformations={dayInformations} eventTypes={listEvenTypes}/>  
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

