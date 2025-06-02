import axios from "axios";

const BASE_URL = import.meta.env.REACT_APP_API_URL as string;

/**
 * Posts data to the EchoController and returns the echoed response.
 * @param data The data to echo (any JSON-serializable object)
 */
export const echoApi = async (data: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/echo/echo`, data);
    return response.data;
  } catch (error) {
    // Optionally, handle/log error here or rethrow
    throw error;
  }
};