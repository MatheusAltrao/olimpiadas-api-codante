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
import Link from "next/link";
import { Paginator } from "primereact/paginator";
import { useEffect, useState, useTransition } from "react";
import * as XLSX from "xlsx";

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
  const [ordenedBy, setOrdenedBy] = useState("az");

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

  const filteredVenues = venues
    .filter((venue) => {
      const venueMatch = venue.name
        .toLocaleLowerCase()
        .includes(inputSearch.toLocaleLowerCase());
      return venueMatch;
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
    const ws_data = [["id", "nome", "url"]];

    filteredVenues.forEach((venue) => {
      ws_data.push([String(venue.id), String(venue.name), String(venue.url)]);
    });

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "venues");
    XLSX.writeFile(wb, "venues.xlsx");
  };

  return (
    <div className="section">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Aquatics Centre"
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
      {!isPending && (
        <Table>
          <TableHeader>
            <TableRow>
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
                  <TableCell>{discipline.id}</TableCell>
                  <TableCell>
                    {" "}
                    <span className="truncate">{discipline.name}</span>{" "}
                  </TableCell>
                  <TableCell>
                    <Link
                      className="underline-offset-8 opacity-70 hover:underline hover:opacity-100"
                      href={discipline.url}
                    >
                      <span className="truncate">{discipline.url}</span>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}

      {isPending && (
        <div className="flex items-center justify-center">
          {" "}
          <Loading />
        </div>
      )}

      {filteredVenues.length > 0 && !isPending && (
        <Paginator
          first={first}
          rows={rows}
          totalRecords={filteredVenues.length}
          onPageChange={onPageChange}
        />
      )}

      {inputSearch.length != 0 && filteredVenues.length == 0 && (
        <p className="text-center">Nenhum local com esse nome.</p>
      )}
    </div>
  );
};

export default Venues;
