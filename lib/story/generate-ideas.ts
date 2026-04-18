import type { StoryIdeaRequest } from "@/lib/types/story";

const educationalTopics = [
  "the solar system",
  "ambulances",
  "plants growing",
  "honesty",
  "being helpful",
  "rain and clouds",
];

const adventureHooks = [
  "a glowing map under a pillow",
  "a talking parrot in a forest",
  "a moonlit train that only children can see",
  "a tiny village hidden in a banyan tree",
  "a kite that remembers the wind",
];

export function generateIdeas(request: StoryIdeaRequest): string[] {
  const agePhrase = request.level <= 3 ? "little child" : request.level <= 6 ? "young child" : "growing reader";
  const childName = request.childContext?.name;

  if (request.mode === "educational") {
    return educationalTopics.slice(0, 5).map((topic) => {
      const lead = childName ? `Help ${childName} understand` : "Explain";
      return `${lead} ${topic} through a gentle story for a ${agePhrase}.`;
    });
  }

  return adventureHooks.slice(0, 5).map((hook, index) => {
    if (childName && index % 2 === 0) {
      return `${childName} discovers ${hook} and learns something brave and kind along the way.`;
    }

    return `A story about ${hook} that feels magical, warm, and perfect for a ${agePhrase}.`;
  });
}
