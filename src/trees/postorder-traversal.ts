import {
  IBinaryTreeTraversable,
  IGeneralTreeTraversable,
  TreeTraversalAbstract,
} from './traversal.class';
import { IContainer } from '../container.interface';
import { IStructure } from '../structure.interface';
import { TreeAbstract } from './tree.class';

/**
 * Tree traversal algorithm that on each level of a tree visits root after traversing all its subtrees.
 */
export class PostorderTreeTraversal<T, TR extends TreeAbstract<T, IContainer<T>, IStructure> = TreeAbstract<T>>
  extends TreeTraversalAbstract<T, void, TR> {

  traverseBinary(traversable: IBinaryTreeTraversable<T, TR>) {
    let traversableChild = traversable.getLeft();

    if (traversableChild) this.traverseBinary(traversableChild);
    traversableChild = traversable.getRight();
    if (traversableChild) this.traverseBinary(traversableChild);
    this.callback(traversable.element, { index: traversable.index }, traversable.getPosition, traversable.tree);
  }

  traverseGeneral(traversable: IGeneralTreeTraversable<T, TR>) {
    for (const child of traversable.getChildren()) this.traverseGeneral(child);
    this.callback(traversable.element, { index: traversable.index }, traversable.getPosition, traversable.tree);
  }

}
