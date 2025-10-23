export type DataItem = {
  id: number;
  doctor: string;
  patient: string;
  method: string;
  status: number;
  created_at: string;
};

export type DataItemDto = Omit<DataItem, "id" | "created_at">;
