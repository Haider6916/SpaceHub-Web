import { Button, Typography } from "@mui/material";
import { ReactComponent as ArrowRight } from '../../Assets/SVGs/ArrowHeadRight.svg';
import { ReactComponent as ArrowLeft } from '../../Assets/SVGs/ArrowHeadLeft.svg';


import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import { useDispatch, useSelector } from "react-redux";
import { changeViewType, dayDecrement, dayIncrement, monthDecrement, monthIncrement, setDay, setMonth, setWeek, weekDecrement, weekIncrement } from "../../Redux/calendarSlice";
import { getMonth } from "../../Utils/util";


export default function CalendarHeader(props) {
  const viewType = useSelector((state) => state.calendar.viewType)
  const monthNumber = useSelector((state) => state.calendar.monthNumber)
  const weekNumber = useSelector((state) => state.calendar.weekNumber)
  const dayNumber = useSelector((state) => state.calendar.dayNumber)
  const [text, setText] = useState('')
  const [weeksLength, setWeeksLength] = useState(0)
  const [daysLength, setDaysLength] = useState(0)
  const dispatch = useDispatch()


  const calculateWeek = () => {
    let index = 0;
    const weeksArray = getMonth(dayjs().month())
    weeksArray.map((row, idx) => {
      row.map((date) => {
        if (date.format("DD-MM-YY") === dayjs().format("DD-MM-YY")) {
          index = idx;
          return;
        }
      });
    });
    return index;
  };

  const calculateDay = () => {
    let index = 0;
    let daysArray = getMonth(dayjs().month()).flat()
    daysArray.map((date, idx) => {
      if (date.format("DD-MM-YY") === dayjs().format("DD-MM-YY")) {
        index = idx;
        return;
      }
    });
    return index
  }

  function handlePrevMonth() {
    if (viewType === 'Month') {
      dispatch(monthDecrement())
    }
    else if (viewType === 'Week') {
      if (weekNumber === 0) {
        let prevMonthLastWeek = getMonth(monthNumber - 1).length - 1
        dispatch(monthDecrement())
        dispatch(setWeek(prevMonthLastWeek))
      }
      else {
        dispatch(weekDecrement())
      }
    } else {
      if (dayNumber === 0) {
        let prevMonthLastDay = getMonth(monthNumber - 1).flat().length - 1
        dispatch(monthDecrement())
        dispatch(setDay(34))
      }
      else {
        dispatch(dayDecrement())
      }

    }
  }
  function handleNextMonth() {
    if (viewType === 'Month') {
      dispatch(monthIncrement())
    }
    else if (viewType === 'Week') {
      if (weekNumber === weeksLength) {
        dispatch(monthIncrement())
        dispatch(setWeek(0))
      }
      else {
        dispatch(weekIncrement())
      }
    } else {
      if (dayNumber === daysLength) {
        dispatch(monthIncrement())
        dispatch(setDay(0))
      }
      else {
        dispatch(dayIncrement())
      }

    }
  }

  function handleReset() {
    if (monthNumber !== dayjs().month()) {
      if (viewType === 'Month') {
        dispatch(setMonth(dayjs().month()))
      } else if (viewType === 'Week') {
        dispatch(setMonth(dayjs().month()))
        dispatch(setWeek(calculateWeek()))
      } else {
        dispatch(setMonth(dayjs().month()))
        dispatch(setDay(calculateDay()))

      }

    }
  }

  const writeText = async () => {
    if (viewType === 'Month') {
      setText(dayjs(new Date(dayjs().year(), monthNumber)).format("MMMM YYYY"));
    }
    else if (viewType === 'Week') {
      let specficWeek = getMonth(monthNumber)[weekNumber]

      let startDateofWeek = dayjs(specficWeek[0]).format("DD")
      let endDateofWeek = dayjs(specficWeek[6]).format("DD")

      let startMonthofWeek = dayjs(specficWeek[0]).format("MMM")
      let endMonthofWeek = dayjs(specficWeek[6]).format("MMM")

      setText(`${startDateofWeek} ${startMonthofWeek} - ${endDateofWeek} ${endMonthofWeek}`)

    }
    else {
      let daysArray = getMonth(monthNumber).flat()
      setText(dayjs(daysArray[dayNumber]).format("DD MMMM YYYY"));
    }
  }

  useEffect(() => {
    writeText()

    let weeksArrayLength = getMonth(monthNumber).length - 1
    let daysArrayLength = getMonth(monthNumber).flat().length - 1

    setWeeksLength(weeksArrayLength);
    setDaysLength(daysArrayLength);


  }, [monthNumber, weekNumber, dayNumber, viewType])

  return (
    <>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between", borderBottom: "1px solid #DBDBDA", height: '72px', padding: '8px 0px' }}>
        <div style={{ display: 'flex' }}>
          <Button variant="outlined" sx={{ borderRadius: '20px', padding: '0px 24px', height: '40px', fontWeight: '500', padding: '0px 24px', fontSize: '16px', lineHeight: '28px' }} onClick={handleReset} >
            Today
          </Button>

          <div style={{ display: "flex", gap: '16px', alignItems: "center", marginLeft: '24px' }}>
            <Button onClick={handlePrevMonth} sx={{ padding: '5px 0px', width: 'max-content' }}>
              <ArrowLeft />
            </Button>

            <Typography sx={{ fontSize: '18px', color: '#8D55A2', fontWeight: '500', lineHeight: 'normal' }} >
              {text}
            </Typography>

            <Button onClick={handleNextMonth} sx={{ padding: '5px 0px', width: 'max-content' }}>
              <ArrowRight />
            </Button>
          </div>

        </div>

        <div>
          <CustomDropdown
            placeholderValue='Calendar'
            menuItems={['Month', 'Week', 'Day']}
            value={viewType}
            handleDropdownValue={(value) => {
              dispatch(changeViewType(value))
            }}
          />
        </div>

      </header>

    </>
  );
}
