/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '1337'
            },
            {
                protocol: 'http',
                hostname: '3.79.181.235',
                port: '1337'
            },
        ],
    },
}

module.exports = nextConfig