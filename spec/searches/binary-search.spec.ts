import { binarySearch, ComparisonResult } from 'ads';
import * as chai from 'chai';

describe('binarySearch()', function() {
  const arr = [0, 1, 3, 6, 6, 7];

  it('should find item in sorted array', function() {
    chai.expect(binarySearch(arr, 3)).to.eql({ index: 2, exact: true });
  });

  it('should return the leftmost item greater than target if target is not matched', function() {
    chai.expect(binarySearch(arr, 4)).to.eql({ index: 3, exact: false });
  });

  it('should return right boundary index if target is greater than any item in [from,to)', function() {
    chai.expect(binarySearch(arr, 8, 2, 5)).to.eql({ index: 5, exact: false });
    chai.expect(binarySearch(arr, 7, 1, 3)).to.eql({ index: 3, exact: false });
  });

  it('should not include right boundary index in search', function() {
    chai.expect(binarySearch(arr, 6, 0, 3)).to.eql({ index: 3, exact: false });
    chai.expect(binarySearch(arr, 6, 0, 4)).to.eql({ index: 3, exact: true });
  });

  it('should return left boundary index if target is less than any item in [from,to)', function() {
    chai.expect(binarySearch(arr, -1, 2, 5)).to.eql({ index: 2, exact: false });
    chai.expect(binarySearch(arr, 1, 2, 5)).to.eql({ index: 2, exact: false });
  });

  it('should include left boundary index in search', function() {
    chai.expect(binarySearch(arr, 1, 1)).to.eql({ index: 1, exact: true });
  });

  it('should left boundary index be zero by default', function() {
    chai.expect(binarySearch(arr, -1)).to.eql({ index: 0, exact: false });
  });

  it('should right boundary index be the length of array by default', function() {
    chai.expect(binarySearch(arr, 8)).to.eql({ index: 6, exact: false });
  });

  it('should compare items as numbers by default', function() {
    chai.expect(binarySearch(['1', '2', '3'], '2')).to.eql({ index: 1, exact: true });
  });

  it('should accept custom comparison handler', function() {
    const compareAsStrings = (a: string, b: string) => {
      if (a > b) return ComparisonResult.GREATER;
      else if (a < b) return ComparisonResult.LESS;

      return ComparisonResult.EQUAL;
    };

    chai.expect(binarySearch(['1', '2', '3'], '25')).to.eql({ index: 3, exact: false });
    chai.expect(binarySearch(['1', '2', '3'], '25', 0, arr.length, compareAsStrings)).to
      .eql({ index: 2, exact: false });
  });

  it('should return right boundary index if from is greater than to', function() {
    chai.expect(binarySearch(arr, 3, 8, 4)).to.eql({ index: 4, exact: false });
    chai.expect(binarySearch(arr, 3, 4, 1)).to.eql({ index: 1, exact: false });
  });

  it('should left boundary be 0 if from is negative', function() {
    chai.expect(binarySearch(arr, 0, -1)).to.eql({ index: 0, exact: true });
    chai.expect(binarySearch(arr, 3, -100, 3)).to.eql({ index: 2, exact: true });
  });

  it('should right boundary be the array length if to is greater than array length', function() {
    chai.expect(binarySearch(arr, 8, 0, 10)).to.eql({ index: 6, exact: false });
    chai.expect(binarySearch(arr, 7, 0, 10)).to.eql({ index: 5, exact: true });
  });

  it('should return zero index if array is empty whatever boundaries are', function() {
    chai.expect(binarySearch([], 1)).to.eql({ index: 0, exact: false });
    chai.expect(binarySearch([], 1, 2, 5)).to.eql({ index: 0, exact: false });
  });
});
