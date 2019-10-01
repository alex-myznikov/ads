import * as chai from 'chai';
import { SinglyLinkedList } from 'ads';

describe('SinglyLinkedList', function() {
  let list: SinglyLinkedList;

  beforeEach(() => {
    list = new SinglyLinkedList();
  });

  describe('length', function() {
    it('should return 0 if the list is empty', function() {
      chai.expect(list.length).to.equal(0);
    });
  });

  describe('constructor()', function() {
    it('should create a list from a set of elements', function() {
      list = new SinglyLinkedList('foo', 'bar', 'baz');
      chai.expect(list.length).to.equal(3);
    });
  });

  describe('first()', function() {
    it('should throw an Error if the list is empty', function() {
      chai.expect(list.first.bind(list)).to.throw('List is empty');
    });

    it('should return the first element from the list', function() {
      list = new SinglyLinkedList('foo', 'bar', 'baz');
      chai.expect(list.first()).to.equal('foo');
    });

    it('should return the same as last() if the list has one element', function() {
      list = new SinglyLinkedList('foo');
      chai.expect(list.first()).to.equal(list.last());
    });
  });

  describe('last()', function() {
    it('should throw an Error if the list is empty', function() {
      chai.expect(list.last.bind(list)).to.throw('List is empty');
    });

    it('should return the last element from the list', function() {
      list = new SinglyLinkedList('foo', 'bar', 'baz');
      chai.expect(list.last()).to.equal('baz');
    });

    it('should return the same as first() if the list has one element', function() {
      list = new SinglyLinkedList('foo');
      chai.expect(list.last()).to.equal(list.first());
    });
  });

  describe('addFirst()', function() {
    it('should prepend element to the list', function() {
      list.addFirst('foo');
      list.addFirst('bar');
      chai.expect(list.first()).to.equal('bar');
    });

    it('should increment the list length by one', function() {
      chai.expect(list.length).to.equal(0);
      list.addFirst('foo');
      chai.expect(list.length).to.equal(1);
    });
  });

  describe('addLast()', function() {
    it('should append element to the list', function() {
      list.addLast('foo');
      list.addLast('bar');
      chai.expect(list.last()).to.equal('bar');
    });

    it('should increment the list length by one', function() {
      chai.expect(list.length).to.equal(0);
      list.addLast('foo');
      chai.expect(list.length).to.equal(1);
    });
  });

  describe('isEmpty()', function() {
    it('should return true if the list is empty', function() {
      chai.expect(list.isEmpty()).to.equal(true);
    });

    it('should return false if the list has elements', function() {
      list.addLast('foo');
      chai.expect(list.isEmpty()).to.equal(false);
    });
  });

  describe('removeFirst()', function() {
    it('should throw an Error if the list is empty', function() {
      chai.expect(list.removeFirst.bind(list)).to.throw('List is empty');
    });

    it('should remove and return the first element from the list', function() {
      list.addFirst('foo');
      list.addFirst('bar');
      chai.expect(list.removeFirst()).to.equal('bar');
    });

    it('should first() === last() if one element is left after removing', function() {
      list.addFirst('foo');
      list.addFirst('bar');
      list.removeFirst();
      chai.expect(list.first()).to.equal(list.last());
    });

    it('should decrement the list length by one', function() {
      list.addFirst('foo');
      chai.expect(list.length).to.equal(1);
      list.removeFirst();
      chai.expect(list.length).to.equal(0);
    });

    it('should throw on first() and last() if the list is empty after removing', function() {
      list.addFirst('foo');
      list.removeFirst();
      chai.expect(list.first.bind(list)).to.throw('List is empty');
      chai.expect(list.last.bind(list)).to.throw('List is empty');
    });
  });

  describe('iterator', function() {
    it('should iterate through all values from the list', function() {
      chai.expect(Array.from(list)).to.eql([]);
      list.addFirst('foo');
      list.addFirst('bar');
      list.addFirst('baz');
      chai.expect(Array.from(list)).to.eql(['baz', 'bar', 'foo']);
    });
  });
});
