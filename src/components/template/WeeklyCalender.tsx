import { addDays, format } from "date-fns"
import React, { useEffect, useState } from "react";
import DispCalenderButton from "../button/DispCalenderButton";
import { showErrorAlert } from "../../model/Utils";
import { CheckSquare, PushPin } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';



const getWeekDates = (startDate: Date): Date[] => {
    const weekDates = []
    const today = new Date()
    for (let i = 0; i < 7; i++) {
        weekDates.push(addDays(today, i));
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

const getColorCompletedForCalender = (completed: boolean) => {
    if (completed) {
        return "bg-gray-200"
    } else {
        return "bg-green-200"
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

    const navigate = useNavigate();

    const navigateTodoInfo = (todoId: number) => {
        navigate(`/todo/${todoId}`);
    };

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
                            <div className={`flex space-x-1`}>
                                <div className="flex flex-col">
                                    <p className="text-base">{format(date, 'MM/dd')}</p>
                                    <p className="text-base font-semibold">{format(date, 'EEE')}</p>
                                </div>
                                <div className="flex">
                                    {summarys.filter((summary) => format(summary.deadline, 'MM/dd') === format(date, 'MM/dd')).map((s) => (
                                        <div onClick={() => {
                                            navigateTodoInfo(s.id)
                                        }} className={`${getColorCompletedForCalender(s.completed)}  flex  space-y-2 space-x-1 justify-center p-2   shadow-md rounded-lg`}  >
                                            {s.completed ? <CheckSquare size={20} /> : <PushPin size={20} />}
                                            <div className="flex-col">
                                                <p className="text-xs font-bold">{s.title}</p>
                                            </div>
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
