import axios from 'axios';

const initData = {
  api: "http://localhost:3000/auth/"
}

export const loginConexion = async (urlApi, objeto) => {
  try {
    let url = initData.api + urlApi;
    const response = await axios.post(url, objeto).catch(err => {
      if (err.response) {
        throw new Error(`La api responde pero con error ${err.response.status}`);
      } else if (err.request) {
        throw new Error(`No existe conexión`);
      } else {
        throw err;
      }
    });
    const resp = response.data;
    return resp;
  }
  catch (err) {
    return Promise.reject((err.message && err) || 'Something went wrong');
  }
}

export const postConexion = async (urlApi, objeto) => {
  try {
    let url = initData.api + urlApi;
    let auth = {
      headers: { 'Authorization': localStorage.getItem("accessToken") }
    }
    const response = await axios.post(url, objeto, auth).catch(err => {
      if (err.response) {
        throw new Error(`La api responde pero con error ${err.response.status}`);
      } else if (err.request) {
        throw new Error(`No existe conexión`);
      } else {
        throw err;
      }
    });
    const resp = response.data;
    return resp;
  }
  catch (err) {
    return Promise.reject((err.message && err) || 'Something went wrong');
  }
}

export const getConexion = async (urlApi) => {
  try {
    let url = initData.api + urlApi;
    let auth = {
      headers: { 'Authorization': localStorage.getItem("accessToken") }
    }
    const response = await axios.get(url, auth).catch(err => {
      if (err.response) {
        throw new Error(`La api responde pero con error ${err.response.status}`);
      } else if (err.request) {
        throw new Error(`No existe conexión`);
      }
      else {
        throw err;
      }
    });
    const resp = response.data;
    return resp;
  }
  catch (err) {
    if (err.message === "Tu autorización ha caducado" ||
      err.message === "La autorización ha caducado, intenta de nuevo")
      window.location.reload();
    return Promise.reject((err.message && err) || 'Error en la conexión');
  }
}

export const putConexion = async (urlApi, objeto) => {
  try {
    let url = initData.api + urlApi;
    let auth = {
      headers: { 'Authorization': localStorage.getItem("accessToken") }
    }
    const response = await axios.put(url, objeto, auth).catch(err => {
      if (err.response) {
        throw new Error(`La api responde pero con error ${err.response.status}`);
      } else if (err.request) {
        throw new Error(`No existe conexión`);
      }
      else {
        throw err;
      }
    });
    const resp = response.data;
    return resp;
  }
  catch (err) {
    if (err.message === "Tu autorización ha caducado" ||
      err.message === "La autorización ha caducado, intenta de nuevo")
      window.location.reload();
    return Promise.reject((err.message && err) || 'Error en la conexión');
  }
}

export const deleteConexion = async (urlApi) => {
  try {
    let url = initData.api + urlApi;
    let auth = {
      headers: { 'Authorization': localStorage.getItem("accessToken") }
    }
    const response = await axios.delete(url, auth).catch(err => {
      if (err.response) {
        throw new Error(`La api responde pero con error ${err.response.status}`);
      } else if (err.request) {
        throw new Error(`No existe conexión`);
      }
      else {
        throw err;
      }
    });
    const resp = response.data;
    return resp;
  }
  catch (err) {
    if (err.message === "Tu autorización ha caducado" ||
      err.message === "La autorización ha caducado, intenta de nuevo")
      window.location.reload();
    return Promise.reject((err.message && err) || 'Error en la conexión');
  }
}