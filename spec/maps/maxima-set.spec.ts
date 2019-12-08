import { MaximaSet, ComparisonResult } from 'ads';
import * as chai from 'chai';

describe('MaximaSet', function() {
  let set: MaximaSet<number, number>;

  beforeEach(() => {
    set = new MaximaSet([[1, 2], [2, 3], [3, 4]]);
  });

  describe('constructor()', function() {
    it('should create a maxima set without elements', function() {
      set = new MaximaSet();
      chai.expect(set.length).to.equal(0);
    });

    it('should accept custom comparison handlers', function() {
      const compareAsStrings = (a: string, b: string) => {
        if (a > b) return ComparisonResult.GREATER;
        else if (a < b) return ComparisonResult.LESS;

        return ComparisonResult.EQUAL;
      };
      const stringXSet = new MaximaSet<string, number>([], compareAsStrings);
      const stringYSet = new MaximaSet<string, string>([], compareAsStrings, compareAsStrings);

      stringXSet.add('c', 3);
      stringXSet.add('a', 1);
      chai.expect(Array.from(stringXSet)).to.eql([['a', 1], ['c', 3]]);
      stringYSet.add('abc', 'klm');
      stringYSet.add('acd', 'jkl');
      chai.expect(Array.from(stringYSet)).to.eql([['abc', 'klm']]);
    });
  });

  describe('add()', function() {
    it('should insert maximum pair with outstanding X, Y values (not dominated by other pairs)', function() {
      set.add(5, 5);
      set.add(0, 1);
      set.add(-1, 0);
      chai.expect(set.length).to.equal(6);
    });

    it('should delete pairs dominated by the new pair -' +
      'X (implied cost) is greater while Y (implied performance) is worse than new pair', function() {
      set.add(2, 4);
      chai.expect(set.length).to.equal(2);
    });

    it('should not insert pair if it is dominated by any other pair in the set', function() {
      set.add(4, 4);
      set.add(5, 4);
      set.add(3, 3);
      chai.expect(set.length).to.equal(3);
    });
  });

  describe('getBest()', function() {
    it('should return pair with best Y (implied performance) and X (implied cost) not greater than the specified value',
      function() {
        chai.expect(set.getBest(2)).to.eql([2, 3]);
        chai.expect(set.getBest(3)).to.eql([3, 4]);
        chai.expect(set.getBest(8)).to.eql([3, 4]);
      });

    it('should return undefined if no pair with X less than or equal to the specified exists in the set', function() {
      chai.expect(set.getBest(0)).to.be.undefined;
      chai.expect(set.getBest(-1)).to.be.undefined;
    });
  });

  describe('getFirst()', function() {
    it('should return pair with least X (implied cost)', function() {
      chai.expect(set.getFirst()).to.eql([1, 2]);
    });

    it('should return undefined if the set is empty', function() {
      set.clear();
      chai.expect(set.getFirst()).to.be.undefined;
    });
  });

  describe('getLast()', function() {
    it('should return pair with greatest X (implied cost)', function() {
      chai.expect(set.getLast()).to.eql([3, 4]);
    });

    it('should return undefined if the set is empty', function() {
      set.clear();
      chai.expect(set.getLast()).to.be.undefined;
    });
  });

  describe('length', function() {
    it('should return count of elements in the set', function() {
      chai.expect(set.length).to.equal(3);
    });
  });

  describe('isEmpty()', function() {
    it('should return true if the set is empty', function() {
      set.clear();
      chai.expect(set.isEmpty()).to.equal(true);
    });

    it('should return false if the set has elements', function() {
      chai.expect(set.isEmpty()).to.equal(false);
    });
  });

  describe('iterator', function() {
    it('should iterate through all values from the set', function() {
      set.add(-1, 1);
      set.add(6, 8);
      chai.expect(Array.from(set)).to.eql([[-1, 1], [1, 2], [2, 3], [3, 4], [6, 8]]);
    });
  });
});
