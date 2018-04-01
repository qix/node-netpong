// tslint:disable:no-console

const NS_PER_SEC = 1e9;

export class Cycle {
  private startTime: [number, number] | null = process.hrtime();

  constructor() {}

  public restart() {
    if (this.startTime !== null) {
      throw new Error('Cycle timer was running');
    }
    this.startTime = process.hrtime();
  }
  public end() {
    if (this.startTime === null) {
      throw new Error('Cycle timer was not running');
    }
    const taken = process.hrtime(this.startTime);
    const takenNs = taken[0] * NS_PER_SEC + taken[1];
    this.startTime = null;

    return takenNs;
  }
}
