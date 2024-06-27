export interface UserListModel {
  id?: number
  login: string
}

export interface UserProfileModel {
  id?: number
  login: string
  name: string
  avatar_url: string
  type: string
  followers: number
  following: number
}