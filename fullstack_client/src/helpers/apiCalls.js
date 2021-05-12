import axios from 'axios';
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL || `http://localhost:5000`; // set our API server url
axios.defaults.withCredentials = true;

const extractApiError = (errAxios) => {
  return errAxios.response
    ? errAxios.response.data
    : { error: { message: 'API not reachable' } };
};

// async => wrap normal returns with a promise!
export const loginUser = async (userCredentials) => {
  // call login route passing in email & password
  try {
    const response = await axios.post(`/users/login`, userCredentials);
    console.log(response);
    return response.data;
  } catch (err) {
    return extractApiError(err);
  }
};

export const googleLoginUser = async (userCredentials) => {
  // call login route passing in email & password
  try {
    const response = await axios.post(`/users/googleLogin`, userCredentials);
    console.log(response);
    return response.data;
  } catch (err) {
    return extractApiError(err);
  }
};

export const logOutUser = async () => {
  console.log('Logging out at backend...');
  try {
    const response = await axios.get('/users/logout');
    console.log('Result: ', response.data);
    return response.data;
  } catch (err) {
    return extractApiError(err);
  }
};

export const signUpUser = async (data) => {
  console.log('Signing up user: ', data);
  try {
    const response = await axios.post('/users', data);
    return response.data;
  } catch (err) {
    return extractApiError(err);
  }
};

export const deleteMultipleTodos = async (data) => {
  const res = await axios.delete('/todos/multiple', { data });
  return res.data;
};

export const fetchTodos = async () => {
  console.log(`im fetching todos`);
  try {
    const response = await axios.get(`/me/todos`);
    return response.data;
  } catch (err) {
    let error = extractApiError(err);
    console.log(error);
    return [];
  }
};

export const fetchTodo = async (id) => {
  console.log(`im fetching a todo`);
  try {
    const response = await axios.get(`/todos/${id}`);
    return response;
  } catch (err) {
    let error = extractApiError(err);
    console.log(error);
    return {};
  }
};

export const addTodo = async (todoData) => {
  console.log(`im creating a todo`);
  try {
    const response = await axios.post(`/todos`, todoData);
    return response;
  } catch (err) {
    let error = extractApiError(err);
    console.log(error);
    return {};
  }
};

export const updateMultipleTodos = async (data) => {
  const res = await axios.post('todos/multiple', data);
  return res.data;
};

export const checkTodo = async (todo) => {
  // data {text, id, status}
  const { text, _id, status } = todo;
  console.log(`im checking a todo`);
  const data = await axios.put(`/todos/${_id}`, {
    text: text,
    status: !status,
  });

  return data;
};

export const authenticateUser = async () => {
  try {
    const response = await axios.post(`/me/auth`);
    return response.data;
  } catch (err) {
    let error = extractApiError(err);
    console.log(error);
    return error;
  }
};

export const verifyUser = async (token) => {
  try {
    const response = await axios.post(`/users/verify`, { token: token });
    return response.data;
  } catch (err) {
    let error = extractApiError(err);
    console.log(error);
    return error;
  }
};
