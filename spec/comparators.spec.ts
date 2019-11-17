import { compareAsNumbers } from 'src/comparators';
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
