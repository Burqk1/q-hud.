import { useNuiEvent } from "@/hooks/useNuiEvent";
import { useState, useMemo } from "preact/hooks";

interface TalkStatusInterface {
  range: number;
  radio: boolean;
  inradio: boolean;
  talking: boolean;
  totalRange: number;
}

export default function Talk() {
  const [talkStatus, setTalkStatus] = useState<TalkStatusInterface>({
    range: 2,
    radio: false,
    inradio: false,
    talking: false,
    totalRange: 3,
  });

  useNuiEvent<TalkStatusInterface>("setTalkingState", (data) => {
    setTalkStatus((prev) => ({
      ...prev,
      radio: data.radio,
      inradio: data.inradio,
      talking: data.talking,
    }));
  });

  useNuiEvent<{ range: number }>("setTalkRange", (data) => {
    setTalkStatus((prev) => ({
      ...prev,
      range: data.range,
    }));
  });

  const audioBars = useMemo(() => {
    const delays = [0, 0.6, 0.4, 0.5, 0.8, 0.3, 0.7];
    return [...Array(7)].map((_, index) => {
      const isActive = talkStatus.talking || talkStatus.radio;
      const color = talkStatus.radio ? '#2489db' : '#94f024';
      const maxHeight = talkStatus.range === 1 ? '50%' : talkStatus.range === 2 ? '70%' : '100%';

      return (
        <div
          key={`audio-bar-${index}`}
          className={isActive ? (talkStatus.radio ? 'audioRadio' : 'audioTalking') : 'audioBar'}
          style={{
            display: 'block',
            position: 'relative',
            width: '5px',
            height: '20%',
            borderRadius: '0.1vh',
            backgroundColor: isActive ? color : 'rgba(39, 39, 39, 0.664)',
            boxShadow: isActive ? `0 0 8px ${color}` : '0 0 2px rgba(39, 39, 39, 0.664)',
            maxHeight: maxHeight,
          }}
        />
      );
    });
  }, [talkStatus.talking, talkStatus.radio, talkStatus.range]);

  const rangeBars = useMemo(() => {
    return [...Array(talkStatus.totalRange)].map((_, index) => {
      const isActive = index < talkStatus.range;
      return (
        <div
          key={`range-bar-${index}`}
          className="rounded-sm"
          style={{
            height: '0.5vh',
            flex: 1,
            backgroundColor: isActive ? '#94f024' : 'rgba(165, 165, 165, 0.582)',
            boxShadow: isActive ? '0 0 8px #94f024' : '0 0 2px rgba(39, 39, 39, 0.664)',
            border: isActive ? 'none' : '1px solid rgba(165, 165, 165, 0.582)',
            transition: 'all 0.2s ease-in-out',
          }}
        />
      );
    });
  }, [talkStatus.range, talkStatus.totalRange]);

  return (
    <>
      <style>
        {`
          @keyframes audioPlaying {
            0% { height: 20%; }
            50% { height: 100%; }
            100% { height: 20%; }
          }
          .audioBar {
            display: block;
            position: relative;
            height: 20%;
            width: 5px;
            border-radius: 0.1vh;
            background-color: rgba(39, 39, 39, 0.664);
            box-shadow: 0 0 2px rgba(39, 39, 39, 0.664);
          }
          .audioTalking {
            animation: audioPlaying 1s linear infinite;
          }
          .audioRadio {
            animation: audioPlaying 1s linear infinite;
          }
          .audioTalking:nth-child(1) { animation-delay: 0s; }
          .audioTalking:nth-child(2) { animation-delay: 0.6s; }
          .audioTalking:nth-child(3) { animation-delay: 0.4s; }
          .audioTalking:nth-child(4) { animation-delay: 0.5s; }
          .audioTalking:nth-child(5) { animation-delay: 0.8s; }
          .audioTalking:nth-child(6) { animation-delay: 0.3s; }
          .audioTalking:nth-child(7) { animation-delay: 0.7s; }
          .audioRadio:nth-child(1) { animation-delay: 0s; }
          .audioRadio:nth-child(2) { animation-delay: 0.6s; }
          .audioRadio:nth-child(3) { animation-delay: 0.4s; }
          .audioRadio:nth-child(4) { animation-delay: 0.5s; }
          .audioRadio:nth-child(5) { animation-delay: 0.8s; }
          .audioRadio:nth-child(6) { animation-delay: 0.3s; }
          .audioRadio:nth-child(7) { animation-delay: 0.7s; }
        `}
      </style>

      <div className="absolute transition-transform duration-[400ms] ease-in-out" style={{ right: '2vh', bottom: '3.5vh' }}>
        <div
          className="flex items-center justify-center"
          style={{
            width: '52px',
            height: '50px',
            gap: '4px',
          }}
        >
          {audioBars}
        </div>

        <div
          className="flex items-center justify-center mt-2"
          style={{
            width: '5vh',
            height: '0.5vh',
            gap: '0.5vh',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {rangeBars}
        </div>
      </div>
    </>
  );
}
