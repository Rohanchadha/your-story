"use client";

import { stylePresets, supportedLanguages, voicePresets } from "@/lib/constants/story-config";
import type { StoryLanguage, StylePreset, VoicePreset } from "@/lib/types/story";

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
        </label>

        <label className="field">
          <span>Narrator Voice</span>
          <select value={voicePreset} onChange={(event) => onVoicePresetChange(event.target.value as VoicePreset)}>
            {voicePresets.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
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
