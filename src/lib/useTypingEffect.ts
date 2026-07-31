import { useEffect, useState } from 'react';

/** Cycles through words with a typing/erasing effect. */
export function useTypingEffect(words: string[], typeSpeed = 90, eraseSpeed = 45, pause = 1600) {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [erasing, setErasing] = useState(false);

  useEffect(() => {
    if (!words.length) return;
    const current = words[index % words.length];

    let timeout: ReturnType<typeof setTimeout>;

    if (!erasing && text === current) {
      timeout = setTimeout(() => setErasing(true), pause);
    } else if (erasing && text === '') {
      setErasing(false);
      setIndex((i) => (i + 1) % words.length);
    } else {
      timeout = setTimeout(
        () => {
          setText((prev) =>
            erasing ? current.slice(0, prev.length - 1) : current.slice(0, prev.length + 1)
          );
        },
        erasing ? eraseSpeed : typeSpeed
      );
    }

    return () => clearTimeout(timeout);
  }, [text, erasing, index, words, typeSpeed, eraseSpeed, pause]);

  return text;
}
