import { NextResponse } from 'next/server';
import { resetState } from '@/lib/state';

export async function POST() {
  resetState();
  return NextResponse.json({ success: true, message: "System reset to NORMAL" });
}
