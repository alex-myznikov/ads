import { ADSError } from '../errors';
import { BinaryTree } from './binary-tree.class';
import { IContainer } from '../container.interface';
import { LinkedTreeStructure } from './linked-tree-structure.class';
import { Position } from '../position.class';
import { PreorderTreeTraversal } from './preorder-traversal';
import { TreeTraversalAbstract, IBinaryTreeTraversable, ITraversalMetadata } from './traversal.class';

/**
 * Stores element and basic structure of a binary tree.
 */
export class Node<T> implements IContainer<T> {

  /**
   * Reference to the node's left child.
   */
  left?: Node<T>;

  /**
   * Reference to the node's right child.
   */
  right?: Node<T>;

  /**
   * Reference to the node's parent.
   */
  parent?: Node<T>;

  /**
   * Stores metadata for this node for various use-cases.
   */
  meta?: { [key: string]: any };

  /**
   * Creates an instance of Node.
   *
   * @param element Element of the tree.
   * @param left Reference to the node's left child.
   * @param right Reference to the node's right child.
   * @param parent Reference to the node's parent.
   */
  constructor(
    public element: T,
    { left, right, parent, ...meta }: { left?: Node<T>, right?: Node<T>, parent?: Node<T>, [key: string]: any } = {},
  ) {
    if (left) this.left = left;
    if (right) this.right = right;
    if (parent) this.parent = parent;
    if (Object.keys(meta).length) this.meta = meta;
  }

}

/**
 * Implementation of a linked binary tree.
 */
export class LinkedBinaryTree<T> extends BinaryTree<T, Position<T, Node<T>>, LinkedTreeStructure<T, Node<T>>> {

  constructor() {
    super(new LinkedTreeStructure((node: Node<T>) => node.parent === node));
  }

  addLeft(position: Position<T, Node<T>>, element: T): Position<T, Node<T>> {
    const parent = this.structure.validate(position);

    if (parent.left) throw new ADSError('Left child already exists');

    parent.left = new Node(element, { parent });
    this.structure.size++;

    return this.structure.createPosition(parent.left);
  }

  addRight(position: Position<T, Node<T>>, element: T): Position<T, Node<T>> {
    const parent = this.structure.validate(position);

    if (parent.right) throw new ADSError('Right child already exists');

    parent.right = new Node(element, { parent });
    this.structure.size++;

    return this.structure.createPosition(parent.right);
  }

  addRoot(element: T): Position<T, Node<T>> {
    if (!this.isEmpty()) throw new ADSError('Root already exists');

    this.structure.root = new Node(element);
    this.structure.size++;

    return this.structure.createPosition(this.structure.root);
  }

  areEqual(a: Position<T, Node<T>>, b: Position<T, Node<T>>): boolean {
    return this.structure.validate(a) === this.structure.validate(b);
  }

  attachLeft(position: Position<T, Node<T>>, tree: this) {
    const parent = this.structure.validate(position);

    if (parent.left) throw new ADSError('Left child already exists');

    const root = tree.getRoot();

    if (root) {
      parent.left = Object.assign(root._internal.node, { parent });
      this.structure.size += tree.length;
      tree.clear(true);
    }
  }

  attachRight(position: Position<T, Node<T>>, tree: this) {
    const parent = this.structure.validate(position);

    if (parent.right) throw new ADSError('Right child already exists');

    const root = tree.getRoot();

    if (root) {
      parent.right = Object.assign(root._internal.node, { parent });
      this.structure.size += tree.length;
      tree.clear(true);
    }
  }

  /**
   * Clears the tree. If instant set TRUE it takes O(1) time but does not deprecate the existing positions.
   *
   * @param instant TRUE to deprecate all existing positions, FALSE to skip deprecation (client code cares of it).
   */
  clear(instant = false) {
    if (!instant) {
      this.traverse(new PreorderTreeTraversal((_element, _index, getPosition) => {
        const node = getPosition()._internal.node;

        node.parent = node;
      }));
    }

    super.clear();
  }

