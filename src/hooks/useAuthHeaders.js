import Cookies from "js-cookie";

export default function useAuthHeaders() {
    const token = Cookies.get('token');

    const config = {
        headers: {
            "Content-Type": "application-json",
            Authorization: `Bearer ${token}`
        }
    }

    return config;
}