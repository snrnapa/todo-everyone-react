import React, { useState } from 'react';
import { IconButton } from '@mui/material';

const FilterButtons: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<string | null>('all');

    const handleFilterClick = (filter: string) => {
        setActiveFilter(filter);
        // フィルターが選択された後の処理を追加する場合はここに追加
    };

    return (
        <div className="flex justify-center ">
            <IconButton
                onClick={() => handleFilterClick('all')}
            >
                <p className={`font-Darumadrop text-sm ${activeFilter === 'all' ? 'text-amber-700 ' : 'text-gray-500 font-light'}`}>ぜんぶ</p>
            </IconButton>
            <IconButton
                onClick={() => handleFilterClick('completed')}
            >
                <p
                    className={`font-Darumadrop text-sm ${activeFilter === 'completed' ? 'text-amber-700 ' : 'text-gray-500 font-light'}`}
                >かんりょう</p>
            </IconButton>
            <IconButton
                onClick={() => handleFilterClick('incomplete')}
            >
                <p className={`font-Darumadrop text-sm ${activeFilter === 'incomplete' ? 'text-amber-700 ' : 'text-gray-500 font-light'}`}>がんばりちゅう</p>
            </IconButton>
        </div >

    );
};

export default FilterButtons;