import { Accessibility, Category, UserRole } from '../../consts'

export class IdResponse {
  id: string
}

export class TokenResponse {
  token: string
}

export class UserRepsonse {
  id: string
  email: string
  role: UserRole
  firstName?: string
  lastName?: string
}

export class FeatureResponse {
  id: string
  name: string
}

export class PlaceResponse {
  id: string
  name: string
  category: Category
  accessibility: Accessibility
  address: string
  lat: number
  lng: number

  description?: string
  owner?: UserRepsonse
  featuresCount?: number
  availableFeatures?: FeatureResponse[]
  unavailableFeatures?: FeatureResponse[]
}
