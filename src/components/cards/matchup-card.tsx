"use client";
import { EventsProps } from "@/app/home/events/page";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import Loading from "../ui/loading";

interface CompetitorsProps {
  country_id: string;
  country_flag_url: string;
  competitor_name: string;
  result_position: string;
  result_winnerLoserTie: string;
  result_mark: string;
}

interface MatchupCardProps {
  event: EventsProps;
  competitors: CompetitorsProps[];
}

const MatchupCard = ({ event, competitors }: MatchupCardProps) => {
  const [team1, team2] = competitors;

  const router = useRouter();

  const handleRedirectToCompetitionDetails = (id: number) => {
    return router.push(`/home/events/${id}`);
  };

  return (
    <div
      onClick={() => handleRedirectToCompetitionDetails(event.id)}
      key={event.id}
      className="flex w-full cursor-pointer flex-col gap-4 rounded-lg border bg-background p-6 transition-colors hover:bg-border"
    >
      <div className="flex flex-wrap items-center justify-center gap-8">
        {competitors.map((team, index) => {
          if (!team.country_id || !team.country_flag_url) {
            return null;
          }

          return (
            <div
              key={index}
              className={`flex items-center justify-center gap-4`}
            >
              {team.country_flag_url ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Image
                        width={40}
                        height={40}
                        className={`h-auto w-auto ${team.result_winnerLoserTie == "L" && "opacity-50"}`}
                        src={team.country_flag_url}
                        alt={team.country_id}
                        priority
                        style={{
                          objectFit: "cover",
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>{team.country_id}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Loading />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="text-center text-sm text-muted-foreground">
            <div>
              <span className="">
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

          <div className="flex flex-col items-center justify-center gap-2">
            <div>
              {event.gender_code == "M" && <Badge> Masculino</Badge>}
              {event.gender_code == "W" && <Badge> Feminino</Badge>}
              {event.gender_code == "X" && <Badge> Outro</Badge>}
              {event.gender_code == "O" && <Badge> Outro</Badge>}
            </div>

            <div>
              {event.status == "Finished" && <Badge>Finalizado</Badge>}
              {event.status == "Scheduled" && (
                <Badge variant={"warning"}> Agendado</Badge>
              )}

              {event.status == "Cancelled" && (
                <Badge variant={"destructive"}> Cancelado</Badge>
              )}
            </div>
          </div>
        </div>

        {event.status == "Finished" && (
          <div className="flex items-center justify-center gap-2 font-bold">
            <span
              className={`text-2xl ${team1.result_winnerLoserTie == "L" && "opacity-50"}`}
            >
              {team1.result_mark}
            </span>
            <span className="text-xl"> X</span>
            <span
              className={`text-2xl ${team2.result_winnerLoserTie == "L" && "opacity-50"}`}
            >
              {team2.result_mark}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchupCard;
