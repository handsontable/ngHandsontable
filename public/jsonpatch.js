/* JSONPatch.js
 *
 * A Dharmafly project written by Thomas Parslow
 * <tom@almostobsolete.net> and released with the kind permission of
 * NetDev.
 *
 * Copyright 2011 Thomas Parslow. All rights reserved.
 * Permission is hereby granted,y free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE. 
 *
 * Implements the JSON Patch IETF Draft as specified at:
 *
 *   http://tools.ietf.org/html/draft-pbryan-json-patch-01
 *
 * Also implements the JSON Pointer IETF Draft as specified at:
 *
 *   http://tools.ietf.org/html/draft-pbryan-zyp-json-pointer-02
 *
 */
(function (exports) {
  var apply_patch, JSONPatch, JSONPointer,_operations,isArray;

  // Taken from underscore.js
  isArray = Array.isArray || function(obj) {
    return Object.prototype.toString.call(obj) == '[object Array]';
  };  
  
  /* Public: Shortcut to apply a patch to a document without having to
   * create a patch object first. Returns the patched document.
   *
   * doc - The target document to which the patch should be applied.
   *       May be mutated
   * patch - A JSON Patch document specifying the changes to the
   *         target documentment
   *
   * Example (node.js)
   *
   *    jsonpatch = require('jsonpatch');
   *    doc = JSON.parse(sourceJSON);
   *    jsonpatch.apply_patch(mydoc, thepatch);
   *    destJSON = JSON.stringify(doc);
   *
   * Example (in browser)
   *    
   *     <script src="jsonpatch.js" type="text/javascript"></script>
   *     <script type="application/javascript">
   *      doc = JSON.parse(sourceJSON);
   *      jsonpatch.apply_patch(mydoc, thepatch);
   *      destJSON = JSON.stringify(doc);
   *     </script>
   *
   * Returns the patched document
   */
  exports.apply_patch = apply_patch = function (doc, patch) {
    return (new JSONPatch(patch)).apply(doc);
  };

  /* Public: Error thrown if the patch supplied is invalid.
   */
  function InvalidPatch(message) {
    Error.call(this, message); this.message = message;
  }
  exports.InvalidPatch = InvalidPatch;
  InvalidPatch.prototype = new Error();
  /* Public: Error thrown if the patch can not be apllied to the given document
   */
  function PatchApplyError(message) {
    Error.call(this, message); this.message = message;
  }
  exports.PatchApplyError = PatchApplyError;
  PatchApplyError.prototype = new Error();

  /* Public: A class representing a JSON Pointer. A JSON Pointer is
   * used to point to a specific sub-item within a JSON document.
   *
   * Example (node.js);
   *
   *     jsonpatch = require('jsonpatch');
   *     var pointer = new jsonpatch.JSONPointer('/path/to/item');
   *     var item = pointer.follow(doc)
   *
   * Draft Spec: http://tools.ietf.org/html/draft-pbryan-zyp-json-pointer-00
   */
  exports.JSONPointer = JSONPointer = function JSONPointer (pathStr) {
    var i,split,path=[];
    // Split up the path
    split = pathStr.split('/');
    if ('' !== split[0]) {
      throw new InvalidPatch('JSONPointer must start with a slash (or be an empty string)!');
    }
    for (i = 1; i < split.length; i++) {
      path[i-1] = decodeURIComponent(split[i]);
    }
    this.path = path;
    this.length = path.length;
  };

  /* Private: Get a segment of the pointer given a current doc
   * context.
   */
  JSONPointer.prototype._get_segment = function (index, doc) {
    var segment = this.path[index];
    if(isArray(doc)) {
      segment = parseInt(segment,10);
      if (isNaN(segment) || segment < 0) {
        throw new PatchApplyError('Expected a number to segment an array');
      }
    }
    return segment;
  };

  /* Private: Follow the pointer to its penultimate segment then call
   * the handler with the current doc and the last key (converted to
   * an int if the current doc is an array).
   *
   * doc - The document to search withing
   * handler - The callback function to handle the last part
   *
   * Returns the result of calling the handler
   */ 
  JSONPointer.prototype._action = function (doc, handler) {
    var i,segment;
    for (i = 0; i < this.length-1; i++) {
      segment = this._get_segment(i, doc);
      if (!Object.hasOwnProperty.call(doc,segment)) {
        throw new PatchApplyError('Path not found in document');
      }
      doc = doc[segment];
    }
    return handler(doc, this._get_segment(this.length-1, doc));
  };

  /* Public: Takes a JSON document and a value and adds the value into
   * the doc at the position pointed to. If the position pointed to is
   * in an array then the existing element at that position (if any)
   * and all that follow it have there position incremented to make
   * room. It is an error to add to a parent object that doesn't exist
   * or to try to replace an existing value in an object.
   *
   * doc - The document to operate against. May be mutated.
   * value - The value to insert at the position pointed to
   *
   * Examples
   *
   *    var doc = new JSONPointer("/obj/new").add({obj: {old: "hello"}}, "world");
   *    // doc now equals {obj: {old: "hello", new: "world"}}
   *
   * Returns the updated doc (the value passed in may also have been mutated)
   */
  JSONPointer.prototype.add = function (doc, value) {
    // Special case for a pointer to the root
    if (0 === this.length) {
      // Adding the root only works if there is no root already (if
      // the doc is undefined)
      if ('undefined' === typeof doc) {
        return value;
      } else {
        throw new PatchApplyError('Add operation must not point to an existing value!');
      }
    }
    return this._action(doc, function (node, lastSegment) {
      if (isArray(node)) {
        if (lastSegment > node.length) {
          throw new PatchApplyError('Add operation must not attempt to create a sparse array!');
        }
        node.splice(lastSegment, 0, value);
      } else {
        if (Object.hasOwnProperty.call(node,lastSegment)) {
          throw new PatchApplyError('Add operation must not point to an existing value!');
        }
        node[lastSegment] = value;
      }
      return doc;
    });
  };


  /* Public: Takes a JSON document and removes the value pointed to.
   * It is an error to attempt to remove a value that doesn't exist.
   *
   * doc - The document to operate against. May be mutated.
   *
   * Examples
   *
   *    var doc = new JSONPointer("/obj/old").add({obj: {old: "hello"}});
   *    // doc now equals {obj: {}}
   *
   * Returns the updated doc (the value passed in may also have been mutated)
   */  
  JSONPointer.prototype.remove = function (doc) {
    // Special case for a pointer to the root
    if (0 === this.length) {
      // Removing the root makes the whole value undefined.
      // NOTE: Should it be an error to remove the root if it is
      // ALREADY undefined? I'm not sure...
      return undefined;
    }
    return this._action(doc, function (node, lastSegment) {
        if (!Object.hasOwnProperty.call(node,lastSegment)) {
          throw new PatchApplyError('Remove operation must point to an existing value!');
        }
        if (isArray(node)) {
          node.splice(lastSegment, 1);
        } else {
          delete node[lastSegment];
        }
      return doc;
    });
  };

  /* Public: Semantically equivalent to an remove followed by an add
   * except when the pointer points to the root element in which case
   * the whole document is replaced.
   *
   * doc - The document to operate against. May be mutated.
   *
   * Examples
   *
   *    var doc = new JSONPointer("/obj/old").replace({obj: {old: "hello"}}, "world");
   *    // doc now equals {obj: {old: "world"}}
   *
   * Returns the updated doc (the value passed in may also have been mutated)
   */    
  JSONPointer.prototype.replace = function (doc, value) {
    return this.add(this.remove(doc), value);
  };

  /* Public: Returns the value pointed to by the pointer in the given doc.
   *
   * doc - The document to operate against. 
   *
   * Examples
   *
   *    var value = new JSONPointer("/obj/value").get({obj: {value: "hello"}});
   *    // value now equals 'hello'
   *
   * Returns the value
   */    
  JSONPointer.prototype.get = function (doc, value) {
    return this._action(doc, function (node, lastSegment) {
      return node[lastSegment];
    });
  };  

  _operations = {
    add: JSONPointer.prototype.add,
    remove: JSONPointer.prototype.remove,
    replace: JSONPointer.prototype.replace
  };

  function make_operation(pointer, method, value) {
    return function (doc) {
      return method.call(pointer,doc, value);
    };
  }
  

  /* Public: A class representing a patch.
   *
   *  patch - The patch as an array or as a JSON string (containing an array)
   */
  exports.JSONPatch = JSONPatch = function JSONPatch(patch) {
    this._compile(patch);
  };

  JSONPatch.prototype._compile = function (patch) {
    var i, n, key, op, path, value, pointer;

    this.compiledOps = [];
    
    if ('string' === typeof patch) {
      patch = JSON.parse(patch);
    }
    
    if(!isArray(patch)) {
      throw new InvalidPatch('Patch must be an array of operations');
    }
    
    for (i = 0; i < patch.length; i++) {
      op = null;
      // Check all the keys, we're being strict about conformance to
      // the RFC
      for (key in patch[i]) {
        if (_operations.hasOwnProperty(key)) {
          if (op) {
            throw new InvalidPatch('Only one operation allowed per block!');
          }
          op = key;
          path = patch[i][op];
        } else if ('value' !== key) {
          if (Object.hasOwnProperty.call(patch[i],key)) {
            throw new InvalidPatch('Invalid operation!');
          }
        }
      }
      
      // Make sure an op was supplied
      if (null === op) {
        throw new InvalidPatch('Operation missing!');
      }
      
      // Check that the value is or is not provided as required by the
      // op
      value = patch[i].value;
      if ('remove' === op && 'undefined' !== typeof (value)) {
        throw new InvalidPatch('"remove" operation should not have a "value"!');
      } else if ('remove' !== op && 'undefined' === typeof (value)) {
        throw new InvalidPatch('"' + op + '" operation should have a "value"!');
      }
      pointer = new JSONPointer(path);
      this.compiledOps[i] = make_operation(pointer, _operations[op], value);
    }
  };

  /* Public: Apply the patch to a document and returns the patched
   * document. The original may be mutated.
   *
   * doc - The document to which the patch should be applied. May be
   * mutated.
   *
   * Returns the patched document (original may be mutated too)
   */
  exports.JSONPatch.prototype.apply = function (doc) {
    var i;
    for(i = 0; i < this.compiledOps.length; i++) {
      doc = this.compiledOps[i](doc);
    }
    return doc;
  };
})('object' === typeof module ? module.exports : (window.jsonpatch = {}));
