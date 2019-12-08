import { GeneralTree, LinkedBinaryTree, PreorderTreeTraversal } from 'ads';
import * as chai from 'chai';

describe('PreorderTreeTraversal', function() {
  let generalTree: GeneralTree<string>;
  let binaryTree: LinkedBinaryTree<string>;

  beforeEach(() => {
    generalTree = new GeneralTree();
    generalTree.addRoot('root element');
    binaryTree = new LinkedBinaryTree();
    binaryTree.addRoot('root element');
  });

  it('should apply preorder traverse algorithm on general trees', () => {
    const position = generalTree.getRoot()!;
    const result = [] as Array<string | number>;
    const traversal = new PreorderTreeTraversal<string, GeneralTree<string>>((element, meta, getPosition, tree) => {
      if (element === '2nd child element') tree.remove(getPosition());
      else result.push(getPosition().element, meta.index);
    });

    generalTree.addChild(generalTree.addChild(position, 'child element'), 'grand child element');
    generalTree.addChild(generalTree.addChild(position, '2nd child element'), '2nd grand child element');
    generalTree.addChild(position, '3rd child element');
    generalTree.traverse(traversal);
    chai.expect(result).to.eql([
      'root element', 0,
      'child element', 1,
      'grand child element', 2,
      '2nd grand child element', 4,
      '3rd child element', 5,
    ]);
  });

  it('should apply preorder traverse algorithm on binary trees', () => {
    const position = binaryTree.getRoot()!;
    const result = [] as Array<string | number>;
    const traversal = new PreorderTreeTraversal<string, LinkedBinaryTree<string>>((
      element,
      meta,
      getPosition,
      tree,
    ) => {
      if (element === 'grand child element') tree.remove(getPosition());
      else result.push(getPosition().element, meta.index);
    });

    binaryTree.addLeft(binaryTree.addLeft(position, 'child element'), 'grand child element');
    binaryTree.addRight(binaryTree.addRight(position, '2nd child element'), '2nd grand child element');
    binaryTree.traverse(traversal);
    chai.expect(result).to.eql([
      'root element', 0,
      'child element', 1,
      '2nd child element', 3,
      '2nd grand child element', 4,
    ]);
  });
});
