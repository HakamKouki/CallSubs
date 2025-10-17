"use client";
import React, { ChangeEvent } from "react";

interface InputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  type?: string; // 👈 Added support for type
  "aria-label"?: string;
}

export function Input({
  value,
  onChange,
  placeholder,
  className = "",
  type = "text",
  ...rest
}: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2 text-white placeholder:text-white/60 outline-none focus:ring-2 focus:ring-purple-500 ${className}`}
      {...rest}
    />
  );
}
