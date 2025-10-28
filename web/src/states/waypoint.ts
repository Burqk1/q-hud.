import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

export interface WaypointStateInterface {
  distance: number;
  hasWaypoint: boolean;
}

const mockWaypointState: WaypointStateInterface = {
  distance: 0,
  hasWaypoint: false,
};

const waypointState = atom<WaypointStateInterface>(mockWaypointState);

export const useWaypointState = () => useAtomValue(waypointState);
export const useSetWaypointState = () => useSetAtom(waypointState);
export const useWaypointStateStore = () => useAtom(waypointState);
