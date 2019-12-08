import { AdaptableHeapPriorityQueue, ComparisonResult } from 'ads';
import * as chai from 'chai';

describe('AdaptableHeapPriorityQueue', function() {
  let queue: AdaptableHeapPriorityQueue<number>;
  const anotherQueue = new AdaptableHeapPriorityQueue<number>();

  beforeEach(() => {
    queue = new AdaptableHeapPriorityQueue([1, 2, 3]);
  });

  describe('constructor()', function() {
    it('should create a queue without elements', function() {
      queue = new AdaptableHeapPriorityQueue();
      chai.expect(queue.length).to.equal(0);
    });

    it('should accept custom comparison handler', function() {
      const compareAsStrings = (a: string, b: string) => {
        if (a > b) return ComparisonResult.GREATER;
        else if (a < b) return ComparisonResult.LESS;

        return ComparisonResult.EQUAL;
      };
      const sQueue = new AdaptableHeapPriorityQueue<string>([], compareAsStrings);

      sQueue.enqueue('c');
      sQueue.enqueue('a');
      sQueue.enqueue('b');
      chai.expect(sQueue.dequeue()).to.equal('a');
      chai.expect(sQueue.dequeue()).to.equal('b');
      chai.expect(sQueue.dequeue()).to.equal('c');
    });
  });

  describe('enqueue()', function() {
    it('should insert element in the queue at relative position according to its key', function() {
      queue.enqueue(0);
      queue.enqueue(2);
      queue.enqueue(5);
      queue.enqueue(4);
      chai.expect(queue.dequeue()).to.equal(0);
      chai.expect(queue.dequeue()).to.equal(1);
      chai.expect(queue.dequeue()).to.equal(2);
      chai.expect(queue.dequeue()).to.equal(2);
      chai.expect(queue.dequeue()).to.equal(3);
      chai.expect(queue.dequeue()).to.equal(4);
      chai.expect(queue.dequeue()).to.equal(5);
    });

    it('should accept key-value pairs as elements', function() {
      const pQueue = new AdaptableHeapPriorityQueue<number, string>();

      pQueue.enqueue([0, 'val']);
      pQueue.enqueue([5, 'val']);
      pQueue.enqueue([2, 'val']);
      pQueue.enqueue([5, 'val']);
      pQueue.enqueue([7, 'val']);
      chai.expect(pQueue.dequeue()).to.eql([0, 'val']);
      chai.expect(pQueue.dequeue()).to.eql([2, 'val']);
      chai.expect(pQueue.dequeue()).to.eql([5, 'val']);
      chai.expect(pQueue.dequeue()).to.eql([5, 'val']);
      chai.expect(pQueue.dequeue()).to.eql([7, 'val']);
    });

    it('should return locator of the added element', function() {
      const locator = queue.enqueue(5);

      chai.expect(locator.index).to.equal(3);
      chai.expect(locator.element).to.equal(5);
    });

    it('should increment the queue length by one', function() {
      chai.expect(queue.length).to.equal(3);
      queue.enqueue(4);
      chai.expect(queue.length).to.equal(4);
    });
  });

  describe('clear()', function() {
    it('should clear the queue', function() {
      queue.clear();
      chai.expect(queue.first.bind(queue)).to.throw('Queue is empty');
    });

    it('should reduce the queue length to 0', function() {
      chai.expect(queue.length).to.equal(3);
      queue.clear();
      chai.expect(queue.length).to.equal(0);
    });
  });

  describe('length', function() {
    it('should return count of elements in the queue', function() {
      chai.expect(queue.length).to.equal(3);
    });
  });

  describe('first()', function() {
    it('should throw if the queue is empty', function() {
      queue.clear();
      chai.expect(queue.first.bind(queue)).to.throw('Queue is empty');
    });

    it('should return the element at the front of the queue', function() {
      chai.expect(queue.first()).to.equal(1);
    });
  });

  describe('isEmpty()', function() {
    it('should return true if the queue is empty', function() {
      queue.clear();
      chai.expect(queue.isEmpty()).to.be.true;
    });

    it('should return false if the queue has elements', function() {
      chai.expect(queue.isEmpty()).to.be.false;
    });
  });

  describe('dequeue()', function() {
    it('should throw if the queue is empty', function() {
      queue.clear();
      chai.expect(queue.dequeue.bind(queue)).to.throw('Queue is empty');
    });

    it('should remove and return the element from the front of the queue', function() {
      chai.expect(queue.dequeue()).to.equal(1);
    });

    it('should decrement the queue length by one', function() {
      chai.expect(queue.length).to.equal(3);
      queue.dequeue();
      chai.expect(queue.length).to.equal(2);
    });
  });

  describe('remove()', function() {
    it('should remove element from the queue by its locator', function() {
      const locator = queue.enqueue(0);

      chai.expect(queue.first()).to.equal(0);
      queue.remove(locator);
      chai.expect(queue.first()).to.equal(1);
    });

    it('should return removed element', function() {
      const locator = queue.enqueue(6);

      chai.expect(queue.remove(locator)).to.equal(6);
    });

    it('should throw if the specified locator is not valid', function() {
      chai.expect(queue.remove.bind(queue, anotherQueue.enqueue(1))).to.throw('Locator is not valid.');
    });

    it('should decrement the queue length by one', function() {
      const locator = queue.enqueue(4);

      chai.expect(queue.length).to.equal(4);
      queue.remove(locator);
      chai.expect(queue.length).to.equal(3);
    });
  });

  describe('update()', function() {
    it('should update element and its position in the queue by its specified locator', function() {
      const locator = queue.enqueue(5);

      queue.update(locator, 0);
      chai.expect(locator.index).to.equal(0);
      chai.expect(locator.element).to.equal(0);
      queue.update(locator, 1);
      chai.expect(queue.dequeue()).to.equal(1);
      chai.expect(queue.dequeue()).to.equal(1);
      chai.expect(queue.dequeue()).to.equal(2);
      chai.expect(queue.dequeue()).to.equal(3);
    });

    it('should throw if the specified locator is not valid', function() {
      chai.expect(queue.update.bind(queue, anotherQueue.enqueue(1))).to.throw('Locator is not valid.');
    });

    it('should not change the queue length', function() {
      const locator = queue.enqueue(4);

      chai.expect(queue.length).to.equal(4);
      queue.update(locator, 6);
      chai.expect(queue.length).to.equal(4);
    });
  });
});
