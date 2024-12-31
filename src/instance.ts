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

type NodePredicate = (node: Node) => boolean;

export function find(
  node: Node,
  predicate: NodePredicate,
): Instance | undefined {
  if (!isInstance(node)) return undefined;
  if (predicate(node)) {
    return node;
  }
  for (const child of node.children) {
    const found = find(child, predicate);
    if (found) {
      return found;
    }
  }
}

export function findAll(node: Node, predicate: NodePredicate): Instance[] {
  const found = [];
  if (isInstance(node)) {
    if (predicate(node)) {
      found.push(node);
    }
    for (const child of node.children) {
      found.push(...findAll(child, predicate));
    }
  }
  return found;
}

export const byType = (type: string) => (node: Node) =>
  isInstance(node) && node.type === type;

export const byText = (text: string) => (node: Node) =>
  isInstance(node) &&
  node.children[0] !== undefined &&
  !isInstance(node.children[0]) &&
  node.children[0].text === text;

export const byProps = (props: Instance['props']) => (node: Node) => {
  if (isInstance(node)) {
    for (const key in props) {
      if (
        typeof node.props[key] === 'object' &&
        typeof props[key] === 'object' &&
        node.props[key] !== null &&
        props[key] !== null
      ) {
        const value = node.props[key] as Record<string, object>;
        return Object.entries(props[key]).every(
          ([subKey, subValue]) => value[subKey] === subValue,
        );
      } else if (node.props[key] !== props[key]) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
};
