import {
  IBinaryTreeTraversable,
  IGeneralTreeTraversable,
  TreeTraversalAbstract,
} from './traversal.class';
import { IContainer } from '../container.interface';
import { IStructure } from '../structure.interface';
import { TreeAbstract } from './tree.class';

/**
 * Implementation of a inorder tree traversal.
 */
export class InorderTreeTraversal<T, TR extends TreeAbstract<T, IContainer<T>, IStructure> = TreeAbstract<T>>
  extends TreeTraversalAbstract<T, void, TR> {

  traverseBinary(traversable: IBinaryTreeTraversable<T, TR>) {
    let traversableChild = traversable.getLeft();

    if (traversableChild) this.traverseBinary(traversableChild);
    this.callback(traversable.element, { index: traversable.index }, traversable.getPosition, traversable.tree);
    traversableChild = traversable.getRight();
    if (traversableChild) this.traverseBinary(traversableChild);
  }

  traverseGeneral(traversable: IGeneralTreeTraversable<T, TR>) {
    let parentVisited = false;

    for (const child of traversable.getChildren()) {
      this.traverseGeneral(child);

      if (!parentVisited) {
        this.callback(traversable.element, { index: traversable.index }, traversable.getPosition, traversable.tree);
        parentVisited = true;
      }
    }

    if (!parentVisited)
      this.callback(traversable.element, { index: traversable.index }, traversable.getPosition, traversable.tree);
  }

}
