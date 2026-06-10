import { NextResponse } from 'next/server';
import { state, updateTick, getTraffic } from '@/lib/state';

// Force dynamic so Next.js doesn't cache this route
export const dynamic = 'force-dynamic';

export async function GET() {
  // Update the time-based revenue tick
  updateTick();

  return NextResponse.json({
    status: state.status,
    metrics: { traffic: getTraffic() },
    revenueLost: state.revenueLost,
    activeThreats: state.activeThreats
  });
}
