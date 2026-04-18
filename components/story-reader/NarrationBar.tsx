"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/shared/Button";
import type { StoryRecord } from "@/lib/types/story";

type NarrationBarProps = {
  story: StoryRecord;
  onNarrationReady?: (audioUrl: string, voicePreset: StoryRecord["voicePreset"]) => void;
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

  function attachAudio(audio: HTMLAudioElement) {
    audio.onplay = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };
    audio.onpause = () => {
      if (audio.currentTime > 0 && !audio.ended) {
        setIsPaused(true);
      }
      setIsPlaying(!audio.paused && !audio.ended);
    };
    audio.onended = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };
    audioRef.current = audio;
  }

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

    // Only reuse saved narration if it matches the currently selected voice preset.
    const savedAudio = audioUrl || story.narrationAudioUrl || "";
    const savedVoiceMatches =
      !story.narrationVoicePreset || story.narrationVoicePreset === story.voicePreset;
    const reusableAudioUrl = savedAudio && savedVoiceMatches ? savedAudio : "";

    if (reusableAudioUrl) {
      const existingAudio = audioRef.current?.src === reusableAudioUrl ? audioRef.current : new Audio(reusableAudioUrl);
      attachAudio(existingAudio);
      try {
        await existingAudio.play();
        setStatusMessage("Playing saved narration.");
      } catch (error) {
        console.error("Failed to play saved narration:", error);
        setStatusMessage("Tap play again to start narration.");
      }
      return;
    }

    // Make sure the browser speech synth isn't already speaking from a previous attempt.
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
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
          storyId: story.id,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const nextAudioUrl = await blobToDataUrl(blob);
        setAudioUrl(nextAudioUrl);
        onNarrationReady?.(nextAudioUrl, story.voicePreset);
        const audio = new Audio(nextAudioUrl);
        attachAudio(audio);
        try {
          await audio.play();
          setStatusMessage("Playing AI-generated narration.");
        } catch (error) {
          console.error("Failed to autoplay generated narration:", error);
          setStatusMessage("Tap play again to start narration.");
        }
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
      return;
    }
    if (!isSupported || !window.speechSynthesis.speaking) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  }

  function resumeNarration() {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        void audioRef.current.play();
      }
      setStatusMessage(audioUrl || story.narrationAudioUrl ? "Resuming saved narration." : "Resuming AI-generated narration.");
      return;
    }
    if (!isSupported || !window.speechSynthesis.paused) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
    setIsPlaying(true);
    setStatusMessage("Resuming browser narration.");
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
        Tap play to hear this story in the selected narrator voice. If live voice generation is temporarily unavailable,
        the reader will switch to browser narration automatically.
      </p>
      <p className="muted-text">Saved audio replays instantly, and new narration is generated on demand.</p>
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
