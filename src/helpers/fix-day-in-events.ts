import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export const fixDayInEvents = (day: string) => {
  const date = parseISO(day);
  const formattedDate = format(date, "EEEE, dd 'de'  MMMM 'de' yyyy", {
    locale: ptBR,
  });

  return formattedDate;
};
