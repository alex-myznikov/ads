import { RelinkableBinaryTree } from 'src/trees/relinkable-binary.tree.class';
import * as chai from 'chai';

describe('RelinkableBinaryTree', function() {
  let tree: RelinkableBinaryTree<string>;

  beforeEach(() => {
    tree = new RelinkableBinaryTree();
    tree.addRoot('root element');
  });

  describe('rotate()', function() {
    it('should rotate a node in the tree on the left side around its parent', function() {
      const parent = tree.getRoot()!;
      const child = tree.addLeft(parent, 'child element');

      tree.rotate(child);
      chai.expect(tree.areEqual(tree.getRight(child)!, parent)).to.be.true;
      chai.expect(tree.areEqual(tree.getParent(parent)!, child)).to.be.true;
    });

    it('should reassing the right subtree if rotation is on the left side', function() {
      const parent = tree.getRoot()!;
      const child = tree.addLeft(parent, 'child element');

      tree.rotate(child);
      chai.expect(tree.getLeft(parent)).to.be.undefined;
      tree.rotate(parent);

      const grandChild = tree.addRight(child, 'grand child element');

      tree.rotate(child);
      chai.expect(tree.areEqual(tree.getLeft(parent)!, grandChild)).to.be.true;
      chai.expect(tree.areEqual(tree.getParent(grandChild)!, parent)).to.be.true;
    });

    it('should rotate a node in the tree on the right side around its parent', function() {
      const parent = tree.getRoot()!;
      const child = tree.addRight(parent, 'child element');

      tree.rotate(child);
      chai.expect(tree.areEqual(tree.getLeft(child)!, parent)).to.be.true;
      chai.expect(tree.areEqual(tree.getParent(parent)!, child)).to.be.true;
    });

    it('should reassing the left subtree if rotation is on the right side', function() {
      const parent = tree.getRoot()!;
      const child = tree.addRight(parent, 'child element');

      tree.rotate(child);
      chai.expect(tree.getRight(parent)).to.be.undefined;
      tree.rotate(parent);

      const grandChild = tree.addLeft(child, 'grand child element');

      tree.rotate(child);
      chai.expect(tree.areEqual(tree.getRight(parent)!, grandChild)).to.be.true;
      chai.expect(tree.areEqual(tree.getParent(grandChild)!, parent)).to.be.true;
    });

    it('should reassign relations with the grand parent', function() {
      const parent = tree.getRoot()!;
      const child = tree.addLeft(parent, 'child element');
      const grandChild = tree.addLeft(child, 'grand child element');

      tree.rotate(grandChild);

      chai.expect(tree.areEqual(tree.getLeft(parent)!, grandChild)).to.be.true;
      chai.expect(tree.areEqual(tree.getParent(grandChild)!, parent)).to.be.true;
    });

    it('should throw if trying to rotate element that has no parent', function() {
      chai.expect(tree.rotate.bind(tree, tree.getRoot()!)).to.throw('Node has no parent');
    });
  });

  describe('restructure()', function() {
    it('should restructure double-left relation around the middle node', function() {
      const parent = tree.getRoot()!;
      const child = tree.addLeft(parent, 'child element');
      const grandChild = tree.addLeft(child, 'grand child element');

      tree.restructure(grandChild);
      chai.expect(tree.areEqual(tree.getRight(child)!, parent)).to.be.true;
      chai.expect(tree.areEqual(tree.getLeft(child)!, grandChild)).to.be.true;
    });

    it('should restructure double-right relation around the middle node', function() {
      const parent = tree.getRoot()!;
      const child = tree.addRight(parent, 'child element');
      const grandChild = tree.addRight(child, 'grand child element');

      tree.restructure(grandChild);
      chai.expect(tree.areEqual(tree.getLeft(child)!, parent)).to.be.true;
      chai.expect(tree.areEqual(tree.getRight(child)!, grandChild)).to.be.true;
    });

    it('should restructure left-right relation around the grand child node', function() {
      const parent = tree.getRoot()!;
      const child = tree.addLeft(parent, 'child element');
      const grandChild = tree.addRight(child, 'grand child element');

      tree.restructure(grandChild);
      chai.expect(tree.areEqual(tree.getRight(grandChild)!, parent)).to.be.true;
      chai.expect(tree.areEqual(tree.getLeft(grandChild)!, child)).to.be.true;
    });

    it('should restructure right-left relation around the grand child node', function() {
      const parent = tree.getRoot()!;
      const child = tree.addRight(parent, 'child element');
      const grandChild = tree.addLeft(child, 'grand child element');

      tree.restructure(grandChild);
      chai.expect(tree.areEqual(tree.getLeft(grandChild)!, parent)).to.be.true;
      chai.expect(tree.areEqual(tree.getRight(grandChild)!, child)).to.be.true;
    });

    it('should throw if trying to call restructure on element that has no parent', function() {
      chai.expect(tree.restructure.bind(tree, tree.getRoot()!)).to.throw('Node has no parent');
    });

    it('should throw if trying to call restructure on element that has no grand parent', function() {
      const child = tree.addRight(tree.getRoot()!, 'child element');

      chai.expect(tree.restructure.bind(tree, child)).to.throw('Node has no grand parent');
    });
  });
});
