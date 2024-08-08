"use client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GoalIcon, ListOrdered } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { EventsProps } from "../page";
interface CompetitionDetailsProps {
  params: {
    id: number;
  };
}

const CompetitionDetails = ({ params }: CompetitionDetailsProps) => {
  const [event, setEvent] = useState<EventsProps>();
  const [isPending, startTransition] = useTransition();

  console.log(event);

  useEffect(() => {
    const fetchDisciplines = async () => {
      startTransition(async () => {
        try {
          const response = await fetch(
            `https://apis.codante.io/olympic-games/events/${params.id}`,
          );
          const data = await response.json();
          setEvent(data.data);
        } catch (error) {
          console.log(error);
        }
      });
    };

    fetchDisciplines();
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <div className="flex items-end gap-2">
          <h1 className="text-4xl font-bold">{event?.discipline_name}</h1>
          <span className="text-base font-medium opacity-60">
            {" "}
            {event?.gender_code == "W" && "Feminino"}
            {event?.gender_code == "M" && "Masculino"}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {event?.competitors.map((competitors) => (
          <Card className="w-full max-w-sm transition-colors hover:bg-border">
            <div className="flex items-center gap-4 p-4">
              <Image
                width={80}
                height={80}
                className={`h-auto w-auto`}
                src={competitors.country_flag_url}
                alt={competitors.country_id}
                priority
                style={{
                  objectFit: "cover",
                }}
              />

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="max-w-[180px] truncate font-medium">
                    {competitors.competitor_name}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <ListOrdered size={20} />
                        </TooltipTrigger>
                        <TooltipContent className="opacity-100">
                          <p>Posição do atleta no ranking</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <span>{competitors.position + 1}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <GoalIcon className="opacity-60" size={20} />
                        </TooltipTrigger>
                        <TooltipContent className="opacity-100">
                          <p>Pontuação</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <span className="opacity-60">
                      {competitors.result_mark}
                    </span>
                  </div>

                  {competitors.result_winnerLoserTie == "W" && (
                    <Badge variant={"default"}>Venceu</Badge>
                  )}
                  {competitors.result_winnerLoserTie == "L" && (
                    <Badge variant={"destructive"}>Perdeu</Badge>
                  )}
                  {competitors.result_winnerLoserTie == "T" && (
                    <Badge variant={"outline"}>Empate</Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CompetitionDetails;
