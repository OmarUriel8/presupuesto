import { getReportesData } from "@/app/(app)/reportes/actions";
import { ReportesView } from "@/components/reportes/reportes-view";

export default async function ReportesPage(): Promise<React.JSX.Element> {
  // Rango por defecto: 6 meses. El cambio de rango refresca desde el cliente.
  const initialData = await getReportesData(6);

  return <ReportesView initialData={initialData} />;
}
