"use client";
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
import usePaginator from "@/hooks/usePaginator";
import axios from "axios";
import { Download } from "lucide-react";
import Image from "next/image";
import { Paginator } from "primereact/paginator";
import { useEffect, useState, useTransition } from "react";
import * as XLSX from "xlsx";

interface DisciplinesProps {
  id: string;
  name: string;
  pictogram_url: string;
}

const Dispiplines = () => {
  const [disciplines, setDisciplines] = useState<DisciplinesProps[]>([]);
  const [isPending, startTransition] = useTransition();
  const [inputSearch, setInputSearch] = useState("");
  const { first, rows, onPageChange } = usePaginator();
  const [ordenedBy, setOrdenedBy] = useState("az");

  useEffect(() => {
    const fetchDisciplines = async () => {
      startTransition(async () => {
        try {
          const response = await axios.get("/api/get-disciplines");
          const data = response.data.data;
          setDisciplines(data);
        } catch (error) {
          console.log(error);
        }
      });
    };

    fetchDisciplines();
  }, []);

  const filteredDisciplines = disciplines
    .filter((discipline) => {
      const disciplineMatch = discipline.name
        .toLocaleLowerCase()
        .includes(inputSearch.toLocaleLowerCase());

      return disciplineMatch;
    })
    .sort((a, b) => {
      switch (ordenedBy) {
        case "az":
          return a.name.localeCompare(b.name);
        case "za":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  const handleExport = () => {
    const ws_data = [["id", "nome", "imagem"]];

    filteredDisciplines.forEach((discipline) => {
      ws_data.push([
        String(discipline.id),
        String(discipline.name),
        String(discipline.pictogram_url),
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "disciplines");
    XLSX.writeFile(wb, "disciplines.xlsx");
  };

  return (
    <div className="section">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Wrestling"
          value={inputSearch}
          onChange={(e) => setInputSearch(e.target.value)}
        />

        <Select value={ordenedBy} onValueChange={setOrdenedBy}>
          <SelectTrigger className="hidden w-[200px] lg:flex">
            <SelectValue placeholder="Ordenar por:" />
            <SelectContent>
              <SelectItem value="az">Alfabética A-Z</SelectItem>
              <SelectItem value="za">Alfabética Z-A</SelectItem>
            </SelectContent>
          </SelectTrigger>
        </Select>

        <Button onClick={handleExport} variant={"outline"}>
          <Download size={20} />
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Pictograma</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Nome</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDisciplines
            .slice(first, first + rows)
            .map((discipline, index) => (
              <TableRow key={discipline.id}>
                <TableCell>
                  {" "}
                  {isPending ? (
                    <Loading />
                  ) : (
                    <div className="rounded-md bg-white p-2">
                      <Image
                        className="h-auto w-auto"
                        width={60}
                        height={60}
                        src={discipline.pictogram_url}
                        alt=""
                      />
                    </div>
                  )}
                </TableCell>

                <TableCell>{discipline.id}</TableCell>

                <TableCell>{discipline.name}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {filteredDisciplines.length > 0 && (
        <Paginator
          first={first}
          rows={rows}
          totalRecords={filteredDisciplines.length}
          onPageChange={onPageChange}
        />
      )}

      {isPending && (
        <div className="flex items-center justify-center">
          {" "}
          <Loading />
        </div>
      )}

      {inputSearch.length != 0 && filteredDisciplines.length == 0 && (
        <p className="text-center">Nenhuma modalidade com esse nome.</p>
      )}
    </div>
  );
};

export default Dispiplines;
