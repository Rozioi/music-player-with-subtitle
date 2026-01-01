import { act, useEffect, useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa6";

import styles from "./AudioPage.module.scss";

interface Music {
  id: number;
  src: string;
  vttSrc: string;
  picture: string;
  title: string;
  artist: string;
}

interface Cue {
  id: number;
  startTime: number;
  endTime: number;
  text: string;
}

const formatTime = (s: number) => {
  if (!s || isNaN(s)) return "0:00";
  const min = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
};

const AudioPage = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);
  const cuesScrollRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<HTMLDivElement[] | null>([]);

  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeMusic, setActiveMusic] = useState(0);
  const [activeCue, setActiveCue] = useState(-1);
  const [cues, setCues] = useState<Cue[]>([]);
  const music: Music[] = [
    {
      id: 0,
      src: "https://cdn.whyp.it/f33c03bb-38ca-48ee-bc39-58f48e440fc5.mp3?token=IsJzX96XeW2FOCbeX_bbnFxzR5n2HVg4vfKYiaSMU7I&filename=a.mp3&expires=1767299936",
      vttSrc: "/a.vtt",
      picture:
        "https://avatars.yandex.net/get-music-content/17730916/ea772c01.a.39762741-1/m1000x1000",
      title: "ТУПОЙ (СТВОЛ 2) rework",
      artist: "boogshi",
    },
    {
      id: 1,
      src: "https://cdn.whyp.it/2a342fe8-ef8f-4042-be72-272303373d47.mp3?token=RoZXq4AFegWKnj_H_yeeCAzWQj7U3oU3HVNLRwUgswA&filename=b.mp3&expires=1767299718",
      vttSrc: "/b.vtt",
      picture:
        "https://i.scdn.co/image/ab67616d00001e02820d86dd139951127b1d4001",
      title: "Не я",
      artist: "Whole Lotta Swag",
    },
    {
      id: 2,
      src: "https://cdn.whyp.it/7c03906e-c09d-42b6-a5a2-a2d65e98777a.mp3?token=_4OlgdZDgEjaFGPoHeRX-2HL-LOailaP2g3YvlgsXag&filename=c.mp3&expires=1767299854",
      vttSrc: "/c.vtt",
      picture:
        "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/2b/8e/22/2b8e2217-e449-dc03-9571-6d458118f383/cover.jpg/630x630bf-60.jpg",
      title: "Целовались",
      artist: "Cupsize",
    },

    {
      id: 3,
      src: "https://cdn.whyp.it/1944cebf-b1c5-4863-9d46-ff53f7417769.mp3?token=26Y3p3DBXkEm04_KH7YmTaNPYa9xLa6Ppevxx85Thbc&filename=d.mp3&expires=1767299891",
      vttSrc: "/d.vtt",
      picture:
        "https://t2.genius.com/unsafe/516x516/https%3A%2F%2Fimages.genius.com%2Fe87d4748a09b51625745759ca1766b96.1000x1000x1.png",
      title: "Больше, чем творчество",
      artist: "Cupsize",
    },
  ];
  useEffect(() => {
    if (!cuesScrollRef.current || activeCue < 0) return;

    const parent = cuesScrollRef.current;

    const activeLine = lineRefs.current[activeCue];

    if (!activeLine) return;

    const parentHeight = parent.clientHeight;
    const liteTop = activeLine.offsetTop;
    const lineHeight = activeLine.clientHeight;
    const offset = liteTop - parentHeight / 6 + lineHeight / 2;
    parent.scrollTo({ top: offset, behavior: "smooth" });
  }, [activeCue]);
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) audio.pause();
    else audio.play();
    setIsPlaying(!isPlaying);
  };

  const onLoaded = () => {
    setActiveCue(-1);
    const audio = audioRef.current;
    if (!audio) return;
    const track = audio.textTracks[0];

    if (!track) return;

    track.mode = "hidden";

    const parsed = Array.from(track.cues || []).map((cue, i) => ({
      id: i,
      startTime: cue.startTime,
      endTime: cue.endTime,
      text: cue.text,
    }));

    setCues(parsed);
    setDuration(audio.duration);

    track.oncuechange = () => {
      const activeCueIndex = track.activeCues?.[0] as VTTCue | undefined;
      if (!activeCueIndex) {
        setActiveCue(-1);
        return;
      }

      const idx = parsed.findIndex(
        (cue) => cue.startTime === activeCueIndex.startTime,
      );
      setActiveCue(idx);
    };
    return () => {
      track.oncuechange = null;
    };
  };

  const onTime = () => {
    const audio = audioRef.current;
    if (!audio) return;

    setCurrent(audio.currentTime);
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Number(e.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.cover}>
        <img
          src={music[activeMusic].picture}
          alt={music[activeMusic].title}
          className={styles.coverImg}
        />
        <div className={styles.title}>{music[activeMusic].title}</div>
        <div className={styles.artist}>{music[activeMusic].artist}</div>
      </div>

      <audio
        ref={audioRef}
        src={music[activeMusic].src}
        onTimeUpdate={onTime}
        onLoadedMetadata={onLoaded}
      >
        <track kind="subtitles" src={music[activeMusic].vttSrc} default /> /
      </audio>
      <div className={styles.player}>
        <button className={styles.playBtn} onClick={togglePlay}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <div className={styles.timelineWrapper}>
          <span className={styles.time}>{formatTime(current)}</span>
          <input
            type="range"
            min={0}
            max={Number(duration)}
            value={Number(current)}
            onChange={onSeek}
            className={styles.timeline}
          />
          <span className={styles.time}>{formatTime(duration)}</span>
        </div>
      </div>

      <div className={styles.cuesContainer}>
        <div ref={cuesScrollRef} className={styles.cuesScroll}>
          {activeCue === -1 && (
            <div>
              <div className={styles.waitText}>
                • {music[activeMusic].title} •
              </div>
              <div className={styles.waitText}>
                • {music[activeMusic].artist} •{" "}
              </div>
            </div>
          )}
          {cues.map((cue, i) => (
            <div
              key={cue.id}
              ref={(el) => (lineRefs.current[i] = el)}
              className={i === activeCue ? styles.activeCue : styles.cue}
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = cue.startTime;
                }
              }}
            >
              {cue.text}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.musicMenu}>
        {music.map((item, i) => (
          <div
            key={item.id}
            className={
              i === activeMusic ? styles.activeMusic : styles.musicButton
            }
            onClick={() => {
              setIsPlaying(false);
              setCurrent(0);
              setDuration(0);
              setActiveMusic(i);
              audioRef.current?.load();
            }}
          >
            <h3>{item.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudioPage;
