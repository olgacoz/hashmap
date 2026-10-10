import LinkedList from "./LinkedList.js";

export default class HashMap {
  #loadFactor;
  #capacity;
  #buckets;

  constructor(loadFactor = 0.75, capacity = 16) {
    this.#loadFactor = loadFactor;
    this.#capacity = capacity;
    this.#buckets = new Array(this.#capacity);
  }

  get capacity() {
    return this.#capacity;
  }

  get buckets() {
    return this.#buckets;
  }

  hash(key) {
    let hashCode = 0;

    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) {
      hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % this.#capacity;
    }

    return hashCode;
  }

  #checkBoundaries(index) {
    if (index < 0 || index >= this.#buckets.length) {
      throw new Error("Trying to access index out of bounds");
    }
  }

  set(key, value) {
    const index = this.hash(key);

    this.#checkBoundaries(index);

    if (!this.#buckets[index]) {
      // bucket is empty
      const list = new LinkedList();
      list.prepend({ key, value });

      this.buckets[index] = list;
      return;
    }

    // bucket is not empty
    let node = this.#buckets[index].headNode;
    while (node !== null) {
      if (node.value.key === key) {
        // key already exists. update the old value
        node.value.value = value;
        return;
      }
      node = node.nextNode;
    }
    this.#buckets[index].prepend({ key, value });

    /* TODO:
        Remember to grow your buckets to double their capacity when your
        hash map exceeds the load factor. The methods mentioned later in
        this assignment can help you handle the growth logic, so you may
        want to leave implementing this particular behavior until later
      */
  }

  get(key) {
    const index = this.hash(key);

    this.#checkBoundaries(index);

    const bucket = this.#buckets[index];
    if (!bucket) {
      return undefined;
    }

    let node = bucket.headNode;
    while (node !== null) {
      if (node.value.key === key) {
        return node.value.value;
      }
      node = node.nextNode;
    }
    return undefined;
  }

  has(key) {
    const index = this.hash(key);

    this.#checkBoundaries(index);

    const bucket = this.#buckets[index];
    if (!bucket) {
      return false;
    }

    let node = bucket.headNode;
    while (node !== null) {
      if (node.value.key === key) {
        return true;
      }
      node = node.nextNode;
    }
    return false;
  }

  remove(key) {
    const index = this.hash(key);

    this.#checkBoundaries(index);

    const bucket = this.#buckets[index];
    if (!bucket) {
      return false;
    }

    let node = bucket.headNode;
    let position = 0;

    while (node !== null) {
      if (node.value.key === key) {
        bucket.removeAt(position);
        return true;
      }
      node = node.nextNode;
      position++;
    }
    return false;
  }
}
