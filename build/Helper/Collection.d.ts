export default class Collection<T> extends Map {
    private baseObject;
    private limit;
    /**
     * Construct a Collection
     * @arg {Class} baseObject The base class for all items
     * @arg {Number} [limit] Max number of items to hold
     */
    constructor(baseObject: any, limit?: number);
    /**
     * Add an object
     * @arg {Object} obj The object data
     * @arg {String} obj.identifier The ID of the object
     * @arg {Class?} extra An extra parameter the constructor may need
     * @arg {Boolean} replace Whether to replace an existing object with the same ID
     * @returns {Class} The existing or newly created object
     */
    add(obj: any, extra?: any, replace?: boolean): T;
    /**
     * Return the first object to make the function evaluate true
     * @arg {function} func A function that takes an object and returns true if it matches
     * @returns {Class?} The first matching object, or undefined if no match
     */
    find(func: any): T | undefined;
    /**
     * Get a random object from the Collection
     * @returns {Class?} The random object, or undefined if there is no match
     */
    random(): T | undefined;
    /**
     * Return all the objects that make the function evaluate true
     * @arg {function} func A function that takes an object and returns true if it matches
     * @returns {Array<Class>} An array containing all the objects that matched
     */
    filter(func: any): T[];
    /**
     * Return an array with the results of applying the given function to each element
     * @arg {function} func A function that takes an object and returns something
     * @returns {Array} An array containing the results
     */
    map(func: any): any;
    /**
     * Update an object
     * @arg {Object} obj The updated object data
     * @arg {String} obj.identifier The ID of the object
     * @arg {Class?} extra An extra parameter the constructor may need
     * @arg {Boolean} replace Whether to replace an existing object with the same ID
     * @returns {Class} The updated object
     */
    update(obj: any, extra: any, replace: any): T;
    /**
     * Remove an object
     * @arg {Object} obj The object
     * @arg {String} obj.identifier The ID of the object
     * @returns {Class?} The removed object, or null if nothing was removed
     */
    remove(obj: any): T;
    toString(): string;
}
