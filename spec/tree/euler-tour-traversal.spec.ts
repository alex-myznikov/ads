import {
  EulerTourTreeTraversal,
  GeneralTree,
  LinkedBinaryTree,
} from 'ads';
import * as chai from 'chai';

describe('EulerTourTreeTraversal', function() {
  let generalTree: GeneralTree<string>;
  let binaryTree: LinkedBinaryTree<string>;

  beforeEach(() => {
    generalTree = new GeneralTree();
    generalTree.addRoot('root element');
    binaryTree = new LinkedBinaryTree();
    binaryTree.addRoot('root element');
  });

  describe('traverseGeneral()', function() {
    it('should apply Euler Tour traversal algorithm on general trees', () => {
      const position = generalTree.getRoot()!;
      const result = [] as Array<string | number>;
      const traversal = new EulerTourTreeTraversal<string, void, GeneralTree<string>>((
        element,
        meta,
        getPosition,
        tree,
      ) => {
        if (element === '2nd child element' && meta.phase === 'post') tree.remove(getPosition());
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
        'grand child element', 2,
        'child element', 1,
        '2nd child element', 3,
        '2nd grand child element', 4,
        '2nd grand child element', 4,
        '3rd child element', 5,
        '3rd child element', 5,
        'root element', 0,
      ]);
    });

    it('should set up meta parameters for the tour', () => {
      const traversal = new EulerTourTreeTraversal<string, void>((_element, meta) => {
        chai.expect(meta.index).to.equal(0);
        chai.expect(meta.depth).to.equal(0);
        chai.expect(meta.path).to.be.empty;
        chai.expect(meta.results).to.be.empty;
      });

      generalTree.traverse(traversal);
    });

    it('should return accumulated result of the tour', () => {
      const position = generalTree.getRoot()!;
      const traversal = new EulerTourTreeTraversal<string, number>((element, meta) => {
        if (meta.phase !== 'post') return 0;

        return meta.results.reduce((acc, cur) => acc + cur, element.length);
      });

      generalTree.addChild(generalTree.addChild(position, 'child element'), 'grand child element');
      generalTree.addChild(position, '2nd child element');
      chai.expect(generalTree.traverse(traversal)).to.equal(61);
    });

    it('should increment depth meta parameter when passing through layers', () => {
      const position = generalTree.getRoot()!;
      const result = [] as number[];
      const traversal = new EulerTourTreeTraversal((_element, meta) => result.push(meta.depth));

      generalTree.addChild(generalTree.addChild(position, 'child element'), 'grand child element');
      generalTree.addChild(position, '2nd child element');
      generalTree.traverse(traversal);
      chai.expect(result).to.eql([0, 1, 2, 2, 1, 1, 1, 0]);
    });

    it('should store path to the currently traversed element in the tree', () => {
      const position = generalTree.getRoot()!;
      const traversal = new EulerTourTreeTraversal((element, meta) => {
        switch (element) {
          case 'root element':
            chai.expect(meta.path).to.eql([]);
            break;
          case 'child element':
            chai.expect(meta.path).to.eql([0]);
            break;
          case 'grand child element':
            chai.expect(meta.path).to.eql([0, 0]);
            break;
          case '2nd child element':
            chai.expect(meta.path).to.eql([1]);
            break;
        }
      });

      generalTree.addChild(generalTree.addChild(position, 'child element'), 'grand child element');
      generalTree.addChild(position, '2nd child element');
      generalTree.traverse(traversal);
    });
  });

  describe('traverseBinary()', function() {
    it('should apply Euler Tour traversal algorithm on binary trees', () => {
      const position = binaryTree.getRoot()!;
      const result = [] as Array<string | number>;
      const traversal = new EulerTourTreeTraversal<string, void, LinkedBinaryTree<string>>((
        element,
        meta,
        getPosition,
        tree,
      ) => {
        if (element === 'grand child element' && meta.phase === 'pre') tree.remove(getPosition());
        else result.push(getPosition().element, meta.index);
      });

      binaryTree.addLeft(binaryTree.addLeft(position, 'child element'), 'grand child element');
      binaryTree.addRight(binaryTree.addRight(position, '2nd child element'), '2nd grand child element');
      binaryTree.traverse(traversal);
      chai.expect(result).to.eql([
        'root element', 0,
        'child element', 1,
        'grand child element', 2,
        'grand child element', 2,
        'child element', 1,
        'child element', 1,
        'root element', 0,
        '2nd child element', 3,
        '2nd child element', 3,
        '2nd grand child element', 4,
        '2nd grand child element', 4,
        '2nd grand child element', 4,
        '2nd child element', 3,
        'root element', 0,
      ]);
    });

    it('should set up meta parameters for the tour', () => {
      const traversal = new EulerTourTreeTraversal<string, void>((_element, meta) => {
        chai.expect(meta.index).to.equal(0);
        chai.expect(meta.depth).to.equal(0);
        chai.expect(meta.path).to.be.empty;
        chai.expect(meta.results).to.be.empty;
      });

      binaryTree.traverse(traversal);
    });

    it('should return accumulated result of the tour', () => {
      const position = binaryTree.getRoot()!;
      const traversal = new EulerTourTreeTraversal<string, number>((element, meta) => {
        if (meta.phase !== 'post') return 0;

        return meta.results.reduce((acc, cur) => acc + cur, element.length);
      });

      binaryTree.addLeft(binaryTree.addLeft(position, 'child element'), 'grand child element');
      binaryTree.addRight(position, '2nd child element');
      chai.expect(binaryTree.traverse(traversal)).to.equal(61);
    });

    it('should increment depth meta parameter when passing through layers', () => {
      const position = binaryTree.getRoot()!;
      const result = [] as number[];
      const traversal = new EulerTourTreeTraversal((_element, meta) => result.push(meta.depth));

      binaryTree.addLeft(binaryTree.addLeft(position, 'child element'), 'grand child element');
      binaryTree.addRight(position, '2nd child element');
      binaryTree.traverse(traversal);
      chai.expect(result).to.eql([0, 1, 2, 2, 2, 1, 1, 0, 1, 1, 1, 0]);
    });

    it('should store path to the currently traversed element in the tree', () => {
      const position = binaryTree.getRoot()!;
      const traversal = new EulerTourTreeTraversal((element, meta) => {
        switch (element) {
          case 'root element':
            chai.expect(meta.path).to.eql([]);
            break;
          case 'child element':
            chai.expect(meta.path).to.eql([0]);
            break;
          case 'grand child element':
            chai.expect(meta.path).to.eql([0, 0]);
            break;
          case '2nd child element':
            chai.expect(meta.path).to.eql([1]);
            break;
        }
      });

      binaryTree.addLeft(binaryTree.addLeft(position, 'child element'), 'grand child element');
      binaryTree.addRight(position, '2nd child element');
      binaryTree.traverse(traversal);
    });
  });
});
