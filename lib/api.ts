import axios, {
	AxiosError,
	AxiosInstance,
	InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";
import { ApiResponse } from "@/types/api";
import { auth } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

class ApiClient {
	private client: AxiosInstance;

	constructor() {
		this.client = axios.create({
			baseURL: API_URL,
			headers: {
				"Content-Type": "application/json",
			},
		});

		this.setupInterceptors();
	}

	private setupInterceptors(): void {
		this.client.interceptors.request.use(
			(config: InternalAxiosRequestConfig) => {
				if (typeof window !== "undefined") {
					const token = auth.getToken();
					if (token && config.headers) {
						config.headers.Authorization = `Bearer ${token}`;
					}
				}
				return config;
			},
			(error) => Promise.reject(error)
		);

		this.client.interceptors.response.use(
			(response) => response,
			async (error: AxiosError<ApiResponse>) => {
				if (error.response?.status === 401) {
					if (typeof window !== "undefined") {
						auth.clear();
						window.location.href = "/login";
					}
				}

				let errorMessage = "An error occurred";

				if (error.response?.data) {
					const data = error.response.data as any;
					errorMessage =
						data.error || data.message || error.message || errorMessage;
				} else {
					errorMessage = error.message || errorMessage;
				}

				return Promise.reject(new Error(errorMessage));
			}
		);
	}

	async get<T = any>(url: string, config?: any): Promise<T> {
		const response = await this.client.get<T>(url, config);
		return response.data;
	}

	async post<T = any>(url: string, data?: any, config?: any): Promise<T> {
		const response = await this.client.post<T>(url, data, config);
		return response.data;
	}

	async put<T = any>(url: string, data?: any, config?: any): Promise<T> {
		const response = await this.client.put<T>(url, data, config);
		return response.data;
	}

	async delete<T = any>(url: string, config?: any): Promise<T> {
		const response = await this.client.delete<T>(url, config);
		return response.data;
	}
}

export const api = new ApiClient();
