import { useRef, useState, useEffect } from "react";
import styles from "./AudioPage.module.scss";
import {
  FaPlay,
  FaPause,
  FaForwardStep,
  FaBackwardStep,
} from "react-icons/fa6";

interface Cue {
  id: number;
  text: string;
  start: number;
  end: number;
}

interface Music {
  id: number;
  src: string;
  vttSrc: string;
  picture: string;
  title: string;
  artist: string;
}

const formatTime = (sec: number) => {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
};

const AudioPage = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);
  const lyricsScrollRef = useRef<HTMLDivElement>(null);
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);
  const volumeRef = useRef<HTMLDivElement>(null);
  const [volume, setVolume] = useState(0.8);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const [cues, setCues] = useState<Cue[]>([]);
  const [activeCueIndex, setActiveCueIndex] = useState(-1);
  const [activeMusic, setActiveMusic] = useState(0);
  useEffect(() => {
    if (!lyricsScrollRef.current || activeCueIndex < 0) return;

    const parent = lyricsScrollRef.current;
    const activeLine = lineRefs.current[activeCueIndex];

    if (!activeLine) return;

    const parentHeight = parent.clientHeight;
    const lineTop = activeLine.offsetTop;
    const lineHeight = activeLine.clientHeight;

    const targetScroll = lineTop - parentHeight / 6 + lineHeight / 2;

    parent.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  }, [activeCueIndex]);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (volumeRef.current && !volumeRef.current.contains(e.target as Node)) {
        setIsVolumeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const music: Music[] = [
    {
      id: 0,
      src: "/a.mp3",
      vttSrc: "/a.vtt",
      picture:
        "https://avatars.yandex.net/get-music-content/17730916/ea772c01.a.39762741-1/m1000x1000",
      title: "ТУПОЙ (СТВОЛ 2) rework",
      artist: "boogshi",
    },
    {
      id: 1,
      src: "/b.mp3",
      vttSrc: "/b.vtt",
      picture:
        "https://i.scdn.co/image/ab67616d00001e02820d86dd139951127b1d4001",
      title: "Не я",
      artist: "Whole Lotta Swag",
    },
    {
      id: 2,
      src: "/c.mp3",
      vttSrc: "/c.vtt",
      picture:
        "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/2b/8e/22/2b8e2217-e449-dc03-9571-6d458118f383/cover.jpg/630x630bf-60.jpg",
      title: "Целовались",
      artist: "Cupsize",
    },

    {
      id: 3,
      src: "/d.mp3",
      vttSrc: "/d.vtt",
      picture:
        "https://t2.genius.com/unsafe/516x516/https%3A%2F%2Fimages.genius.com%2Fe87d4748a09b51625745759ca1766b96.1000x1000x1.png",
      title: "Больше, чем творчество",
      artist: "Cupsize",
    },
    {
      id: 4,
      src: "/e.mp3",
      vttSrc: "/e.vtt",
      picture:
        "https://i.pinimg.com/736x/ce/15/b0/ce15b0ace13ef9bc59feacb9a8e98635.jpg",
      title: "Я люблю тебя",
      artist: "Cupsize",
    },
  ];

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) audio.pause();
    else audio.play();

    setIsPlaying(!isPlaying);
  };
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.load();
    setCurrent(0);
  }, [activeMusic]);
  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  const onLoaded = () => {
    const audio = audioRef.current;
    if (!audio) return;

    setDuration(audio.duration);
    audio.volume = volume;

    const track = audio.textTracks[0];
    if (!track) return;

    track.mode = "hidden";

    const parsed = Array.from(track.cues || []).map((cue, i) => ({
      id: i,
      text: cue.text,
      start: cue.startTime,
      end: cue.endTime,
    }));

    setCues(parsed);

    track.oncuechange = () => {
      const activeCue = track.activeCues?.[0] as VTTCue | undefined;
      if (!activeCue) {
        setActiveCueIndex(-1);
        return;
      }

      const idx = parsed.findIndex((c) => c.start === activeCue.startTime);
      setActiveCueIndex(idx);
    };
  };
  const isPrevDisabled = activeMusic === 0;
  const isNextDisabled = activeMusic === music.length - 1;

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
  const scrollTrack = (op: "prev" | "next") => {
    setIsPlaying(false);
    setActiveCueIndex(-1);

    setActiveMusic((prev) => {
      if (op === "prev") {
        return Math.max(prev - 1, 0);
      }
      if (op === "next") {
        return Math.min(prev + 1, music.length - 1);
      }
      return prev;
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.currentCover}>
        <img src={music[activeMusic].picture} className={styles.coverImg} />
        <div className={styles.title}>{music[activeMusic].title}</div>
        <div className={styles.artist}>{music[activeMusic].artist}</div>
      </div>
      <button className={styles.playBtn} onClick={togglePlay}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>

      <audio
        ref={audioRef}
        src={music[activeMusic].src}
        onLoadedMetadata={onLoaded}
        onTimeUpdate={onTime}
      >
        <track kind="subtitles" src={music[activeMusic].vttSrc} default />
      </audio>

      <div className={styles.player}>
        <button
          className={`${styles.prevBtn} ${
            isPrevDisabled ? styles.disabled : ""
          }`}
          onClick={() => scrollTrack("prev")}
          disabled={isPrevDisabled}
        >
          <FaBackwardStep />
        </button>

        <div className={styles.timelineWrapper}>
          <span className={styles.time}>{formatTime(current)}</span>

          <input
            type="range"
            min={0}
            max={duration}
            value={current}
            onChange={onSeek}
            className={styles.timeline}
          />

          <span className={styles.time}>{formatTime(duration)}</span>
        </div>
        <div className={styles.volumeWrapper} ref={volumeRef}>
          <button
            className={styles.volumeBtn}
            onClick={() => setIsVolumeOpen((v) => !v)}
          >
            {Math.round(volume * 100)}%
          </button>

          {isVolumeOpen && (
            <div className={styles.volumePopover}>
              <div className={styles.volumeSlider}>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={changeVolume}
                />
              </div>
            </div>
          )}
        </div>
        <button
          className={`${styles.nextBtn} ${
            isNextDisabled ? styles.disabled : ""
          }`}
          onClick={() => scrollTrack("next")}
          disabled={isNextDisabled}
        >
          <FaForwardStep />
        </button>
      </div>

      <div className={styles.lyricsContainer}>
        <div ref={lyricsScrollRef} className={styles.lyricsScroll}>
          {activeCueIndex === -1 && (
            <div className={styles.waitText}>
              ♪ … {music[activeMusic].title} • {music[activeMusic].artist} • … ♪
            </div>
          )}

          {cues.map((cue, i) => (
            <div
              key={cue.id}
              ref={(el) => (lineRefs.current[i] = el)}
              className={i === activeCueIndex ? styles.activeLine : styles.line}
              onClick={() => {
                if (audioRef.current) audioRef.current.currentTime = cue.start;
              }}
            >
              {cue.text}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.musicMenu}>
        {music.map((m, i) => (
          <div
            key={m.id}
            className={
              i === activeMusic ? styles.activeMusic : styles.musicButton
            }
            onClick={() => {
              setActiveCueIndex(-1);
              setIsPlaying(false);
              setActiveMusic(i);
              audioRef.current?.load();
            }}
          >
            {m.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudioPage;
