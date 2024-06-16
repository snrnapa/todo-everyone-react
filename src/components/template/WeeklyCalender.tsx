import { addDays, format, startOfWeek } from "date-fns"
import React, { useState } from "react";
import DispCalenderButton from "../button/DispCalenderButton";

const getWeekDates = (startDate: Date): Date[] => {
    const weekDates = []
    const startOfWeekDate = startOfWeek(startDate, { weekStartsOn: 0 })
    for (let i = 0; i < 7; i++) {
        weekDates.push(addDays(startOfWeekDate, i));
    }
    return weekDates
}


const getColorForToday = (index: number, date: Date) => {
    const dailyString = format(date, 'EEE')
    if (index == 0) {
        return "bg-blue-200  border-black border-2"
    } else if (dailyString == 'Sat' || dailyString == 'Sun') {
        return "bg-red-100 font-bold"
    }
}



export const WeeklyCalender: React.FC = () => {
    const today = new Date()
    const weekDates = getWeekDates(today)
    const [dispCalender, setDispCalender] = useState<boolean>(false);
    return (
        <div className="">
            <DispCalenderButton dispCalender={dispCalender} onDisp={setDispCalender} />

            {dispCalender ?
                <div>
                    {weekDates.map((date, index) => (
                        <div key={index} className={`p-1 border rounded shadow flex flex-col  ${getColorForToday(index, date)}`}>
                            <div className={`flex flex-col `}>
                                <p className="text-xl">{format(date, 'MM/dd')}</p>
                                <p className="text-lg font-semibold">{format(date, 'EEE')}</p>
                            </div>
                        </div>
                    ))}
                </div>
                :
                <div></div>}
        </div>
    )
}
