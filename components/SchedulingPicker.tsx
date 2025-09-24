'use client';

import { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { MEETING_DURATIONS } from '@/lib/constants';

interface SchedulingPickerProps {
  onSchedule: (datetime: Date, duration: number) => void;
  timezone: string;
  disabled?: boolean;
}

export function SchedulingPicker({ onSchedule, timezone, disabled = false }: SchedulingPickerProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(30);

  const handleSchedule = () => {
    if (selectedDate && selectedTime) {
      const datetime = new Date(`${selectedDate}T${selectedTime}`);
      onSchedule(datetime, selectedDuration);
    }
  };

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const getAvailableTimes = () => {
    const times = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };

  const isScheduleValid = selectedDate && selectedTime;

  return (
    <div className="card space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-primary" />
        <h3 className="font-medium text-text-primary">Schedule Your Coffee Chat</h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Select Date
          </label>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">Choose a date</option>
            {getAvailableDates().map((date) => (
              <option key={date} value={date}>
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Select Time ({timezone})
          </label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            disabled={disabled || !selectedDate}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">Choose a time</option>
            {getAvailableTimes().map((time) => (
              <option key={time} value={time}>
                {new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Duration
          </label>
          <select
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(Number(e.target.value))}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
          >
            {MEETING_DURATIONS.map((duration) => (
              <option key={duration.value} value={duration.value}>
                {duration.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleSchedule}
        disabled={!isScheduleValid || disabled}
        className="w-full btn-primary flex items-center justify-center gap-2"
      >
        <Clock className="w-4 h-4" />
        Schedule Coffee Chat
      </button>

      <p className="text-xs text-text-secondary text-center">
        Both participants will receive calendar invites with video call details.
      </p>
    </div>
  );
}