  /**
   * Creates binary traversable representation of an element of the tree.
   *
   * @protected
   * @param node Instance of a node containing the element.
   * @param meta Traversal process metadata.
   * @returns Binary tree traversable element representation.
   */
  protected createBinaryTraversable(
    node: Node<T>,
    meta: { index: number },
  ): IBinaryTreeTraversable<T, LinkedBinaryTree<T>> {
    const tree = this;

    return {
      element: node.element,
      getLeft() {
        if (node.left) return tree.createBinaryTraversable(node.left, meta);
      },
      getRight() {
        if (node.right) return tree.createBinaryTraversable(node.right, meta);
      },
      getPosition() {
        return tree.structure.createPosition(node);
      },
      get index() {
        return meta.index++;
      },
      tree,
    };
  }

  *getChildren(position: Position<T, Node<T>>): IterableIterator<Position<T, Node<T>>> {
    const node = this.structure.validate(position);

    if (node.left) yield this.structure.createPosition(node.left);
    if (node.right) yield this.structure.createPosition(node.right);
  }

  getLeft(position: Position<T, Node<T>>): Position<T, Node<T>> | undefined {
    const node = this.structure.validate(position).left;

    return node ? this.structure.createPosition(node) : node;
  }

  getNumChildren(position: Position<T, Node<T>>): number {
    const node = this.structure.validate(position);
    let count = 0;

    if (node.left) count++;
    if (node.right) count++;

    return count;
  }

  getParent(position: Position<T, Node<T>>): Position<T, Node<T>> | undefined {
    const node = this.structure.validate(position).parent;

    return node ? this.structure.createPosition(node) : node;
  }

  getRight(position: Position<T, Node<T>>): Position<T, Node<T>> | undefined {
    const node = this.structure.validate(position).right;

    return node ? this.structure.createPosition(node) : node;
  }

  getRoot(): Position<T, Node<T>> | undefined {
    const root = this.structure.root;

    return root ? this.structure.createPosition(root) : root;
  }

  getSibling(position: Position<T, Node<T>>): Position<T, Node<T>> | undefined {
    const node = this.structure.validate(position);
    const parent = node.parent;

    if (!parent) return;
    else if (parent.left === node && parent.right) return this.structure.createPosition(parent.right);
    else if (parent.right === node && parent.left) return this.structure.createPosition(parent.left);
  }

  hasLeft(position: Position<T, Node<T>>): boolean {
    const node = this.structure.validate(position).left;

    return Boolean(node);
  }

  hasRight(position: Position<T, Node<T>>): boolean {
    const node = this.structure.validate(position).right;

    return Boolean(node);
  }

  hasSibling(position: Position<T, Node<T>>): boolean {
    const node = this.structure.validate(position);
    const parent = node.parent;

    if (!parent) return false;
    else if (parent.left === node) return Boolean(parent.right);

    return Boolean(parent.left);
  }

  isLeftChild(a: Position<T, Node<T>>, b: Position<T, Node<T>>): boolean {
    return this.structure.validate(a) === this.structure.validate(b).left;
  }

  isRightChild(a: Position<T, Node<T>>, b: Position<T, Node<T>>): boolean {
    return this.structure.validate(a) === this.structure.validate(b).right;
  }

  isRoot(position: Position<T, Node<T>>): boolean {
    return this.structure.validate(position) === this.structure.root;
  }

  remove(position: Position<T, Node<T>>): T {
    const node = this.structure.validate(position);
    const parent = node.parent;

    if (node.left && node.right) throw new ADSError('Position has more than one child');

    const child = node.left || node.right;

    if (!parent) this.structure.root = child;
    else if (parent.left === node) parent.left = child;
    else parent.right = child;
    if (child) child.parent = parent;
    node.parent = position._internal.node;
    this.structure.size--;

    return node.element;
  }

  replace(position: Position<T, Node<T>>, element: T): T {
    const node = this.structure.validate(position);
    const replacedElement = node.element;

    node.element = element;

    return replacedElement;
  }

  traverse<R, M extends ITraversalMetadata>(traversal: TreeTraversalAbstract<T, R, LinkedBinaryTree<T>, M>): R {
    const node = this.structure.root;

    if (!node) throw new ADSError('Tree is empty');

    return traversal.traverseBinary(this.createBinaryTraversable(node, { index: 0 }));
  }

}
