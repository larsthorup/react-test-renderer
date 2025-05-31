import { act } from 'react';
import ReactReconciler from 'react-reconciler';
import {
  ConcurrentRoot,
  DefaultEventPriority,
} from 'react-reconciler/constants.js';

import {
  byProps,
  byText,
  byType,
  find,
  findAll,
  type Instance,
  type Predicate,
  type TextInstance,
} from './instance.js';
import type { TransitionStatus } from './react-reconciler-compat.js';

type Container = ReactReconciler.OpaqueRoot;

interface HostConfig {
  type: string;
  props: Instance['props'];
  container: Container;
  instance: Instance;
  textInstance: TextInstance;
  suspenseInstance: Instance;
  hydratableInstance: never;
  publicInstance: Instance | TextInstance;
  hostContext: unknown;
  updatePayload: never;
  childSet: never;
  timeoutHandle: number | undefined;
  noTimeout: -1;
}

const reconciler = ReactReconciler<
  HostConfig['type'],
  HostConfig['props'],
  HostConfig['container'],
  HostConfig['instance'],
  HostConfig['textInstance'],
  HostConfig['suspenseInstance'],
  HostConfig['hydratableInstance'],
  HostConfig['publicInstance'],
  HostConfig['hostContext'],
  HostConfig['updatePayload'],
  HostConfig['childSet'],
  HostConfig['timeoutHandle'],
  HostConfig['noTimeout'],
  TransitionStatus
>({
  supportsMutation: true,
  createInstance(type, props) {
    const { children, ...propsCleaned } = props;
    return {
      type,
      props: propsCleaned,
      children: [],
    };
  },
  createTextInstance(text) {
    return { text };
  },
  appendChildToContainer(container, child) {
    container.children.push(child);
  },
  removeChildFromContainer(container, child) {},
  appendChild(parent, child) {
    if (!child) return;
    parent.children.push(child);
  },
  appendInitialChild(parent, child) {
    if (!child) return;
    parent.children.push(child);
  },
  removeChild(parent, child) {
    if (!child) return;
    parent.children.splice(parent.children.indexOf(child), 1);
  },
  insertBefore(parent, child, beforeChild) {
    if (!child || !beforeChild) return;
    parent.children.splice(parent.children.indexOf(beforeChild), 0, child);
  },
  hideInstance() {},
  unhideInstance() {},
  commitUpdate(
    instance,
    // updatePayload,
    type,
    oldProps,
    newProps,
    // finishedWork
  ) {
    instance.props = newProps;
  },
  commitTextUpdate(textInstance, oldText, newText) {
    textInstance.text = newText;
  },
  finalizeInitialChildren() {
    return false;
  },
  getChildHostContext(parentHostContext) {
    return parentHostContext;
  },
  getPublicInstance(instance) {
    return instance;
  },
  // @ts-expect-error TODO: figure out the typing issue here
  getRootHostContext() {
    return {};
  },
  prepareForCommit() {
    return null;
  },
  resetAfterCommit() {},
  shouldSetTextContent() {
    return false;
  },
  getCurrentUpdatePriority() {
    return DefaultEventPriority;
  },
  resolveUpdatePriority() {
    return DefaultEventPriority;
  },
  setCurrentUpdatePriority() {},
  clearContainer() {},
  maySuspendCommit() {
    return false;
  },
  // @ts-expect-error TODO: figure out the typing issue here
  HostTransitionContext: {},
});

function createContainer(containerInfo: Instance) {
  const tag = ConcurrentRoot;
  const hydrationCallbacks = null;
  const isStrictMode = false;
  const concurrentUpdatesByDefaultOverride = null;
  const identifierPrefix = '';
  const onRecoverableError = console.error;
  const transitionCallbacks = null;
  const container = reconciler.createContainer(
    containerInfo,
    tag,
    hydrationCallbacks,
    isStrictMode,
    concurrentUpdatesByDefaultOverride,
    identifierPrefix,
    onRecoverableError,
    transitionCallbacks,
  );
  container.onUncaughtError = (error: unknown) => {
    console.error(error);
  };
  return container;
}

export class TestRenderer {
  root: Instance;

  constructor() {
    this.root = { type: '', props: {}, children: [] };
  }

  static async create(element: React.ReactNode) {
    const renderer = new TestRenderer();
    const container = createContainer(renderer.root);
    await act(async () => {
      reconciler.updateContainer(element, container, null, null);
    });
    return renderer;
  }

  find(predicate: Predicate) {
    return find(this.root, predicate);
  }

  findByType(type: string) {
    return find(this.root, byType(type));
  }

  findByProps(props: Instance['props']) {
    return find(this.root, byProps(props));
  }

  findByText(text: string) {
    return find(this.root, byText(text));
  }

  findAll(predicate: Predicate) {
    return findAll(this.root, predicate);
  }

  findAllByType(type: string) {
    findAll(this.root, byType(type));
  }

  findAllByProps(props: Instance['props']) {
    return findAll(this.root, byProps(props));
  }

  findAllByText(text: string) {
    return findAll(this.root, byText(text));
  }
}
