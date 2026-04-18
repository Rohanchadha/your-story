"use client";

import { stylePresets, supportedLanguages, voicePresets } from "@/lib/constants/story-config";
import type { StoryLanguage, StylePreset, VoicePreset } from "@/lib/types/story";

const voiceIcons: Record<VoicePreset, string> = {
  "warm-parent": "/images/icons/voice-warm-parent.svg",
  "playful-friend": "/images/icons/voice-playful-friend.svg",
  "gentle-grandma": "/images/icons/voice-gentle-grandma.svg",
  "curious-explorer": "/images/icons/voice-curious-explorer.svg",
};

type StorySettingsFormProps = {
  language: StoryLanguage;
  level: number;
  stylePreset: StylePreset;
  voicePreset: VoicePreset;
  onLanguageChange: (value: StoryLanguage) => void;
  onLevelChange: (value: number) => void;
  onStylePresetChange: (value: StylePreset) => void;
  onVoicePresetChange: (value: VoicePreset) => void;
};

export function StorySettingsForm({
  language,
  level,
  stylePreset,
  voicePreset,
  onLanguageChange,
  onLevelChange,
  onStylePresetChange,
  onVoicePresetChange,
}: StorySettingsFormProps) {
  return (
    <div className="stack-sm">
      <div>
        <p className="eyebrow">Step 3</p>
        <h2>Tune the storytelling mood</h2>
        <p className="muted-text">Keep the setup lightweight, then pick the visual world at a glance.</p>
      </div>

      <div className="settings-grid">
        <label className="field">
          <span>Language</span>
          <select value={language} onChange={(event) => onLanguageChange(event.target.value as StoryLanguage)}>
            {supportedLanguages.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Level {level}</span>
          <input
            max={10}
            min={1}
            onChange={(event) => onLevelChange(Number(event.target.value))}
            type="range"
            value={level}
          />
          <small className="field-hint">
            {level <= 3 ? "Simple words, short sentences (ages 2–4)" : level <= 6 ? "Richer vocabulary, gentle complexity (ages 4–7)" : "Longer narratives, bigger ideas (ages 7–10)"}
          </small>
        </label>
      </div>

      <div className="stack-xs">
        <div>
          <span className="field-label">Narrator Voice</span>
          <p className="muted-text">Choose who tells the story aloud.</p>
        </div>
        <div className="voice-preset-grid">
          {voicePresets.map((item) => {
            const isSelected = item.value === voicePreset;
            return (
              <button
                key={item.value}
                className={["voice-preset-card", isSelected ? "voice-preset-card--selected" : ""].filter(Boolean).join(" ")}
                onClick={() => onVoicePresetChange(item.value)}
                type="button"
              >
                <img src={voiceIcons[item.value]} alt="" className="voice-preset-card__icon" aria-hidden="true" />
                <strong>{item.label}</strong>
                <span>{item.blurb}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="stack-xs">
        <div>
          <span className="field-label">Illustration Style</span>
          <p className="muted-text">Visual presets help parents choose tone without guessing from a dropdown label.</p>
        </div>
        <div className="style-preset-grid">
          {stylePresets.map((item) => {
            const isSelected = item.value === stylePreset;

            return (
              <button
                key={item.value}
                className={["style-preset-card", isSelected ? "style-preset-card--selected" : ""].filter(Boolean).join(" ")}
                onClick={() => onStylePresetChange(item.value)}
                type="button"
              >
                <div className="style-preset-card__art">
                  <img alt={`${item.label} preview`} className="style-preset-card__image" src={item.previewImageUrl} />
                </div>
                <div className="style-preset-card__body">
                  <strong>{item.label}</strong>
                  <p>{item.blurb}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
