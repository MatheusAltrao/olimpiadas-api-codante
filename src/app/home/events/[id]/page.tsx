"use client";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import axios from "axios";
import { GoalIcon, TrophyIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";

interface CompetitionDetailsProps {
  params: {
    id: number;
  };
}

const CompetitionDetails = ({ params }: CompetitionDetailsProps) => {
  const [countries, setCountries] = useState([]);
  const [isPending, startTransition] = useTransition();

  console.log(countries);

  useEffect(() => {
    const fetchDisciplines = async () => {
      startTransition(async () => {
        try {
          const response = await axios.get("/api/get-events-by-id");
          const data = response.data.data;
          setCountries(data);
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
          <h1 className="text-4xl font-bold">Wrestiling</h1>
          <span className="text-base font-medium opacity-60">Feminino</span>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="w-full max-w-sm">
          <div className="flex items-center gap-4 p-4">
            <Image
              width={80}
              height={80}
              className={`h-auto w-auto`}
              src="https://codante.s3.amazonaws.com/codante-apis/olympic-games/flags/CZE.png"
              alt="Country Flag"
              priority
              style={{
                objectFit: "cover",
              }}
            />

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-medium">Brazil</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <TrophyIcon className="h-4 w-4" />
                  <span>5th</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm opacity-60">
                  <GoalIcon size={20} />
                  <span>8.2</span>
                </div>
                <div
                  className={cn(
                    "rounded-full px-2 py-1 text-xs font-medium",
                    "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200",
                  )}
                >
                  Gained
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CompetitionDetails;
