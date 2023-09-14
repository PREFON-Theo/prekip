import React, { useEffect, useState, useContext } from 'react'
import styles from "./Calendar.module.scss"
import "./Calendar.css"

//https://calendrier.api.gouv.fr/jours-feries/metropole.json

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

  
  const { user, cookies } = useContext(UserContext)

  const [events, setEvents] = useState([])

  const [dayInformations, setDayInformations] = useState()

  const [openDialog, setOpenDialog] = useState(false)
  const [openAddEvent, setOpenAddEvent] = useState(false)
  const [openEditEvent, setOpenEditEvent] = useState(false)
  const [openNotConnected, setOpenNotConnected] = useState(false)
  const [idEventToEdit, setIdEventToEdit] = useState("")

  const [dateSelected, setDateSelected] = useState()

  const [eventsOfTheDaySelected, setEventsOfTheDaySelected] = useState()
  const [listOfUsers, setListOfUsers] = useState()
  
  const fetchData = async () => {
    const usersList = await axios.get('/user', {headers: {jwt: cookies.token}})
    setListOfUsers(usersList.data)
    setEvents([])
    const eventData = await axios.get('/event', {headers: {jwt: cookies.token}})
    let objTT = {};
    let objRE = {};
    let objOther = {};

    eventData.data?.map((item) => (
      item.type === 'teletravail' ?
        objTT = {...objTT, 
          [`${item.startDate.substring(0,10)}T00:00:00.000Z`]: {
            count: `${isNaN(objTT[`${item.startDate.substring(0,10)}T00:00:00.000Z`]?.count) ? 1 : parseInt(objTT[`${item.startDate.substring(0,10)}T00:00:00.000Z`]?.count) + 1}`,
            evId: `${item.startDate.substring(0,10)}T00:00:00.000Z`,
            start: new Date(item.startDate.substring(0,10)),
            description: `Évènements du jour ${`${item.startDate.substring(0,10)}T00:00:00.000Z`}`,
            owner: `${isNaN(objTT[`${item.startDate.substring(0,10)}T00:00:00.000Z`]?.count) ? "" : `${objTT[`${item.startDate.substring(0,10)}T00:00:00.000Z`].owner}, `} ${usersList.data?.filter((et) => et._id === item.owner)[0]?.firstname === undefined ? '' : `${usersList.data?.filter((et) => et._id === item.owner)[0]?.firstname} ${usersList.data?.filter((et) => et._id === item.owner)[0]?.lastname}` }`
            
          } 
        }
      : item.type === "reunion_entreprise" ?
        objRE = {...objRE, 
          [`${item.startDate.substring(0,10)}T00:00:00.000Z`]: {
            count: `${isNaN(objRE[`${item.startDate.substring(0,10)}T00:00:00.000Z`]?.count) ? 1 : parseInt(objRE[`${item.startDate.substring(0,10)}T00:00:00.000Z`]?.count) + 1}`,
            evId: `${item.startDate.substring(0,10)}T00:00:00.000Z`,
            start: new Date(item.startDate.substring(0,10)),
            description: `Évènements du jour ${`${item.startDate.substring(0,10)}T00:00:00.000Z`}`,
          } 
        }
      :
        objOther = {...objOther, 
          [`${item.startDate.substring(0,10)}T00:00:00.000Z`]: {
            count: `${isNaN(objOther[`${item.startDate.substring(0,10)}T00:00:00.000Z`]?.count) ? 1 : parseInt(objOther[`${item.startDate.substring(0,10)}T00:00:00.000Z`]?.count) + 1}`,
            evId: `${item.startDate.substring(0,10)}T00:00:00.000Z`,
            start: new Date(item.startDate.substring(0,10)),
            description: `Évènements du jour ${`${item.startDate.substring(0,10)}T00:00:00.000Z`}`,
          } 
        }
    ))
    
    Object.values(objTT).map((item) => (
      setEvents((eve) => [...eve, {
        eventId: item.evId,
        title: `${item.count > 1 ? `${item.count} personnes en télétravail: ${item.owner}` : `${item.owner} en télétravail`}`,
        start: new Date(dayjs(item.start).hour(9)),
        end: new Date(dayjs(item.start).hour(18)),
        description: item.description
      }])
    ))

    Object.values(objRE).map((item) => (
      setEvents((eve) => [...eve, {
        eventId: item.evId,
        title: `${item.count} ${item.count > 1 ? "réunions": "réunion"} d'entreprise`,
        start: new Date(dayjs(item.start).hour(9)),
        end: new Date(dayjs(item.start).hour(18)),
        description: item.description,
        color: "red"
      }])
    ))

    Object.values(objOther).map((item) => (
      setEvents((eve) => [...eve, {
        eventId: item.evId,
        title: `${item.count} ${item.count > 1 ? "autres": "autre"}`,
        start: new Date(dayjs(item.start).hour(9)),
        end: new Date(dayjs(item.start).hour(18)),
        description: item.description,
        color: 'black'
      }])
    ))

    /*const publicHolidays = await axios.get("https://calendrier.api.gouv.fr/jours-feries/metropole.json")
    Object.values(publicHolidays).map((item) => (
      setEvents((eve) => [...eve, {
        eventId: item,
        title: "Jour férié",
        start: new Date(dayjs(item.start).hour(9)),
        end: new Date(dayjs(item.start).hour(18)),
        description: item.description,
        color: 'grey'
      }])
    ))*/
  };


  useEffect(() => {
    fetchData();
  },[])


  const showDialog = async (day, date) => {
    console.log(day)
    setDateSelected(new Date(date).toLocaleDateString())
    setOpenAddEvent(false)
    setOpenEditEvent(false)
    setDayInformations(day)
    setOpenDialog(true)
    const eventsOfThisDay = await axios.get(`/event/day/${date}`, {headers: {jwt: cookies.token}})
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
                  eventsOfTheDaySelected?.length === 0 ?
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
                          {
                          eventTypesList?.filter((et) => et.internalName === item.type)[0]?.title === undefined ? 
                            <span style={{fontStyle: "italic"}}>type inconnu</span>
                          : eventTypesList?.filter((et) => et.internalName === item.type)[0]?.title
                          } de {listOfUsers?.filter((et) => et._id === item.owner)[0]?.firstname === undefined ? 
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
            month:    'Mois',
            week:     'Semaine',
            day:      'Jour',
            list:     'Liste'
          }}
          titleFormat={
            { year: 'numeric', month: 'numeric', day: 'numeric' }
          }
          dateClick={(e) => e.dateStr.length === 10 ? showDialog(e,`${e.dateStr}T00:00:00.000Z`) : showDialog(e,`${e.dateStr.substring(0,10)}T00:00:00.000Z`)}
          eventClick={(e) => showDialog(e, e.event.extendedProps.eventId)}
          dayCellClassNames={"event_case"}
          locale= 'fr'
        />
      </div>
    </>
  )
}

export default Calendar

