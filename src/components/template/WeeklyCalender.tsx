import { addDays, format } from "date-fns"
import React, { useEffect, useState } from "react";
import DispCalenderButton from "../button/DispCalenderButton";
import { CheckSquare, PushPin } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';
import { refreshFirebaseToken } from "../../model/token";

const getWeekDates = (): Date[] => {
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

interface WeeklyCalenderProps {
    summaries: any;
    setSummaries: any;
    fetchSummaries: any;
}

export const WeeklyCalender: React.FC<WeeklyCalenderProps> = ({ summaries, fetchSummaries }) => {
    const weekDates = getWeekDates()
    const [dispCalender, setDispCalender] = useState<boolean>(true);
    const userId = localStorage.getItem('firebaseUserId')
    const [headers, setHeaders] = useState<{ Authorization: string }>({ Authorization: '' });
    const [initialized, setInitialized] = useState(false)

    const navigate = useNavigate();

    const navigateTodoInfo = (todoId: number) => {
        navigate(`/todo/${todoId}`);
    };

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const token = await refreshFirebaseToken()
                setHeaders({
                    Authorization: `Bearer ${token}`,
                });
                setInitialized(true);
            } catch (error) {
                console.error('Failed to refresh token:', error);
            }
        }
        fetchToken()
    }, [])

    useEffect(() => {
        if (initialized) {
            fetchSummaries(headers)
        }
    }, [initialized, fetchSummaries])

    if (userId == null) {
        return <div>Loading Now......</div>;
    }

    return (
        <div className="flex flex-col justify-center items-center space-y-5 w-full">
            <DispCalenderButton dispCalender={dispCalender} onDisp={setDispCalender} />
            {dispCalender ?
                <div className="w-full">
                    {weekDates.map((date, index) => (
                        <div key={index} className={`p-1 border rounded shadow flex flex-col ${getColorForToday(index, date)}`}>
                            <div className={`flex space-x-1`}>
                                <div className="flex flex-col">
                                    <p className="text-base">{format(date, 'MM/dd')}</p>
                                    <p className="text-base font-semibold">{format(date, 'EEE')}</p>
                                </div>
                                <div className="flex">
                                    {(summaries || []).filter((summary: any) => {
                                        return summary.deadline && format(summary.deadline, 'MM/dd') === format(date, 'MM/dd');
                                    }).map((s: any) => (
                                        <div
                                            key={s.id} // `key` を追加
                                            onClick={() => navigateTodoInfo(s.id)}
                                            className={`${getColorCompletedForCalender(s.completed)} flex space-y-2 space-x-1 justify-center p-2 shadow-md rounded-lg`}
                                        >
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
