import { IconButton } from '@mui/material'
import { CalendarBlank } from 'phosphor-react'
import React from 'react'


interface DispCalenderButtonProps {
  dispCalender: boolean
  onDisp: (isDisp: boolean) => void
}


const stringClass = 'text-base text-black '
const layoutClass = 'flex space-x-2'

const DispCalenderButton: React.FC<DispCalenderButtonProps> = ({ dispCalender: dispCalender, onDisp: onDisp }) => {

  if (dispCalender) {
    return (
      <IconButton className={`${layoutClass}`} onClick={() => { onDisp(!dispCalender) }}>
        <CalendarBlank size={32} />
        <p className={`${stringClass}`}>非表示</p>
      </IconButton>
    )
  } else {
    return (
      <IconButton className={`${layoutClass}`} onClick={() => { onDisp(!dispCalender) }}>
        <CalendarBlank size={32} />
        <p className={`${stringClass}`}>表示</p>
      </IconButton >
    )
  }

}

export default DispCalenderButton