import { DoublyLinkedList } from 'ads';
import { Position } from 'src/position.class';
import * as chai from 'chai';

describe('DoublyLinkedList', function() {
  const anotherList = new DoublyLinkedList(['some element']);
  let list: DoublyLinkedList<string>;

  beforeEach(() => {
    list = new DoublyLinkedList(['foo', 'bar', 'baz']);
  });

  describe('constructor()', function() {
    it('should create a linked list without elements', function() {
      list = new DoublyLinkedList();
      chai.expect(list.length).to.equal(0);
    });
  });

  describe('addAfter()', function() {
    it('should insert element after the specified position in the list', function() {
      const position = list.addAfter(list.first()!, 'added element');
      const afterPosition = list.after(position);
      const beforePosition = list.before(position);

      chai.expect(afterPosition!.element).to.equal('bar');
      chai.expect(beforePosition!.element).to.equal('foo');
      chai.expect(list.before(afterPosition!)!.element).to.equal('added element');
      chai.expect(list.after(beforePosition!)!.element).to.equal('added element');
    });

    it('should return position of the added element', function() {
      const position = list.addAfter(list.first()!, 'added element');

      chai.expect(position).to.be.instanceOf(Position);
      chai.expect(position.element).to.equal('added element');
    });

    it('should throw if the specified position does not belong to this list', function() {
      chai.expect(list.addAfter.bind(list, anotherList.first()!, 'added element')).to
        .throw('Position does not belong to this container');
    });

    it('should increment the list length by one', function() {
      chai.expect(list.length).to.equal(3);
      list.addAfter(list.first()!, 'added element');
      chai.expect(list.length).to.equal(4);
    });
  });

  describe('addBefore()', function() {
    it('should insert element before the specified position in the list', function() {
      const position = list.addBefore(list.last()!, 'added element');
      const afterPosition = list.after(position);
      const beforePosition = list.before(position);

      chai.expect(afterPosition!.element).to.equal('baz');
      chai.expect(beforePosition!.element).to.equal('bar');
      chai.expect(list.before(afterPosition!)!.element).to.equal('added element');
      chai.expect(list.after(beforePosition!)!.element).to.equal('added element');
    });

    it('should return position of the added element', function() {
      const position = list.addAfter(list.first()!, 'added element');

      chai.expect(position).to.be.instanceOf(Position);
      chai.expect(position.element).to.equal('added element');
    });

    it('should throw if the specified position does not belong to this list', function() {
      chai.expect(list.addAfter.bind(list, anotherList.first()!, 'added element')).to
        .throw('Position does not belong to this container');
    });

    it('should increment the list length by one', function() {
      chai.expect(list.length).to.equal(3);
      list.addAfter(list.first()!, 'added element');
      chai.expect(list.length).to.equal(4);
    });
  });

  describe('addFirst()', function() {
    it('should prepend element to the list', function() {
      const positionAfter = list.after(list.addFirst('added element'));

      chai.expect(list.first()!.element).to.equal('added element');
      chai.expect(list.after(list.first()!)!.element).to.equal('foo');
      chai.expect(list.before(positionAfter!)!.element).to.equal('added element');
    });

    it('should init both head and tail if the list is empty', function() {
      list.clear();
      list.addFirst('added element');
      chai.expect(list.first()!.element).to.equal(list.last()!.element);
    });

    it('should return position of the added element', function() {
      const position = list.addFirst('added element');

      chai.expect(position).to.be.instanceOf(Position);
      chai.expect(position.element).to.equal('added element');
    });

    it('should increment the list length by one', function() {
      chai.expect(list.length).to.equal(3);
      list.addFirst('added element');
      chai.expect(list.length).to.equal(4);
    });
  });

  describe('addLast()', function() {
    it('should append element to the list', function() {
      const positionBefore = list.before(list.addLast('added element'));

      chai.expect(list.last()!.element).to.equal('added element');
      chai.expect(list.before(list.last()!)!.element).to.equal('baz');
      chai.expect(list.after(positionBefore!)!.element).to.equal('added element');
    });

    it('should init both head and tail if the list is empty', function() {
      list.clear();
      list.addLast('added element');
      chai.expect(list.first()!.element).to.equal(list.last()!.element);
    });

    it('should return position of the added element', function() {
      const position = list.addLast('added element');

      chai.expect(position).to.be.instanceOf(Position);
      chai.expect(position.element).to.equal('added element');
    });

    it('should increment the list length by one', function() {
      chai.expect(list.length).to.equal(3);
      list.addLast('added element');
      chai.expect(list.length).to.equal(4);
    });
  });

  describe('after()', function() {
    it('should return undefined if there is no element after the position', function() {
      chai.expect(list.after(list.last()!)).to.be.undefined;
    });

    it('should return position of the element after the specified position', function() {
      chai.expect(list.after(list.first()!)).to.be.instanceOf(Position);
      chai.expect(list.after(list.first()!)!.element).to.equal('bar');
    });

    it('should throw if the specified position does not belong to this list', function() {
      chai.expect(list.after.bind(list, anotherList.first()!)).to.throw('Position does not belong to this container');
    });
  });

  describe('before()', function() {
    it('should return undefined if there is no element before the position', function() {
      chai.expect(list.before(list.first()!)).to.be.undefined;
    });

    it('should return position of the element before the specified position', function() {
      chai.expect(list.before(list.last()!)).to.be.instanceOf(Position);
      chai.expect(list.before(list.last()!)!.element).to.equal('bar');
    });

    it('should throw if the specified position does not belong to this list', function() {
      chai.expect(list.before.bind(list, anotherList.first()!)).to.throw('Position does not belong to this container');
    });
  });

  describe('clear()', function() {
    it('should clear the list', function() {
      list.clear();
      chai.expect(list.first()).to.be.undefined;
      chai.expect(list.last()).to.be.undefined;
      chai.expect(Array.from(list).length).to.equal(0);
    });

    it('should not deprecate existing positions if instant is TRUE', function() {
      const position = list.first();
      const positionAfter = list.after(position!);

      list.clear(true);
      chai.expect(list.after(position!)!.element).to.be.equal(positionAfter!.element);
    });

    it('should deprecate existing positions if instant is FALSE', function() {
      const position = list.first();

      list.clear();
      chai.expect(list.after.bind(list, position!)).to.throw('Position is deprecated');
    });

    it('should reduce the list length to 0', function() {
      chai.expect(list.length).to.equal(3);
      list.clear();
      chai.expect(list.length).to.equal(0);
    });
  });

  describe('delete()', function() {
    it('should delete element from the specified position in the list', function() {
      const position = list.after(list.first()!);
      const afterPosition = list.after(position!);
      const beforePosition = list.before(position!);

      list.delete(position!);
      chai.expect(list.before(afterPosition!)!.element).to.equal(beforePosition!.element);
      chai.expect(list.after(beforePosition!)!.element).to.equal(afterPosition!.element);
    });

    it('should return deleted element', function() {
      const position = list.after(list.first()!);

      chai.expect(list.delete(position!)).to.equal('bar');
    });

    it('should throw if the specified position does not belong to this list', function() {
      chai.expect(list.delete.bind(list, anotherList.first()!)).to
        .throw('Position does not belong to this container');
    });

    it('should decrement the list length by one', function() {
      chai.expect(list.length).to.equal(3);
      list.delete(list.first()!);
      chai.expect(list.length).to.equal(2);
    });

    it('should deprecate the deleted node', function() {
      const position = list.after(list.first()!);

      list.delete(position!);
      chai.expect(list.before.bind(list, position!)).to.throw('Position is deprecated');
    });
  });

  describe('length', function() {
    it('should return count of elements in the list', function() {
      chai.expect(list.length).to.equal(3);
    });
  });

  describe('first()', function() {
    it('should return undefined if the list is empty', function() {
      list.clear();
      chai.expect(list.first()).to.be.undefined;
    });

    it('should return position of the first element in the list', function() {
      chai.expect(list.first()).to.be.instanceOf(Position);
      chai.expect(list.first()!.element).to.equal('foo');
    });

    it('should return the same as last() if the list has one element', function() {
      list = new DoublyLinkedList(['foo']);
      chai.expect(list.first()!.element).to.equal(list.last()!.element);
    });
  });

  describe('last()', function() {
    it('should return undefined if the list is empty', function() {
      list.clear();
      chai.expect(list.last()).to.be.undefined;
    });

    it('should return position of the last element in the list', function() {
      chai.expect(list.last()).to.be.instanceOf(Position);
      chai.expect(list.last()!.element).to.equal('baz');
    });

    it('should return the same as first() if the list has one element', function() {
      list = new DoublyLinkedList(['foo']);
      chai.expect(list.last()!.element).to.equal(list.first()!.element);
    });
  });

  describe('isEmpty()', function() {
    it('should return true if the list is empty', function() {
      list.clear();
      chai.expect(list.isEmpty()).to.equal(true);
    });

    it('should return false if the list has elements', function() {
      chai.expect(list.isEmpty()).to.equal(false);
    });
  });

  describe('removeFirst()', function() {
    it('should throw if the list is empty', function() {
      list.clear();
      chai.expect(list.removeFirst.bind(list)).to.throw('List is empty');
    });

    it('should remove and return the first element from the list', function() {
      chai.expect(list.removeFirst()).to.equal('foo');
    });

    it('should first() and last() point to the same if one element is left after removing', function() {
      list.removeFirst();
      list.removeFirst();
      chai.expect(list.first()!.element).to.equal(list.last()!.element);
    });

    it('should decrement the list length by one', function() {
      chai.expect(list.length).to.equal(3);
      list.removeFirst();
      chai.expect(list.length).to.equal(2);
    });

    it('should return undefined on first() and last() if the list is empty after removing', function() {
      list.removeFirst();
      list.removeFirst();
      list.removeFirst();
      chai.expect(list.first()).to.equal(list.last()).and.to.be.undefined;
    });
  });

  describe('removeLast()', function() {
    it('should throw if the list is empty', function() {
      list.clear();
      chai.expect(list.removeLast.bind(list)).to.throw('List is empty');
    });

    it('should remove and return the last element from the list', function() {
      chai.expect(list.removeLast()).to.equal('baz');
    });

    it('should first() and last() point to the same if one element is left after removing', function() {
      list.removeLast();
      list.removeLast();
      chai.expect(list.first()!.element).to.equal(list.last()!.element);
    });

    it('should decrement the list length by one', function() {
      chai.expect(list.length).to.equal(3);
      list.removeLast();
      chai.expect(list.length).to.equal(2);
    });

    it('should return undefined on first() and last() if the list is empty after removing', function() {
      list.removeLast();
      list.removeLast();
      list.removeLast();
      chai.expect(list.first()).to.equal(list.last()).and.to.be.undefined;
    });
  });

  describe('replace()', function() {
    it('should replace element at the specified position in the list', function() {
      list.replace(list.first()!, 'replacement');
      chai.expect(list.first()!.element).to.equal('replacement');
    });

    it('should return the replaced element', function() {
      chai.expect(list.replace(list.first()!, 'replacement')).to.equal('foo');
    });

    it('should throw if the specified position does not belong to this list', function() {
      chai.expect(list.replace.bind(list, anotherList.first()!, 'replacement')).to
        .throw('Position does not belong to this container');
    });

    it('should not change the list length', function() {
      chai.expect(list.length).to.equal(3);
      list.replace(list.first()!, 'replacement');
      chai.expect(list.length).to.equal(3);
    });
  });

  describe('iterator', function() {
    it('should iterate through all values from the list', function() {
      chai.expect(Array.from(list)).to.eql(['foo', 'bar', 'baz']);
    });
  });
});
