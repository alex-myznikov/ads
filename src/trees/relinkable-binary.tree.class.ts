import { LinkedBinaryTree, Node } from './linked-binary-tree.class';
import { Position } from '../position.class';

/**
 * Implementation of a relinkable binary tree.
 */
export class RelinkableBinaryTree<T> extends LinkedBinaryTree<T> {

  constructor() {
    super();
  }

  /**
   * Links the specified nodes to each other making them a parent-child pair.
   *
   * @param parent Node to become a parent.
   * @param child Node to become a child.
   * @param left Whether to add child as a left.
   */
  protected relink(parent: Node<T>, child?: Node<T>, left = false) {
    if (left) parent.left = child;
    else parent.right = child;
    if (child) child.parent = parent;
  }

  /**
   * Rotates position in the tree above its parent.
   *
   * @param position Position in the tree.
   */
  rotate(position: Position<T, Node<T>>) {
    const [node, parentNode, grandParentNode] = this.trackNodes(position);

    if (!parentNode) throw new Error('Node has no parent');

    if (!grandParentNode) {
      this.structure.root = node;
      delete node.parent;
    } else this.relink(grandParentNode, node, parentNode === grandParentNode.left);

    if (node === parentNode.left) {
      this.relink(parentNode, node.right, true);
      this.relink(node, parentNode);
    } else {
      this.relink(parentNode, node.left);
      this.relink(node, parentNode, true);
    }
  }

  /**
   * Performs trinode restructuring of the specified position with its ancestors.
   *
   * @param position Position in the tree.
   * @returns Position which is root of the subtree after restructuring.
   */
  restructure(position: Position<T, Node<T>>): Position<T, Node<T>> {
    const [node, parentNode, grandParentNode] = this.trackNodes(position);

    if (!parentNode) throw new Error('Node has no parent');
    else if (!grandParentNode) throw new Error('Node has no grand parent');

    if (node === parentNode.right && parentNode === grandParentNode.right ||
      node === parentNode.left && parentNode === grandParentNode.left) {
      const parent = this.structure.createPosition(parentNode);

      this.rotate(parent);

      return parent;
    }

    this.rotate(position);
    this.rotate(position);

    return position;
  }

  /**
   * Walks up the tree starting from the specified position and collects up to three consecutive nodes in it.
   *
   * @protected
   * @param position Position in the tree.
   * @returns Triplet of nodes related as grandparent-parent-child.
   */
  protected trackNodes(position: Position<T, Node<T>>): [Node<T>, Node<T>?, Node<T>?] {
    const node = this.structure.validate(position);
    const parentNode = node.parent;
    const grandParentNode = parentNode ? parentNode.parent : parentNode;

    return [node, parentNode, grandParentNode];
  }

}
