export interface TextInstance {
  text: string;
}

export interface Instance {
  type: string;
  children: Node[];
  props: Record<string, unknown>;
}

export type Node = Instance | TextInstance;

export function isInstance(node: Node): node is Instance {
  return 'type' in node;
}

type Predicate = (instance: Instance) => boolean;

export function find(
  instance: Instance,
  predicate: Predicate,
): Instance | undefined {
  if (predicate(instance)) {
    return instance;
  }
  for (const child of instance.children) {
    if (isInstance(child)) {
      const found = find(child, predicate);
      if (found) {
        return found;
      }
    }
  }
}

export function findAll(instance: Instance, predicate: Predicate): Instance[] {
  const found = [];
  if (predicate(instance)) {
    found.push(instance);
  }
  for (const child of instance.children) {
    if (isInstance(child)) {
      found.push(...findAll(child, predicate));
    }
  }
  return found;
}

export const byType = (type: string) => (instance: Instance) =>
  instance.type === type;

export const byText = (text: string) => (instance: Instance) =>
  instance.children[0] !== undefined &&
  !isInstance(instance.children[0]) &&
  instance.children[0].text === text;

export const byProps = (props: Instance['props']) => (instance: Instance) => {
  for (const key in props) {
    if (
      typeof instance.props[key] === 'object' &&
      typeof props[key] === 'object' &&
      instance.props[key] !== null &&
      props[key] !== null
    ) {
      const value = instance.props[key] as Record<string, object>;
      return Object.entries(props[key]).every(
        ([subKey, subValue]) => value[subKey] === subValue,
      );
    } else if (instance.props[key] !== props[key]) {
      return false;
    }
  }
  return true;
};
