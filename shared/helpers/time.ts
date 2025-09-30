import { TimeFrame } from "../types/api";

function formatLocal(dt: Date) {
  // Format as 'YYYY-MM-DD HH:00:00' in local time
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())} ${pad(dt.getHours())}:00:00`;
}

export function getTimeFrame(numHours: number): TimeFrame {
  const now = new Date();
  const toDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0, 0);
  const fromDate = new Date(toDate.getTime() - numHours * 60 * 60 * 1000);
  return { from: formatLocal(fromDate), to: formatLocal(toDate) };
}