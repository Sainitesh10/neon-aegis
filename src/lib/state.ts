type SystemStatus = "NORMAL" | "UNDER_ATTACK" | "RECOVERED";

export interface TelemetryState {
  status: SystemStatus;
  revenueLost: number;
  activeThreats: string[];
}

const INITIAL_STATE: TelemetryState = {
  status: "NORMAL",
  revenueLost: 0,
  activeThreats: []
};

// Use globalThis to persist state across Next.js API hot reloads in dev mode
const globalForState = globalThis as unknown as {
  telemetryState: TelemetryState | undefined;
  lastTick: number | undefined;
};

export const state: TelemetryState = globalForState.telemetryState ?? { ...INITIAL_STATE };
export const ticker = {
  lastTick: globalForState.lastTick ?? Date.now()
};

if (process.env.NODE_ENV !== "production") {
  globalForState.telemetryState = state;
  globalForState.lastTick = ticker.lastTick;
}

// Tick function to update revenue dynamically based on time passed
export function updateTick() {
  const now = Date.now();
  const delta = (now - ticker.lastTick) / 1000; // seconds passed
  ticker.lastTick = now;

  if (state.status === "UNDER_ATTACK") {
    // Lose $500 per second of attack
    state.revenueLost += Math.floor(delta * 500);
  }
}

export function resetState() {
  state.status = "NORMAL";
  state.revenueLost = 0;
  state.activeThreats = [];
  ticker.lastTick = Date.now();
}

export function triggerAttack() {
  state.status = "UNDER_ATTACK";
  state.activeThreats = ["DB-CLUSTER-ALPHA", "PAYMENT-GATEWAY", "AUTH-SERVER-01"];
  ticker.lastTick = Date.now();
}

export function mitigateThreat(nodeId: string) {
  state.activeThreats = state.activeThreats.filter(node => node !== nodeId);
  if (state.activeThreats.length === 0 && state.status === "UNDER_ATTACK") {
    state.status = "RECOVERED";
  }
}

export function getTraffic() {
  // Baseline traffic: 100-300
  // Attack traffic: 800-1100
  const isAttacking = state.status === "UNDER_ATTACK";
  const min = isAttacking ? 800 : 100;
  const max = isAttacking ? 1100 : 300;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
