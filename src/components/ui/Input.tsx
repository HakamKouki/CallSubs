"use client";
import React from "react";

export function Input({
  value,
  onChange,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2 text-white placeholder:text-white/60 outline-none focus:ring-2 focus:ring-purple-500 ${className}`}
    />
  );
}
