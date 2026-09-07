export function shouldForgetMemory(
  message: string
) {
  const lower =
    message.toLowerCase();

  const forgetTriggers = [
    "forget my",
    "forget that",
    "delete memory",
    "remove memory",
    "remove that",
  ];

  return forgetTriggers.some(
    (trigger) =>
      lower.includes(trigger)
  );
}