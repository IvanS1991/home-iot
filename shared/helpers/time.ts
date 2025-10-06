import { TimeFrame } from "../types/api";

function formatLocal(dt: Date) {
  // Format as 'YYYY-MM-DD HH:00:00' in local time
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())} ${pad(dt.getHours())}:00:00`;
}

export function getTimeFrame(numHours: number, targetTime?: string /* 'YYYY-MM-DD HH:MM:SS' */): TimeFrame {
  const to = targetTime ? new Date(targetTime) : new Date();
  const toDate = new Date(to.getFullYear(), to.getMonth(), to.getDate(), to.getHours(), 0, 0, 0);
  const fromDate = new Date(toDate.getTime() - numHours * 60 * 60 * 1000);
  return { from: formatLocal(fromDate), to: formatLocal(toDate) };
}