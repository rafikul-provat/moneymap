import api from './axiosConfig';

export const loginUser = async (data) => {
  return await api.post('/auth/login', data);
};

export const signupUser = async (data) => {
  return await api.post('/auth/signup', data);
};
