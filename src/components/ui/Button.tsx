"use client";
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  size?: "sm" | "md";
  variant?: "outline" | "ghost";
  disabled?: boolean; // 👈 Added support for disabled
}

export function Button({
  children,
  onClick,
  className = "",
  type = "button",
  size = "md",
  variant = "outline",
  disabled = false,
}: ButtonProps) {
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
  };

  const variants = {
    outline:
      "border border-white/15 bg-white/10 text-white hover:bg-white/20 transition",
    ghost: "text-white hover:bg-white/10 transition",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg font-semibold ${sizes[size]} ${variants[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
}
