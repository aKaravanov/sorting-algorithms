/*
 * Name: Andrei Karavanov
 * Date: October 16, 2019
 * Section: CSE 154 AB
 *
 * This is a .js file that find a list of algorithms on every page and sets
 * it to have a different color.
 */

"use strict";
(function() {
  const ARRAY_OF_COLORS = ['red', 'blue', 'green'];
  window.addEventListener("load", initializePage);

  /** Set up things on load */
  function initializePage() {
    colorList();
  }

  /** This function colors the list of algorithms in different colors. */
  function colorList() {
    try {
      let listOfAlgorithms = document
        .getElementsByClassName("algorithmsList")[0]
        .getElementsByTagName("a");
      Array.from(listOfAlgorithms).map((elm, index) => {
        elm.style.color = ARRAY_OF_COLORS[index % (ARRAY_OF_COLORS.length)];
        return elm;
      });
    } catch (err) {
      // Do something eles istead?
      console.error(err);
    }
  }
})();
