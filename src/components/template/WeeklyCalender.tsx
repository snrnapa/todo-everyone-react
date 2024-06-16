import { addDays, format, startOfWeek } from "date-fns"
import React, { useEffect, useState } from "react";
import DispCalenderButton from "../button/DispCalenderButton";
import { showErrorAlert } from "../../model/Utils";

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

interface Summary {
    id: number;
    user_id: string;
    title: string;
    deadline: Date;
    completed: boolean;
}




export const WeeklyCalender: React.FC = () => {
    const today = new Date()
    const weekDates = getWeekDates(today)
    const [dispCalender, setDispCalender] = useState<boolean>(false);
    const [summarys, setSummarys] = useState<Summary[]>([]);
    const token = localStorage.getItem('firebaseToken')
    const userId = localStorage.getItem('firebaseUserId')

    useEffect(() => {
        const getSummary = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/v1/summary/${userId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                if (!response.ok) {
                    throw new Error(`HTTP Error! status : ${response.status} `)
                }
                const responseData = await response.json()
                const summariesWithDates = responseData.map((item: any) => ({
                    ...item,
                    deadline: new Date(item.deadline)
                }))
                setSummarys(summariesWithDates)
            } catch (error) {
                showErrorAlert('summaryの取得に失敗しました', `${error}`)
            }
        }
        getSummary();
    }, [])

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
                                <div className="flex">
                                    {summarys.filter((summary) => format(summary.deadline, 'MM/dd') === format(date, 'MM/dd')).map((s) => (
                                        <div className="h-20 flex flex-col items-center space-y-2 justify-center p-2  mx-auto bg-white shadow-md rounded-lg ">
                                            <p className="font-bold">{s.title}</p>
                                            {s.completed ? <p>完了</p> : <p>じっしちゅう</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                :
                <div></div>}
        </div>
    )
}
