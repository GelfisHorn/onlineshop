import axios from "axios";

export default async function handler(req, res) {
    if (req.method != "GET") {
        return res.status(405).json({ msg: "Method not allowed", success: false });
    }

    try {
        const { data } = await axios.request({
            method: "GET",
            url: `${process.env.STRAPI_URI}/impressum`,
            headers: {
                "Content-Type": "application-json",
                'Authorization': `Bearer ${process.env.STRAPI_TOKEN}`
            }
        })
        return res.status(200).json({ success: true, data: data.data.attributes });
    } catch (error) {
        console.log(error)
        return res.status(404).json({ msg: error?.response?.data?.msg || "There was an error getting impressum", success: false });
    }
}