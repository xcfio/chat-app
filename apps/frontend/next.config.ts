import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    missingSuspenseWithCSRBailout: false,
    experimental: {
        optimizePackageImports: ["@mantine/core", "@mantine/hooks"]
    }
}

export default nextConfig
