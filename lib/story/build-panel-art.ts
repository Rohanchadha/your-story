import { buildPanelPrompt } from "@/lib/imagegen/build-panel-prompt";
import type { StoryMode, StoryPanel, StylePreset } from "@/lib/types/story";

function encodeSvg(svg: string): string {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function paletteForStyle(stylePreset: StylePreset): { bgA: string; bgB: string; ink: string; accent: string } {
  switch (stylePreset) {
    case "cozy-anime":
      return { bgA: "#ffd9c9", bgB: "#d6e8ff", ink: "#382a2a", accent: "#ff8e6f" };
    case "minimal-pastel":
      return { bgA: "#fce9f3", bgB: "#eef9d8", ink: "#36413b", accent: "#8fc7b8" };
    case "soft-watercolor":
      return { bgA: "#dff1ff", bgB: "#fff0da", ink: "#314254", accent: "#e6b774" };
    case "playful-pencil":
      return { bgA: "#f6eddc", bgB: "#efe6f9", ink: "#43372d", accent: "#e08c63" };
    default:
      return { bgA: "#ffe6db", bgB: "#fff5cd", ink: "#3d3028", accent: "#ff9b72" };
  }
}

function titleLines(title: string): string[] {
  const words = title.split(" ");
  const midpoint = Math.ceil(words.length / 2);
  return [words.slice(0, midpoint).join(" "), words.slice(midpoint).join(" ")].filter(Boolean);
}

export function createPanelArtDataUrl(panel: Pick<StoryPanel, "title" | "panelText">, stylePreset: StylePreset, mode: StoryMode): string {
  const palette = paletteForStyle(stylePreset);
  const lines = titleLines(panel.title);
  const prompt = buildPanelPrompt(panel, stylePreset, mode);
  const promptSnippet = prompt.split("\n")[3]?.replace("Scene/backdrop: ", "") ?? panel.panelText;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1400" height="960" viewBox="0 0 1400 960" role="img" aria-label="${panel.title}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${palette.bgA}" />
          <stop offset="100%" stop-color="${palette.bgB}" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="rgba(34,28,23,0.14)" />
        </filter>
      </defs>
      <rect width="1400" height="960" rx="48" fill="url(#bg)" />
      <circle cx="1170" cy="140" r="130" fill="${palette.accent}" opacity="0.22" />
      <circle cx="230" cy="760" r="150" fill="${palette.accent}" opacity="0.18" />
      <path d="M0 670 C 180 590, 320 760, 530 670 S 880 520, 1120 650 S 1290 720, 1400 660 L 1400 960 L 0 960 Z" fill="rgba(255,255,255,0.52)" />
      <g filter="url(#shadow)">
        <rect x="124" y="112" width="1152" height="736" rx="42" fill="rgba(255,255,255,0.72)" />
      </g>
      <text x="190" y="212" font-family="'Avenir Next','Trebuchet MS',sans-serif" font-size="26" letter-spacing="5" fill="${palette.ink}" opacity="0.68">ILLUSTRATION PREVIEW</text>
      ${lines
        .map(
          (line, index) =>
            `<text x="190" y="${index === 0 ? 338 : 408}" font-family="'Iowan Old Style','Palatino Linotype',serif" font-size="76" fill="${palette.ink}">${line}</text>`,
        )
        .join("")}
      <foreignObject x="190" y="470" width="980" height="220">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:'Avenir Next','Trebuchet MS',sans-serif;font-size:29px;line-height:1.45;color:${palette.ink};opacity:0.84;">
          ${promptSnippet}
        </div>
      </foreignObject>
      <g opacity="0.72">
        <path d="M1030 315 C1088 250 1162 248 1216 314" stroke="${palette.ink}" stroke-width="10" fill="none" stroke-linecap="round"/>
        <circle cx="1056" cy="356" r="18" fill="${palette.ink}" opacity="0.85" />
        <circle cx="1192" cy="356" r="18" fill="${palette.ink}" opacity="0.85" />
        <path d="M1050 515 C1110 582 1172 582 1232 515" stroke="${palette.ink}" stroke-width="12" fill="none" stroke-linecap="round"/>
      </g>
      <rect x="190" y="736" width="270" height="64" rx="32" fill="${palette.accent}" opacity="0.9" />
      <text x="235" y="778" font-family="'Avenir Next','Trebuchet MS',sans-serif" font-size="28" font-weight="700" fill="#fffdf7">${stylePreset.replaceAll("-", " ")}</text>
    </svg>
  `;

  return encodeSvg(svg);
}

export function createCoverArtDataUrl(title: string, summary: string, stylePreset: StylePreset, coverAccent: string): string {
  const palette = paletteForStyle(stylePreset);
  const lines = titleLines(title);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720" role="img" aria-label="${title}">
      <defs>
        <linearGradient id="coverBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${coverAccent}" />
          <stop offset="100%" stop-color="${palette.bgB}" />
        </linearGradient>
      </defs>
      <rect width="1200" height="720" rx="40" fill="url(#coverBg)" />
      <circle cx="980" cy="140" r="110" fill="${palette.accent}" opacity="0.26" />
      <circle cx="220" cy="580" r="140" fill="#ffffff" opacity="0.26" />
      <rect x="94" y="92" width="1012" height="536" rx="32" fill="rgba(255,255,255,0.68)" />
      <text x="148" y="170" font-family="'Avenir Next','Trebuchet MS',sans-serif" font-size="24" letter-spacing="5" fill="${palette.ink}" opacity="0.7">STORY COVER</text>
      ${lines
        .map(
          (line, index) =>
            `<text x="148" y="${index === 0 ? 280 : 348}" font-family="'Iowan Old Style','Palatino Linotype',serif" font-size="64" fill="${palette.ink}">${line}</text>`,
        )
        .join("")}
      <foreignObject x="148" y="402" width="760" height="150">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:'Avenir Next','Trebuchet MS',sans-serif;font-size:28px;line-height:1.42;color:${palette.ink};opacity:0.84;">
          ${summary}
        </div>
      </foreignObject>
      <rect x="148" y="574" width="250" height="56" rx="28" fill="${palette.accent}" opacity="0.92" />
      <text x="184" y="611" font-family="'Avenir Next','Trebuchet MS',sans-serif" font-size="24" font-weight="700" fill="#fffdf7">${stylePreset.replaceAll("-", " ")}</text>
    </svg>
  `;

  return encodeSvg(svg);
}
