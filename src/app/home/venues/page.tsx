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
import Link from "next/link";
import { Paginator } from "primereact/paginator";
import { useEffect, useState, useTransition } from "react";
interface VenuesProps {
  id: string;
  name: string;
  url: string;
}

const Venues = () => {
  const [venues, setVenues] = useState<VenuesProps[]>([]);
  const [isPending, startTransition] = useTransition();
  const [inputSearch, setInputSearch] = useState("");
  const { first, rows, onPageChange } = usePaginator();

  useEffect(() => {
    const fetchVenues = async () => {
      startTransition(async () => {
        try {
          const response = await axios.get("/api/get-venues");
          const data = response.data.data;
          setVenues(data);
        } catch (error) {
          console.log(error);
        }
      });
    };

    fetchVenues();
  }, []);

  const filteredVenues = venues.filter((venue) =>
    venue.name.toLocaleLowerCase().includes(inputSearch.toLocaleLowerCase()),
  );

  return (
    <div className="mx-auto min-h-screen w-full max-w-[900px] space-y-8">
      <Input
        placeholder="Aquatics Centre"
        value={inputSearch}
        onChange={(e) => setInputSearch(e.target.value)}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]"></TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead className="max-w-[400px]">URL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredVenues
            .slice(first, first + rows)
            .map((discipline, index) => (
              <TableRow key={discipline.id}>
                <TableCell className="font-bold">
                  {String(index + 1).padStart(2, "0")}
                </TableCell>
                <TableCell>{discipline.id}</TableCell>
                <TableCell>{discipline.name}</TableCell>
                <TableCell>
                  <Link
                    className="underline-offset-8 opacity-70 hover:underline hover:opacity-100"
                    href={discipline.url}
                  >
                    <span>{discipline.url}</span>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {filteredVenues.length > 0 && (
        <Paginator
          first={first}
          rows={rows}
          totalRecords={filteredVenues.length}
          onPageChange={onPageChange}
        />
      )}

      {isPending && (
        <div className="flex items-center justify-center">
          {" "}
          <Loading />
        </div>
      )}

      {inputSearch.length != 0 && filteredVenues.length == 0 && (
        <p className="text-center">Nenhum local com esse nome.</p>
      )}
    </div>
  );
};

export default Venues;
