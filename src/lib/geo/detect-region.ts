import type { Region } from '@prisma/client';

/**
 * Detects user region based on IP address or request headers
 * Uses Cloudflare CF-IPCountry header if available
 */
export function detectRegion(request: Request): Region {
  // Try Cloudflare header first (if deployed on Cloudflare/Vercel)
  const cfCountry = request.headers.get('CF-IPCountry');

  if (cfCountry === 'CN') {
    return 'CN';
  }

  // Try other headers
  const xCountry = request.headers.get('X-Country');
  if (xCountry === 'CN') {
    return 'CN';
  }

  // Default to US (rest of world)
  return 'US';
}

/**
 * Alternative: Use IP geolocation API
 * Uncomment and use if you need more accurate detection
 */
export async function detectRegionByIP(ip: string): Promise<Region> {
  try {
    // Example using ipapi.co (free tier available)
    const response = await fetch(`https://ipapi.co/${ip}/country/`);
    const country = await response.text();

    if (country.trim() === 'CN') {
      return 'CN';
    }

    return 'US';
  } catch (error) {
    console.error('Error detecting region by IP:', error);
    return 'US'; // Default to US on error
  }
}

/**
 * Get currency symbol based on region
 */
export function getCurrencySymbol(region: Region): string {
  return region === 'CN' ? '¥' : '$';
}
