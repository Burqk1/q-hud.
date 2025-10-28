import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

export interface WeaponStateInterface {
  hasWeapon: boolean;
  ammo: number;
  totalAmmo: number;
  isInVehicle?: boolean;
}

const mockWeaponState: WeaponStateInterface = {
  hasWeapon: false,
  ammo: 0,
  totalAmmo: 0,
  isInVehicle: false,
};

const weaponState = atom<WeaponStateInterface>(mockWeaponState);

export const useWeaponState = () => useAtomValue(weaponState);
export const useSetWeaponState = () => useSetAtom(weaponState);
export const useWeaponStateStore = () => useAtom(weaponState);
