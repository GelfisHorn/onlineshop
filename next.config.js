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
                hostname: '3.65.78.240',
                port: '1337'
            },
        ],
    },
}

module.exports = nextConfig