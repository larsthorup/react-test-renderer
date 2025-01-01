import { describe, expect, test } from 'vitest';
import { TestRenderer } from './react-test-renderer.js';

describe(TestRenderer.name, () => {
  test(TestRenderer.create.name, async () => {
    const renderer = await TestRenderer.create(<div>Hello World</div>);
    expect(renderer.root.children).toEqual([
      {
        type: 'div',
        props: {},
        children: [
          {
            text: 'Hello World',
          },
        ],
      },
    ]);
  });
});
