import { NextResponse } from 'next/server';
import { triggerAttack } from '@/lib/state';

export async function POST() {
  triggerAttack();
  return NextResponse.json({ success: true, message: "Attack simulated" });
}
