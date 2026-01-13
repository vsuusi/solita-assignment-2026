import axios from "axios";

const baseURL = "http://localhost:3000/api/electricity";

export const electricityApi = {
  getDailyElectricityList: async (
    page: number = 1,
    limit: number = 10,
    sortBy: string = "date",
    sortOrder: "ASC" | "DESC" = "ASC"
  ) => {
    const resp = await axios.get(
      `${baseURL}?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`
    );
    return resp.data;
  },

  getSingleDayElectricityData: async (date: string) => {
    const resp = await axios.get(`${baseURL}/${date}`);
    return resp.data;
  },
};
