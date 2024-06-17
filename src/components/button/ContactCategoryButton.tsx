import { BugDroid, DotsThreeCircle, User, Wrench } from 'phosphor-react';
import React, { useState } from 'react';

interface ContactCategoryButtonProps {
    selectedCategory: string;
    // setSelectedCategory: () => void;
    onSelected: (category: string) => void;
}


const ContactCategoryButton: React.FC<ContactCategoryButtonProps> = ({ selectedCategory: selectedCategory, onSelected: onSelected }) => {

    const iconSize: number = 32

    const categories = [
        { value: 'feature-request', label: '機能リクエスト', icon: <Wrench size={iconSize} /> },
        { value: 'bug-report', label: 'バグ報告', icon: <BugDroid size={iconSize} /> },
        { value: 'account-issue', label: 'アカウント問題', icon: <User size={iconSize} /> },
        { value: 'other', label: 'その他', icon: <DotsThreeCircle size={iconSize} /> },
    ]

    return (
        <div className="max-w-sm mx-auto my-10 p-4 border border-gray-300 rounded-md shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                カテゴリを選択してください
            </label>
            <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((category) => (
                    <button
                        key={category.value}
                        onClick={() => onSelected(category.value)}
                        className={`flex flex-col items-center justify-center w-24 h-24 p-2 border rounded-md shadow-sm transition-transform transform hover:scale-105 
                ${selectedCategory === category.value ? 'bg-personaBlue text-personaTextWhite' : 'bg-white text-gray-700'}`}
                    >
                        {category.icon}
                        <span className="mt-2 text-sm">{category.label}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default ContactCategoryButton