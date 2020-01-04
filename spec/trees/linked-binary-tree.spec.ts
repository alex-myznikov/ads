import { LinkedBinaryTree, PreorderTreeTraversal } from 'ads';
import { Node } from 'src/trees/linked-binary-tree.class';
import { Position } from 'src/position.class';
import * as chai from 'chai';

describe('LinkedBinaryTree - Node', function() {
  it('should accept and store arbitrary metadata', function() {
    const node = new Node('element', { some: 'sort of', data: [] });

    chai.expect(node.meta).to.eql({ some: 'sort of', data: [] });
  });

  it('should metadata be undefined by default', function() {
    const node = new Node('element');

    chai.expect(node.meta).to.be.undefined;
  });

  it('should accept structural links to other nodes', function() {
    const left = new Node('left');
    const right = new Node('right');
    const parent = new Node('parent');
    const node = new Node('element', { left, right, parent });

    chai.expect(node.left).to.equal(left);
    chai.expect(node.right).to.equal(right);
    chai.expect(node.parent).to.equal(parent);
  });

  it('should structural links be not defined by default', function() {
    const node = new Node('element');

    chai.expect('left' in node).to.be.false;
    chai.expect('right' in node).to.be.false;
    chai.expect('parent' in node).to.be.false;
  });
});

