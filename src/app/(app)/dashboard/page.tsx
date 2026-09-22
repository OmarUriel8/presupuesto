import { getDashboardData } from "@/app/(app)/dashboard/actions";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export default async function DashboardPage(): Promise<React.JSX.Element> {
  // Sin parámetro: usa la fecha de hoy para derivar año y mes.
  // El filtro de fecha refresca los datos desde el cliente con la acción.
  const initialData = await getDashboardData();

  return <DashboardView initialData={initialData} />;
}
