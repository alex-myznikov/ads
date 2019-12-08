import { CircularQueue } from 'ads';
import * as chai from 'chai';

describe('CircularQueue', function() {
  let queue: CircularQueue<number>;

  beforeEach(() => {
    queue = new CircularQueue([1, 2, 3]);
  });

  describe('constructor()', function() {
    it('should create a queue without elements', function() {
      queue = new CircularQueue();
      chai.expect(queue.length).to.equal(0);
    });
  });

  describe('enqueue()', function() {
    it('should enqueue element at the rear of the queue', function() {
      queue.enqueue(4);
      queue.enqueue(5);
      chai.expect(queue.dequeue()).to.equal(1);
      chai.expect(queue.dequeue()).to.equal(2);
      chai.expect(queue.dequeue()).to.equal(3);
      chai.expect(queue.dequeue()).to.equal(4);
      chai.expect(queue.dequeue()).to.equal(5);
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
      chai.expect(queue.getFirst.bind(queue)).to.throw('Queue is empty');
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

  describe('getFirst()', function() {
    it('should throw if the queue is empty', function() {
      queue.clear();
      chai.expect(queue.getFirst.bind(queue)).to.throw('Queue is empty');
    });

    it('should return the element at the front of the queue', function() {
      chai.expect(queue.getFirst()).to.equal(1);
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

  describe('rotate()', function() {
    it('should move move the queue front one step towards its rear', function() {
      queue.rotate();
      chai.expect(queue.getFirst()).to.equal(2);
    });

    it('should accept the number of steps to rotate', function() {
      queue.rotate(2);
      chai.expect(queue.getFirst()).to.equal(3);
      queue.rotate(4);
      chai.expect(queue.getFirst()).to.equal(1);
    });
  });
});
