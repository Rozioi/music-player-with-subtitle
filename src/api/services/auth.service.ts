import type {
  CreateDoctorRequest,
  CreateUserRequest,
  DoctorInput,
  User,
} from "../types";
import { api } from "../api";

export const authService = {
  async createUser(data: CreateUserRequest): Promise<User> {
    const response = await api.post<User>("/users", data);
    return response.data;
  },

  async createDoctor(data: CreateDoctorRequest): Promise<DoctorInput> {
    const response = await api.post<DoctorInput>("/doctors", data);
    return response.data;
  },
};
