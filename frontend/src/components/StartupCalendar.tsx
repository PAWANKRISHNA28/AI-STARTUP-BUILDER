import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, Video } from 'lucide-react';
import { m } from 'framer-motion';

export const StartupCalendar: React.FC<{ projectId?: string }> = ({ projectId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const mockEvents = [
    { day: 5, title: 'Investor Pitch - Sequoia', time: '10:00 AM', type: 'meeting' },
    { day: 12, title: 'MVP Launch Deadline', type: 'milestone' },
    { day: 18, title: 'Weekly Sync with AI', time: '2:00 PM', type: 'meeting' },
    { day: 24, title: 'Marketing Campaign Live', type: 'task' },
  ];

  return (
    <div className="h-full w-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Startup Calendar</h2>
          <p className="text-sm text-muted-foreground">Schedule meetings, track milestones, and plan sprints.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-full text-xs font-bold shadow-apple hover:scale-105 transition-transform">
          <Plus className="w-4 h-4" /> New Event
        </button>
      </div>

      <div className="flex-1 glass-panel rounded-3xl border border-border/50 p-6 flex flex-col h-full shadow-soft">
        
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-foreground">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <div className="flex items-center gap-2">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-muted rounded-full transition-colors">
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="px-4 py-1.5 text-xs font-bold bg-muted/50 rounded-full hover:bg-muted transition-colors">
              Today
            </button>
            <button onClick={handleNextMonth} className="p-2 hover:bg-muted rounded-full transition-colors">
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-4 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 grid grid-cols-7 gap-4 auto-rows-fr">
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="opacity-0" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
            const dayEvents = mockEvents.filter(e => e.day === day);

            return (
              <div 
                key={day} 
                className={`min-h-[100px] p-2 rounded-2xl border transition-all hover:border-blue-500/50 cursor-pointer flex flex-col group ${
                  isToday ? 'bg-blue-50/50 border-blue-200 shadow-inner' : 'bg-background border-border/50 hover:bg-muted/30'
                }`}
              >
                <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full mb-2 ${
                  isToday ? 'bg-blue-500 text-white shadow-soft' : 'text-foreground'
                }`}>
                  {day}
                </span>

                <div className="flex-1 space-y-1.5 overflow-y-auto scrollbar-none">
                  {dayEvents.map((event, i) => (
                    <div 
                      key={i} 
                      className={`px-2 py-1.5 rounded-lg text-[10px] font-medium leading-tight truncate ${
                        event.type === 'meeting' ? 'bg-blue-100/80 text-blue-700 border border-blue-200/50' : 
                        event.type === 'milestone' ? 'bg-purple-100/80 text-purple-700 border border-purple-200/50' : 
                        'bg-emerald-100/80 text-emerald-700 border border-emerald-200/50'
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-0.5">
                        {event.type === 'meeting' && <Video className="w-2.5 h-2.5" />}
                        {event.type === 'milestone' && <CalendarIcon className="w-2.5 h-2.5" />}
                        {event.time && <span className="font-bold">{event.time}</span>}
                      </div>
                      <span className="truncate block">{event.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
