import { useRef, useState } from "react";

export function useStateWithRef<T>(initialValue: T) {
  const ref = useRef<T>(initialValue);
  const [_, forceRender] = useState(false);

  return {
    // The "snapshot". Updated on each re-render
    get: ref.current,
    // When called gets the current value referenced by ref.current
    getHot: () => ref.current,
    set: (value: T) => {
      ref.current = value;
      forceRender((b) => !b);
    },
  };
}
