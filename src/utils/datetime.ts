/** Combine HTML date + time inputs into ISO string for the API */
export function combineDateAndTime(date: string, time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const d = new Date(`${date}T00:00:00`);
  d.setHours(hours || 0, minutes || 0, 0, 0);
  return d.toISOString();
}

/** Split API ISO date into local date and time for form inputs */
export function splitDateTime(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    const today = new Date();
    return {
      date: today.toISOString().split("T")[0],
      time: "12:00",
    };
  }
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
}

export function nowDateTimeInputs(): { date: string; time: string } {
  return splitDateTime(new Date().toISOString());
}
