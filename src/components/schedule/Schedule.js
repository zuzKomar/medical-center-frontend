import * as React from 'react';
import {useEffect, useState} from "react";
import Paper from '@material-ui/core/Paper';
import {Scheduler , WeekView, Appointments, Toolbar, DateNavigator, TodayButton } from '@devexpress/dx-react-scheduler-material-ui';
import { ViewState } from '@devexpress/dx-react-scheduler';
import { makeStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';

const useStyles = makeStyles(theme => ({
    todayCell: {
        backgroundColor: fade(theme.palette.primary.main, 0.1),
        '&:hover': {
            backgroundColor: fade(theme.palette.primary.main, 0.14),
        },
        '&:focus': {
            backgroundColor: fade(theme.palette.primary.main, 0.16),
        },
    },
    weekendCell: {
        backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
        '&:hover': {
            backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
        },
        '&:focus': {
            backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
        },
    },
    today: {
        backgroundColor: fade(theme.palette.primary.main, 0.16),
    },
    weekend: {
        backgroundColor: fade(theme.palette.action.disabledBackground, 0.06),
    },
}));

const TimeTableCell = (props) => {
    const classes = useStyles();
    const { startDate } = props;
    const date = new Date(startDate);

    if (date.getDate() === new Date().getDate()) {
        return <WeekView.TimeTableCell {...props} className={classes.todayCell} />;
    } if (date.getDay() === 0 || date.getDay() === 6) {
        return <WeekView.TimeTableCell {...props} className={classes.weekendCell} />;
    } return <WeekView.TimeTableCell {...props} />;
};

const DayScaleCell = (props) => {
    const classes = useStyles();
    const { startDate, today } = props;

    if (today) {
        return <WeekView.DayScaleCell {...props} className={classes.today} />;
    } if (startDate.getDay() === 0 || startDate.getDay() === 6) {
        return <WeekView.DayScaleCell {...props} className={classes.weekend} />;
    } return <WeekView.DayScaleCell {...props} />;
};

const Schedule = ({schedule}) =>{

    const [appointments, setAppointments] = useState([]);

    useEffect(()=>{
        if(schedule !== undefined){
            let processedAppointments = convertAppointments(schedule);
            setAppointments(processedAppointments);
        }
    },[schedule])

    function convertDate(date){
        let year, month, day, hours, minutes;
        year = date.substring(0, 4)-0;
        month = date.substring(5,7)-1;
        day = date.substring(8,10)-0;
        hours = date.substring(11,13)-0;
        minutes = date.substring(14,16)-0;

        return new Date(year, month, day, hours, minutes);
    }

    function convertAppointments(schedule){
        let properAppointments = [];

        Object.entries(schedule).forEach((([key,value])=>Object.entries(value)
            .forEach(([key,value])=>{
                let date = new Object();
                date["startDate"] = convertDate(value.startDate);
                date["endDate"] = convertDate(value.endDate);
                properAppointments.push(date);
            })))

        return properAppointments;
    }

    return(
        <Paper>
            <Scheduler data={appointments}>
                <ViewState/>
                <WeekView
                    startDayHour={8}
                    endDayHour={18}
                    timeTableCellComponent={TimeTableCell}
                    dayScaleCellComponent={DayScaleCell}
                />
                <Toolbar/>
                <DateNavigator/>
                <TodayButton/>
                <Appointments/>
            </Scheduler>
        </Paper>
    )
}

export default Schedule;