import { act } from 'react';
import type { Instance } from './instance.js';

export async function invokeEventHandler(
  handlerName: string,
  node: Instance | undefined,
  props: Instance['props'],
) {
  if (!node) throw new Error('click: node is required');
  const handler = node.props[handlerName];
  if (typeof handler !== 'function')
    throw new Error(`click: props.${handlerName} is not a function`);
  await act(async () => {
    handler(props);
  });
}

export async function click(node?: Instance, props: Instance['props'] = {}) {
  await invokeEventHandler('onClick', node, props);
}

export async function change(node?: Instance, props: Instance['props'] = {}) {
  await invokeEventHandler('onChange', node, props);
}

export async function submit(node?: Instance, props: Instance['props'] = {}) {
  await invokeEventHandler('onSubmit', node, props);
}
