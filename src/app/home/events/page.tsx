"use client";
import GroupCompetitionCard from "@/components/cards/group-competition-card";
import MatchupCard from "@/components/cards/matchup-card";
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
import { CountriesProps } from "../ranking/page";
export interface Competitor {
  competitor_name: string;
  country_flag_url: string;
  country_id: string;
  position: number;
  result_mark: string;
  result_position: string;
  result_winnerLoserTie: string;
}

export interface EventsProps {
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
  const [date, setDate] = useState<Date | undefined>();
  const [countries, setCountries] = useState<CountriesProps[]>([]);
  const [filterByCountry, setFilterByCountry] = useState("");
  console.log(filterByCountry);

  useEffect(() => {
    const fetchCountries = async () => {
      startTransition(async () => {
        try {
          const response = await axios.get("/api/get-countries");
          const data = response.data.data;
          setCountries(data);
        } catch (error) {
          console.log(error);
        }
      });
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      startTransition(async () => {
        try {
          const query = new URLSearchParams({
            page: page.toString(),
            gender: ordenedBy || "",
            date: date ? format(date, "yyyy-MM-dd") : "",
          });

          if (filterByCountry && filterByCountry.toLowerCase() !== "all") {
            query.append("country", filterByCountry);
          }

          query.forEach((value, key) => {
            if (!value) {
              query.delete(key);
            }
          });

          const response = await axios.get(
            `/api/get-events?${query.toString()}`,
          );
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
  }, [page, filterByCountry, ordenedBy, date]);

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

        <Select value={filterByCountry} onValueChange={setFilterByCountry}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Países" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {countries.map((country) => (
              <SelectItem value={country.id}>
                <div className="flex items-center gap-2">
                  <Image
                    width={30}
                    height={30}
                    className={`h-auto w-auto`}
                    src={country.flag_url}
                    alt={country.name}
                    priority
                    style={{
                      objectFit: "cover",
                    }}
                  />
                  <p className="text-sm"> {country.name}</p>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button className="gap-2" variant={"outline"}>
              {date ? (
                format(date, "dd/MM/yyyy")
              ) : (
                <div className="flex items-center gap-2">
                  {" "}
                  <span className="hidden lg:block">Calendário</span>{" "}
                  <CalendarCheck size={20} />
                </div>
              )}
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
      {!isPending && (
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

            if (competitors.length === 2) {
              return (
                <MatchupCard
                  key={event.id}
                  event={event}
                  competitors={competitors}
                />
              );
            }

            if (competitors.length > 2) {
              return (
                <GroupCompetitionCard
                  key={event.id}
                  event={event}
                  competitors={competitors}
                />
              );
            }
          })}
        </div>
      )}

      {isPending && (
        <div className="flex w-full items-center justify-center">
          {" "}
          <Loading />
        </div>
      )}

      {filteredEvents.length > 0 && !isPending && (
        <Paginator
          first={first}
          rows={rows}
          totalRecords={totalRecords}
          onPageChange={onPageChange}
        />
      )}

      {inputSearch.length != 0 && filteredEvents.length == 0 && (
        <p className="text-center">Nenhum evento com esse nome.</p>
      )}
    </div>
  );
};

export default Events;
