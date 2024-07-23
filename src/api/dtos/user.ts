import { IsEnum } from 'class-validator'
import { UserRole } from '../../database/models'

export class UserRoleDTO {
  @IsEnum(UserRole)
  role: UserRole
}
