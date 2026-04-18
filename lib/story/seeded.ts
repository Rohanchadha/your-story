import { buildPanelPrompt } from "@/lib/imagegen/build-panel-prompt";
import { createPanelArtDataUrl } from "@/lib/story/build-panel-art";
import type { StoryMode, StoryPanel, StoryRecord, StorySummary, StylePreset } from "@/lib/types/story";

function createPanels(
  storyId: string,
  mode: StoryMode,
  stylePreset: StylePreset,
  items: Array<{ title: string; text: string }>,
): StoryPanel[] {
  return items.map((item, index) => ({
    id: `${storyId}_panel_${index + 1}`,
    title: item.title,
    panelText: item.text,
    narrationText: item.text,
    imagePrompt: buildPanelPrompt({ title: item.title, panelText: item.text }, stylePreset, mode),
    imageUrl: createPanelArtDataUrl({ title: item.title, panelText: item.text }, stylePreset, mode),
    status: "ready",
  }));
}

export const seededStoryRecords: StoryRecord[] = [
  {
    id: "story_of_day_solar_train",
    title: "The Sunbeam Train",
    summary: "A bright little engine helps two siblings understand how the planets travel around the sun.",
    category: "Science Stories",
    level: 3,
    language: "english",
    mode: "educational",
    stylePreset: "soft-watercolor",
    voicePreset: "warm-parent",
    coverAccent: "#ffd6a6",
    coverImageUrl: "/images/stories/the-sunbeam-train.png",
    prompt: "Explain the solar system through a warm train adventure.",
    fullText:
      "On a golden evening, Mina and Kabir heard a tiny whistle near their window and found the Sunbeam Train glowing on the moonlit tracks. Conductor Suraj bowed and promised to show them how the solar system moves together like a careful parade. First, the train circled the sun, who stood at the center like a warm station lamp. Mercury rushed quickly, Venus shimmered softly, and Earth spun with blue oceans sparkling in the dark. Mars rolled by in rusty red boots, while giant Jupiter kept everyone feeling safe with his strong, swirling presence. Saturn floated elegantly, wearing rings like hula hoops made of light. Farther away, Uranus and Neptune glided slowly, calm and chilly in the deep dark. By the time the train returned home, Mina and Kabir understood that the planets are not lost at all. They each follow a path around the sun, moving at their own pace, yet staying part of one beautiful cosmic family.",
    panels: createPanels("story_of_day_solar_train", "educational", "soft-watercolor", [
      {
        title: "A Tiny Whistle at Dusk",
        text: "Mina and Kabir hear a soft whistle outside and discover the glowing Sunbeam Train waiting just beyond their window.",
      },
      {
        title: "Conductor Suraj Appears",
        text: "Conductor Suraj tips his golden cap and explains that the solar system moves like a careful parade around one bright center.",
      },
      {
        title: "The Sun at the Center",
        text: "The train circles the sun, who glows like a grand station lantern while every planet follows its own path nearby.",
      },
      {
        title: "The Inner Planets",
        text: "Mercury rushes, Venus glows, Earth spins blue and green, and Mars strolls by in cheerful red colors.",
      },
      {
        title: "The Giants Join In",
        text: "Jupiter rumbles kindly, Saturn twirls in shining rings, and the distant planets drift slowly through the cool dark.",
      },
      {
        title: "A Cosmic Family",
        text: "Back home, Mina and Kabir smile because they now know the planets are a family, each traveling in its own steady rhythm around the sun.",
      },
    ]),
    origin: "seeded",
    createdAt: "2026-04-18T00:00:00.000Z",
    updatedAt: "2026-04-18T00:00:00.000Z",
    status: "ready",
  },
  {
    id: "story_kindness_bridge",
    title: "The Bridge of Kind Hands",
    summary: "A village learns that every small helpful act can build something beautiful together.",
    category: "Being Helpful",
    level: 4,
    language: "english",
    mode: "adventure",
    stylePreset: "storybook-cartoon",
    voicePreset: "gentle-grandma",
    coverAccent: "#d5f5e8",
    coverImageUrl: "/images/stories/the-bridge-of-kind-hands.png",
    prompt: "Tell a value-based story about helpfulness creating something magical.",
    fullText:
      "In the village of Neem Hollow, a stream separated the homes from the school garden, and after a storm the wooden bridge had washed away. Everyone worried because the children could no longer reach the flowers they had planted. Little Tara began by carrying a basket of rope to the riverbank. Soon her neighbor brought smooth stones, then a baker carried warm bread for the workers, and then even the youngest children gathered twigs and sang cheerful songs to keep tired hands moving. No one act was grand enough to solve the problem alone, but each small kindness made the next one easier. A carpenter shaped the rails, grandparents tied colorful ribbons, and the gardeners planted mint along the path. By sunset a new bridge curved across the water, stronger and prettier than the one before. Tara stepped onto the planks and realized the bridge had been built from more than wood and rope. It had been built from kind hands, thoughtful hearts, and the joy of helping without waiting to be asked.",
    panels: createPanels("story_kindness_bridge", "adventure", "storybook-cartoon", [
      {
        title: "The Washed Away Bridge",
        text: "After a storm, the bridge to the school garden disappears, and the village worries about how the children will cross the stream.",
      },
      {
        title: "Tara Starts Small",
        text: "Tara carries a basket of rope to the riverbank, deciding that even a tiny helpful step matters.",
      },
      {
        title: "Help Begins to Grow",
        text: "One by one, neighbors bring stones, bread, tools, songs, and cheerful energy to help each other.",
      },
      {
        title: "The Bridge Takes Shape",
        text: "The carpenter fits new rails while grandparents tie ribbons and children pass along what is needed.",
      },
      {
        title: "A Garden Path Again",
        text: "By evening, the new bridge curves beautifully over the stream, leading everyone back toward the garden.",
      },
      {
        title: "Kind Hands Everywhere",
        text: "Tara understands that the strongest part of the bridge is the kindness everyone shared while building it.",
      },
    ]),
    origin: "seeded",
    createdAt: "2026-04-18T00:00:00.000Z",
    updatedAt: "2026-04-18T00:00:00.000Z",
    status: "ready",
  },
  {
    id: "story_moon_laddoo",
    title: "Moonlight Laddoo Mystery",
    summary: "A bedtime adventure where soft clues and giggles help a family find a missing treat.",
    category: "Bedtime",
    level: 2,
    language: "hindi",
    mode: "adventure",
    stylePreset: "cozy-anime",
    voicePreset: "warm-parent",
    coverAccent: "#dfe7ff",
    coverImageUrl: "/images/stories/moonlight-laddoo-mystery.png",
    prompt: "A cozy bedtime mystery about a missing laddoo.",
    fullText:
      "One sleepy night, a silver moonbeam slipped into Nani's kitchen just as everyone noticed that the last laddoo from the brass tin was missing. Instead of worrying, little Meher decided to become a moonlight detective. She found a tiny trail of sweet crumbs near the window, a round smudge on the floor, and one giggly cat hiding under the table. Nani followed with a lantern, Dadu hummed a detective tune, and together they tiptoed through the courtyard where jasmine flowers nodded in the breeze. Behind the tulsi pot they discovered not a thief, but a baby monkey clutching the laddoo and looking terribly embarrassed. Meher knelt down and offered half of her own biscuit, and the monkey carefully set the laddoo back into her hands. Everyone laughed so softly that even the moon seemed to giggle. Nani cut the laddoo into tiny pieces and shared it with the family before bed. Meher fell asleep proud of her gentle mystery solving, knowing that kindness can finish even the sweetest little adventure.",
    panels: createPanels("story_moon_laddoo", "adventure", "cozy-anime", [
      {
        title: "The Missing Laddoo",
        text: "At bedtime, the family discovers that the very last laddoo has disappeared from the brass tin.",
      },
      {
        title: "Detective Meher",
        text: "Meher becomes a moonlight detective and follows a tiny trail of crumbs near the window.",
      },
      {
        title: "Clues in the Courtyard",
        text: "With Nani and Dadu nearby, Meher tiptoes into the courtyard while jasmine flowers sway in the breeze.",
      },
      {
        title: "A Shy Guest",
        text: "Behind the tulsi pot, a baby monkey holds the laddoo and looks more embarrassed than naughty.",
      },
      {
        title: "Kindness Solves It",
        text: "Meher offers a biscuit, and the monkey carefully returns the laddoo without any fuss.",
      },
      {
        title: "Sweet Dreams",
        text: "The laddoo is shared into tiny pieces, and everyone heads to bed with quiet giggles and soft hearts.",
      },
    ]),
    origin: "seeded",
    createdAt: "2026-04-18T00:00:00.000Z",
    updatedAt: "2026-04-18T00:00:00.000Z",
    status: "ready",
  },
  {
    id: "story_number_garden",
    title: "The Number Garden",
    summary: "A playful counting story where every flower patch unlocks a tiny math surprise.",
    category: "Math Stories",
    level: 3,
    language: "english",
    mode: "educational",
    stylePreset: "minimal-pastel",
    voicePreset: "playful-friend",
    coverAccent: "#fde3ef",
    coverImageUrl: "/images/stories/the-number-garden.png",
    prompt: "Explain early counting through a cheerful flower garden.",
    fullText:
      "When Pihu stepped into the Number Garden, the gate whispered, \"Count kindly, and every patch will bloom.\" In the first patch she found one sunflower standing tall like a tiny golden lighthouse. In the next patch there were two butterflies fluttering above two pink roses. Soon she counted three busy bees, four smooth pebbles around a pond, and five tiny mushrooms under a fern umbrella. Each time she counted slowly, the garden answered by opening another path. Pihu learned that numbers are not just symbols on a page. They help us notice how many things are around us, how groups can grow, and how patterns appear. By the end of the walk, she had counted all the way to ten and back again while the flowers swayed proudly around her. When she left the garden, she no longer felt that numbers were stiff or scary. They felt like friendly little helpers that could turn the whole world into a colorful puzzle waiting to be understood.",
    panels: createPanels("story_number_garden", "educational", "minimal-pastel", [
      {
        title: "The Whispering Gate",
        text: "Pihu enters the Number Garden, where the gate promises that careful counting will make every patch bloom.",
      },
      {
        title: "One and Two",
        text: "She counts one sunflower and then two butterflies floating above two pink roses.",
      },
      {
        title: "Three and Four",
        text: "Next come three bees and four pebbles, each group helping her see what numbers really mean.",
      },
      {
        title: "Five Tiny Mushrooms",
        text: "Under a fern umbrella, five little mushrooms pop up like a cheerful counting chorus.",
      },
      {
        title: "Counting Opens Paths",
        text: "Every time Pihu counts slowly, another colorful path opens deeper into the garden.",
      },
      {
        title: "Numbers as Helpers",
        text: "Pihu leaves smiling because numbers now feel like helpful friends rather than scary symbols.",
      },
    ]),
    origin: "seeded",
    createdAt: "2026-04-18T00:00:00.000Z",
    updatedAt: "2026-04-18T00:00:00.000Z",
    status: "ready",
  },
];

export const seededStories: StorySummary[] = seededStoryRecords.map((story) => ({
  id: story.id,
  title: story.title,
  summary: story.summary,
  category: story.category,
  level: story.level,
  language: story.language,
  mode: story.mode,
  stylePreset: story.stylePreset,
  voicePreset: story.voicePreset,
  coverAccent: story.coverAccent,
  coverImageUrl: story.coverImageUrl,
}));

export function getStoryOfTheDay(): StorySummary {
  return seededStories[0];
}

export function getSeededStoryById(id: string): StoryRecord | undefined {
  return seededStoryRecords.find((story) => story.id === id);
}
