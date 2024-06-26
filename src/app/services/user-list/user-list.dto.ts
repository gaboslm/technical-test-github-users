import { UserModel } from "src/app/models/user.model";

export interface GitHubUserListDTO {
    total_count: number,
    incomplete_results: boolean,
    items: UserModel[]
}