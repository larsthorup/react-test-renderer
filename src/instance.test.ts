import { test, expect } from 'vitest';
import { isInstance, type Instance, type Node } from './instance.js';

test(isInstance.name, () => {
  const instance: Node = { type: 'div', props: {}, children: [] };
  expect(isInstance(instance)).toBe(true);
  expect(instance.type).toBe('div');

  const textInstance: Node = { text: 'Hello, world!' };
  expect(isInstance(textInstance)).toBe(false);
  expect(textInstance.text).toBe('Hello, world!');
});
