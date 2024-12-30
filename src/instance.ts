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
