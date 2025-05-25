/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        HEALTHCHECK_URL: process.env.HEALTHCHECK_URL,
        COMMODITIES_BRENT: process.env.COMMODITIES_BRENT
    }
};

export default nextConfig;
