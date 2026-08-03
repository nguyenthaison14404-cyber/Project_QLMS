import axios from 'axios';

const commonConfig = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export const createApiClient = (baseURL) => {
  return axios.create({
    baseURL,
    ...commonConfig,
  });
};

export default createApiClient('http://localhost:3000/api');