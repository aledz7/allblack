/**
 * Dados dos treinos da semana — separados do layout para fácil manutenção.
 * Alterar aqui reflete em todos os cards da home.
 */
export type WeekWorkout = {
  id: string;
  dayName: string;
  summary: string;
  imageUri?: string;
};

export const WEEK_WORKOUTS: WeekWorkout[] = [
  { id: "mon", dayName: "Segunda", summary: "5km • Zona 2" },
  { id: "tue", dayName: "Terça", summary: "Descanso ou 3km leve" },
  { id: "wed", dayName: "Quarta", summary: "8km • Zona 2" },
  { id: "thu", dayName: "Quinta", summary: "5km • Zona 2" },
  { id: "fri", dayName: "Sexta", summary: "Descanso" },
  { id: "sat", dayName: "Sábado", summary: "10km • Zona 2" },
  { id: "sun", dayName: "Domingo", summary: "Longão 15km • Zona 2" },
];

/** Índice do dia atual (0 = Segunda, 6 = Domingo) */
export function getTodayWeekIndex(): number {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}
