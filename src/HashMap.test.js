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

  test("throws TypeError in length() after setting a bucket slot to undefined", () => {
    // 1. Eleman ekliyoruz -> Bu kova için new LinkedList() oluşturulur
    hashMap.set("key1", "val1");
    const index = hashMap.hash("key1");

    // 2. Bir şekilde kovayı sildik veya açıkça undefined atadık
    // (Örn: remove metodunda kova tamamen boşalınca silindiyse veya doğrudan erişimde)
    hashMap.buckets[index] = undefined;

    // 3. Artık indeks 'empty slot' değil, değeri 'undefined' olan bir elemandır!
    // forEach artık bu indeksi atlamaz ve bucket.size() çağırırken PATLAR.
    expect(() => hashMap.length()).not.toThrow();
  });
});
