"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";
import { Label } from "../ui/label";

const DropdownTheme = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-2">
      <Label>Tema</Label>
      <Select value={theme} onValueChange={setTheme}>
        <SelectTrigger>
          <SelectValue placeholder="Tema" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Claro </SelectItem>
          <SelectItem value="dark">Escuro</SelectItem>
          <SelectItem value="system">Sistema</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default DropdownTheme;
