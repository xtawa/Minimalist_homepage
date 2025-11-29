import React from 'react';
import { BadgeItem } from '../types';

export const Badge: React.FC<BadgeItem> = ({ text, icon: Icon, href, colorClass }) => {
  const content = (
    <span className={`
      inline-flex items-center gap-1.5 px-2 py-1 rounded md:rounded-md
      bg-[#222] hover:bg-[#2a2a2a] 
      border border-neutral-800 hover:border-neutral-700
      transition-colors duration-200 ease-in-out
      text-sm font-medium leading-none
      text-neutral-400
      ${href ? 'cursor-pointer' : ''}
    `}>
      {Icon && (
        typeof Icon === 'string' ? (
           <span>{Icon}</span>
        ) : (
          <Icon size={14} className={colorClass || 'text-neutral-400'} />
        )
      )}
      <span className={colorClass || 'text-neutral-300'}>{text}</span>
    </span>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="no-underline">
        {content}
      </a>
    );
  }

  return content;
};
