import React from 'react';
import { IconButton } from '@mui/material';


interface FilterButtonsProps {
    activeFilter: string;
    onHandleFilterClick: (filter: string) => void;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ onHandleFilterClick: onHandleFilterClick, activeFilter: activeFilter }) => {

    return (
        <div className="flex justify-center ">
            <IconButton
                onClick={() => onHandleFilterClick('all')}
            >
                <p className={`font-Darumadrop text-sm ${activeFilter === 'all' ? 'text-amber-700 ' : 'text-gray-500 font-light'}`}>ぜんぶ</p>
            </IconButton>
            <IconButton
                onClick={() => onHandleFilterClick('completed')}
            >
                <p
                    className={`font-Darumadrop text-sm ${activeFilter === 'completed' ? 'text-amber-700 ' : 'text-gray-500 font-light'}`}
                >かんりょう</p>
            </IconButton>
            <IconButton
                onClick={() => onHandleFilterClick('incomplete')}
            >
                <p className={`font-Darumadrop text-sm ${activeFilter === 'incomplete' ? 'text-amber-700 ' : 'text-gray-500 font-light'}`}>がんばりちゅう</p>
            </IconButton>
        </div >

    );
};

export default FilterButtons;