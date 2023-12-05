import axios from "axios";

export default async function handler(req, res) {
    if (req.method != "POST") {
        return res.status(405).json({ msg: "Method not allowed", success: false });
    }

    const config = req.body;

    try {
        const { data } = await axios.request({
            url: `${process.env.API_URI}/order`,
            headers: {
                'Authorization': config?.headers?.Authorization
            }
        });
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(404).json({ msg: error?.response?.data?.msg || "There was an error getting orders", success: false });
    }
}