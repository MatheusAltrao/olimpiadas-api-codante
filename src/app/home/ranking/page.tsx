"use client";
import PieCharts from "@/components/charts/Pie";
import Vertical from "@/components/charts/vertical";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { chartColors } from "@/hooks/chart-colors";
import usePaginator from "@/hooks/usePaginator";
import axios from "axios";
import { Download } from "lucide-react";
import Image from "next/image";
import { Paginator } from "primereact/paginator";
import { useEffect, useState, useTransition } from "react";
import * as XLSX from "xlsx";
export interface CountriesProps {
  id: string;
  rank: number;
  name: string;
  continent: string;
  gold_medals: number;
  silver_medals: number;
  bronze_medals: number;
  total_medals: number;
  flag_url: string;
}

const Ranking = () => {
  const [countries, setCountries] = useState<CountriesProps[]>([]);
  const [isPending, startTransition] = useTransition();
  const [inputSearch, setInputSearch] = useState("");
  const [filter, setFilter] = useState("gold");
  const [previewMode, setPreviewMode] = useState("table");
  const { first, rows, onPageChange } = usePaginator();

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

  const filteredCountries = countries
    .filter((country) =>
      country.name
        .toLocaleLowerCase()
        .includes(inputSearch.toLocaleLowerCase()),
    )
    .sort((a, b) => {
      switch (filter) {
        case "total":
          return b.total_medals - a.total_medals;
        case "gold":
          return b.gold_medals - a.gold_medals;
        case "silver":
          return b.silver_medals - a.silver_medals;
        case "bronze":
          return b.bronze_medals - a.bronze_medals;
        case "az":
          return a.name.localeCompare(b.name);
        case "za":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  const chartData = filteredCountries
    .filter((country) => {
      let amount = 0;
      switch (filter) {
        case "total":
          amount = country.total_medals;
          break;
        case "gold":
          amount = country.gold_medals;
          break;
        case "silver":
          amount = country.silver_medals;
          break;
        case "bronze":
          amount = country.bronze_medals;
          break;
        default:
          amount = 0;
      }
      return amount > 0;
    })
    .map((country, index) => {
      let amount = 0;
      switch (filter) {
        case "total":
          amount = country.total_medals;
          break;
        case "gold":
          amount = country.gold_medals;
          break;
        case "silver":
          amount = country.silver_medals;
          break;
        case "bronze":
          amount = country.bronze_medals;
          break;
        default:
          amount = 0;
      }

      return {
        country: country.name,
        amount: amount,
        fill: chartColors[index % chartColors.length],
      };
    });

  const handleExport = () => {
    const ws_data = [
      ["Posição", "Nome", "Continente", "Ouro", "Prata", "Bronze", "Total"],
    ];

    filteredCountries.forEach((country) => {
      ws_data.push([
        String(country.rank),
        String(country.name),
        String(country.continent),
        String(country.gold_medals),
        String(country.silver_medals),
        String(country.bronze_medals),
        String(country.total_medals),
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "CountriesData");
    XLSX.writeFile(wb, "CountriesData.xlsx");
  };

  return (
    <div className="section">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Brasil"
          value={inputSearch}
          onChange={(e) => setInputSearch(e.target.value)}
        />

        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="hidden w-[180px] lg:flex">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="total">Total</SelectItem>
            <SelectItem value="gold">Ouro</SelectItem>
            <SelectItem value="silver">Prata</SelectItem>
            <SelectItem value="bronze">Bronze</SelectItem>
            <SelectItem
              className={`${previewMode == "chart" && "hidden"}`}
              value="az"
            >
              Alfabética A-Z
            </SelectItem>
            <SelectItem
              className={`${previewMode == "chart" && "hidden"}`}
              value="za"
            >
              Alfabética Z-A
            </SelectItem>
          </SelectContent>
        </Select>

        <Select value={previewMode} onValueChange={setPreviewMode}>
          <SelectTrigger className="hidden w-[180px] lg:flex">
            <SelectValue placeholder="Visualizar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="table">Tabela</SelectItem>
            <SelectItem value="chart">Gráfico</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleExport} variant={"outline"}>
          <Download size={20} />
        </Button>
      </div>

      {previewMode == "table" && !isPending && (
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Posição</TableHead>
                <TableHead>Bandeira</TableHead>
                <TableHead>Nome</TableHead>

                <TableHead>Ouro</TableHead>
                <TableHead>Prata</TableHead>
                <TableHead>Bronze</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCountries.slice(first, first + rows).map((country) => (
                <TableRow key={country.name}>
                  <TableCell className="font-bold">
                    {String(country.rank).padStart(2, "0")}
                  </TableCell>
                  <TableCell>
                    {" "}
                    {isPending ? (
                      <Loading />
                    ) : (
                      <Image
                        className="h-auto w-auto"
                        width={60}
                        height={60}
                        src={country.flag_url}
                        alt=""
                      />
                    )}
                  </TableCell>

                  <TableCell className="truncate">{country.name}</TableCell>

                  <TableCell>{country.gold_medals}</TableCell>
                  <TableCell>{country.silver_medals}</TableCell>
                  <TableCell>{country.bronze_medals}</TableCell>

                  <TableCell className="text-right font-bold">
                    {String(country.total_medals).padStart(2, "0")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredCountries.length > 0 && !isPending && (
            <Paginator
              first={first}
              rows={rows}
              totalRecords={filteredCountries.length}
              onPageChange={onPageChange}
            />
          )}

          {inputSearch.length != 0 && filteredCountries.length == 0 && (
            <p className="text-center">Nenhum país com esse nome.</p>
          )}
        </div>
      )}

      {isPending && (
        <div className="flex items-center justify-center">
          <Loading />
        </div>
      )}

      {previewMode == "chart" && <Vertical chartData={chartData} />}

      {previewMode == "chart" && (
        <div>
          <PieCharts chartData={chartData} />
        </div>
      )}
    </div>
  );
};

export default Ranking;
