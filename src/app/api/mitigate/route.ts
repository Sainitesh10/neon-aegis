import { NextResponse } from 'next/server';
import { mitigateThreat } from '@/lib/state';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nodeId } = body;
    
    if (nodeId) {
      mitigateThreat(nodeId);
      return NextResponse.json({ success: true, mitigated: nodeId });
    }
    
    return NextResponse.json({ success: false, error: "Missing nodeId" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }
}
