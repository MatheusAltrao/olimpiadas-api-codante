import { Badge } from "./badge";

interface DynamicBadgeProps {
  status: string;
}

const DynamicBadge = ({ status }: DynamicBadgeProps) => {
  let badge = null;

  switch (status) {
    case "Finished":
      badge = <Badge>Finalizado</Badge>;
      break;
    case "Scheduled":
      badge = <Badge variant={"warning"}>Agendado</Badge>;
      break;
    case "Scheduled Break":
      badge = <Badge variant={"warning"}>Intervalo</Badge>;
      break;
    case "Running":
      badge = <Badge variant={"success"}>Agora</Badge>;
      break;
    case "Cancelled":
      badge = <Badge variant={"destructive"}>Cancelado</Badge>;
      break;
    default:
      badge = null; // Retorna null se o status não for nenhum dos esperados
  }

  return <div>{badge}</div>;
};

export default DynamicBadge;
