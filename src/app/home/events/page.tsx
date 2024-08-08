"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/loading";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarCheck } from "lucide-react";
import Image from "next/image";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { useEffect, useState, useTransition } from "react";
interface Competitor {
  competitor_name: string;
  country_flag_url: string;
  country_id: string;
  position: number;
  result_mark: string;
  result_position: string;
  result_winnerLoserTie: string;
}

interface EventsProps {
  competitors: Competitor[];
  id: number;
  day: string;
  detailed_event_name: string;
  discipline_name: string;
  discipline_pictogram: string;
  start_date: string;
  end_date: string;
  event_name: string;
  gender_code: string;
  status: string;
  venue_name: string;
}

const Events = () => {
  const [events, setEvents] = useState<EventsProps[]>([]);
  const [inputSearch, setInputSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [ordenedBy, setOrdenedBy] = useState("M");
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    const fetchEvents = async () => {
      startTransition(async () => {
        try {
          const query = new URLSearchParams({
            page: page.toString(),
            country: inputSearch || "",
            gender: ordenedBy || "",
          }).toString();

          const response = await axios.get(`/api/get-events?${query}`);
          const data = response.data.data;
          setEvents(data);
          setTotalRecords(response.data.meta.total);
          setRows(response.data.meta.per_page);
          setFirst(
            (response.data.meta.current_page - 1) * response.data.meta.per_page,
          );
        } catch (error) {
          console.log(error);
        }
      });
    };

    fetchEvents();
  }, [page, inputSearch, ordenedBy]);

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setPage(event.page + 1);
  };

  const filteredEvents = events.filter(
    (event) =>
      event.venue_name
        .toLocaleLowerCase()
        .includes(inputSearch.toLocaleLowerCase()) ||
      event.discipline_name
        .toLocaleLowerCase()
        .includes(inputSearch.toLocaleLowerCase()),
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Brasil"
          value={inputSearch}
          onChange={(e) => setInputSearch(e.target.value)}
        />

        <Select value={ordenedBy} onValueChange={setOrdenedBy}>
          <SelectTrigger className="hidden w-[200px] lg:flex">
            <SelectValue placeholder="Ordenar por:" />
            <SelectContent>
              <SelectItem value="M">Masculino</SelectItem>
              <SelectItem value="W">Feminino</SelectItem>
            </SelectContent>
          </SelectTrigger>
        </Select>

        <Popover>
          <PopoverTrigger>
            <Button className="gap-2" variant={"outline"}>
              Calendário <CalendarCheck size={20} />{" "}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex w-full max-w-[400px] items-center justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="w-full"
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {filteredEvents.map((event) => {
          const competitors = event.competitors.map((competitor) => ({
            country_id: competitor.country_id,
            country_flag_url: competitor.country_flag_url,
            competitor_name: competitor.competitor_name,
            result_position: competitor.result_position,
            result_winnerLoserTie: competitor.result_winnerLoserTie,
            result_mark: competitor.result_mark,
          }));

          if (competitors.length !== 2) {
            return null;
          }

          const [team1, team2] = competitors;

          return (
            <div
              key={event.id}
              className="flex w-full max-w-md flex-col gap-4 rounded-lg border bg-background p-6"
            >
              <div className="flex flex-row items-center justify-between">
                <div className={`flex items-center justify-center gap-4`}>
                  {team1.country_flag_url ? (
                    <Image
                      width={40}
                      height={40}
                      className={`h-auto w-auto ${team1.result_winnerLoserTie == "L" && "opacity-50"}`}
                      src={team1.country_flag_url}
                      alt={team1.country_id}
                      priority
                      style={{
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Loading />
                  )}
                  <h2
                    className={`truncate text-sm font-bold ${team1.result_winnerLoserTie == "L" && "opacity-50"}`}
                  >
                    {team1.country_id}
                  </h2>
                </div>
                <div className={`flex flex-row items-center gap-4`}>
                  <h2
                    className={`truncate text-sm font-bold ${team2.result_winnerLoserTie == "L" && "opacity-50"}`}
                  >
                    {team2.country_id}
                  </h2>
                  {team2.country_flag_url ? (
                    <Image
                      width={40}
                      height={40}
                      className={`h-auto w-auto ${team2.result_winnerLoserTie == "L" && "opacity-50"}`}
                      src={team2.country_flag_url}
                      alt={team2.country_id}
                      priority
                      style={{
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Loading />
                  )}
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="text-center text-sm text-muted-foreground">
                    <div>
                      <span className="">
                        {" "}
                        {event.venue_name} - {event.discipline_name}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">
                        {format(event.day, "EEEE, dd 'de'  MMMM 'de' yyyy  ", {
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                  </div>

                  <div>
                    {event.gender_code == "M" && <Badge> Masculino</Badge>}
                    {event.gender_code == "W" && <Badge> Feminino</Badge>}
                    {event.gender_code == "X" && <Badge> Outro</Badge>}
                    {event.gender_code == "O" && <Badge> Outro</Badge>}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 font-bold">
                  <span
                    className={`text-4xl ${team1.result_winnerLoserTie == "L" && "opacity-50"}`}
                  >
                    {team1.result_mark}
                  </span>
                  <span className="text-2xl"> X</span>
                  <span
                    className={`text-4xl ${team2.result_winnerLoserTie == "L" && "opacity-50"}`}
                  >
                    {team2.result_mark}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvents.length > 0 && (
        <Paginator
          first={first}
          rows={rows}
          totalRecords={totalRecords}
          onPageChange={onPageChange}
        />
      )}

      {isPending && (
        <div className="flex w-full items-center justify-center">
          {" "}
          <Loading />
        </div>
      )}

      {inputSearch.length != 0 && filteredEvents.length == 0 && (
        <p className="text-center">Nenhum evento com esse nome.</p>
      )}
    </div>
  );
};

export default Events;
