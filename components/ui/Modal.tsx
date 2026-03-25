"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, description, children, className }: ModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      <div 
        className={cn(
          "relative z-50 w-full max-w-lg rounded-xl bg-white p-6 text-left shadow-2xl transition-all dark:bg-neutral-950 sm:my-8 sm:w-full border border-neutral-200 dark:border-neutral-800",
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:ring-offset-neutral-950 dark:focus:ring-neutral-300"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        
        {(title || description) && (
          <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
            {title && <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>}
            {description && <p className="text-sm text-neutral-500 dark:text-neutral-400">{description}</p>}
          </div>
        )}
        
        {children}
      </div>
    </div>
  );
}
