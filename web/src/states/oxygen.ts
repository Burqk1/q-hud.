import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

export interface OxygenStateInterface {
  isUnderwater: boolean;
  oxygen: number; // 0-100
}

const mockOxygenState: OxygenStateInterface = {
  isUnderwater: true,
  oxygen: 75,
};

const oxygenState = atom<OxygenStateInterface>(mockOxygenState);

export const useOxygenState = () => useAtomValue(oxygenState);
export const useSetOxygenState = () => useSetAtom(oxygenState);
export const useOxygenStateStore = () => useAtom(oxygenState);
