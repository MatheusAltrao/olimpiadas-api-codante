import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.HOST_URL,
});
