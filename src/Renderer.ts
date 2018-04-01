import { Stats } from "fast-stats";

const NS_PER_MILLI = 1e6;

let maxLength = 0;
function fixedNsToMs(ns: number) {
  const value = (ns / NS_PER_MILLI).toFixed(3);
  maxLength = Math.max(value.length, maxLength);
  return " ".repeat(maxLength - value.length) + value;
}

import { terminal } from "terminal-kit";

export class Renderer {
  constructor() {
    terminal.clear().hideCursor();
  }

  public write(name: string, line: number, stats: Stats) {
    terminal.moveTo(1, line)(
      `${name} ` +
        `mean ${fixedNsToMs(stats.amean())} ` +
        `p95 ${fixedNsToMs(stats.percentile(95))} ` +
        `p99 ${fixedNsToMs(stats.percentile(99))} ` +
        `count=${stats.length}`
    );
  }
}
