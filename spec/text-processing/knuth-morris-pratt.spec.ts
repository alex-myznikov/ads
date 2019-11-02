import { indexOfKMP, precomputePattern } from 'src/text-processing/knuth-morris-pratt';
import * as chai from 'chai';

describe('indexOfKMP()', function() {
  const source = 'some test\nstring';

  it('should find the leftmost index at which pattern begins in the source string', function() {
    chai.expect(indexOfKMP(source, 'st')).to.equal(7);
    chai.expect(indexOfKMP(source, 'est\nstr')).to.equal(6);
  });

  it('should handle special characters correctly', function() {
    chai.expect(indexOfKMP(source, ' ')).to.equal(4);
    chai.expect(indexOfKMP(source, ' t')).to.equal(4);
    chai.expect(indexOfKMP(source, '\n')).to.equal(9);
  });

  it('should return 0 if the pattern is empty', function() {
    chai.expect(indexOfKMP(source, '')).to.equal(0);
  });

  it('should return -1 if the source does not contain the pattern', function() {
    chai.expect(indexOfKMP(source, 'not contain')).to.equal(-1);
  });

  it('should accept precomputed pattern overlaps', function() {
    const precomputedPattern = precomputePattern('st');
    const anotherSource = 'some other test\nstring';

    chai.expect(indexOfKMP(source, precomputedPattern)).to.equal(7);
    chai.expect(indexOfKMP(anotherSource, precomputedPattern)).to.equal(13);
  });
});

describe('precomputePattern()', function() {
  it('should precompute pattern', function() {
    chai.expect(precomputePattern('mammamama')).to.eql(['mammamama', [0, 0, 1, 1, 2, 3, 2, 3, 2]]);
  });

  it('should throw if the pattern is empty', function() {
    chai.expect(precomputePattern.bind(this, '')).to.throw('Can not precompute an empty pattern');
  });
});
