// types.ts
export type Column<T> = {
  key: keyof T;
  title: string;
  flex?: number; // ✅ responsive width
  minWidth?: number; // ✅ fallback width
  render?: (item: T) => React.ReactNode;
};
