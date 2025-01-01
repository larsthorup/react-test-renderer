import { describe, expect, test, vi } from 'vitest';
import { click, submit, TestRenderer } from './index.js';

describe(TestRenderer.name, () => {
  test(TestRenderer.create.name, async () => {
    const renderer = await TestRenderer.create(<div>Hello World</div>);
    expect(renderer.findByText('Hello World')).toBe(renderer.root.children[0]);
  });
});

test(submit.name, async () => {
  const handler = vi.fn();
  const props = { some: 'props' };
  const node = { type: 'div', props: { onClick: handler }, children: [] };
  await click(node, props);
  expect(handler).toHaveBeenCalledWith(props);
});
