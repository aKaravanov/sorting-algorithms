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
  let isSorting = false;

  let i;
  let j;

  window.addEventListener("load", initializePage);

  /** Set up things on load */
  function initializePage() {
    createCanvas();
    resetArray();
    setUpControls();
    drawCurrentState();
  }

  function setUpControls() {
    // Hide buttons
    resetAllButtons();
    document.getElementById("sortButton").style.display = "inline";

    // Add listeners to buttons
    document.getElementById("sortButton").addEventListener("click", sort);
    document.getElementById("pauseButton").addEventListener("click", pause);
    document.getElementById("resetButton").addEventListener("click", reset);
    document.getElementById("stepButton").addEventListener("click", step);

    // Add listeners to sliders
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

  function step() {
    if (!isSorting) {
      makeAnIteration();
      drawCurrentState();
    }
  }

  /**
   * Update the speed variable
   * @param {Event} event Trigger event
   */
  function pause(event) {
      switch(event.target.innerText) {
        case "Pause":
          window.cancelAnimationFrame(eventId);
          document.getElementById("stepButton").style.display = "inline";
          event.target.innerText = "Play";
          isSorting = false;
          break;
        case "Play":
          document.getElementById("stepButton").style.display = "none";
          eventId = window.requestAnimationFrame(draw);
          event.target.innerText = "Pause";
          isSorting = true;
          break;
        }
  }

  /**
   * Resets problem to adjust with a new size
   * @param {Event} event Trigger event
   */
  function reset() {
    isSorting = false;
    window.cancelAnimationFrame(eventId);
    let ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    resetArray();
    drawCurrentState();

    resetAllButtons();
    document.getElementById("sortButton").style.display = "inline";
  }

  /** Creates canvas DOM */
  function createCanvas() {
    setUpCanvas();
    document.getElementById('visualization').appendChild(canvas);
  }

  /** Performs sorting when button is pressed */
  function sort() {
    document.getElementById("sortButton").style.display = "none";
    document.getElementById("pauseButton").style.display = "inline";
    document.getElementById("resetButton").style.display = "inline";
    eventId = window.requestAnimationFrame(draw);
    isSorting = true;
  }

  function resetAllButtons() {
    Array.from(document.getElementsByTagName("button")).map((element) => {
      element.style.display = "none";
      return element;
    });

    document.getElementById("pauseButton").innerText = "Pause";
  }

  /** Draws sorting procedure on canvas */
  function draw() {
    // Make n number of iterations where n is controlled by selected speed
    for (let steps = 0; steps < speed; steps++) {
      makeAnIteration();
      // End iterations if hit end
      if (i === workingArray.length)
        break;
    }

    // Draw current state
    drawCurrentState();

    // Repeat if needed
    if (i < workingArray.length) {
      eventId = window.requestAnimationFrame(draw);
    } else {
      resetAllButtons();
      document.getElementById("resetButton").style.display = "inline";
    }
  }

  /** Sets up canvas object */
  function setUpCanvas() {
    canvas = document.createElement("CANVAS");
    canvas.id = "canvas";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.background = 'black';
    canvas.style.marginLeft = 'auto';
    canvas.style.marginRight = 'auto';
    canvas.style.display = 'block';
  }

  /** Using stored array, created virtual representation of it on canvas */
  function drawCurrentState() {
    let ctx = canvas.getContext('2d');

    // Reset
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all of the items
    for (let k = 0; k < workingArray.length; k++) {
      if (j === k) {
        ctx.fillStyle = "red";
      } else {
        ctx.fillStyle = "white";
      }
      ctx.fillRect(k*strokeWidth, canvas.height - workingArray[k],
        strokeWidth, workingArray[k]);
    }
  }

  function makeAnIteration() {
    if (workingArray[j] > workingArray[j + 1]) {
      swap(j);
    }
    j += 1;
    if (j === workingArray.length) {
      j = 0;
      i += 1;
    }
  }

  /**
   * Creates new random array of a given size
   * @param {String} size Reading from slider corresponding to size of the
   * problem
   */
  function resetArray() {
    console.log(document.getElementById("problemSizeSlider"));
    let size = document.getElementById("problemSizeSlider").value;
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
