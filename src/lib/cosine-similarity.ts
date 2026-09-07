export function cosineSimilarity(
  a: number[],
  b: number[]
) {
  if (
    !a.length ||
    !b.length
  ) {
    return 0;
  }

  if (
    a.length !==
    b.length
  ) {
    return 0;
  }

  const dot =
    a.reduce(
      (
        sum,
        value,
        index
      ) =>
        sum +
        value *
          b[index],
      0
    );

  const magnitudeA =
    Math.sqrt(
      a.reduce(
        (
          sum,
          value
        ) =>
          sum +
          value *
            value,
        0
      )
    );

  const magnitudeB =
    Math.sqrt(
      b.reduce(
        (
          sum,
          value
        ) =>
          sum +
          value *
            value,
        0
      )
    );

  if (
    magnitudeA === 0 ||
    magnitudeB === 0
  ) {
    return 0;
  }

  return (
    dot /
    (
      magnitudeA *
      magnitudeB
    )
  );
}