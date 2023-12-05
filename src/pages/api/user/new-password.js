import axios from "axios";

export default async function handler(req, res) {
    if (req.method != "POST") {
        return res.status(405).json({ msg: "Method not allowed", success: false });
    }

    const { token, password } = req.body || {};
    try {
        await axios.post(`${process.env.API_URI}/users/reset-password/${token}`, { password });
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(404).json({ msg: error?.response?.data?.msg || "There was an error changing password", success: false });
    }
}