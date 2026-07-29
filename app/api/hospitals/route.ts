import { NextRequest, NextResponse } from 'next/server';
import { findNearbyHospitals } from '@/lib/tools';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let address = searchParams.get('address');
    let latStr = searchParams.get('lat');
    let lngStr = searchParams.get('lng');

    let lat = latStr ? parseFloat(latStr) : undefined;
    let lng = lngStr ? parseFloat(lngStr) : undefined;

    // Automatic IP-based Geolocation Lookup if lat/lng/address are missing or default
    if (!address && (!lat || !lng)) {
      try {
        const ipRes = await fetch('http://ip-api.com/json/', { next: { revalidate: 3600 } });
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          if (ipData && ipData.status === 'success') {
            lat = ipData.lat;
            lng = ipData.lon;
            address = `${ipData.city || 'Islamabad'}, ${ipData.regionName || 'ICT'}, ${ipData.country || 'Pakistan'}`;
          }
        }
      } catch (e) {
        console.warn('[API /api/hospitals] IP Geolocation lookup notice:', e);
      }
    }

    const result = findNearbyHospitals({
      latitude: lat || 33.6405,
      longitude: lng || 72.9837,
      address: address || 'H-12, Islamabad, Pakistan'
    });

    return NextResponse.json(result, { status: 200 });

  } catch (error: any) {
    console.error('[API /api/hospitals] Error locating hospitals:', error);
    return NextResponse.json({ error: error?.message || 'Failed to locate nearby hospitals' }, { status: 500 });
  }
}
