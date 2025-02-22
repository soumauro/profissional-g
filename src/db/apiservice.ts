import axios, { AxiosResponse } from "axios";

class ApiService<T> {
  /**
   * Realiza uma requisição GET para obter dados da API.
   * @param url URL do recurso a ser acessado.
   * @returns Promise com os dados retornados.
   */
  

  async get(endpoint: string = ""): Promise<T | T[]> {
    try {
      const response: AxiosResponse<{ data: T | T[] }> = await axios.get(`${endpoint}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erro ao realizar GET");
    }
  }

  /**
   * Realiza uma requisição POST para inserir novos dados.
   * @param url URL do recurso onde os dados serão enviados.
   * @param data Dados a serem enviados no corpo da requisição.
   * @returns Promise com os dados retornados.
   */
  async insert(url: string, data: T): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.post(url, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erro ao realizar POST");
    }
  }

  /**
   * Realiza uma requisição PUT para atualizar dados existentes.
   * @param url URL do recurso onde os dados serão atualizados.
   * @param data Dados a serem enviados no corpo da requisição.
   * @returns Promise com os dados retornados.
   */
  async update(url: string, data: Partial<T>): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.put(url, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erro ao realizar PUT");
    }
  }
}

export default ApiService;
