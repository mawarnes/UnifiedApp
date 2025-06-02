import axios from "axios";

const BASE_URL = import.meta.env.REACT_APP_API_URL as string;

/**
 * Posts data to the EchoController and returns the echoed response.
 * @param data The data to echo (any JSON-serializable object)
 */
export const echoApi = async (data: any) => {

      const response = await axios.post(`${BASE_URL}/echo/echo`, data).catch((ex) => {
          console.log(ex);
      });;
      return response?.data;
};