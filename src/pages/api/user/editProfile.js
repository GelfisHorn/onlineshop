import axios from "axios";

export default async function handler(req, res) {
    if (req.method != "POST") {
        return res.status(405).json({ msg: "Method not allowed", success: false });
    }

    const { user = {}, config = {} } = req.body;
    try {
        await axios.request({
            method: "POST",
            url: `${process.env.API_URI}/users/edit`,
            headers: {
                'Authorization': config?.headers?.Authorization
            },
            data: user
        })
        return res.status(200).json({ success: true });
    } catch (error) {
        console.log(error)
        return res.status(404).json({ msg: error?.response?.data?.msg || "There was an error updating profile", success: false });
    }
}