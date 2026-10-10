import { fixtures } from '../data/fixtures';
import { selectors } from './adapter';
import type { LabState } from './types';

export interface EnergyGroup { id: string; label: string; resources: string[]; nominalWatts: number | null; protected: boolean; basis: string }
export const energyGroups: EnergyGroup[] = [
  { id: 'lighting', label: 'Capture lighting', resources: ['C1-L1', 'C1-L2'], nominalWatts: 120, protected: false, basis: '2 × 60 W illustrative assumption; actual wattage unverified' },
  { id: 'computing', label: 'Computing stations', resources: fixtures.resources.filter(r => r.kind === 'Station').map(r => r.id), nominalWatts: 600, protected: false, basis: '6 × 100 W illustrative assumption; actual load unmetered' },
  { id: 'signal', label: 'Signal bench', resources: ['S1-B'], nominalWatts: 50, protected: false, basis: '50 W illustrative assumption; actual equipment unverified' },
  { id: 'protected', label: 'Network and essential services', resources: [], nominalWatts: null, protected: true, basis: 'Protected boundary; no circuit inventory or meter connected' },
];
export interface StandbyPreview { eligible: boolean; reasons: string[]; maxAvoidedKWh: number | null }
export function previewStandby(state: LabState, group: EnergyGroup, minutes: number): StandbyPreview {
  const reasons: string[] = [];
  if (!Number.isFinite(minutes) || minutes <= 0 || minutes > 60) return { eligible: false, reasons: ['Choose a preview interval between 1 and 60 minutes.'], maxAvoidedKWh: null };
  if (group.protected) reasons.push('Essential services are outside the standby proposal boundary.');
  if (group.nominalWatts === null) reasons.push('No power basis is available for this group.');
  for (const id of group.resources) {
    const availability = selectors.availability(state, id);
    if (availability.state !== 'bookable') reasons.push(`${id}: ${availability.label}.`);
    if (selectors.occupancy(state, fixtures, id).state === 'in-use') reasons.push(`${id} has an active session.`);
  }
  for (const booking of state.bookings) {
    if (booking.status === 'Closed' || booking.day !== 'Thu 1 Oct' || !booking.resources.some(id => group.resources.includes(id))) continue;
    const match = /^(\d{2}):(\d{2})/.exec(booking.slot);
    if (!match) { reasons.push(`${booking.id} has an unresolved time window.`); continue; }
    const start = Number(match[1]) * 60 + Number(match[2]);
    // Conservatively protect a 60-minute example slot; this is an energy-preview policy, not a booking rule change.
    if (start < state.minute + minutes && start + 60 > state.minute) reasons.push(`${booking.id} reserves part of this group during the preview interval.`);
  }
  return { eligible: !reasons.length, reasons: [...new Set(reasons)], maxAvoidedKWh: reasons.length || group.nominalWatts === null ? null : group.nominalWatts * minutes / 60 / 1000 };
}
