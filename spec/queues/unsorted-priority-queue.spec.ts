import { ComparisonResult, UnsortedPriorityQueue } from 'ads';
import * as chai from 'chai';

describe('UnsortedPriorityQueue', function() {
  let queue: UnsortedPriorityQueue<number>;

  beforeEach(() => {
    queue = new UnsortedPriorityQueue([1, 2, 3]);
  });

  describe('constructor()', function() {
    it('should create a queue without elements', function() {
      queue = new UnsortedPriorityQueue();
      chai.expect(queue.length).to.equal(0);
    });

    it('should accept custom comparison handler', function() {
      const compareAsStrings = (a: string, b: string) => {
        if (a > b) return ComparisonResult.GREATER;
        else if (a < b) return ComparisonResult.LESS;

        return ComparisonResult.EQUAL;
      };
      const sQueue = new UnsortedPriorityQueue<string>([], compareAsStrings);

      sQueue.enqueue('c');
      sQueue.enqueue('a');
      sQueue.enqueue('b');
      chai.expect(sQueue.dequeue()).to.equal('a');
      chai.expect(sQueue.dequeue()).to.equal('b');
      chai.expect(sQueue.dequeue()).to.equal('c');
    });
  });

  describe('enqueue()', function() {
    it('should enqueue element at the rear of the queue', function() {
      queue.enqueue(0);
      queue.enqueue(5);
      queue.enqueue(4);
      chai.expect(queue['structure']['list'].last()!.element).to.equal(4);
      chai.expect(queue['structure']['list']['tail']!.prev!.element).to.equal(5);
      chai.expect(queue['structure']['list']['tail']!.prev!.prev!.element).to.equal(0);
    });

    it('should accept key-value pairs as elements', function() {
      const pQueue = new UnsortedPriorityQueue<number, string>();

      pQueue.enqueue([0, 'val']);
      pQueue.enqueue([5, 'val']);
      pQueue.enqueue([2, 'val']);
      pQueue.enqueue([7, 'val']);
      chai.expect(pQueue.dequeue()).to.eql([0, 'val']);
      chai.expect(pQueue.dequeue()).to.eql([2, 'val']);
      chai.expect(pQueue.dequeue()).to.eql([5, 'val']);
      chai.expect(pQueue.dequeue()).to.eql([7, 'val']);
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

    it('should remove and return the minimum from the queue', function() {
      chai.expect(queue.dequeue()).to.equal(1);
    });

    it('should decrement the queue length by one', function() {
      chai.expect(queue.length).to.equal(3);
      queue.dequeue();
      chai.expect(queue.length).to.equal(2);
    });
  });
});
