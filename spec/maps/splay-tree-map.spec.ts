import { SplayTreeMap, ComparisonResult } from 'ads';
import * as chai from 'chai';

describe('SplayTreeMap', function() {
  let map: SplayTreeMap<number, string>;

  beforeEach(() => {
    map = new SplayTreeMap([[1, 'val'], [2, 'val'], [7, 'val']]);
  });

  describe('constructor()', function() {
    it('should create a splay tree map without elements', function() {
      map = new SplayTreeMap();
      chai.expect(map.size).to.equal(0);
    });

    it('should accept custom comparison handler', function() {
      const compareAsStrings = (a: string, b: string) => {
        if (a > b) return ComparisonResult.GREATER;
        else if (a < b) return ComparisonResult.LESS;

        return ComparisonResult.EQUAL;
      };
      const stringMap = new SplayTreeMap<string, number>([], compareAsStrings);

      stringMap.set('c', 3).set('a', 1).set('b', 2);
      chai.expect(Array.from(stringMap)).to.eql([['a', 1], ['b', 2], ['c', 3]]);
    });
  });

  describe('set()', function() {
    it('should insert new key-value pair to splay tree map on proper place', function() {
      map.set(5, 'val');
      map.set(0, 'val');
      map.set(-1, 'another val');
      chai.expect(Array.from(map)).to
        .eql([[-1, 'another val'], [0, 'val'], [1, 'val'], [2, 'val'], [5, 'val'], [7, 'val']]);
      chai.expect(map.size).to.equal(6);
    });

    it('should update value in existing key-value pair', function() {
      map.set(2, 'another val');
      chai.expect(Array.from(map)).to.eql([[1, 'val'], [2, 'another val'], [7, 'val']]);
    });

    it('should support operation chaining', function() {
      map.set(4, 'val').set(5, 'val');
      chai.expect(map.size).to.equal(5);
    });

    it('should rebalance the tree after adding a new element', function() {
      let root = map['tree'].getRoot()!['node'];

      chai.expect(root.element).to.eql([7, 'val']);
      chai.expect(root.left!.element).to.eql([2, 'val']);
      chai.expect(root.left!.left!.element).to.eql([1, 'val']);
      map.set(5, 'val');
      root = map['tree'].getRoot()!['node'];
      chai.expect(root.element).to.eql([5, 'val']);
      chai.expect(root.left!.element).to.eql([2, 'val']);
      chai.expect(root.left!.left!.element).to.eql([1, 'val']);
      chai.expect(root.right!.element).to.eql([7, 'val']);
      map.set(8, 'val');
      root = map['tree'].getRoot()!['node'];
      chai.expect(root.element).to.eql([8, 'val']);
      chai.expect(root.left!.element).to.eql([7, 'val']);
      chai.expect(root.left!.left!.element).to.eql([5, 'val']);
      map.set(6, 'val');
      root = map['tree'].getRoot()!['node'];
      chai.expect(root.element).to.eql([6, 'val']);
      chai.expect(root.left!.element).to.eql([5, 'val']);
      chai.expect(root.right!.element).to.eql([8, 'val']);
      chai.expect(root.right!.left!.element).to.eql([7, 'val']);
    });
  });

  describe('get()', function() {
    it('should return value for the specified key', function() {
      chai.expect(map.get(2)).to.equal('val');
      chai.expect(map.get(1)).to.equal('val');
    });

    it('should throw if the key not found', function() {
      chai.expect(map.get.bind(map, 0)).to.throw('Key not found');
      map.clear();
      chai.expect(map.get.bind(map, 1)).to.throw('Key not found');
    });

    it('should rebalance the tree after getting an element', function() {
      let root;

      map.get(7);
      root = map['tree'].getRoot()!['node'];
      chai.expect(root.element).to.eql([7, 'val']);
      chai.expect(root.left!.element).to.eql([2, 'val']);
      chai.expect(root.left!.left!.element).to.eql([1, 'val']);
      map.get(1);
      root = map['tree'].getRoot()!['node'];
      chai.expect(root.element).to.eql([1, 'val']);
      chai.expect(root.right!.element).to.eql([2, 'val']);
      chai.expect(root.right!.right!.element).to.eql([7, 'val']);
      map.get(2);
      root = map['tree'].getRoot()!['node'];
      chai.expect(root.element).to.eql([2, 'val']);
      chai.expect(root.left!.element).to.eql([1, 'val']);
      chai.expect(root.right!.element).to.eql([7, 'val']);
    });

    it('should rebalance the last visited element if key not found', function() {
      let root;

      chai.expect(map.get.bind(map, 5)).to.throw('Key not found');
      root = map['tree'].getRoot()!['node'];
      chai.expect(root.element).to.eql([2, 'val']);
      chai.expect(root.left!.element).to.eql([1, 'val']);
      chai.expect(root.right!.element).to.eql([7, 'val']);
      chai.expect(map.get.bind(map, 0)).to.throw('Key not found');
      root = map['tree'].getRoot()!['node'];
      chai.expect(root.element).to.eql([1, 'val']);
      chai.expect(root.right!.element).to.eql([2, 'val']);
      chai.expect(root.right!.right!.element).to.eql([7, 'val']);
      chai.expect(map.get.bind(map, 8)).to.throw('Key not found');
      root = map['tree'].getRoot()!['node'];
      chai.expect(root.element).to.eql([7, 'val']);
      chai.expect(root.left!.element).to.eql([2, 'val']);
      chai.expect(root.left!.left!.element).to.eql([1, 'val']);
    });
  });

  describe('has()', function() {
    it('should return true if the map has a pair with the specified key', function() {
      chai.expect(map.has(2)).to.be.true;
    });

    it('should return false if the map has no pair with the specified key', function() {
      chai.expect(map.has(0)).to.be.false;
      map.clear();
      chai.expect(map.has(1)).to.be.false;
    });

    it('should rebalance the tree after accessing an element', function() {
      let root;

      map.has(7);
      root = map['tree'].getRoot()!['node'];
      chai.expect(root.element).to.eql([7, 'val']);
      chai.expect(root.left!.element).to.eql([2, 'val']);
      chai.expect(root.left!.left!.element).to.eql([1, 'val']);
      map.has(1);
      root = map['tree'].getRoot()!['node'];
      chai.expect(root.element).to.eql([1, 'val']);
      chai.expect(root.right!.element).to.eql([2, 'val']);
      chai.expect(root.right!.right!.element).to.eql([7, 'val']);
      map.has(2);
      root = map['tree'].getRoot()!['node'];
      chai.expect(root.element).to.eql([2, 'val']);
      chai.expect(root.left!.element).to.eql([1, 'val']);
      chai.expect(root.right!.element).to.eql([7, 'val']);
    });

    it('should rebalance the last visited element if key not found', function() {
      let root;

      map.has(5);
      root = map['tree'].getRoot()!['node'];
      chai.expect(root.element).to.eql([2, 'val']);
      chai.expect(root.left!.element).to.eql([1, 'val']);
      chai.expect(root.right!.element).to.eql([7, 'val']);
      map.has(0);
      root = map['tree'].getRoot()!['node'];
      chai.expect(root.element).to.eql([1, 'val']);
      chai.expect(root.right!.element).to.eql([2, 'val']);
      chai.expect(root.right!.right!.element).to.eql([7, 'val']);
      map.has(8);
      root = map['tree'].getRoot()!['node'];
      chai.expect(root.element).to.eql([7, 'val']);
      chai.expect(root.left!.element).to.eql([2, 'val']);
      chai.expect(root.left!.left!.element).to.eql([1, 'val']);
    });
  });

  describe('delete()', function() {
    it('should delete key-value pair for the specified key', function() {
      chai.expect(map.get(2)).to.equal('val');
      map.delete(2);
      chai.expect(map.get.bind(map, 2)).to.throw('Key not found');
    });

    it('should return false if the key not found', function() {
      chai.expect(map.delete(5)).to.be.false;
      chai.expect(map.delete(0)).to.be.false;
    });

    it('should return true if key-value pair for the specified key was deleted', function() {
      chai.expect(map.delete(1)).to.be.true;
      chai.expect(map.delete(2)).to.be.true;
    });

    it('should rebalance the tree after deleting an element', function() {
      map.set(0, 'val').set(4, 'val').set(9, 'val').set(8, 'val')
        .set(3, 'val').set(6, 'val').set(5, 'val').set(10, 'val');

      let root = map['tree'].getRoot()!['node'];

      chai.expect(root.element).to.eql([10, 'val']);
      chai.expect(root.left!.element).to.eql([6, 'val']);
      map.delete(10);
      root = map['tree'].getRoot()!['node'];
      chai.expect(root.element).to.eql([6, 'val']);
      chai.expect(root.left!.element).to.eql([5, 'val']);
      chai.expect(root.right!.element).to.eql([9, 'val']);
      map.delete(6);
      root = map['tree'].getRoot()!['node'];
      chai.expect(root.element).to.eql([5, 'val']);
      chai.expect(root.left!.element).to.eql([4, 'val']);
      chai.expect(root.right!.element).to.eql([9, 'val']);
      map.delete(0);
      root = map['tree'].getRoot()!['node'];
      chai.expect(root.element).to.eql([2, 'val']);
      chai.expect(root.left!.element).to.eql([1, 'val']);
      chai.expect(root.right!.element).to.eql([5, 'val']);
      map.delete(7);
      root = map['tree'].getRoot()!['node'];
      chai.expect(root.element).to.eql([8, 'val']);
      chai.expect(root.left!.element).to.eql([2, 'val']);
      chai.expect(root.right!.element).to.eql([9, 'val']);
      map.delete(2);
      root = map['tree'].getRoot()!['node'];
      chai.expect(root.element).to.eql([1, 'val']);
      chai.expect(root.left).to.be.undefined;
      chai.expect(root.right!.element).to.eql([8, 'val']);
      map.delete(4);
      root = map['tree'].getRoot()!['node'];
      chai.expect(root.element).to.eql([3, 'val']);
      chai.expect(root.left!.element).to.eql([1, 'val']);
      chai.expect(root.right!.element).to.eql([5, 'val']);
      map.delete(5);
      map.delete(8);
      map.delete(9);
      root = map['tree'].getRoot()!['node'];
      chai.expect(root.element).to.eql([3, 'val']);
      chai.expect(root.left!.element).to.eql([1, 'val']);
      chai.expect(root.right).to.be.undefined;
      map.delete(1);
      map.delete(3);
      chai.expect(map['tree'].getRoot()!).to.be.undefined;
    });
  });

  describe('clear()', function() {
    it('should clear the map', function() {
      chai.expect(map.size).to.equal(3);
      map.clear();
      chai.expect(map.size).to.equal(0);
    });
  });

  describe('size', function() {
    it('should return count of elements in the map', function() {
      chai.expect(map.size).to.equal(3);
    });
  });

  describe('isEmpty()', function() {
    it('should return true if the map is empty', function() {
      map.clear();
      chai.expect(map.isEmpty()).to.equal(true);
    });

    it('should return false if the map has elements', function() {
      chai.expect(map.isEmpty()).to.equal(false);
    });
  });

  describe('entries()', function() {
    it('should return iteration through all entries in the map', function() {
      const entries = map.entries();

      chai.expect(entries.next()).to.eql({ value: [1, 'val'], done: false });
      chai.expect(entries.next()).to.eql({ value: [2, 'val'], done: false });
      chai.expect(entries.next()).to.eql({ value: [7, 'val'], done: false });
      chai.expect(entries.next().done).to.be.true;
    });

    it('should disallow editing entries', function() {
      const entry = map.entries().next().value;

      entry[0] = 'chanded key';
      entry[1] = 'changed value';
      chai.expect(map.entries().next()).to.eql({ value: [1, 'val'], done: false });
    });
  });

  describe('keys()', function() {
    it('should return iteration through all keys in the map', function() {
      const keys = map.keys();

      chai.expect(keys.next()).to.eql({ value: 1, done: false });
      chai.expect(keys.next()).to.eql({ value: 2, done: false });
      chai.expect(keys.next()).to.eql({ value: 7, done: false });
      chai.expect(keys.next().done).to.be.true;
      chai.expect(Array.from(map.keys())).to.eql([1, 2, 7]);
    });
  });

  describe('values()', function() {
    it('should return iteration through all values in the map', function() {
      const values = map.values();

      map.set(7, 'another val');
      chai.expect(values.next()).to.eql({ value: 'val', done: false });
      chai.expect(values.next()).to.eql({ value: 'val', done: false });
      chai.expect(values.next()).to.eql({ value: 'another val', done: false });
      chai.expect(values.next().done).to.be.true;
      chai.expect(Array.from(map.values())).to.eql(['val', 'val', 'another val']);
    });
  });

  describe('reversed()', function() {
    it('should return iteration through all pairs in the map in reverse order', function() {
      const reversed = map.reversed();

      chai.expect(reversed.next()).to.eql({ value: [7, 'val'], done: false });
      chai.expect(reversed.next()).to.eql({ value: [2, 'val'], done: false });
      chai.expect(reversed.next()).to.eql({ value: [1, 'val'], done: false });
      chai.expect(reversed.next().done).to.be.true;
      chai.expect(Array.from(map.reversed())).to.eql([[7, 'val'], [2, 'val'], [1, 'val']]);
    });

    it('should disallow editing pairs', function() {
      const pair = map.reversed().next().value;

      pair[0] = 'chanded key';
      pair[1] = 'changed value';
      chai.expect(map.reversed().next()).to.eql({ value: [7, 'val'], done: false });
    });
  });

  describe('forEach()', function() {
    it('should apply the specified function to each key-value pair in the map', function() {
      // TODO: to docs -> 'due to complex rebalancing do not self-modify without a purpose'
      map.forEach((value, key, self) => self.set(key * 2, value + ' changed'), this);
      chai.expect(Array.from(map)).to.eql([
        [1, 'val'], // updates pair with key 2
        [2, 'val changed'], // creates pair with key 4
        [4, 'val changed changed'], // this pair is not handled because splaying excludes it from the iteration order
        [7, 'val'], // creates pair with key 14
        [14, 'val changed'], // this pair is not handled, reason the same as for 4
      ]);
    });

    it('should apply the specified thisArg to callback function passed', function() {
      const callback = function(this: any, _value: any, key: any) {
        return chai.expect(this.has(key)).to.be.true;
      };

      map.forEach(callback, map);
    });
  });

  describe('findGreater()', function() {
    it('should return the leftmost key-value pair with key greater than the specified', function() {
      chai.expect(map.findGreater(5)).to.eql([7, 'val']);
      chai.expect(map.findGreater(1)).to.eql([2, 'val']);
      chai.expect(map.findGreater(0)).to.eql([1, 'val']);
    });

    it('should return undefined if the specified key is the greatest or greater than any in the map', function() {
      chai.expect(map.findGreater(7)).to.be.undefined;
      chai.expect(map.findGreater(8)).to.be.undefined;
    });

    it('should return undefined if the map is empty', function() {
      map.clear();
      chai.expect(map.findGreater(5)).to.be.undefined;
      chai.expect(map.findGreater(7)).to.be.undefined;
    });

    it('should disallow editing pair', function() {
      const pair = map.findGreater(0)!;

      pair[0] = 0;
      pair[1] = 'changed value';
      chai.expect(map.findGreater(0)).to.eql([1, 'val']);
    });
  });

  describe('findGreaterOrEqual()', function() {
    it('should return the leftmost key-value pair with key greater or equal to the specified', function() {
      chai.expect(map.findGreaterOrEqual(5)).to.eql([7, 'val']);
      chai.expect(map.findGreaterOrEqual(1)).to.eql([1, 'val']);
      chai.expect(map.findGreaterOrEqual(0)).to.eql([1, 'val']);
      chai.expect(map.findGreaterOrEqual(7)).to.eql([7, 'val']);
    });

    it('should return undefined if the specified key is greater than any in the map', function() {
      chai.expect(map.findGreaterOrEqual(8)).to.be.undefined;
    });

    it('should return undefined if the map is empty', function() {
      map.clear();
      chai.expect(map.findGreaterOrEqual(5)).to.be.undefined;
      chai.expect(map.findGreaterOrEqual(8)).to.be.undefined;
    });

    it('should disallow editing pair', function() {
      const pair = map.findGreaterOrEqual(0)!;

      pair[0] = 0;
      pair[1] = 'changed value';
      chai.expect(map.findGreaterOrEqual(0)).to.eql([1, 'val']);
    });
  });

  describe('findLess()', function() {
    it('should return the rightmost key-value pair with key less than the specified', function() {
      chai.expect(map.findLess(2)).to.eql([1, 'val']);
      chai.expect(map.findLess(5)).to.eql([2, 'val']);
      chai.expect(map.findLess(8)).to.eql([7, 'val']);
    });

    it('should return undefined if the specified key is the least or less than any in the map', function() {
      chai.expect(map.findLess(1)).to.be.undefined;
      chai.expect(map.findLess(0)).to.be.undefined;
    });

    it('should return undefined if the map is empty', function() {
      map.clear();
      chai.expect(map.findLess(2)).to.be.undefined;
      chai.expect(map.findLess(1)).to.be.undefined;
    });

    it('should disallow editing pair', function() {
      const pair = map.findLess(2)!;

      pair[0] = 0;
      pair[1] = 'changed value';
      chai.expect(map.findLess(2)).to.eql([1, 'val']);
    });
  });

  describe('findLessOrEqual()', function() {
    it('should return the rightmost key-value pair with key less or equal to the specified', function() {
      chai.expect(map.findLessOrEqual(5)).to.eql([2, 'val']);
      chai.expect(map.findLessOrEqual(1)).to.eql([1, 'val']);
      chai.expect(map.findLessOrEqual(8)).to.eql([7, 'val']);
      chai.expect(map.findLessOrEqual(7)).to.eql([7, 'val']);
    });

    it('should return undefined if the specified key is less than any in the map', function() {
      chai.expect(map.findLessOrEqual(0)).to.be.undefined;
    });

    it('should return undefined if the map is empty', function() {
      map.clear();
      chai.expect(map.findLessOrEqual(5)).to.be.undefined;
      chai.expect(map.findLessOrEqual(0)).to.be.undefined;
    });

    it('should disallow editing pair', function() {
      const pair = map.findLessOrEqual(1)!;

      pair[0] = 0;
      pair[1] = 'changed value';
      chai.expect(map.findLessOrEqual(1)).to.eql([1, 'val']);
    });
  });

  describe('findMax()', function() {
    it('should return the greatest key-value pair in the map', function() {
      chai.expect(map.findMax()).to.eql([7, 'val']);
    });

    it('should return undefined if the map is empty', function() {
      map.clear();
      chai.expect(map.findMax()).to.be.undefined;
    });

    it('should disallow editing pair', function() {
      const pair = map.findMax()!;

      pair[0] = 0;
      pair[1] = 'changed value';
      chai.expect(map.findMax()).to.eql([7, 'val']);
    });
  });

  describe('findMin()', function() {
    it('should return the least key-value pair in the map', function() {
      chai.expect(map.findMin()).to.eql([1, 'val']);
    });

    it('should return undefined if the map is empty', function() {
      map.clear();
      chai.expect(map.findMin()).to.be.undefined;
    });

    it('should disallow editing pair', function() {
      const pair = map.findMin()!;

      pair[0] = 0;
      pair[1] = 'changed value';
      chai.expect(map.findMin()).to.eql([1, 'val']);
    });
  });

  describe('findRange()', function() {
    it('should return iterable of key-value pairs in interval of [start, stop)', function() {
      const range = map.findRange(1, 7);

      chai.expect(range.next()).to.eql({ value: [1, 'val'], done: false });
      chai.expect(range.next()).to.eql({ value: [2, 'val'], done: false });
      chai.expect(range.next().done).to.be.true;
      chai.expect(Array.from(map.findRange(-1, 8))).to.eql([[1, 'val'], [2, 'val'], [7, 'val']]);
      chai.expect(Array.from(map.findRange(2, 8))).to.eql([[2, 'val'], [7, 'val']]);
      chai.expect(Array.from(map.findRange(-1, 1))).to.eql([]);
    });

    it('should return an empty iterable if start and stop bounds are equal', function() {
      chai.expect(Array.from(map.findRange(1, 1))).to.eql([]);
    });

    it('should return an empty iterable if start bound is greater when the stop', function() {
      chai.expect(Array.from(map.findRange(2, 1))).to.eql([]);
    });

    it('should disallow editing pairs', function() {
      const pair = map.findRange(1, 7).next().value;

      pair[0] = 'chanded key';
      pair[1] = 'changed value';
      chai.expect(map.findRange(1, 7).next()).to.eql({ value: [1, 'val'], done: false });
    });
  });

  describe('iterator', function() {
    it('should iterate through all elements from the map', function() {
      chai.expect(Array.from(map)).to.eql([[1, 'val'], [2, 'val'], [7, 'val']]);
    });

    it('should disallow editing elements', function() {
      const element = Array.from(map)[0];

      element[0] = 0;
      element[1] = 'changed value';
      chai.expect(Array.from(map)[0]).to.eql([1, 'val']);
    });
  });

  describe('toString', function() {
    it('should explain itself type via toString call', function() {
      chai.expect(map.toString()).to.equal('[object SplayTreeMap]');
      chai.expect(String(map)).to.equal('[object SplayTreeMap]');
      chai.expect(map + '').to.equal('[object SplayTreeMap]');
    });
  });
});
