import { Expose, Type } from 'class-transformer'
import { Accessibility, Category, UserRole } from '../../consts'

export class IdResponse {
  id: string
}

export class TokenResponse {
  token: string
}

export class UserRepsonse {
  @Expose()
  id: string
  @Expose()
  email: string
  @Expose()
  role: UserRole
  @Expose()
  firstName?: string
  @Expose()
  lastName?: string
}

export class FeatureResponse {
  @Expose()
  id: string
  @Expose()
  name: string
}

export class PlaceResponse {
  @Expose()
  id: string
  @Expose()
  name: string
  @Expose()
  category: Category
  @Expose()
  accessibility: Accessibility
  @Expose()
  address: string
  @Expose()
  lat: number
  @Expose()
  lng: number

  @Expose()
  description?: string
  @Expose()
  @Type(() => UserRepsonse)
  owner?: UserRepsonse
  @Expose()
  @Type(() => FeatureResponse)
  availableFeatures?: FeatureResponse[]
  @Expose()
  @Type(() => FeatureResponse)
  unavailableFeatures?: FeatureResponse[]
}
