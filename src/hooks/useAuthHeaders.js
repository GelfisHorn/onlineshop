import Cookies from "js-cookie";

export default function useAuthHeaders() {
    const token = Cookies.get('token');
    if(!token) return null;

    const config = {
        headers: {
            "Content-Type": "application-json",
            Authorization: `Bearer ${token}`
        }
    }

    return config;
}