import { GeneralTree, PreorderTreeTraversal } from 'ads';
import { InorderTreeTraversal } from 'src/trees/inorder-traversal';
import { Node } from 'src/trees/general-tree.class';
import { Position } from 'src/position.class';
import * as chai from 'chai';

describe('GeneralTree - Node', function() {
  it('should accept structural links to other nodes', function() {
    const first = new Node('first');
    const second = new Node('second');
    const parent = new Node('parent');
    const node = new Node('element', [first, second], parent);

    chai.expect(node.children).to.eql([first, second]);
    chai.expect(node.parent).to.equal(parent);
  });

  it('should structural links be not defined by default', function() {
    const node = new Node('element');

    chai.expect('_children' in node).to.be.false;
    chai.expect('parent' in node).to.be.false;
  });
});

describe('GeneralTree', function() {
  const positionFromAnotherTree = new GeneralTree<string>().addRoot('root element');
  let tree: GeneralTree<string>;

  beforeEach(() => {
    tree = new GeneralTree();
    tree.addRoot('root element');
  });

  describe('length', function() {
    it('should return count of elements in the tree', function() {
      chai.expect(tree.length).to.equal(1);
      tree.addChild(tree.getRoot()!, 'child element');
      chai.expect(tree.length).to.equal(2);
    });
  });

  describe('addChild()', function() {
    it('should add element to the end of the specified position children list in the tree', function() {
      const position = tree.getRoot()!;

      tree.addChild(position, 'child element');
      tree.addChild(position, 'another child element');

      chai.expect(Array.from(tree.getChildren(position)).map(ch => ch.element)).to
        .eql(['child element', 'another child element']);
    });

    it('should return position of the added element', function() {
      const position = tree.addChild(tree.getRoot()!, 'child element');

      chai.expect(position).to.be.instanceOf(Position);
      chai.expect(position.element).to.equal('child element');
    });

    it('should throw if the specified position does not belong to this tree', function() {
      chai.expect(tree.addChild.bind(tree, positionFromAnotherTree, 'child element')).to
        .throw('Position does not belong to this tree');
    });

    it('should throw if the specified position is deprecated', function() {
      const position = tree.getRoot()!;

      tree.clear();
      chai.expect(tree.addChild.bind(tree, position)).to.throw('Position is deprecated');
    });

    it('should increment the tree length by one', function() {
      chai.expect(tree.length).to.equal(1);
      tree.addChild(tree.getRoot()!, 'child element');
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
      const position = tree.addChild(tree.getRoot()!, 'child element');

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

  describe('attach()', function() {
    let firstTree: GeneralTree<string>;
    let secondTree: GeneralTree<string>;
    let result: string[];
    const traversal = new InorderTreeTraversal<string, GeneralTree<string>>(element => {
      result.push(element);
    });

    beforeEach(() => {
      firstTree = new GeneralTree<string>();
      secondTree = new GeneralTree<string>();
      firstTree.addChild(firstTree.addRoot('firstRoot'), 'firstChild');
      secondTree.addChild(secondTree.addRoot('secondRoot'), 'secondChild');
      result = [];
    });

    it('should add roots of the attached trees to the end of the specified position children list', function() {
      const position = tree.getRoot()!;

      tree.attach(position, firstTree, secondTree);
      tree.traverse(traversal);
      chai.expect(result).to.eql(['firstChild', 'firstRoot', 'root element', 'secondChild', 'secondRoot']);
    });

    it('should update parent link in attached roots properly', function() {
      const position = tree.getRoot()!;
      const firstTreeRoot = firstTree.getRoot()!;

      tree.attach(position, firstTree);
      chai.expect(firstTreeRoot._internal.node.parent).to.eql(position._internal.node);
    });

    it('should not attach the same tree several times', function() {
      const position = tree.getRoot()!;

      tree.attach(position, firstTree, firstTree);
      tree.traverse(traversal);
      chai.expect(result).to.eql(['firstChild', 'firstRoot', 'root element']);
    });

    it('should throw if the specified position does not belong to this tree', function() {
      chai.expect(tree.attach.bind(tree, positionFromAnotherTree)).to
        .throw('Position does not belong to this tree');
    });

    it('should throw if the specified position is deprecated', function() {
      const position = tree.getRoot()!;

      tree.clear();
      chai.expect(tree.attach.bind(tree, position)).to.throw('Position is deprecated');
    });

    it('should increment the tree length by the sum of lengths of the attached trees', function() {
      const position = tree.getRoot()!;

      chai.expect(tree.length).to.equal(1);
      tree.attach(position, firstTree, secondTree);
      chai.expect(tree.length).to.equal(5);
    });

    // TODO: to docs -> 'positions from the attached tree does not get invalidated by default
    // so you have to take care about them by yourself'
  });

  describe('clear()', function() {
    it('should clear the tree', function() {
      tree.clear();
      chai.expect(tree.getRoot()).to.be.undefined;
    });

    it('should not deprecate existing positions if instant is TRUE', function() {
      const position = tree.getRoot()!;
      const childPosition = tree.addChild(position, 'child element');

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
      tree.addChild(position, 'child element');
      tree.addChild(position, 'another child element');
      chai.expect(Array.from(tree.getChildren(position)).map(ch => ch.element)).to
        .eql(['child element', 'another child element']);
    });

    it('should not iterate through the nested levels', function() {
      const position = tree.getRoot()!;

      tree.addChild(tree.addChild(position, 'child element'), 'another child element');
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

      child = tree.addChild(position, 'child element');
      chai.expect(tree.getDepth(child)).to.equal(1);
      child = tree.addChild(child, 'grand child element');
      chai.expect(tree.getDepth(child)).to.equal(2);
    });

    it('should return 0 if the specified position is of the root of the tree', function() {
      chai.expect(tree.getDepth(tree.getRoot()!)).to.equal(0);
    });

    it('should throw if the specified position does not belong to this tree', function() {
      chai.expect(tree.getHeight.bind(tree, positionFromAnotherTree)).to
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
        child = tree.addChild(position, 'child element');
        chai.expect(tree.getHeight(position)).to.equal(1);
        child = tree.addChild(child, 'grand child element');
        tree.addChild(position, 'another child element');
        chai.expect(tree.getHeight(position)).to.equal(2);
        chai.expect(tree.getHeight(child)).to.equal(0);
      });

    it('should return the height of the entire tree if position is not specified', function() {
      const position = tree.getRoot()!;

      chai.expect(tree.getHeight()).to.equal(0);
      tree.addChild(tree.addChild(position, 'child element'), 'grand child element');
      tree.addChild(position, 'another child element');
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

  describe('getNumChildren()', function() {
    it('should return count of child elements for the specified position in the tree', function() {
      const position = tree.getRoot()!;

      chai.expect(tree.getNumChildren(position)).to.equal(0);
      tree.addChild(position, 'child element');
      chai.expect(tree.getNumChildren(position)).to.equal(1);
    });

    it('should count only direct children', function() {
      const position = tree.getRoot()!;
      const childPosition = tree.addChild(position, 'child element');

      tree.addChild(childPosition, 'another child element');
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
      const child = tree.addChild(parent, 'child element');

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

      tree.addChild(position, 'child element');
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

  describe('isRoot()', function() {
    it('should return true if the specified position is of the root element in the tree', function() {
      chai.expect(tree.isRoot(tree.getRoot()!)).to.equal(true);
    });

    it('should return false if the specified position is not of the root element in the tree', function() {
      const position = tree.addChild(tree.getRoot()!, 'child element');

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

      tree.addChild(position, 'child element');
      tree.addChild(position, 'child element');
      chai.expect(tree.remove.bind(tree, position)).to.throw('Position has more than one child');
    });

    it('should remove and return element at the specified position from the tree', function() {
      const parent = tree.getRoot()!;
      const child = tree.addChild(parent, 'child element');

      chai.expect(tree.getNumChildren(parent)).to.equal(1);
      chai.expect(tree.remove(child)).to.equal('child element');
      chai.expect(tree.getNumChildren(parent)).to.equal(0);
      chai.expect(tree.remove(parent)).to.equal('root element');
    });

    it('should replace the removed element with its child if it has any', function() {
      const parent = tree.getRoot()!;
      const child = tree.addChild(parent, 'child element');
      const grandChild = tree.addChild(child, 'grand child element');

      tree.remove(child);
      chai.expect(tree.areEqual(grandChild, tree.getChildren(parent).next().value)).to.be.true;
      chai.expect(tree.areEqual(tree.getParent(grandChild)!, parent)).to.be.true;
      tree.remove(parent);
      chai.expect(tree.getRoot()!.element).to.equal('grand child element');
      chai.expect(tree.getParent(grandChild)).to.be.undefined;
    });

    it('should remove the element with no replacement if it has no children', function() {
      const parent = tree.getRoot()!;
      const child = tree.addChild(parent, 'child element');

      tree.remove(child);
      chai.expect(tree.getNumChildren(parent)).to.equal(0);
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
      const traversal = new PreorderTreeTraversal<string, GeneralTree<string>>((_element, _index, getPosition) => {
        result.push(getPosition().element);
      });

      tree.addChild(tree.getRoot()!, 'child element');
      tree.traverse(traversal);
      chai.expect(result).to.eql(['root element', 'child element']);
    });

    it('should throw an error if the tree is empty', () => {
      const traversal = new PreorderTreeTraversal<string, GeneralTree<string>>(element => element);

      tree.clear();
      chai.expect(tree.traverse.bind(tree, traversal)).to.throw('Tree is empty');
    });

    it('should correctly increment index of a traversable', () => {
      const position = tree.getRoot()!;
      const result = [] as Array<string | number>;
      const traversal = new PreorderTreeTraversal<string, GeneralTree<string>>((element, meta) => {
        result.push(element, meta.index);
      });

      tree.addChild(tree.addChild(position, 'child element'), 'grand child element');
      tree.addChild(position, 'another child element');
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
