import axios from "axios";

export default async function handler(req, res) {
    if (req.method != "POST") {
        return res.status(405).json({ msg: "Method not allowed", success: false });
    }

    const { code } = req.body || {};
    try {
        const { data } = await axios.request({
            method: "GET",
            url: `${process.env.STRAPI_URI}/discount-codes?filters[codigo][$eq]=${code}&filters[usos][$gt]=0`,
            headers: {
                "Content-Type": "application-json",
                'Authorization': `Bearer ${process.env.STRAPI_TOKEN}`
            }
        });
        if (data.data.length != 0) {
            return res.status(200).json({ success: true, data });
        } else {
            return res.status(404).json({ success: false, msg: "Discount code not found" });
        }
    } catch (error) {
        console.log(error)
        return res.status(404).json({ msg: error?.response?.data?.msg || "There was an error getting discount code", success: false });
    }
}