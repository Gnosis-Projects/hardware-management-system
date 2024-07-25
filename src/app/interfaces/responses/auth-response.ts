import { CommonResponse } from "./common-response";

export interface UserData {
  active: any;
  userId?: string;
  token: string;
  username: string;
  email: string;
  roles: string[];
  carriers: CommonResponse[];
}

export interface GetUserResponse {
  data: UserData;
  success: boolean;
  message: string;
}

export interface GetAllUsersResponse {
  data: UserData[];
  success: boolean;
  message: string;
}

