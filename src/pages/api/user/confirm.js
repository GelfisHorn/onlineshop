import axios from "axios";

export default async function handler(req, res) {
    if (req.method != "POST") {
        return res.status(405).json({ msg: "Method not allowed", success: false });
    }

    const { token } = req.body || {};
    try {
        await axios.request({
            url: `${process.env.API_URI}/users/confirm/${token}`,
        })
        return res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        return res.status(404).json({ msg: error?.response?.data?.msg || "There was an error confirming account", success: false });
    }
}