import { SortedMap } from 'ads';
import * as chai from 'chai';
import { ComparisonResult } from 'src/comparators';

describe('SortedMap', function() {
  let map: SortedMap<number, string>;

  beforeEach(() => {
    map = new SortedMap([[1, 'val'], [2, 'val'], [7, 'val']]);
  });

  describe('constructor()', function() {
    it('should create a sorted map without elements', function() {
      map = new SortedMap();
      chai.expect(map.size).to.equal(0);
    });

    it('should accept custom comparison handler', function() {
      const compareAsStrings = (a: string, b: string) => {
        if (a > b) return ComparisonResult.GREATER;
        else if (a < b) return ComparisonResult.LESS;

        return ComparisonResult.EQUAL;
      };
      const stringMap = new SortedMap<string, number>([], compareAsStrings);

      stringMap.set('c', 3).set('a', 1).set('b', 2);
      chai.expect(Array.from(stringMap)).to.eql([['a', 1], ['b', 2], ['c', 3]]);
    });
  });

  describe('set()', function() {
    it('should insert new key-value pair to sorted map on proper place', function() {
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
  });

  describe('get()', function() {
    it('should return value for the specified key', function() {
      chai.expect(map.get(2)).to.equal('val');
      chai.expect(map.get(1)).to.equal('val');
    });

    it('should throw if the key not found', function() {
      chai.expect(map.get.bind(map, 0)).to.throw('Key not found');
    });
  });

  describe('has()', function() {
    it('should return true if the map has a pair with the specified key', function() {
      chai.expect(map.has(2)).to.be.true;
    });

    it('should return false if the map has no pair with the specified key', function() {
      chai.expect(map.has(0)).to.be.false;
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

      chai.expect(values.next()).to.eql({ value: 'val', done: false });
      chai.expect(values.next()).to.eql({ value: 'val', done: false });
      chai.expect(values.next()).to.eql({ value: 'val', done: false });
      chai.expect(values.next().done).to.be.true;
      chai.expect(Array.from(map.values())).to.eql(['val', 'val', 'val']);
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
  });

  describe('forEach()', function() {
    it('should apply the specified function to each key-value pair in the map', function() {
      map.forEach((value, key, self) => self.set(key * 2, value + ' changed'));
      chai.expect(Array.from(map)).to.eql([
        [1, 'val'],
        [2, 'val changed'], // changes self pairs
        [4, 'val changed changed'], // the last handled pair because of initial map length equal 3
        [7, 'val'], // this pair is not handled
        [8, 'val changed changed changed'], // result of the last handled pair of [4, 'val changed changed']
      ]);
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
  });

  describe('findMax()', function() {
    it('should return the greatest key-value pair in the map', function() {
      chai.expect(map.findMax()).to.eql([7, 'val']);
    });

    it('should return undefined if the map is empty', function() {
      map.clear();
      chai.expect(map.findMax()).to.be.undefined;
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
  });

  describe('iterator', function() {
    it('should iterate through all elements from the map', function() {
      chai.expect(Array.from(map)).to.eql([[1, 'val'], [2, 'val'], [7, 'val']]);
    });
  });

  describe('toString', function() {
    it('should explain itself type via toString call', function() {
      chai.expect(map.toString()).to.equal('[object SortedMap]');
      chai.expect(String(map)).to.equal('[object SortedMap]');
      chai.expect(map + '').to.equal('[object SortedMap]');
    });
  });
});
