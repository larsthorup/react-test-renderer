import { test, expect, describe, assertType } from 'vitest';
import type { Instance, Node, TextInstance } from './instance.js';
import {
  byProps,
  byText,
  byType,
  find,
  findAll,
  isInstance,
} from './instance.js';

const leafText = { text: 'Hello, world!' };
const leaf = { type: 'b', props: {}, children: [leafText] };
const child1 = {
  type: 'span',
  props: { className: 'primary', style: { color: 'red', padding: '2px' } },
  children: [leaf],
};
const child2 = {
  type: 'span',
  props: {
    className: 'secondary',
    ariaLabel: 'Hello, world!',
    style: { color: 'blue' },
  },
  children: [{ text: 'Hello, world!' }],
};
const root: Node = {
  type: 'div',
  props: { onClick: () => {} },
  children: [child1, child2],
};

describe(isInstance.name, () => {
  test('Instance', () => {
    const instance: Node = { type: 'div', props: {}, children: [] };
    expect(isInstance(instance)).toBe(true);
    assertType<Instance>(instance);
    expect(instance.type).toBe('div');
  });

  test('TextInstance', () => {
    const textInstance: Node = { text: 'Hello, world!' };
    expect(isInstance(textInstance)).toBe(false);
    assertType<TextInstance>(textInstance);
    expect(textInstance.text).toBe('Hello, world!');
  });
});

describe(find.name, () => {
  test('root', () => {
    const instance = find(root, byType('div'));
    expect(instance).toBe(root);
  });
  test('child', () => {
    const instance = find(root, byType('span'));
    expect(instance).toBe(child1);
  });
  test('leaf', () => {
    const instance = find(root, byType('b'));
    expect(instance).toBe(leaf);
  });
  test('first', () => {
    const instance = find(root, byType('span'));
    expect(instance).toBe(child1);
  });
});

describe(findAll.name, () => {
  test('none', () => {
    const instances = findAll(root, byType('a'));
    expect(instances).toEqual([]);
  });

  test('one', () => {
    const instances = findAll(root, byType('b'));
    expect(instances).toEqual([leaf]);
  });

  test('all', () => {
    const instances = findAll(root, byType('span'));
    expect(instances).toEqual([child1, child2]);
  });
});

describe(byText.name, () => {
  test('found', () => {
    const instance = find(root, byText('Hello, world!'));
    expect(instance).toBe(leaf);
  });

  test('not found', () => {
    const instance = find(root, byText('Goodbye, world!'));
    expect(instance).toBe(undefined);
  });
});

describe(byProps.name, () => {
  test('subset of props', () => {
    const instance = find(root, byProps({ className: 'primary' }));
    expect(instance).toBe(child1);
  });

  test('all props', () => {
    const instance = find(
      root,
      byProps({ className: 'secondary', ariaLabel: 'Hello, world!' }),
    );
    expect(instance).toBe(child2);
  });

  test('missing props', () => {
    const instance = find(root, byProps({ className: 'tertiary' }));
    expect(instance).toBe(undefined);
  });

  test('subset of sub props', () => {
    const instance = find(root, byProps({ style: { color: 'blue' } }));
    expect(instance).toBe(child2);
  });

  test('all sub props', () => {
    const instance = find(
      root,
      byProps({ style: { color: 'red', padding: '2px' } }),
    );
    expect(instance).toBe(child1);
  });

  test('missing sub props', () => {
    const instance = find(root, byProps({ style: { color: 'orange' } }));
    expect(instance).toBe(undefined);
  });
});
