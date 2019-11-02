import { ComparisonResult } from 'src/comparators';
import { quickSelect } from 'src/searches';
import * as chai from 'chai';

describe('quickSelect()', function() {
  const arr = [1, 3, 2, 7, 4, 1, 5, 2];

  it('should select nth smallest item in unsorted array', function() {
    chai.expect(quickSelect(arr, 5)).to.equal(4);
    chai.expect(quickSelect(arr, 2)).to.equal(2);
    chai.expect(quickSelect(arr, 3)).to.equal(2);
    chai.expect(quickSelect(arr, 7)).to.equal(7);
    chai.expect(quickSelect(arr, 0)).to.equal(1);
  });

  it('should select the smallest item in the array by default', function() {
    chai.expect(quickSelect(arr)).to.equal(1);
  });

  it('should throw if n is out of the array bounds', function() {
    const err = 'Can not select item from outside of the array bounds';

    chai.expect(quickSelect.bind(this, arr, -1)).to.throw(err);
    chai.expect(quickSelect.bind(this, arr, 8)).to.throw(err);
    chai.expect(quickSelect.bind(this, arr, Infinity)).to.throw(err);
  });

  it('should throw if the array to select from is empty', function() {
    chai.expect(quickSelect.bind(this, [], 0)).to.throw('Can not select from an empty array');
  });

  it('should accept custom comparison handler', function() {
    const compareAsStrings = (a: string, b: string) => {
      if (a > b) return ComparisonResult.GREATER;
      else if (a < b) return ComparisonResult.LESS;

      return ComparisonResult.EQUAL;
    };

    chai.expect(quickSelect(['1', '2', '3', '11'], 1)).to.equal('2');
    chai.expect(quickSelect(['1', '2', '3', '11'], 1, compareAsStrings)).to.equal('11');
  });
});
