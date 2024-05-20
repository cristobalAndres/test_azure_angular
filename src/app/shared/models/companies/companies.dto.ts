export type Company = Readonly<{
  id: number;
  name: string;
  masterUserId: number;
  createdAt: string;
}>

export type CompanySelect = Readonly<{
  id: number;
  name: string;
}>
