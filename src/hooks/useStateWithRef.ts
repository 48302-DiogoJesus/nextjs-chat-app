import { useRef, useState } from "react";

// Re-renders parent component on value changed
export function useStateHotValue<T>(initialValue: T): [
  T,
  () => T,
  (value: T) => void,
] {
  const ref = useRef<T>(initialValue);
  const [_, forceRender] = useState(false);

  return [
    // gets "snapshot" on render
    ref.current,
    // gets hot value whenever called. should be used on callbacks/event handlers
    () => ref.current,
    // setter. causes re-render
    (value: T) => {
      ref.current = value;
      forceRender((b) => !b);
    },
  ];
}

// Does not re-render parent component on value changed
export function useRefHotValue<T>(initialValue: T): [
  T,
  () => T,
  (value: T) => void,
] {
  const ref = useRef<T>(initialValue);

  return [
    // gets "snapshot" on render
    ref.current,
    // gets hot value whenever called. should be used on callbacks/event handlers
    () => ref.current,
    // setter. causes re-render
    (value: T) => {
      ref.current = value;
    },
  ];
}
