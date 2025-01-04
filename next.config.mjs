/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
          allowedOrigins: [
            'localhost:3000', // localhost
            'gfstats.duckdns.org', // Codespaces\
            'newstats.geekfestclan.com', 
          ],
        },
      },
};

export default nextConfig;
