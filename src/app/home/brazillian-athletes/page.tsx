"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { athletes } from "@/helpers/athletes";
import { disciplinesList } from "@/helpers/disciplines";
import usePaginator from "@/hooks/usePaginator";
import { Download } from "lucide-react";
import { Paginator } from "primereact/paginator";
import { useState } from "react";
import * as XLSX from "xlsx";

const BrazillianAthletes = () => {
  const [inputSearch, setInputSearch] = useState("");
  const { first, rows, onPageChange } = usePaginator();
  const [filter, setFilter] = useState("all");
  const [ordenedBy, setOrdenedBy] = useState("az");

  const filteredAthletes = athletes
    .filter((athlete) => {
      const nameMatches = athlete.name
        .toLocaleLowerCase()
        .includes(inputSearch.toLocaleLowerCase());

      const disciplineMatches =
        filter.toLocaleLowerCase() === "all"
          ? true
          : athlete.discipline.toLocaleLowerCase() ===
            filter.toLocaleLowerCase();

      return nameMatches && disciplineMatches;
    })
    .sort((a, b) => {
      switch (ordenedBy) {
        case "az":
          return a.name.localeCompare(b.name);
        case "za":
          return b.name.localeCompare(a.name);
        case "male":
          return a.gender === "Masculino" ? -1 : 1;
        case "female":
          return a.gender === "Feminino" ? -1 : 1;
        default:
          return 0;
      }
    });

  const handleExport = () => {
    const ws_data = [["Nome", "Modalidade", "Gênero"]];

    filteredAthletes.forEach((athlete) => {
      ws_data.push([
        String(athlete.name),
        String(athlete.discipline),
        String(athlete.gender),
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "brazillian-athletes");
    XLSX.writeFile(wb, "brazillian-athletes.xlsx");
  };

  return (
    <div className="section">
      <div className="flex items-start gap-4">
        <Input
          placeholder="Rebeca Andrade"
          value={inputSearch}
          onChange={(e) => setInputSearch(e.target.value)}
        />
        <Select value={ordenedBy} onValueChange={setOrdenedBy}>
          <SelectTrigger className="hidden w-[200px] lg:flex">
            <SelectValue placeholder="Ordenar por:" />
            <SelectContent>
              <SelectItem value="az">Alfabética A-Z</SelectItem>
              <SelectItem value="za">Alfabética Z-A</SelectItem>
              <SelectItem value="male">Masculino</SelectItem>
              <SelectItem value="female">Feminino</SelectItem>
            </SelectContent>
          </SelectTrigger>
        </Select>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="hidden w-[200px] lg:flex">
            <SelectValue placeholder="Modalidades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"all"}>Todas</SelectItem>
            {disciplinesList.map((discipline, index) => (
              <SelectItem key={index} value={discipline}>
                {discipline}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleExport} variant={"outline"}>
          <Download size={20} />
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Modalidade</TableHead>
            <TableHead>Gênero</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAthletes.slice(first, first + rows).map((athlete, index) => (
            <TableRow key={index}>
              <TableCell>{athlete.name}</TableCell>
              <TableCell>{athlete.discipline}</TableCell>
              <TableCell>{athlete.gender}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filteredAthletes.length > 0 && (
        <Paginator
          first={first}
          rows={rows}
          totalRecords={filteredAthletes.length}
          onPageChange={onPageChange}
        />
      )}

      {inputSearch.length != 0 && filteredAthletes.length == 0 && (
        <p className="text-center">Nenhum atleta com esse nome.</p>
      )}
    </div>
  );
};

export default BrazillianAthletes;
