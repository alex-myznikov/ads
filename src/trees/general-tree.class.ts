import { IContainer } from '../container.interface';
import { LinkedTreeStructure } from './linked-tree-structure.class';
import { Position } from '../position.class';
import { PreorderTreeTraversal } from './preorder-traversal';
import { TreeAbstract } from './tree.class';
import { TreeTraversalAbstract, IGeneralTreeTraversable, ITraversalMetadata } from './traversal.class';

/**
 * Stores element and basic structure of a tree.
 */
export class Node<T> implements IContainer<T> {

  /**
   * Creates an instance of Node.
   *
   * @param element Element of the tree.
   * @param children Reference to an array of the node's children.
   * @param parent Reference to the node's parent.
   */
  constructor(public element: T, public children: Node<T>[] = [], public parent?: Node<T>) { }

}

/**
 * Implementation of a general tree.
 */
export class GeneralTree<T> extends TreeAbstract<T, Position<T, Node<T>>, LinkedTreeStructure<T, Node<T>>> {

  constructor() {
    super(new LinkedTreeStructure((node: Node<T>) => node.parent === node));
  }

  /**
   * Adds child element to parent element at the specified position.
   *
   * @param position Position of the parent element.
   * @param element Element to add.
   * @returns Position of the added element.
   */
  addChild(position: Position<T, Node<T>>, element: T): Position<T, Node<T>> {
    const node = this.structure.validate(position);
    const childNode = new Node(element, [], node);

    node.children.push(childNode);
    this.structure.size++;

    return this.structure.createPosition(childNode);
  }

  /**
   * Adds the specified element at the root of the tree. Throws an error if the tree is not empty.
   *
   * @param element Element to add.
   * @returns Position of the added element.
   */
  addRoot(element: T): Position<T, Node<T>> {
    if (!this.isEmpty()) throw new Error('Root already exists');

    this.structure.root = new Node(element);
    this.structure.size++;

    return this.structure.createPosition(this.structure.root);
  }

  // attach(position: P, trees: this[]) { ... } TODO: realization and tests

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
   * Creates general traversable representation of an element of the tree.
   *
   * @protected
   * @param node Instance of a node containing the element.
   * @param meta Traversal process metadata.
   * @returns General tree traversable element representation.
   */
  protected createGeneralTraversable(
    node: Node<T>,
    meta: { index: number },
  ): IGeneralTreeTraversable<T, GeneralTree<T>> {
    const tree = this;

    return {
      element: node.element,
      *getChildren() {
        for (const child of node.children) yield tree.createGeneralTraversable(child, meta);
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
    for (const child of this.structure.validate(position).children) yield this.structure.createPosition(child);
  }

  getNumChildren(position: Position<T, Node<T>>): number {
    return this.structure.validate(position).children.length;
  }

  getParent(position: Position<T, Node<T>>): Position<T, Node<T>> | undefined {
    const node = this.structure.validate(position).parent;

    return node ? this.structure.createPosition(node) : node;
  }

  getRoot(): Position<T, Node<T>> | undefined {
    const root = this.structure.root;

    return root ? this.structure.createPosition(root) : root;
  }

  isRoot(position: Position<T, Node<T>>): boolean {
    return this.structure.validate(position) === this.structure.root;
  }

  /**
   * Removes element from the tree by position and returns it. Throws an error if the position is not valid
   * or has more than one child.
   *
   * @param position Position of the element.
   * @returns Removed element.
   */
  remove(position: Position<T, Node<T>>): T {
    const node = this.structure.validate(position);
    const parent = node.parent;
    const child = node.children[0];

    if (node.children.length > 1) throw new Error('Position has more than one child');
    else if (parent) {
      const index = parent.children.indexOf(node);

      if (child) parent.children[index] = child;
      else parent.children.splice(index, 1);
    } else this.structure.root = child;
    node.parent = position._internal.node;
    this.structure.size--;

    return node.element;
  }

  /**
   * Replaces element at the specified position.
   *
   * @param position Position of an element.
   * @param element Element to replace the existing with.
   * @returns Replaced element.
   */
  replace(position: Position<T, Node<T>>, element: T): T {
    const node = this.structure.validate(position);
    const replacedElement = node.element;

    node.element = element;

    return replacedElement;
  }

  traverse<R, M extends ITraversalMetadata>(traversal: TreeTraversalAbstract<T, R, GeneralTree<T>, M>): R {
    const node = this.structure.root;

    if (!node) throw new Error('Tree is empty');

    return traversal.traverseGeneral(this.createGeneralTraversable(node, { index: 0 }));
  }

}
