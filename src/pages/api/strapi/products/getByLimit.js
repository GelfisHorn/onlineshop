import axios from "axios";

export default async function handler(req, res) {
    if (req.method != "POST") {
        return res.status(405).json({ msg: "Method not allowed", success: false });
    }

    const { category, limit } = req.body || {};
    try {
        const { data } = await axios.request({
            method: "GET",
            url: `${process.env.STRAPI_URI}/products?filters[collections][url][$eq]=${category}&pagination[limit]=${limit}&populate=variante&populate=encaje&populate=colores&populate=img`,
            headers: {
                "Content-Type": "application-json",
                'Authorization': `Bearer ${process.env.STRAPI_TOKEN}`
            }
        })
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log(error)
        return res.status(404).json({ msg: error?.response?.data?.msg || "There was an error getting products", success: false });
    }
}