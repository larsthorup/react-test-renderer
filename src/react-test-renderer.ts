import type { Instance } from './instance.js';

export class TestRenderer {
  root: Instance;

  constructor() {
    this.root = { type: '', props: {}, children: [] };
  }

  static async create(/* element: React.ReactNode */) {
    const renderer = new TestRenderer();
    return renderer;
  }
}
