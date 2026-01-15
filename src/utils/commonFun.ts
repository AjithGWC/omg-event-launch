import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const baseUrl = "https://omg-appcontrol-service-993414851442.asia-south1.run.app";

// Function to get headers
const getHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// General GET function
export const generalGetFunction = async <T = unknown>(
  endpoint: string,
  config?: AxiosRequestConfig,
  customBaseUrl?: string
): Promise<AxiosResponse<T>> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const url = customBaseUrl || baseUrl;
    const response = await axios.get<T>(`${url}${endpoint}`, {
      ...config,
      headers: {
        ...getHeaders(),
        ...config?.headers,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// General POST function
export const generalPostFunction = async <T = unknown>(
  endpoint: string,
  data?: unknown,
  config?: AxiosRequestConfig,
  customBaseUrl?: string
): Promise<AxiosResponse<T>> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const url = customBaseUrl || baseUrl;
    const response = await axios.post<T>(
      `${url}${endpoint}`,
      data,
      {
        ...config,
        headers: {
          ...getHeaders(),
          ...config?.headers,
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// General PUT function
export const generalPutFunction = async <T = unknown>(
  endpoint: string,
  data?: unknown,
  config?: AxiosRequestConfig,
  customBaseUrl?: string
): Promise<AxiosResponse<T>> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const url = customBaseUrl || baseUrl;
    const response = await axios.put<T>(
      `${url}${endpoint}`,
      data,
      {
        ...config,
        headers: {
          ...getHeaders(),
          ...config?.headers,
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// General DELETE function
export const generalDeleteFunction = async <T = unknown>(
  endpoint: string,
  config?: AxiosRequestConfig,
  customBaseUrl?: string
): Promise<AxiosResponse<T>> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const url = customBaseUrl || baseUrl;
    const response = await axios.delete<T>(`${url}${endpoint}`, {
      ...config,
      headers: {
        ...getHeaders(),
        ...config?.headers,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

