"use client";
import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/loading";
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
import Image from "next/image";
import { Paginator } from "primereact/paginator";
import { useEffect, useState, useTransition } from "react";
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

  const filteredDisciplines = disciplines.filter((discipline) =>
    discipline.name
      .toLocaleLowerCase()
      .includes(inputSearch.toLocaleLowerCase()),
  );

  return (
    <div className="mx-auto min-h-screen w-full max-w-[900px] space-y-8">
      <Input
        placeholder="Wrestling"
        value={inputSearch}
        onChange={(e) => setInputSearch(e.target.value)}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]"></TableHead>
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
                <TableCell className="font-bold">
                  {String(index + 1).padStart(2, "0")}
                </TableCell>
                <TableCell>
                  {" "}
                  {isPending ? (
                    <Loading />
                  ) : (
                    <div className="rounded-md bg-zinc-50 p-2">
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
