export type PaginatedResponse<T> = Readonly<{
  data: T[];
  columns: TableColumn[]; // Asumiendo que 'columns' es un arreglo de nombres de columnas
  pagination: {
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    totalElements: number;
  };
}>;

export type TableColumn = Readonly<{
  name: string;
}>;