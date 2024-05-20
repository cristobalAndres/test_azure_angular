export type UserDto = Readonly<{
  id: number;
  name: string;
  lastName: string;
  secondLastName: string;
  email: string;
  roleId: number;
  createdAt: string;
  updatedAt: string;
  companies?: UserCompanyDto[];
}>

export type UserCompanyDto = Readonly<{
  id: number;
  name: string;
}>
