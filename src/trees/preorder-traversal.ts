import {
  IBinaryTreeTraversable,
  IGeneralTreeTraversable,
  TreeTraversalAbstract,
} from './traversal.class';
import { IContainer } from '../container.interface';
import { IStructure } from '../queues';
import { TreeAbstract } from './tree.class';

/**
 * Implementation of a preorder tree traversal.
 */
export class PreorderTreeTraversal<T, TR extends TreeAbstract<T, IContainer<T>, IStructure> = TreeAbstract<T>>
  extends TreeTraversalAbstract<T, void, TR> {

  traverseBinary(traversable: IBinaryTreeTraversable<T, TR>) {
    let traversableChild;

    this.callback(traversable.element, { index: traversable.index }, traversable.getPosition, traversable.tree);
    traversableChild = traversable.getLeft();
    if (traversableChild) this.traverseBinary(traversableChild);
    traversableChild = traversable.getRight();
    if (traversableChild) this.traverseBinary(traversableChild);
  }

  traverseGeneral(traversable: IGeneralTreeTraversable<T, TR>) {
    this.callback(traversable.element, { index: traversable.index }, traversable.getPosition, traversable.tree);
    for (const child of traversable.getChildren()) this.traverseGeneral(child);
  }

}
