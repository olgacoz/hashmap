import HashMap from "./HashMap";

let hashMap;
beforeEach(() => {
  hashMap = new HashMap();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("hash method", () => {
  test("order matters", () => {
    expect(hashMap.hash("ab")).not.toBe(hashMap.hash("ba"));
  });

  test.each([
    "Hello",
    "Yo! What's up?",
    "This is a very very veryyy long string",
    "",
    "!@0129u3asdk lqwh!=21++eqjhdsaoijqwe",
    "o",
    "p",
  ])("returns hash code in range [0, capacity) for '%s'", (key) => {
    const index = hashMap.hash(key);
    expect(index).toBeGreaterThanOrEqual(0);
    expect(index).toBeLessThan(hashMap.capacity);
  });

  test("hash function is deterministic for the same input", () => {
    expect(hashMap.hash("testKey")).toBe(hashMap.hash("testKey"));
  });
});

describe("set method", () => {
  test("inserts a new key-value pair into an empty bucket", () => {
    hashMap.set("123", "Olgac");

    const index = hashMap.hash("123");
    const bucket = hashMap.buckets[index];

    expect(bucket).toBeDefined();
    expect(bucket.size()).toBe(1);
    expect(bucket.headNode.value).toEqual({
      key: "123",
      value: "Olgac",
    });
  });

  test("updates value when key already exists in bucket", () => {
    hashMap.set("123", "Olgac");
    hashMap.set("123", "Joe");

    const index = hashMap.hash("123");
    const bucket = hashMap.buckets[index];

    expect(bucket.size()).toBe(1);
    expect(bucket.headNode.value).toEqual({
      key: "123",
      value: "Joe",
    });
  });

  test("handles collision by keeping both key-value pairs in the same bucket", () => {
    jest.spyOn(hashMap, "hash").mockReturnValue(3);

    hashMap.set("firstKey", "Value 1");
    hashMap.set("secondKey", "Value 2");

    const bucket = hashMap.buckets[3];

    expect(bucket.size()).toBe(2);

    const nodeValues = [bucket.headNode.value, bucket.headNode.nextNode.value];
    expect(nodeValues).toContainEqual({ key: "firstKey", value: "Value 1" });
    expect(nodeValues).toContainEqual({ key: "secondKey", value: "Value 2" });
  });

  test("automatically resizes and re-hashes entries when load factor threshold is exceeded", () => {
    const initialCapacity = hashMap.capacity;
    const threshold = Math.floor(initialCapacity * 0.75);

    for (let i = 0; i < threshold; i++) {
      hashMap.set(`key${i}`, `value${i}`);
    }

    expect(hashMap.capacity).toBe(initialCapacity);

    hashMap.set(`key${threshold}`, `value${threshold}`);

    expect(hashMap.capacity).toBe(initialCapacity * 2);
    expect(hashMap.length()).toBe(threshold + 1);

    for (let i = 0; i <= threshold; i++) {
      expect(hashMap.get(`key${i}`)).toBe(`value${i}`);
    }
  });

  test("does not resize when updating an existing key at the threshold", () => {
    const loadFactor = 0.75;
    const initialCapacity = 16;
    const hashMap = new HashMap(loadFactor, initialCapacity);
    const threshold = Math.floor(loadFactor * initialCapacity);

    for (let i = 0; i < threshold; i++) {
      hashMap.set(`key${i}`, `value${i}`);
    }

    const previousLength = hashMap.length();
    const previousCapacity = hashMap.capacity;

    hashMap.set("key0", "updatedValue");

    expect(hashMap.get("key0")).toBe("updatedValue");
    expect(hashMap.length()).toBe(previousLength);
    expect(hashMap.capacity).toBe(previousCapacity);
  });
});

describe("get method", () => {
  test("returns undefined for empty HashMap", () => {
    expect(hashMap.get("no such key")).toBeUndefined();
  });

  test("returns undefined if there is no such a key", () => {
    hashMap.set("std. 1", "Michael");
    hashMap.set("std. 2", "Morgan");

    expect(hashMap.get("std. 3")).toBeUndefined();
  });

  test("returns the associated value if key is found", () => {
    hashMap.set("1234", "admin");
    const index = hashMap.hash("1234");

    jest.spyOn(hashMap, "hash").mockReturnValue(index);
    hashMap.set("1235", "user");
    hashMap.set("1236", "guest");

    expect(hashMap.get("1234")).toBe("admin");
    expect(hashMap.get("1235")).toBe("user");
    expect(hashMap.get("1236")).toBe("guest");
  });
});

describe("has method", () => {
  test("returns false for empty HashMap", () => {
    expect(hashMap.has("123")).toBe(false);
  });

  test("returns false if key is not in the hash map", () => {
    hashMap.set("hello", "world");
    hashMap.set("random", "stuff");
    expect(hashMap.has("modnar")).toBe(false);
  });

  test("return true if key is in the hash map", () => {
    hashMap.set("1234", "admin");
    const index = hashMap.hash("1234");

    jest.spyOn(hashMap, "hash").mockReturnValue(index);
    hashMap.set("1235", "user");
    hashMap.set("1236", "guest");

    expect(hashMap.has("1234")).toBe(true);
    expect(hashMap.has("1235")).toBe(true);
    expect(hashMap.has("1236")).toBe(true);
  });
});

describe("remove method", () => {
  test("removes the entry with associated key and returns true", () => {
    hashMap.set("1234", "admin");
    const index = hashMap.hash("1234");
    const bucket = hashMap.buckets[index];

    jest.spyOn(hashMap, "hash").mockReturnValue(index);
    hashMap.set("1235", "user");
    hashMap.set("1236", "guest");

    expect(hashMap.remove("1235")).toBe(true);
    expect(bucket.size()).toBe(2);
    expect(hashMap.remove("1234")).toBe(true);
    expect(hashMap.remove("1236")).toBe(true);
    expect(bucket.size()).toBe(0);
  });

  test("returns false if key isn't in the hash map", () => {
    hashMap.set("1234", "admin");
    expect(hashMap.remove("1235")).toBe(false);
  });
});

describe("length method", () => {
  test("returns 0 for empty hash map", () => {
    expect(hashMap.length()).toBe(0);
  });

  test("returns number of stored keys in hash map", () => {
    hashMap.set("Hello", "World");
    hashMap.set("123", "Admin");
    hashMap.set("James", "Bond");
    hashMap.set("2823", "user");

    expect(hashMap.length()).toBe(4);
  });
});

describe("clear method", () => {
  test("removes all entries in the hash map", () => {
    hashMap.set("Hello", "World");
    hashMap.set("123", "Admin");
    hashMap.set("James", "Bond");
    hashMap.set("2823", "user");

    hashMap.clear();
    expect(hashMap.length()).toBe(0);
    expect(hashMap.buckets.length).toBe(hashMap.capacity);
  });

  test("removes all entries of empty hash map", () => {
    hashMap.clear();
    expect(hashMap.length()).toBe(0);
    expect(hashMap.buckets.length).toBe(hashMap.capacity);
  });
});

describe("keys method", () => {
  test("returns array containing all the keys inside hash map.", () => {
    jest
      .spyOn(hashMap, "hash")
      .mockReturnValueOnce(3)
      .mockReturnValueOnce(3)
      .mockReturnValueOnce(3)
      .mockReturnValueOnce(2)
      .mockReturnValueOnce(2);

    hashMap.set("9213", "user");
    hashMap.set("821", "banned");
    hashMap.set("91234", "banned");
    hashMap.set("921", "high stake player");
    hashMap.set("2823", "admin");

    const keys = hashMap.keys().sort();
    const expected = ["9213", "821", "91234", "921", "2823"].sort();

    expect(keys).toEqual(expected);
  });

  test("returns empty array if hash map is empty", () => {
    expect(hashMap.keys()).toEqual([]);
  });
});

describe("values method", () => {
  test("returns array containing all the values inside hash map", () => {
    jest
      .spyOn(hashMap, "hash")
      .mockReturnValueOnce(3)
      .mockReturnValueOnce(3)
      .mockReturnValueOnce(3)
      .mockReturnValueOnce(2)
      .mockReturnValueOnce(2);

    hashMap.set("9213", "user");
    hashMap.set("821", "banned");
    hashMap.set("91234", "banned");
    hashMap.set("921", "high stake player");
    hashMap.set("2823", "admin");

    const values = hashMap.values().sort();
    const expected = [
      "user",
      "banned",
      "banned",
      "high stake player",
      "admin",
    ].sort();

    expect(values).toEqual(expected);
  });

  test("returns empty array if hash map is empty", () => {
    expect(hashMap.values()).toEqual([]);
  });
});

describe("entries method", () => {
  test("returns array of all key-value pairs of a hash map in their own arrays", () => {
    jest
      .spyOn(hashMap, "hash")
      .mockReturnValueOnce(3)
      .mockReturnValueOnce(3)
      .mockReturnValueOnce(3)
      .mockReturnValueOnce(2)
      .mockReturnValueOnce(2);

    hashMap.set("9213", "user");
    hashMap.set("821", "banned");
    hashMap.set("91234", "banned");
    hashMap.set("921", "high stake player");
    hashMap.set("2823", "admin");

    const entries = hashMap.entries();
    const expected = [
      ["9213", "user"],
      ["821", "banned"],
      ["91234", "banned"],
      ["921", "high stake player"],
      ["2823", "admin"],
    ];

    expect(entries).toHaveLength(expected.length);
    expect(entries).toEqual(expect.arrayContaining(expected));
  });

  test("returns empty array if hash map is empty", () => {
    expect(hashMap.entries()).toEqual([]);
  });
});
