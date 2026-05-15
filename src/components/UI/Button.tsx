import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md';
}

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 rounded font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm' };
  const variants = {
    primary: 'bg-header text-white hover:brightness-110',
    secondary: 'bg-[#222] text-text-main hover:bg-[#2a2a2a] border border-border',
    danger: 'bg-[#ff6b8022] text-error-color hover:bg-[#ff6b8033] border border-[#ff6b8044]',
    ghost: 'text-text-secondary hover:text-text-main hover:bg-[#ffffff0a]',
  };
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
