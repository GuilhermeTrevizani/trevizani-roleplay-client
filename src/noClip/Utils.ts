namespace Utils {
  export const Rad2Deg = 180 / Math.PI;

  export function clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max);
  }
}

export default Utils;