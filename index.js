/** @namespace rebubble */
var rebubble = (function () {

  /** Finds the first element between the event target and the 'top' element
    * (probably the element on which the handler is registered)
    * that satisfies a CSS-style selector
    * @memberof rebubble
    * @param {string} selector a CSS-style selector
    * @param {DOMnode} top only elements between the event target and this argument
    * will be checked
    * @param {DOMevent} event the event that you want to rebubble
    * @returns {DOMnode} the node closest to the event target that satisfies
    * the selector
    */
  function rebubble(selector, top, event) {

    var target = event.target;
    var levels = selector.split(' ').reverse();
    return checkConditions (levels, top, target);

  }

  /** Checks that the target satisfies all the conditions of the selector
    * @memberof rebubble
    * @param {array} levels an array of conditions that the node and nodes above
    * it must satisfy
    * @param {DOMnode} top only elements between the event target and this argument
    * will be checked
    * @param {DOMnode} target the node that may satisfy all the conditions
    * @returns {Maybe(DOMnode)} Not really a Maybe. The first node that satisfies
    * all the conditions, or false if none do
    */
  function checkConditions(levels, top, target){
    var node = target;
    var nodeIsPossible = levelSatisfied(levels[0], node);
    if (nodeIsPossible && levels.slice(1).every(thisOrAbove(node))) {return target; }
    if (target === top) { return false; }
    return checkConditions(levels, top, target.parentNode);
  }

  /** Checks if this node or one above it satisfies all the conditions in a level
    * of a selector
    * @memberof rebubble
    * @param {DOMnode} node The node to start with
    * @returns {Boolean} True if the node satisfies, false if not.
    */
  function thisOrAbove (node) {
    return function thisNode(level){
      var current = node;
      node = node.parentNode;
      if (levelSatisfied(level, current)) { return true; }
      if (current === top){ return false; }
      return thisNode(level);
    };
  }

  /** Checks if this node satisfies a level of a selector
    * @memberof rebubble
    * @param {String} level The level the node must satisfy
    * @param {DOMnode} node The node being checked
    * @returns {Boolean} True if the node satisfies, false if not.
    */
  function levelSatisfied(level, node){
    var conditions = getConditions(level);
    return conditions.every(function(condition){
      return translate(condition)(node);
    });
  }

  /** Turns a string condition into a function
    * @memberof rebubble
    * @param {String} condition The condition to be translated into a function
    * @returns {Function} A function that returns true if the node satisfies the
    * condition and false otherwise
    */
  function translate (condition) {
    return function (node) {
      if (condition[0] === '.') { return node.className.indexOf(condition.slice(1)) !== -1; }
      if (condition[0] === '#') { return node.id === condition.slice(1); }
      return tagChecker(condition, node);
    };
  }

  /** Checks if a node is a specific tag
    * @memberof rebubble
    * @param {String} tag The tag the node is checked against
    * @param {DOMnode} The node to be checked
    * @returns {Boolean} True if the node is that tag, false otherwise
    */
  function tagChecker (tag, node) {
    return tag.toUpperCase() === node.nodeName;
  }

  /** Gets all the conditions from a level
    * @memberof rebubble
    * @param {String} conjuctiveSelector The selector to be turned into conditions
    * @returns {Array(String)} An array of conditions on a node
    */
  function getConditions (conjuctiveSelector) {
    if (!conjuctiveSelector.length){ return []; }
    var start = conjuctiveSelector.search(/[\.\#]/);
    var end;
    if (start === -1) { end = 0; }
    else if (start > 0) { end = start; }
    else { end = conjuctiveSelector.slice(start + 1).search(/[\.\#]/) + 1; }

    return chunkMapper(getConditions, end, conjuctiveSelector);
  }

  /** Maps sections of an enumerable to elements of an array
    * @memberof rebubble
    * @param {Function} func The function that maps sections to elements
    * @param {Number} index The length of the section to be mapped
    * @param {Enumerable} list The enumerable to be mapped
    * @returns {Array} An array of the images of the sections under the map
    */
  function chunkMapper(func, index, list){
    return [slice(0, index, list)].concat(func(slice(index, list)));
  }


  /** Data-last version of slice that deals with the slice(0, 0) edgecase
    * differently from default slice.
    * @memberof rebubble
    * @param {Number} start The place to start the slice
    * @param [Number] end The place to end the slice
    * @param {Enumerable} list The enumerable to be slice
    * @returns {Enumerable} An slice of list
    */
  function slice (start, end, list) {
    if (typeof end !== 'number') {
      if (start === 0) {
        return end.slice(0, 0);
      }
      return end.slice(start);
    }
    if (start === 0 && end === 0) return list;
    return list.slice(start, end);
  }

  return rebubble;

}());


/** A helper function that can be called when assigning a listener to an object
  * not inline. Allows you to pass only two arguments to rebubble.
  * The 'this' argument of the rebubble.handy.call should be 'this'.
  * @memberof rebubble
  * @param {string} selector a CSS-style selector
  * @param {DOMnode} self only elements between the event target and this argument
  * will be checked
  * @param {DOMevent} event the event that you want to rebubble
  * @returns {DOMnode} the node closest to the event target that satisfies
  * the selector
  */
rebubble.handy = function(selector, self, event){
  if (!event){
    event = self;
    self = this;
  }
  return rebubble(selector, self, event);
};
