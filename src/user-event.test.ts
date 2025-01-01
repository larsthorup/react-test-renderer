import { describe, expect, it, vi } from 'vitest';
import { invokeEventHandler } from './user-event.js';

describe(invokeEventHandler.name, () => {
  it('should throw if node is not provided', async () => {
    await expect(invokeEventHandler('onClick', undefined, {})).rejects.toThrow(
      'click: node is required',
    );
  });

  it('should throw if handler is not a function', async () => {
    const node = { type: 'div', props: {}, children: [] };
    await expect(invokeEventHandler('onClick', node, {})).rejects.toThrow(
      'click: props.onClick is not a function',
    );
  });

  it('should call the handler with props', async () => {
    const handler = vi.fn();
    const props = { some: 'props' };
    const node = { type: 'div', props: { onClick: handler }, children: [] };
    await invokeEventHandler('onClick', node, props);
    expect(handler).toHaveBeenCalledWith(props);
  });
});
