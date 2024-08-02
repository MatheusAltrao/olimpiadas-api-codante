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
interface countriesProps {
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
  const [countries, setCountries] = useState<countriesProps[]>([]);
  const [isPending, startTransition] = useTransition();
  const [inputSearch, setInputSearch] = useState("");

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

  const filteredCountries = countries.filter((country) =>
    country.name.toLocaleLowerCase().includes(inputSearch.toLocaleLowerCase()),
  );

  return (
    <div className="mx-auto min-h-screen w-full max-w-[900px] space-y-8">
      <Input
        placeholder="Brasil"
        value={inputSearch}
        onChange={(e) => setInputSearch(e.target.value)}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]"></TableHead>
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

              <TableCell>{country.name}</TableCell>

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

      {filteredCountries.length > 0 && (
        <Paginator
          first={first}
          rows={rows}
          totalRecords={filteredCountries.length}
          onPageChange={onPageChange}
        />
      )}

      {isPending && (
        <div className="flex items-center justify-center">
          {" "}
          <Loading />
        </div>
      )}

      {inputSearch.length != 0 && filteredCountries.length == 0 && (
        <p className="text-center">Nenhum país com esse nome.</p>
      )}
    </div>
  );
};

export default Ranking;
