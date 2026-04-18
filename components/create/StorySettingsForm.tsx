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
        <p className="eyebrow">Step 4</p>
        <h2>Tune the story settings</h2>
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
          <span>Illustration Style</span>
          <select value={stylePreset} onChange={(event) => onStylePresetChange(event.target.value as StylePreset)}>
            {stylePresets.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
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
    </div>
  );
}
