import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import Day from "./Day";
import { privateRequest } from "../../ApiMethods";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

export default function Month({ month, monthIndex, }) {

  const [Tasks, setTasks] = useState([]);
  const [Events, setEvents] = useState([]);
  const [Bookings, setBookings] = useState([]);

  const monthNumber = useSelector((state) => state.calendar.monthNumber)

  // const [Tasks, setOwnerTasks] = useState([]);
  // const [Events, setOwnerEvents] = useState([]);
  // const [Bookings, setOwnerBookings] = useState([]);


  // console.log('month', month);


  // const API_RESPONSE = [{
  //   day: 1679598000000,
  //   description: "I am uzair",
  //   id: 1680249377909,
  //   label: "#8D55A2",
  //   title: "Event 1"
  // }, {
  //   day: 1679598000000,
  //   description: "I am uzair",
  //   id: 1680249377909,
  //   label: "#8D55A2",
  //   title: "Event 1"
  // }, {
  //   day: 1679598000000,
  //   description: "I am uzair",
  //   id: 1680249377909,
  //   label: "green",
  //   title: "Event 5"
  // }, {
  //   day: 1679598000000,
  //   description: "I am uzair",
  //   id: 1680249377909,
  //   label: "red",
  //   title: "Event 2"
  // }]


  const fetchCalendarDetails = () => {
    let startDate = dayjs().set('month', monthNumber).set('date', 1);
    let endDate = startDate.endOf('month');

    startDate = startDate.format('YYYY-MM-DD')
    endDate = endDate.format('YYYY-MM-DD')

    privateRequest.get(`calendar?startDate=${startDate}&endDate=${endDate}`)
      .then((response) => {
        // console.log('response.data.receivedInvites', response.data.data.receivedInvites);
        // console.log('response.data.Bookings', response.data.data.Bookings);
        // console.log('response.data.Events', response.data.data.Events);
        // console.log('response.data.Tasks', response.data.data.Tasks);
        // // setCalendarData(response.data.result)

        setTasks(response.data.data.tasks)
        setBookings(response.data.data.bookings)
        setEvents(response.data.data.events)
      })
      .catch((error) => {
        toast.error(error.response.data.error.message)
      })
  }


  useEffect(() => {
    fetchCalendarDetails()
  }, [monthNumber])




  return (
    <Grid container >
      {month.map((row, i) => (
        row.map((day, idx) => (
          <Grid item xs={1.7142857142857142} sx={{ display: 'flex', alignItems: 'stretch', width: '100%' }}>
            <Day day={day} key={`${i} ${idx}`} Bookings={Bookings} Tasks={Tasks} Events={Events} />
          </Grid>
        ))
      ))
      }
    </Grid >
  );

}
