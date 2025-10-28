import { useHudSettings } from "@/states/settings";

export default function CinematicBars() {
  const settings = useHudSettings();

  if (!settings.showCinematicBars) {
    return null;
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-[8vh] bg-black z-[9000] pointer-events-none transition-all duration-500" />

      <div className="fixed bottom-0 left-0 w-full h-[8vh] bg-black z-[9000] pointer-events-none transition-all duration-500" />
    </>
  );
}
