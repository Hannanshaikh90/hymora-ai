export function shouldSaveMemory(
  message: string
) {
  const lower =
    message.toLowerCase();

  const memoryTriggers = [
    "my name is",
    "i am",
    "i'm",

    "i live in",

    "my goal is",

    "my startup",

    "my business",

    "i prefer",

    "remember that",

    "from now on",

    "my company",

    "my agency",

    "favorite",
    "favourite",

    "i use",
    "we use",

    "i work with",

    "my tech stack",

    "building",
    "currently building",

    "our startup",
    "our product",
  ];

  return memoryTriggers.some(
    (trigger) =>
      lower.includes(
        trigger
      )
  );
}