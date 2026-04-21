// src/utils/prayerTimerUtils.js
import { parse, isAfter } from 'date-fns';

/**
 * Calculates the time remaining between Now and a target time string.
 */
export function calculateTimeRemaining(targetTimeStr) {
  if (!targetTimeStr) return "";

  const now = new Date();
  
  // Parse the target time string (e.g., "04:30 AM") into a Date object on TODAY's date
  const targetDate = parse(targetTimeStr, 'hh:mm a', now);

  // If the target time has already passed today, assume it is for TOMORROW
  if (targetDate < now) {
    targetDate.setDate(targetDate.getDate() + 1);
  }

  const differenceMs = targetDate - now;

  // Calculate H:M:S
  const h = Math.floor((differenceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((differenceMs % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((differenceMs % (1000 * 60)) / 1000);

  // Pad numbers with leading zeros (e.g., 05H : 09M : 02S)
  const pad = (num) => String(num).padStart(2, '0');
  
  return `${pad(h)}H : ${pad(m)}M : ${pad(s)}S`;
}

/**
 * Determines the next upcoming prayer from an array of times based on current time.
 */
export function getNextPrayer(currentTime, prayersArray) {
  if (!prayersArray || prayersArray.length === 0) return null;

  // --- NEW ROBUST SORTING LOGIC ---
  // Create a helper to convert "hh:mm A" string to minutes past midnight
  const getMinutes = (timeStr) => {
    // Parse time on a dummy date to get hours and minutes easily
    const parsed = parse(timeStr, 'hh:mm a', new Date(2000, 0, 1));
    return parsed.getHours() * 60 + parsed.getMinutes();
  };

  // Create a copy of the array and sort it by time chronologically (earliest to latest)
  const sortedPrayers = [...prayersArray].sort((a, b) => {
    return getMinutes(a.time) - getMinutes(b.time);
  });
  // ---------------------------------

  // 1. Now iterate through the guaranteed SORTED array to find today's next prayer
  for (const prayer of sortedPrayers) {
    // Convert the prayer time string to a full Date object on TODAY'S date
    const prayerTimeToday = parse(prayer.time, 'hh:mm a', currentTime);

    // If this prayer time is AFTER the current time, it is the next one.
    if (isAfter(prayerTimeToday, currentTime)) {
      return {
        ...prayer,
        isTomorrow: false // It's still today
      };
    }
  }

  // 2. IF WE GOT HERE, it means the current time is PAST the last prayer of the day.
  // The next prayer is therefore the FIRST prayer in the SORTED list (earliest in day), but TOMORROW.
  return {
    ...sortedPrayers[0], // This is now guaranteed to be the earliest prayer (Fajr)
    isTomorrow: true // It's tomorrow
  };
}