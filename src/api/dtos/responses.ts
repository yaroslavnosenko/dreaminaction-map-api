import { Accessibility, Category, UserRole } from '../../consts'

export interface IdResponse {
  id: string
}

export interface TokenResponse {
  token: string
}

export interface UserRepsonse {
  id: string
  email: string
  role: UserRole
  firstName?: string
  lastName?: string
}

export interface FeatureResponse {
  id: string
  name: string
}

export interface PlaceResponse {
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
