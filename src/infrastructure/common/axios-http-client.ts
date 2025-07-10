import axios from "axios";
import { IHttpClient } from "../../interfaces/http-client.interface";

export class AxiosHttpClient implements IHttpClient {
  async get<T>(url: string): Promise<{ data: T }> {
    return axios.get<T>(url);
  }
}