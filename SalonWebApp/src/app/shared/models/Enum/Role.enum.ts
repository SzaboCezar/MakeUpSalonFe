export enum Role {

  ADMIN = "Admin",
  EMPLOYEE = "Employee",
  CUSTOMER = "Customer"

}

// Optional: Map enum values to descriptions if needed
export const RoleDescriptions: { [key in Role]: string } = {
  [Role.ADMIN]: 'Admin',
  [Role.EMPLOYEE]: 'Employee',
  [Role.CUSTOMER]: 'Customer'
};

// Function to get description from role
export function getRoleDescription(role: Role): string {
  return RoleDescriptions[role];
}


//Exmplu de utilizare:

// // example.services.ts
// import { Role, getRoleDescription } from './enums/role.enum';
//
// function printRoleDescriptions() {
//   const roles: Role[] = [Role.ADMIN, Role.EMPLOYEE, Role.CUSTOMER];
//
//   roles.forEach(role => {
//     console.log(`Role: ${role}, Description: ${getRoleDescription(role)}`);
//   });
// }
//
// printRoleDescriptions();
