import React, { ReactNode, MouseEvent, useState } from 'react';
import { ChevronLeftIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

interface ExpandableTextProps {
  onClick: (event: MouseEvent) => void;
  isOpen: boolean;
  endpointName: string;
  content: string;
  children: ReactNode;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ onClick, isOpen, endpointName, content, children }) => {
  return (
    <div onClick={onClick} className="bg-gray-100 p-1 hover:cursor-pointer">
      <div className="flex justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-500 p-1 w-auto inline-block shadow-lg">
            <p className="text-white ">POST</p>
          </div>
          <p>https://rvs.vercel.app/{endpointName}</p>
        </div>
        {!isOpen ? (
          <div className="flex items-center">
            <ChevronLeftIcon className="h-5 w-5" />
          </div>
        ) : (
          <div className="flex items-center">
            <ChevronDownIcon className="h-5 w-5" />
          </div>
        )}
      </div>

      {isOpen && (
        <div>
          { children }
        </div>
      )}
    </div>
  );
};

export default ExpandableText;
