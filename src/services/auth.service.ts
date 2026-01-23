import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function loginApi(payload: {
    nombre_usuario: string;
    password: string;
}): Promise<string> {
    const { data } = await axios.post(`${API_URL}/auth/login`, payload);
    return data.data.access_token;
}

export async function registerApi(payload: {
    nombre_usuario: string;
    password: string;
}): Promise<string> {
    const { data } = await axios.post(`${API_URL}/auth/register`, payload);
    return data.data.access_token;
}
