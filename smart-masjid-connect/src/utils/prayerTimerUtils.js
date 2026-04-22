// src/utils/prayerTimerUtils.js
import { parse, isAfter } from 'date-fns';


export function calculateTimeRemaining(targetTimeStr) {
  if (!targetTimeStr) return "";

  const now = new Date();
  
  const targetDate = parse(targetTimeStr, 'hh:mm a', now);

  if (targetDate < now) {
    targetDate.setDate(targetDate.getDate() + 1);
  }

  const differenceMs = targetDate - now;

  const h = Math.floor((differenceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((differenceMs % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((differenceMs % (1000 * 60)) / 1000);

  const pad = (num) => String(num).padStart(2, '0');
  
  return `${pad(h)}H : ${pad(m)}M : ${pad(s)}S`;
}


export function getNextPrayer(currentTime, prayersArray) {
  if (!prayersArray || prayersArray.length === 0) return null;

 
  const getMinutes = (timeStr) => {
    const parsed = parse(timeStr, 'hh:mm a', new Date(2000, 0, 1));
    return parsed.getHours() * 60 + parsed.getMinutes();
  };

  const sortedPrayers = [...prayersArray].sort((a, b) => {
    return getMinutes(a.time) - getMinutes(b.time);
  });
  
  for (const prayer of sortedPrayers) {
   
    const prayerTimeToday = parse(prayer.time, 'hh:mm a', currentTime);

   
    if (isAfter(prayerTimeToday, currentTime)) {
      return {
        ...prayer,
        isTomorrow: false
      };
    }
  }

  return {
    ...sortedPrayers[0], 
    isTomorrow: true 
  };
}