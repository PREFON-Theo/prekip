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
import Button from '@mui/material/Button';

import dayjs from 'dayjs';
import "dayjs/locale/fr"

import { UserContext } from "../../../../utils/Context/UserContext/UserContext"
import FormNotConnected from './FormNotConnected/FormNotConnected'
import { Paper } from '@mui/material'


const usersList = await axios.get('/user')
const listOfUsers = usersList.data


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


const Calendar = ({ handleOpenAlert, changeAlertValues, handleOpenLoginForm }) => {

  
  const { user } = useContext(UserContext)

  const [events, setEvents] = useState([])

  const [dayInformations, setDayInformations] = useState()

  const [openDialog, setOpenDialog] = useState(false)
  const [openAddEvent, setOpenAddEvent] = useState(false)
  const [openEditEvent, setOpenEditEvent] = useState(false)
  const [openNotConnected, setOpenNotConnected] = useState(false)
  const [idEventToEdit, setIdEventToEdit] = useState("")

  const [dateSelected, setDateSelected] = useState()

  const [eventsOfTheDaySelected, setEventsOfTheDaySelected] = useState()
  
  const fetchData = async () => {
    setEvents([])
    const eventData = await axios.get('/event')
    let obj = {};
    eventData.data.map((item) => (
        obj = {...obj, 
          [`${item.startDate.substring(0,10)}T00:00:00.000Z`]: {
            count: `${isNaN(obj[`${item.startDate.substring(0,10)}T00:00:00.000Z`]?.count) ? 1 : parseInt(obj[`${item.startDate.substring(0,10)}T00:00:00.000Z`]?.count) + 1}`,
            evId: `${item.startDate.substring(0,10)}T00:00:00.000Z`,
            start: new Date(item.startDate.substring(0,10)),
            description: `Évènements du jour ${`${item.startDate.substring(0,10)}T00:00:00.000Z`}`,
          } 
        }
    ))
    
    Object.values(obj).map((item) => (
      setEvents((eve) => [...eve, {
        eventId: item.evId,
        title: `${item.count} ${item.count > 1 ? "évènements": "évènement"} ce jour`,
        start: item.start,
        end: item.start,
        description: item.description,
        //color
      }])
    ))

  };


  useEffect(() => {
    fetchData();
  },[])


  const showDialog = async (day, date) => {
    setDateSelected(new Date(date).toLocaleDateString())
    setOpenAddEvent(false)
    setOpenEditEvent(false)
    setDayInformations(day)
    setOpenDialog(true)
    const eventsOfThisDay = await axios.get(`/event/day/${date}`)
    setEventsOfTheDaySelected(eventsOfThisDay.data)
  }


  const handleFormAddEvent = () => {
    setOpenDialog(false)
    setOpenEditEvent(false)
    if(user) {
      setOpenAddEvent(true)
    }
    else {
      setOpenNotConnected(true)
    }
  }


  const handleEditFormEvent = (id) => {
    setOpenAddEvent(false)
    setOpenDialog(false)
    setOpenEditEvent(true)

    setIdEventToEdit(id)
  }


  return (
    <>
      <div className={styles.container}>
        <div className={styles.show_dialog}>
          <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
          >
            <Paper sx={{
              overflowX: "auto",
              width: "auto",
              height: "auto",
              margin: "auto",
              padding: "5vh 4vw",
              backgroundColor: "rgba(210, 210, 210, 0.13)",
            }}>
              <div style={{textAlign: 'left'}}>
                <h1>Évènements du {dayjs(dateSelected).locale('fr').format('dddd DD MMM YYYY')}</h1>
              </div>
              {
              user ?
                <div style={{display: "flex", flexDirection: "row-reverse"}}>
                  <Button variant='contained' color='success' onClick={handleFormAddEvent}>
                    Ajouter un évènement
                  </Button>
                </div>
              :
                <></>
              }
              <div style={{margin: "20px 0"}}>
                {
                  eventsOfTheDaySelected === undefined ?
                    "Chargement..."
                  :
                  eventsOfTheDaySelected.length === 0 ?
                    "Pas d'évènements pour ce jour"
                  :
                  <>
                    <h3>Liste des évènements du jour: </h3>
                    <div style={{maxHeight: "50vh", overflowY: "auto"}}>
                      {eventsOfTheDaySelected?.map((item, index) => (
                        <div
                          key={index}
                          onClick={() => handleEditFormEvent(item._id)} 
                          style={{
                            cursor: "pointer",
                            padding: "10px"
                          }}
                        >
                          {eventTypesList?.filter((et) => et.internalName === item.type)[0]?.title === undefined ? <span style={{fontStyle: "italic"}}>type inconnu</span> : eventTypesList?.filter((et) => et.internalName === item.type)[0]?.title} de {listOfUsers?.filter((et) => et._id === item.owner)[0]?.firstname === undefined ? 
                              <span style={{fontStyle: "italic"}}>Utilisateur inconnu</span>
                            : 
                              `${listOfUsers?.filter((et) => et._id === item.owner)[0]?.firstname} ${listOfUsers?.filter((et) => et._id === item.owner)[0]?.lastname}`
                          }
                        </div>
                      ))}
                    </div>
                  </>
                }
              </div>
              
            </Paper>
          </Dialog>
        </div>


        <div className={styles.new_event_form}>
          <Dialog
            open={openAddEvent}
            onClose={() => setOpenAddEvent(false)}
          >
            <FormAddEvent
              dayInformations={dayInformations}
              user={user}
              userList={listOfUsers}
              handleCloseForm={() => setOpenAddEvent(false)}
              handleOpenAlert={handleOpenAlert}
              changeAlertValues={changeAlertValues}
              actualisateData={() => fetchData()}

            />  
          </Dialog>
        </div>
        <div className={styles.edit_event_form}>
          <Dialog
            open={openEditEvent}
            onClose={() => setOpenEditEvent(false)}
          >
            <FormEditEvent 
              idEventToEdit={idEventToEdit}
              user={user}
              userList={listOfUsers}
              handleCloseForm={() => setOpenEditEvent(false)}
              handleOpenAlert={handleOpenAlert}
              changeAlertValues={changeAlertValues}
              actualisateData={() => fetchData()}
            />
          </Dialog>
        </div>
        <div className={styles.form_not_connected}>
          <Dialog
            open={openNotConnected}
            onClose={() => setOpenNotConnected(false)}
          >
            <FormNotConnected
              handleCloseForm={() => setOpenNotConnected(false)}
              handleOpenLoginForm={handleOpenLoginForm}
            />  
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
          allDayContent={''}
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
          dateClick={(e) => showDialog(e,`${e.dateStr}T00:00:00.000Z`)}
          eventClick={(e) => showDialog(e, e.event.extendedProps.eventId)}
          dayCellClassNames={"event_case"}
          locale= 'fr'
        />
      </div>
    </>
  )
}

export default Calendar