describe('LinkedBinaryTree', function() {
  const anotherTree = new LinkedBinaryTree<string>();
  const positionFromAnotherTree = anotherTree.addRoot('root element');
  let tree: LinkedBinaryTree<string>;

  beforeEach(() => {
    tree = new LinkedBinaryTree();
    tree.addRoot('root element');
  });

  describe('length', function() {
    it('should return count of elements in the tree', function() {
      chai.expect(tree.length).to.equal(1);
      tree.addLeft(tree.getRoot()!, 'child element');
      chai.expect(tree.length).to.equal(2);
    });
  });

  describe('addLeft()', function() {
    it('should add element as the left child of the specified position in the tree', function() {
      const position = tree.getRoot()!;

      tree.addLeft(position, 'child element');

      chai.expect(tree.getLeft(position)!.element).to.equal('child element');
    });

    it('should return position of the added element', function() {
      const position = tree.addLeft(tree.getRoot()!, 'child element');

      chai.expect(position).to.be.instanceOf(Position);
      chai.expect(position.element).to.equal('child element');
    });

    it('should throw if the specified position already has a left child', function() {
      const position = tree.getRoot()!;

      tree.addLeft(position, 'child element');
      chai.expect(tree.addLeft.bind(tree, position, 'child element')).to.throw('Left child already exists');
    });

    it('should throw if the specified position does not belong to this tree', function() {
      chai.expect(tree.addLeft.bind(tree, positionFromAnotherTree, 'child element')).to
        .throw('Position does not belong to this tree');
    });

    it('should throw if the specified position is deprecated', function() {
      const position = tree.getRoot()!;

      tree.clear();
      chai.expect(tree.addLeft.bind(tree, position)).to.throw('Position is deprecated');
    });

    it('should increment the tree length by one', function() {
      chai.expect(tree.length).to.equal(1);
      tree.addLeft(tree.getRoot()!, 'child element');
      chai.expect(tree.length).to.equal(2);
    });
  });

  describe('addRight()', function() {
    it('should add element as the right child of the specified position in the tree', function() {
      const position = tree.getRoot()!;

      tree.addRight(position, 'child element');

      chai.expect(tree.getRight(position)!.element).to.equal('child element');
    });

    it('should return position of the added element', function() {
      const position = tree.addRight(tree.getRoot()!, 'child element');

      chai.expect(position).to.be.instanceOf(Position);
      chai.expect(position.element).to.equal('child element');
    });

    it('should throw if the specified position already has a right child', function() {
      const position = tree.getRoot()!;

      tree.addRight(position, 'child element');
      chai.expect(tree.addRight.bind(tree, position, 'child element')).to.throw('Right child already exists');
    });

    it('should throw if the specified position does not belong to this tree', function() {
      chai.expect(tree.addRight.bind(tree, positionFromAnotherTree, 'child element')).to
        .throw('Position does not belong to this tree');
    });

    it('should throw if the specified position is deprecated', function() {
      const position = tree.getRoot()!;

      tree.clear();
      chai.expect(tree.addRight.bind(tree, position)).to.throw('Position is deprecated');
    });

    it('should increment the tree length by one', function() {
      chai.expect(tree.length).to.equal(1);
      tree.addRight(tree.getRoot()!, 'child element');
      chai.expect(tree.length).to.equal(2);
    });
  });

  describe('addRoot()', function() {
    it('should add root element to the tree', function() {
      tree.clear();
      tree.addRoot('new root element');
      chai.expect(tree.getRoot()!.element).to.equal('new root element');
    });

    it('should throw if the tree is not empty', function() {
      chai.expect(tree.addRoot.bind(tree, 'new root element')).to
        .throw('Root already exists');
    });

    it('should return position of the added element', function() {
      tree.clear();

      const position = tree.addRoot('new root element');

      chai.expect(position).to.be.instanceOf(Position);
      chai.expect(position.element).to.equal('new root element');
    });

    it('should increment the tree length by one', function() {
      tree.clear();
      chai.expect(tree.length).to.equal(0);
      tree.addRoot('new root element');
      chai.expect(tree.length).to.equal(1);
    });
  });

  describe('areEqual()', function() {
    it('should return true if positions are of the same element node in the tree', function() {
      const position = tree.getRoot();

      chai.expect(tree.areEqual(position!, tree.getRoot()!)).to.be.true;
    });

    it('should return false if positions are not the same', function() {
      const position = tree.addLeft(tree.getRoot()!, 'child element');

      chai.expect(tree.areEqual(position, tree.getRoot()!)).to.be.false;
    });

    it('should throw if one of the specified positions does not belong to this tree', function() {
      chai.expect(tree.areEqual.bind(tree, positionFromAnotherTree, tree.getRoot()!)).to
        .throw('Position does not belong to this tree');
      chai.expect(tree.areEqual.bind(tree, tree.getRoot()!, positionFromAnotherTree)).to
        .throw('Position does not belong to this tree');
    });

    it('should throw if the specified position is deprecated', function() {
      const position = tree.getRoot()!;

      tree.clear();
      chai.expect(tree.areEqual.bind(tree, position!, position!)).to.throw('Position is deprecated');
    });
  });

  describe('clear()', function() {
    it('should clear the tree', function() {
      tree.clear();
      chai.expect(tree.getRoot()).to.be.undefined;
    });

    it('should not deprecate existing positions if instant is TRUE', function() {
      const position = tree.getRoot()!;
      const childPosition = tree.addLeft(position, 'child element');

      tree.clear(true);
      chai.expect(tree.getChildren(position).next().value.element).to.be.equal(childPosition.element);
    });

    it('should deprecate existing positions if instant is FALSE', function() {
      const position = tree.getRoot()!;

      tree.clear();
      chai.expect(tree.getNumChildren.bind(tree, position)).to.throw('Position is deprecated');
    });

    it('should reduce the tree length to 0', function() {
      chai.expect(tree.length).to.equal(1);
      tree.clear();
      chai.expect(tree.length).to.equal(0);
    });
  });

  describe('getChildren()', function() {
    it('should iterate through all children positions of the specified position in the tree', function() {
      const position = tree.getRoot()!;

      chai.expect(tree.getChildren(position).next().done).to.be.true;
      tree.addLeft(position, 'child element');
      tree.addRight(position, 'another child element');
      chai.expect(Array.from(tree.getChildren(position)).map(ch => ch.element)).to
        .eql(['child element', 'another child element']);
    });

    it('should not iterate through the nested levels', function() {
      const position = tree.getRoot()!;

      tree.addLeft(tree.addLeft(position, 'child element'), 'another child element');
      chai.expect(tree.getChildren(position).next().value.element).to.equal('child element');
    });

    it('should throw if the specified position does not belong to this tree', function() {
      chai.expect(Array.from.bind(Array, tree.getChildren(positionFromAnotherTree))).to
        .throw('Position does not belong to this tree');
    });

    it('should throw if the specified position is deprecated', function() {
      const position = tree.getRoot()!;

      tree.clear();
      chai.expect(Array.from.bind(Array, tree.getChildren(position))).to.throw('Position is deprecated');
    });
  });

  describe('getDepth()', function() {
    it('should return the number of levels separating the specified position from the root of the tree', function() {
      const position = tree.getRoot()!;
      let child;

      child = tree.addLeft(position, 'child element');
      chai.expect(tree.getDepth(child)).to.equal(1);
      child = tree.addLeft(child, 'grand child element');
      chai.expect(tree.getDepth(child)).to.equal(2);
    });

    it('should return 0 if the specified position is of the root of the tree', function() {
      chai.expect(tree.getDepth(tree.getRoot()!)).to.equal(0);
    });

    it('should throw if the specified position does not belong to this tree', function() {
      chai.expect(tree.getDepth.bind(tree, positionFromAnotherTree)).to
        .throw('Position does not belong to this tree');
    });

    it('should throw if the specified position is deprecated', function() {
      const position = tree.getRoot()!;

      tree.clear();
      chai.expect(tree.getDepth.bind(tree, position)).to.throw('Position is deprecated');
    });
  });

  describe('getHeight()', function() {
    it('should return the maximum number of levels separating the specified position from the deepest leaf of the tree',
      function() {
        const position = tree.getRoot()!;
        let child;

        chai.expect(tree.getHeight(position)).to.equal(0);
        child = tree.addLeft(position, 'child element');
        chai.expect(tree.getHeight(position)).to.equal(1);
        child = tree.addLeft(child, 'grand child element');
        tree.addRight(position, 'another child element');
        chai.expect(tree.getHeight(position)).to.equal(2);
        chai.expect(tree.getHeight(child)).to.equal(0);
      });

    it('should return the height of the entire tree if position is not specified', function() {
      const position = tree.getRoot()!;

      chai.expect(tree.getHeight()).to.equal(0);
      tree.addLeft(tree.addLeft(position, 'child element'), 'grand child element');
      tree.addRight(position, 'another child element');
      chai.expect(tree.getHeight()).to.equal(2);
    });

    it('should return 0 if the tree is empty', function() {
      tree.clear();
      chai.expect(tree.getHeight()).to.equal(0);
    });

    it('should throw if the specified position does not belong to this tree', function() {
      chai.expect(tree.getHeight.bind(tree, positionFromAnotherTree)).to
        .throw('Position does not belong to this tree');
    });

    it('should throw if the specified position is deprecated', function() {
      const position = tree.getRoot()!;

      tree.clear();
      chai.expect(tree.getHeight.bind(tree, position)).to.throw('Position is deprecated');
    });
  });

  describe('getLeft()', function() {
    it('should return undefined if the specified position has no left child', function() {
      const position = tree.getRoot()!;

      chai.expect(tree.getLeft(position)).to.be.undefined;
    });

    it('should return position of the left child of the specified position in the tree', function() {
      const position = tree.getRoot()!;
      const leftChildPosition = tree.addLeft(position, 'child element');

      chai.expect(tree.getLeft(position)).to.be.instanceOf(Position);
      chai.expect(tree.getLeft(position)!.element).to.equal(leftChildPosition.element);
    });

    it('should throw if the specified position does not belong to this tree', function() {
      chai.expect(tree.getLeft.bind(tree, positionFromAnotherTree)).to
        .throw('Position does not belong to this tree');
    });

    it('should throw if the specified position is deprecated', function() {
      const position = tree.getRoot()!;

      tree.clear();
      chai.expect(tree.getLeft.bind(tree, position, 'replacement')).to.throw('Position is deprecated');
    });
  });

  describe('getNumChildren()', function() {
    it('should return count of child elements for the specified position in the tree', function() {
      const position = tree.getRoot()!;

      chai.expect(tree.getNumChildren(position)).to.equal(0);
      tree.addLeft(position, 'child element');
      chai.expect(tree.getNumChildren(position)).to.equal(1);
    });

    it('should count only direct children', function() {
      const position = tree.getRoot()!;
      const childPosition = tree.addLeft(position, 'child element');

      tree.addLeft(childPosition, 'another child element');
      chai.expect(tree.getNumChildren(position)).to.equal(1);
      chai.expect(tree.getNumChildren(childPosition)).to.equal(1);
    });

    it('should throw if the specified position does not belong to this tree', function() {
      chai.expect(tree.getNumChildren.bind(tree, positionFromAnotherTree)).to
        .throw('Position does not belong to this tree');
    });

    it('should throw if the specified position is deprecated', function() {
      const position = tree.getRoot()!;

      tree.clear();
      chai.expect(tree.getNumChildren.bind(tree, position)).to.throw('Position is deprecated');
    });
  });

  describe('getParent()', function() {
    it('should return position of a parent of the specified position', function() {
      const parent = tree.getRoot()!;
      const child = tree.addLeft(parent, 'child element');

      chai.expect(tree.areEqual(parent, tree.getParent(child)!)).to.be.true;
    });

    it('should return undefined if the specified position is of the root of the tree', function() {
      const root = tree.getRoot()!;

      chai.expect(tree.getParent(root)).to.be.undefined;
    });

    it('should throw if the specified position does not belong to this tree', function() {
      chai.expect(tree.getParent.bind(tree, positionFromAnotherTree)).to
        .throw('Position does not belong to this tree');
    });

    it('should throw if the specified position is deprecated', function() {
      const position = tree.getRoot()!;

      tree.clear();
      chai.expect(tree.getParent.bind(tree, position)).to.throw('Position is deprecated');
    });
  });

  describe('getRight()', function() {
    it('should return undefined if the specified position has no right child', function() {
      const position = tree.getRoot()!;

      chai.expect(tree.getRight(position)).to.be.undefined;
    });

    it('should return position of the right child of the specified position in the tree', function() {
      const position = tree.getRoot()!;
      const rightChildPosition = tree.addRight(position, 'child element');

      chai.expect(tree.getRight(position)).to.be.instanceOf(Position);
      chai.expect(tree.getRight(position)!.element).to.equal(rightChildPosition.element);
    });

    it('should throw if the specified position does not belong to this tree', function() {
      chai.expect(tree.getRight.bind(tree, positionFromAnotherTree)).to
        .throw('Position does not belong to this tree');
    });

    it('should throw if the specified position is deprecated', function() {
      const position = tree.getRoot()!;

      tree.clear();
      chai.expect(tree.getRight.bind(tree, position, 'replacement')).to.throw('Position is deprecated');
    });
  });

  describe('getRoot()', function() {
    it('should return undefined if the tree is empty', function() {
      tree.clear();
      chai.expect(tree.getRoot()).to.be.undefined;
    });

    it('should return position of the root element in the tree', function() {
      chai.expect(tree.getRoot()).to.be.instanceOf(Position);
      chai.expect(tree.getRoot()!.element).to.equal('root element');
    });
  });

  describe('getSibling()', function() {
    it('should return undefined if the specified position has no sibling', function() {
      const position = tree.getRoot()!;
      const child = tree.addLeft(position, 'child element');

      chai.expect(tree.getSibling(position)).to.be.undefined;
      chai.expect(tree.getSibling(child)).to.be.undefined;
    });

    it('should return position of the sibling of the specified position in the tree', function() {
      const position = tree.getRoot()!;
      const leftChildPosition = tree.addLeft(position, 'child element');
      const rightChildPosition = tree.addRight(position, 'child element');

      chai.expect(tree.getSibling(leftChildPosition)).to.be.instanceOf(Position);
      chai.expect(tree.getSibling(leftChildPosition)!.element).to.equal(rightChildPosition.element);
      chai.expect(tree.getSibling(rightChildPosition)).to.be.instanceOf(Position);
      chai.expect(tree.getSibling(rightChildPosition)!.element).to.equal(leftChildPosition.element);
    });

    it('should throw if the specified position does not belong to this tree', function() {
      chai.expect(tree.getSibling.bind(tree, positionFromAnotherTree)).to
        .throw('Position does not belong to this tree');
    });

    it('should throw if the specified position is deprecated', function() {
      const position = tree.getRoot()!;

      tree.clear();
      chai.expect(tree.getSibling.bind(tree, position, 'replacement')).to.throw('Position is deprecated');
    });
  });

  describe('hasLeft()', function() {
    it('should return false if the specified position has no right child', function() {
      const position = tree.getRoot()!;
      const child = tree.addRight(position, 'child element');

      chai.expect(tree.hasLeft(position)).to.be.false;
      chai.expect(tree.hasLeft(child)).to.be.false;
    });

    it('should return true if the specified position has right child', function() {
      const position = tree.getRoot()!;

      tree.addLeft(position, 'child element');
      chai.expect(tree.hasLeft(position)).to.be.true;
    });

    it('should throw if the specified position does not belong to this tree', function() {
      chai.expect(tree.hasLeft.bind(tree, positionFromAnotherTree)).to
        .throw('Position does not belong to this tree');
    });

    it('should throw if the specified position is deprecated', function() {
      const position = tree.getRoot()!;

      tree.clear();
      chai.expect(tree.hasLeft.bind(tree, position, 'replacement')).to.throw('Position is deprecated');
    });
  });

  describe('hasRight()', function() {
    it('should return false if the specified position has no right child', function() {
      const position = tree.getRoot()!;
      const child = tree.addLeft(position, 'child element');

      chai.expect(tree.hasRight(position)).to.be.false;
      chai.expect(tree.hasRight(child)).to.be.false;
    });

    it('should return true if the specified position has right child', function() {
      const position = tree.getRoot()!;

      tree.addRight(position, 'child element');
      chai.expect(tree.hasRight(position)).to.be.true;
    });

    it('should throw if the specified position does not belong to this tree', function() {
      chai.expect(tree.hasRight.bind(tree, positionFromAnotherTree)).to
        .throw('Position does not belong to this tree');
    });

    it('should throw if the specified position is deprecated', function() {
      const position = tree.getRoot()!;

      tree.clear();
      chai.expect(tree.hasRight.bind(tree, position, 'replacement')).to.throw('Position is deprecated');
    });
  });

  describe('hasSibling()', function() {
    it('should return false if the specified position has no sibling', function() {
      const position = tree.getRoot()!;
      const child = tree.addLeft(position, 'child element');

      chai.expect(tree.hasSibling(position)).to.be.false;
      chai.expect(tree.hasSibling(child)).to.be.false;
    });

    it('should return true if the specified position has sibling', function() {
      const position = tree.getRoot()!;
      const leftChildPosition = tree.addLeft(position, 'child element');
      const rightChildPosition = tree.addRight(position, 'child element');

      chai.expect(tree.hasSibling(leftChildPosition)).to.be.true;
      chai.expect(tree.hasSibling(rightChildPosition)).to.be.true;
    });

    it('should throw if the specified position does not belong to this tree', function() {
      chai.expect(tree.hasSibling.bind(tree, positionFromAnotherTree)).to
        .throw('Position does not belong to this tree');
    });

    it('should throw if the specified position is deprecated', function() {
      const position = tree.getRoot()!;

      tree.clear();
      chai.expect(tree.hasSibling.bind(tree, position, 'replacement')).to.throw('Position is deprecated');
    });
  });

  describe('isEmpty()', function() {
    it('should return true if the tree is empty', function() {
      tree.clear();
      chai.expect(tree.isEmpty()).to.equal(true);
    });

    it('should return false if the tree has elements', function() {
      chai.expect(tree.isEmpty()).to.equal(false);
    });
  });

  describe('isLeaf()', function() {
    it('should return true if the specified position is of a leaf element in the tree', function() {
      chai.expect(tree.isLeaf(tree.getRoot()!)).to.equal(true);
    });

    it('should return false if the specified position is not of a leaf element in the tree', function() {
      const position = tree.getRoot()!;

      tree.addLeft(position, 'child element');
      chai.expect(tree.isLeaf(position)).to.equal(false);
    });

    it('should throw if the specified position does not belong to this tree', function() {
      chai.expect(tree.isLeaf.bind(tree, positionFromAnotherTree)).to
        .throw('Position does not belong to this tree');
    });

    it('should throw if the specified position is deprecated', function() {
      const position = tree.getRoot()!;

      tree.clear();
      chai.expect(tree.isLeaf.bind(tree, position)).to.throw('Position is deprecated');
    });
  });

  describe('isLeftChild()', function() {
    it(`should return true if the first specified position is of the node that is
      the left child of the node of the second position`, function() {
      const position = tree.getRoot();

      chai.expect(tree.isLeftChild(tree.addLeft(position!, 'child element'), position!)).to.be.true;
    });

    it(`should return false if the first specified position is of the node that is not
      the left child of the node of the second position`, function() {
      const position = tree.getRoot();

      chai.expect(tree.isLeftChild(tree.addRight(position!, 'child element'), position!)).to.be.false;
    });

    it('should throw if one of the specified positions does not belong to this tree', function() {
      chai.expect(tree.isLeftChild.bind(tree, positionFromAnotherTree, tree.getRoot()!)).to
        .throw('Position does not belong to this tree');
      chai.expect(tree.isLeftChild.bind(tree, tree.getRoot()!, positionFromAnotherTree)).to
        .throw('Position does not belong to this tree');
    });

    it('should throw if the specified position is deprecated', function() {
      const position = tree.getRoot()!;

      tree.clear();
      chai.expect(tree.isLeftChild.bind(tree, position!, position!)).to.throw('Position is deprecated');
    });
  });

  describe('isRightChild()', function() {
    it(`should return true if the first specified position is of the node that is
      the right child of the node of the second position`, function() {
      const position = tree.getRoot();

      chai.expect(tree.isRightChild(tree.addRight(position!, 'child element'), position!)).to.be.true;
    });

    it(`should return false if the first specified position is of the node that is not
      the right child of the node of the second position`, function() {
      const position = tree.getRoot();

      chai.expect(tree.isRightChild(tree.addLeft(position!, 'child element'), position!)).to.be.false;
    });

    it('should throw if one of the specified positions does not belong to this tree', function() {
      chai.expect(tree.isRightChild.bind(tree, positionFromAnotherTree, tree.getRoot()!)).to
        .throw('Position does not belong to this tree');
      chai.expect(tree.isRightChild.bind(tree, tree.getRoot()!, positionFromAnotherTree)).to
        .throw('Position does not belong to this tree');
    });

    it('should throw if the specified position is deprecated', function() {
      const position = tree.getRoot()!;

      tree.clear();
      chai.expect(tree.isRightChild.bind(tree, position!, position!)).to.throw('Position is deprecated');
    });
  });

  describe('isRoot()', function() {
    it('should return true if the specified position is of the root element in the tree', function() {
      chai.expect(tree.isRoot(tree.getRoot()!)).to.equal(true);
    });

    it('should return false if the specified position is not of the root element in the tree', function() {
      const position = tree.addLeft(tree.getRoot()!, 'child element');

      chai.expect(tree.isRoot(position)).to.equal(false);
    });

    it('should throw if the specified position does not belong to this tree', function() {
      chai.expect(tree.isRoot.bind(tree, positionFromAnotherTree)).to
        .throw('Position does not belong to this tree');
    });

    it('should throw if the specified position is deprecated', function() {
      const position = tree.getRoot()!;

      tree.clear();
      chai.expect(tree.isRoot.bind(tree, position)).to.throw('Position is deprecated');
    });
  });

  describe('remove()', function() {
    it('should throw if the specified position does not belong to this tree', function() {
      chai.expect(tree.remove.bind(tree, positionFromAnotherTree)).to
        .throw('Position does not belong to this tree');
    });

    it('should throw if the specified position is deprecated', function() {
      const position = tree.getRoot()!;

      tree.clear();
      chai.expect(tree.remove.bind(tree, position)).to.throw('Position is deprecated');
    });

    it('should throw if the specified position has more than one child', function() {
      const position = tree.getRoot()!;

      tree.addLeft(position, 'child element');
      tree.addRight(position, 'child element');
      chai.expect(tree.remove.bind(tree, position)).to.throw('Position has more than one child');
    });

    it('should remove and return element at the specified position from the tree', function() {
      const parent = tree.getRoot()!;
      const child = tree.addRight(parent, 'child element');

      chai.expect(tree.getNumChildren(parent)).to.equal(1);
      chai.expect(tree.remove(child)).to.equal('child element');
      chai.expect(tree.getNumChildren(parent)).to.equal(0);
      chai.expect(tree.remove(parent)).to.equal('root element');
    });

    it('should replace the removed element with its child if it has any', function() {
      const parent = tree.getRoot()!;
      const child = tree.addLeft(parent, 'child element');
      const grandChild = tree.addLeft(child, 'grand child element');

      tree.remove(child);
      chai.expect(tree.areEqual(grandChild, tree.getLeft(parent)!)).to.be.true;
      chai.expect(tree.areEqual(tree.getParent(grandChild)!, parent)).to.be.true;
      tree.remove(parent);
      chai.expect(tree.getRoot()!.element).to.equal('grand child element');
      chai.expect(tree.getParent(grandChild)).to.be.undefined;
    });

    it('should remove the element with no replacement if it has no children', function() {
      const parent = tree.getRoot()!;
      const child = tree.addRight(parent, 'child element');

      tree.remove(child);
      chai.expect(tree.hasRight(parent)).to.be.false;
    });

    it('should decrement the tree length by one', function() {
      chai.expect(tree.length).to.equal(1);
      tree.remove(tree.getRoot()!);
      chai.expect(tree.length).to.equal(0);
    });

    it('should deprecate the removed node', function() {
      const position = tree.getRoot()!;

      tree.remove(position);
      chai.expect(tree.remove.bind(tree, position!)).to.throw('Position is deprecated');
    });
  });

  describe('replace()', function() {
    it('should replace element at the specified position in the tree', function() {
      tree.replace(tree.getRoot()!, 'replacement');
      chai.expect(tree.getRoot()!.element).to.equal('replacement');
    });

    it('should return the replaced element', function() {
      chai.expect(tree.replace(tree.getRoot()!, 'replacement')).to.equal('root element');
    });

    it('should throw if the specified position does not belong to this tree', function() {
      chai.expect(tree.replace.bind(tree, positionFromAnotherTree, 'replacement')).to
        .throw('Position does not belong to this tree');
    });

    it('should throw if the specified position is deprecated', function() {
      const position = tree.getRoot()!;

      tree.clear();
      chai.expect(tree.replace.bind(tree, position, 'replacement')).to.throw('Position is deprecated');
    });

    it('should not change the length of the tree', function() {
      chai.expect(tree.length).to.equal(1);
      tree.replace(tree.getRoot()!, 'replacement');
      chai.expect(tree.length).to.equal(1);
    });
  });

  describe('traverse()', function() {
    it('should apply traverse algorithm on the tree', () => {
      const result = [] as string[];
      const traversal = new PreorderTreeTraversal<string, LinkedBinaryTree<string>>((_element, _index, getPosition) => {
        result.push(getPosition().element);
      });

      tree.addLeft(tree.getRoot()!, 'child element');
      tree.traverse(traversal);
      chai.expect(result).to.eql(['root element', 'child element']);
    });

    it('should throw an error if the tree is empty', () => {
      const traversal = new PreorderTreeTraversal<string, LinkedBinaryTree<string>>(element => element);

      tree.clear();
      chai.expect(tree.traverse.bind(tree, traversal)).to.throw('Tree is empty');
    });

    it('should correctly increment index of a traversable', () => {
      const position = tree.getRoot()!;
      const result = [] as Array<string | number>;
      const traversal = new PreorderTreeTraversal<string, LinkedBinaryTree<string>>((element, meta) => {
        result.push(element, meta.index);
      });

      tree.addLeft(tree.addLeft(position, 'child element'), 'grand child element');
      tree.addRight(position, 'another child element');
      tree.traverse(traversal);
      chai.expect(result).to.eql([
        'root element', 0,
        'child element', 1,
        'grand child element', 2,
        'another child element', 3,
      ]);
    });
  });
});
