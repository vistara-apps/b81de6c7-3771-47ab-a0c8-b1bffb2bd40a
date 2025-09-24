import { format, addDays, isWithinInterval, parseISO, addHours } from 'date-fns'
import { utcToZonedTime, zonedTimeToUtc, format as formatTZ } from 'date-fns-tz'

export interface TimeSlot {
  datetime: Date
  available: boolean
  timezone: string
}

export interface SchedulingPreferences {
  duration: number // in minutes
  availableDays: string[] // ['monday', 'tuesday', etc.]
  availableHours: { start: string; end: string } // '09:00', '17:00'
  timezone: string
}

export class SchedulingEngine {
  static generateTimeSlots(
    preferences: SchedulingPreferences,
    daysAhead: number = 14
  ): TimeSlot[] {
    const slots: TimeSlot[] = []
    const now = new Date()

    for (let day = 0; day < daysAhead; day++) {
      const date = addDays(now, day)
      const dayName = format(date, 'EEEE').toLowerCase()

      // Check if this day is available
      if (!preferences.availableDays.includes(dayName)) {
        continue
      }

      // Generate hourly slots within available hours
      const [startHour, startMinute] = preferences.availableHours.start.split(':').map(Number)
      const [endHour, endMinute] = preferences.availableHours.end.split(':').map(Number)

      let currentTime = new Date(date)
      currentTime.setHours(startHour, startMinute, 0, 0)

      const endTime = new Date(date)
      endTime.setHours(endHour, endMinute, 0, 0)

      while (currentTime < endTime) {
        // Check if slot is in the future
        const isAvailable = currentTime > now

        slots.push({
          datetime: new Date(currentTime),
          available: isAvailable,
          timezone: preferences.timezone,
        })

        // Add duration for next slot
        currentTime = addHours(currentTime, preferences.duration / 60)
      }
    }

    return slots
  }

  static findMutualTimeSlots(
    user1Prefs: SchedulingPreferences,
    user2Prefs: SchedulingPreferences,
    daysAhead: number = 14
  ): TimeSlot[] {
    const user1Slots = this.generateTimeSlots(user1Prefs, daysAhead)
    const user2Slots = this.generateTimeSlots(user2Prefs, daysAhead)

    // Find overlapping slots
    const mutualSlots: TimeSlot[] = []

    for (const slot1 of user1Slots) {
      for (const slot2 of user2Slots) {
        // Convert both times to UTC for comparison
        const slot1Utc = zonedTimeToUtc(slot1.datetime, slot1.timezone)
        const slot2Utc = zonedTimeToUtc(slot2.datetime, slot2.timezone)

        // Check if times overlap (considering duration)
        const slot1End = addHours(slot1Utc, user1Prefs.duration / 60)
        const slot2End = addHours(slot2Utc, user2Prefs.duration / 60)

        if (
          slot1Utc.getTime() < slot2End.getTime() &&
          slot2Utc.getTime() < slot1End.getTime()
        ) {
          // Use the later start time and earlier end time
          const mutualStart = slot1Utc > slot2Utc ? slot1Utc : slot2Utc
          const mutualEnd = slot1End < slot2End ? slot1End : slot2End

          if (mutualStart < mutualEnd) {
            mutualSlots.push({
              datetime: mutualStart,
              available: true,
              timezone: 'UTC', // Store in UTC, convert when displaying
            })
          }
        }
      }
    }

    // Sort by datetime and return top matches
    return mutualSlots
      .sort((a, b) => a.datetime.getTime() - b.datetime.getTime())
      .slice(0, 10) // Return top 10 mutual slots
  }

  static formatTimeSlot(slot: TimeSlot, targetTimezone: string): string {
    const zonedTime = utcToZonedTime(slot.datetime, targetTimezone)
    return formatTZ(zonedTime, 'EEEE, MMMM d, yyyy \'at\' h:mm a zzz', { timeZone: targetTimezone })
  }

  static generateCalendarInvite(
    title: string,
    description: string,
    startTime: Date,
    duration: number,
    attendees: string[],
    videoCallLink?: string
  ): string {
    const endTime = addHours(startTime, duration / 60)

    // Generate ICS content
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CircleUp//Coffee Chat//EN',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@circleup.app`,
      `DTSTART:${format(startTime, "yyyyMMdd'T'HHmmss'Z'")}`,
      `DTEND:${format(endTime, "yyyyMMdd'T'HHmmss'Z'")}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${videoCallLink || 'TBD'}`,
      ...attendees.map(email => `ATTENDEE:mailto:${email}`),
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')

    return icsContent
  }

  static generateVideoCallLink(): string {
    // In production, integrate with Zoom, Google Meet, etc.
    // For now, generate a unique meeting link
    const meetingId = Math.random().toString(36).substring(2, 15)
    return `https://meet.circleup.app/${meetingId}`
  }

  static validateTimeSlot(
    slot: Date,
    preferences: SchedulingPreferences
  ): boolean {
    const dayName = format(slot, 'EEEE').toLowerCase()

    // Check if day is available
    if (!preferences.availableDays.includes(dayName)) {
      return false
    }

    // Check if time is within available hours
    const [startHour, startMinute] = preferences.availableHours.start.split(':').map(Number)
    const [endHour, endMinute] = preferences.availableHours.end.split(':').map(Number)

    const slotHour = slot.getHours()
    const slotMinute = slot.getMinutes()

    const slotTime = slotHour * 60 + slotMinute
    const startTime = startHour * 60 + startMinute
    const endTime = endHour * 60 + endMinute

    return slotTime >= startTime && slotTime <= endTime
  }

  static getDefaultSchedulingPreferences(timezone: string = 'America/Los_Angeles'): SchedulingPreferences {
    return {
      duration: 30,
      availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      availableHours: { start: '09:00', end: '17:00' },
      timezone,
    }
  }
}

