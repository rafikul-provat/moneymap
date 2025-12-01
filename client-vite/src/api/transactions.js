import api from './axiosConfig';

export const getTransactions = async (token) => {
  return await api.get('/transactions', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addTransaction = async (data, token) => {
  return await api.post('/transactions', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
