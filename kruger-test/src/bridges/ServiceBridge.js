import {
  loginConexion,
  postConexion,
  putConexion,
  getConexion,
  deleteConexion
} from '../conexion/conexion';

export const login = async (objUser) => {
  const user = await loginConexion('login', objUser);
  localStorage.setItem('accessToken', 'Bearer ' + user.token);
  localStorage.setItem('profile', JSON.stringify(user));

  return user;
}

export const logout = async (objUser) => {
  await postConexion('logout', objUser);
  localStorage.removeItem('accessToken');
  localStorage.removeItem('profile');
  window.location.reload();
}

export const getAllUsers = async () => {
  const allUsers = await getConexion('users');
  return allUsers;
}

export const deleteUser = async (id) => {
  const user = await deleteConexion(`delete-users/${id}`);
  return user;
}

export const updateUser = async (id, objUser) => {
  const user = await putConexion(`update-employee/${id}`, objUser);
  return user;
}

export const createUser = async (objUser) => {
  const user = await postConexion('register', objUser);
  return user;
}

export const getProfile = async (objUser) => {
  const profile = await postConexion('profile', objUser);
  return profile;
}