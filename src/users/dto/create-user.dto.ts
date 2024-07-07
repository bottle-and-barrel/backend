import { Role } from '@/lib/types/role';

export class CreateUserDto {
  lastName: string;
  firstName: string;
  middleName: string;
  phone: string;
  email: string;
  password: string;
  role: Role;
}
