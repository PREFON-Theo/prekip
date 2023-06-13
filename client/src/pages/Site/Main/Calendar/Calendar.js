import React, { useEffect, useState } from 'react'
import styles from "./Calendar.module.scss"


import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from "@fullcalendar/timegrid"
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import axios from 'axios';



const Calendar = () => {

  const [events, setEvents] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      setEvents([])
      console.log("reset")
      axios
        .get('events')
        .then((res) => {
          res.data.map((item) => (
            setEvents((eve) => [...eve, {
              title: item.title,
              date: item.startDate
            }]),
            console.log("rr")
          ))
        })
    };
    fetchData();

  },[])

  useEffect(() => {
    console.log(events)
  }, [events])

  return (
    <>
      <div className={styles.container}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          /*events={[
            { title: 'event 1', date: '2023-06-01' },
            { title: 'event 2', date: '2023-06-02' }
          ]}*/
        />
      </div>
    </>
  )
}

export default Calendar

