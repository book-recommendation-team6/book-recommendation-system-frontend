import React from 'react';

function SectionHeader(props) {
    const {title} = props;
    return (
         <div className="w-full mb-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-medium text-gray-800 mb-2">{title}</h1>
                    <div className="w-32 h-1 bg-red-500 rounded-t-2xl"></div>
                </div>
                <a href="#" className="text-gray-600 text-sm hover:underline">
                    Xem tất cả
                </a>
            </div>
            <hr className="text-gray-200"/>
        </div>
    );
}

export default SectionHeader;