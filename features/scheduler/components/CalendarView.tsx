"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

interface CalendarViewProps {
  posts: any[];
}

export function CalendarView({ posts }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const getPostsForDay = (day: Date) => {
    return posts.filter(post => {
      const postDate = new Date(post.scheduled_for);
      return isSameDay(postDate, day);
    });
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-white/5 shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-100 dark:border-white/5 bg-neutral-50/50 dark:bg-neutral-800/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-500/20">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 capitalize">
              {format(currentMonth, 'MMMM yyyy', { locale: es })}
            </h3>
            <p className="text-xs text-neutral-500">{posts.length} posts en total</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors">
            <ChevronLeft className="h-5 w-5 text-neutral-500" />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors">
            <ChevronRight className="h-5 w-5 text-neutral-500" />
          </button>
        </div>
      </div>

      {/* Days Labels */}
      <div className="grid grid-cols-7 border-b border-neutral-100 dark:border-white/5 bg-neutral-50/30 dark:bg-neutral-900/50">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
          <div key={day} className="py-3 text-center text-[10px] font-black uppercase tracking-widest text-neutral-400">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-neutral-100 dark:divide-white/5 border-l border-t border-neutral-100 dark:border-white/5">
        {calendarDays.map((day, i) => {
          const dayPosts = getPostsForDay(day);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());

          return (
            <div 
              key={i} 
              className={`min-h-[100px] sm:min-h-[120px] p-2 transition-colors ${
                !isCurrentMonth ? 'bg-neutral-50/50 dark:bg-neutral-950/20 opacity-30' : 
                isToday ? 'bg-blue-50/30 dark:bg-blue-900/5' : 'bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-800/30'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`text-xs font-bold leading-none p-1.5 rounded-md ${
                  isToday ? 'bg-blue-600 text-white shadow-sm' : 'text-neutral-500'
                }`}>
                  {format(day, 'd')}
                </span>
                {dayPosts.length > 0 && (
                   <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                )}
              </div>
              
              <div className="space-y-1 overflow-hidden">
                {dayPosts.slice(0, 2).map(post => (
                  <div 
                    key={post.id} 
                    className="group relative px-1.5 py-1 rounded bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 cursor-pointer hover:border-blue-400 transition-all"
                  >
                    <p className="text-[9px] font-medium text-blue-700 dark:text-blue-300 truncate leading-tight">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5 text-[8px] text-blue-500/70">
                      <Clock className="h-2 w-2" />
                      {format(new Date(post.scheduled_for), 'HH:mm')}
                    </div>
                  </div>
                ))}
                {dayPosts.length > 2 && (
                  <div className="text-[9px] font-bold text-neutral-400 text-center py-1">
                    +{dayPosts.length - 2} más
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
