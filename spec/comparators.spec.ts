import { compareAsNumbers, compareAsStrings } from 'ads';
import * as chai from 'chai';

describe('compareAsNumbers()', function() {
  it('should return -1 if a is less than b', function() {
    chai.expect(compareAsNumbers(5, 6)).to.equal(-1);
    chai.expect(compareAsNumbers('3', 5)).to.equal(-1);
    chai.expect(compareAsNumbers(3, '5')).to.equal(-1);
    chai.expect(compareAsNumbers('3', '5')).to.equal(-1);
  });

  it('should return 1 if a is greater than b', function() {
    chai.expect(compareAsNumbers(6, 5)).to.equal(1);
    chai.expect(compareAsNumbers('6', 5)).to.equal(1);
    chai.expect(compareAsNumbers(6, '5')).to.equal(1);
    chai.expect(compareAsNumbers('6', '5')).to.equal(1);
  });

  it('should return 0 if a is equal b', function() {
    chai.expect(compareAsNumbers(5, 5)).to.equal(0);
    chai.expect(compareAsNumbers('5', 5)).to.equal(0);
    chai.expect(compareAsNumbers(5, '5')).to.equal(0);
    chai.expect(compareAsNumbers('5', '5')).to.equal(0);
  });

  it('should extract number prefixes from strings', function() {
    chai.expect(compareAsNumbers('5abc', 5)).to.equal(0);
    chai.expect(compareAsNumbers(6, '5abc')).to.equal(1);
    chai.expect(compareAsNumbers('5.1abc', '5.2abc')).to.equal(-1);
  });

  it('should compare numbers as decimals', function() {
    chai.expect(compareAsNumbers(5.25, 5.1)).to.equal(1);
    chai.expect(compareAsNumbers(3.98, 5.1)).to.equal(-1);
    chai.expect(compareAsNumbers(4.999, 5)).to.equal(-1);
  });

  it('should throw if encounters not correct number argument', function() {
    chai.expect(compareAsNumbers.bind(this, 5, NaN)).to.throw('Can not compare with NaN');
    chai.expect(compareAsNumbers.bind(this, NaN, 5)).to.throw('Can not compare with NaN');
    chai.expect(compareAsNumbers.bind(this, 'not correct number', 'not correct number')).to
      .throw('Can not compare with NaN');
  });
});

describe('compareAsStrings()', function() {
  it('should return -1 if a is less than b', function() {
    chai.expect(compareAsStrings('abc', 'acc')).to.equal(-1);
    chai.expect(compareAsStrings('abc', 'cd')).to.equal(-1);
    chai.expect(compareAsStrings('abc', 'abcd')).to.equal(-1);
    chai.expect(compareAsStrings('', '0')).to.equal(-1);
    chai.expect(compareAsStrings('11', '2')).to.equal(-1);
  });

  it('should return 1 if a is greater than b', function() {
    chai.expect(compareAsStrings('acc', 'abc')).to.equal(1);
    chai.expect(compareAsStrings('cd', 'abc')).to.equal(1);
    chai.expect(compareAsStrings('abcd', 'abc')).to.equal(1);
    chai.expect(compareAsStrings('0', '')).to.equal(1);
    chai.expect(compareAsStrings('2', '11')).to.equal(1);
  });

  it('should return 0 if a is equal b', function() {
    chai.expect(compareAsStrings('abc', 'abc')).to.equal(0);
    chai.expect(compareAsStrings('0', '0')).to.equal(0);
    chai.expect(compareAsStrings('', '')).to.equal(0);
  });

  it('should convert parameters of arbitrary types to strings', function() {
    chai.expect(compareAsStrings('0', 0)).to.equal(0);
    chai.expect(compareAsStrings('2', 11)).to.equal(1);
    chai.expect(compareAsStrings({}, '[object Object]')).to.equal(0);
    chai.expect(compareAsStrings('NaN', NaN)).to.equal(0);
  });
});
