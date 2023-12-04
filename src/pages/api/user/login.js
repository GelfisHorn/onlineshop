import axios from "axios";
import { serialize } from 'cookie'

export default async function handler(req, res) {
    if (req.method != "POST") {
        return res.status(405).json({ msg: "Method not allowed", success: false });
    }

    const user = req.body;
    try {
        const { data } = await axios.post(`${process.env.API_URI}/users/login`, user);
        res.setHeader('Set-Cookie', serialize('token', data.token, { path: '/' }));
        res.status(200).json({ success: true, ...data });
    } catch (error) {
        console.log(error);
        return res.status(404).json({ msg: error?.response?.data?.msg || "There was an error creating order", success: false });
    }
}