export type ModulePermissionDto = Readonly<{
  moduleId: number;
  moduleName: string;
  moduleCode: string;
  permissions: Permission[];
}>

export type Permission = Readonly<{
  permissionId: number;
  action: string;
  actionCode: string;
  isAllowed: boolean;
}>;
