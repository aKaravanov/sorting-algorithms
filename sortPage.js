/*
 * Name: Andrei Karavanov
 * Date: October 16, 2019
 * Section: CSE 154 AB
 *
 * This is a .js file that manages visualization for bubble sort.
 */
"use strict";
(function() {
  let eventId;
  let workingArray;
  let canvas;
  let strokeWidth;
  let speed = 1;

  let i;
  let j;

  window.addEventListener("load", initializePage);

  /** Set up things on load */
  function initializePage() {
    createCanvas();
    resetArray();
    drawCurrentState();

    document.getElementById("sortButton").addEventListener("click", sort);
    document.getElementById("problemSizeSlider")
      .addEventListener("input", reset);
    document.getElementById("speedSlider")
      .addEventListener("input", speedUpdate);
  }

  /**
   * Update the speed variable
   * @param {Event} event Trigger event
   */
  function speedUpdate(event) {
    speed = Math.round(1.0 * parseInt(event.target.value) / 10.0) + 1;
  }

  /**
   * Resets problem to adjust with a new size
   * @param {Event} event Trigger event
   */
  function reset(event) {
    window.cancelAnimationFrame(eventId);
    let ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    resetArray(event.target.value);
    drawCurrentState();
  }

  /** Creates canvas DOM */
  function createCanvas() {
    setUpCanvas();
    document.getElementById('visualization').appendChild(canvas);
  }

  /** Performs sorting when button is pressed */
  function sort() {
    eventId = window.requestAnimationFrame(draw);
  }

  /** Draws sorting procedure on canvas */
  function draw() {
    let ctx = canvas.getContext('2d');

    // Reset
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Make n number of iterations where n is controlled by selected speed
    for (let steps = 0; steps < speed; steps++) {
      if (workingArray[j] > workingArray[j + 1]) {
        swap(j);
      }
      j += 1;
      if (j === workingArray.length) {
        j = 0;
        i += 1;
      }
    }

    // Draw current state
    drawCurrentState();

    // Repeat if needed
    if (i < canvas.width) {
      eventId = window.requestAnimationFrame(draw);
    }
  }

  /** Sets up canvas object */
  function setUpCanvas() {
    canvas = document.createElement("CANVAS");
    canvas.id = "canvas";
    canvas.width = 600;
    canvas.height = 300;
    canvas.style.background = 'black';
    canvas.style.marginLeft = 'auto';
    canvas.style.marginRight = 'auto';
    canvas.style.display = 'block';
  }

  /** Using stored array, created virtual representation of it on canvas */
  function drawCurrentState() {
    let temp = canvas.getContext("2d");
    for (let k = 0; k < workingArray.length; k++) {
      temp.beginPath();
      temp.lineWidth = strokeWidth;
      temp.moveTo((k + 0.5) * strokeWidth, canvas.height);
      temp.lineTo((k + 0.5) * strokeWidth, canvas.height - workingArray[k]);
      temp.strokeStyle = "white";
      temp.stroke();
    }
  }

  /**
   * Creates new random array of a given size
   * @param {String} size Reading from slider corresponding to size of the
   * problem
   */
  function resetArray(size = 100) {
    workingArray = [];
    let lengthOfArray = parseInt(size) + 5;
    strokeWidth = canvas.width / lengthOfArray;

    for (let m = 0; m < lengthOfArray; m++) {
      workingArray[workingArray.length] = Math.floor(Math.random() *
        Math.floor(canvas.height - 10));
    }

    i = 0;
    j = 0;
  }

  /**
   * Swaps array[q] and array[q+1] neighbours
   * @param {ineger} q Location in the array of the first number to swap
   */
  function swap(q) {
    let temp = workingArray[q + 1];
    workingArray[q + 1] = workingArray[q];
    workingArray[q] = temp;
  }
})();
