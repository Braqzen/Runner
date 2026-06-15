export const parseDate = (dateStr: string): Date | null => {
  const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{2})$/);
  if (!match) return null;

  const [, day, month, year] = match;
  const parsed = new Date(
    parseInt(year) + 2000,
    parseInt(month) - 1,
    parseInt(day),
  );
  return isNaN(parsed.getTime()) ? null : parsed;
};

export const getTimeLeft = (eventDate: Date) => {
  const now = new Date();
  const diff = eventDate.getTime() - now.getTime();

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / 1000 / 60) % 60;
  const hours = Math.floor(diff / 1000 / 60 / 60) % 24;
  const days = Math.floor(diff / 1000 / 60 / 60 / 24);

  return { days, hours, minutes, seconds };
};

export const formatCountdown = (eventDate: Date): string => {
  const { days, hours, minutes } = getTimeLeft(eventDate);
  if (days === 0 && hours === 0 && minutes === 0) return "Past";

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  return parts.join(" ");
};
