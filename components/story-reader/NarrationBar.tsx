"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/shared/Button";
import type { StoryRecord } from "@/lib/types/story";

type NarrationBarProps = {
  story: StoryRecord;
  onNarrationReady?: (audioUrl: string) => void;
};

function rateForVoicePreset(voicePreset: StoryRecord["voicePreset"]): number {
  switch (voicePreset) {
    case "playful-friend":
      return 1.02;
    case "gentle-grandma":
      return 0.92;
    case "curious-explorer":
      return 1.04;
    default:
      return 0.96;
  }
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }
      reject(new Error("Failed to convert audio blob to data URL."));
    };
    reader.onerror = () => reject(new Error("Failed to read audio blob."));
    reader.readAsDataURL(blob);
  });
}

export function NarrationBar({ story, onNarrationReady }: NarrationBarProps) {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const supported = typeof window !== "undefined" && "speechSynthesis" in window;
    setIsSupported(supported);

    return () => {
      if (supported) {
        window.speechSynthesis.cancel();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  async function startNarration() {
    setStatusMessage("");
    const reusableAudioUrl = audioUrl || story.narrationAudioUrl || "";

    if (reusableAudioUrl) {
      audioRef.current = new Audio(reusableAudioUrl);
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };
      await audioRef.current.play();
      setIsPlaying(true);
      setIsPaused(false);
      setStatusMessage("Playing saved narration.");
      return;
    }

    setIsApiLoading(true);

    try {
      const response = await fetch("/api/media/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: story.fullText,
          voicePreset: story.voicePreset,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const nextAudioUrl = await blobToDataUrl(blob);
        setAudioUrl(nextAudioUrl);
        onNarrationReady?.(nextAudioUrl);
        audioRef.current = new Audio(nextAudioUrl);
        audioRef.current.onended = () => {
          setIsPlaying(false);
          setIsPaused(false);
        };
        await audioRef.current.play();
        setIsPlaying(true);
        setIsPaused(false);
        setStatusMessage("Playing AI-generated narration.");
        return;
      }
    } catch {
      // Fall through to browser speech synthesis.
    } finally {
      setIsApiLoading(false);
    }

    if (!isSupported) {
      setStatusMessage("Narration is unavailable right now. Please try again.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(story.fullText);
    utterance.rate = rateForVoicePreset(story.voicePreset);
    utterance.pitch = story.voicePreset === "playful-friend" ? 1.08 : 1;
    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };
    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
    setStatusMessage("Using browser speech fallback.");
  }

  function pauseNarration() {
    if (!isPlaying) return;
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPaused(true);
      return;
    }
    if (!isSupported) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  }

  function resumeNarration() {
    if (audioRef.current) {
      void audioRef.current.play();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }
    if (!isSupported) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
    setIsPlaying(true);
  }

  function stopNarration() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (isSupported) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    utteranceRef.current = null;
  }

  return (
    <section className="panel-card narration-card">
      <p className="eyebrow">Narration</p>
      <h2>{story.voicePreset.replaceAll("-", " ")}</h2>
      <p className="muted-text">
        When your API key is configured, this will use AI-generated speech first. Otherwise it falls back to your browser's speech engine.
      </p>
      <p className="muted-text">Voice output is AI-generated when the API path is active.</p>
      {statusMessage ? <p className="media-status">{statusMessage}</p> : null}
      <div className="panel-card__actions">
        {!isPlaying ? <Button onClick={startNarration}>{isApiLoading ? "Preparing Audio..." : "Play"}</Button> : null}
        {isPlaying && !isPaused ? (
          <Button onClick={pauseNarration} variant="secondary">
            Pause
          </Button>
        ) : null}
        {isPlaying && isPaused ? (
          <Button onClick={resumeNarration} variant="secondary">
            Resume
          </Button>
        ) : null}
        <Button onClick={stopNarration} variant="ghost">
          Restart
        </Button>
      </div>
      {!isSupported ? (
        <p className="muted-text">Browser speech fallback is unavailable here, so API narration is preferred.</p>
      ) : null}
    </section>
  );
}
