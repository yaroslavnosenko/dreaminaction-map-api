import { IsEnum } from 'class-validator'

import { UserRole } from '../../consts'

export class UserRoleDTO {
  @IsEnum(UserRole)
  role: UserRole
}
