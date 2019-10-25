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
  let timer = null;

  let i;
  let j;

  window.addEventListener("load", initializePage);

  /** Set up things on load */
  function initializePage() {
    createCanvas();
    resetArray();
    setUpControls();
    drawCurrentState();
    addBox();
    // timer = setInterval(updateBox, 200);
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
  async function sort() {
    await sortBooks();
    // document.getElementById("sortButton").style.display = "none";
    // document.getElementById("pauseButton").style.display = "inline";
    // document.getElementById("resetButton").style.display = "inline";
    // eventId = window.requestAnimationFrame(draw);
    // isSorting = true;
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

  function updateBox() {
    let box = document.querySelectorAll(".little-box")[0];
    let sides = [];

    let topSide = parseInt(window.getComputedStyle(box).top);
    let leftSide = parseInt(window.getComputedStyle(box).left);

    if (topSide >= 20) {
      sides.push("top");
    }

    if (topSide <= 480) {
      sides.push("bottom");
    }

    if (leftSide >= 20) {
      sides.push("left");
    }

    if (leftSide <= 480) {
      sides.push("right");
    }

    let randomSideIndex = Math.floor(Math.random() * sides.length);
    let randomSide = sides[randomSideIndex];

    switch (randomSide) {
      case "top":
        box.style.top = topSide - 20 + "px";
        break;
      case "right":
        box.style.left = leftSide + 20 + "px";
        break;
      case "left":
        box.style.left = leftSide - 20 + "px";
        break;
      case "bottom":
        box.style.top = topSide + 20 + "px";
        break;
    }
  }

  function addBox() {
    let size = document.getElementById("problemSizeSlider").value;
    const COLORS = ["#e6194B", "#3cb44b", "#ffe119", "#4363d8", "#f58231",
      "#911eb4", "#42d4f4", "#f032e6", "#bfef45", "#fabebe", "#469990",
      "#e6beff", "#9A6324", "#a9a9a9", "#800000", "#aaffc3", "#808000",
      "#ffd8b1", "#000075"];
    const letters = ("abcdefghijklmnopqrstuvwxyz").toUpperCase().split("");
    shuffle(COLORS);
    shuffle(letters);
    // size = COLORS.length;
    size = 10;
    let index = 0;

    while (size > 0) {
      let littleBox = document.createElement("div");
      let letter = letters[size-1];
      let color = COLORS[size-1];
      littleBox.innerHTML = `<p>${letter}</p>`;
      littleBox.style.background = color;
      littleBox.classList.add("little-box");
      littleBox.addEventListener("click", moveBox);
      document.getElementById("vis").appendChild(littleBox);
      size-=1;
      index+=1;
    }
  }

  async function sortBooks() {
    let books = document.getElementById("vis");
    for (let index = 0; index < books.children.length; index++) {
      for (let index2 = 0; index2 < books.children.length - 1; index2++) {
        let book = books.children[index2];
        let nextBook = book.nextSibling;
        let b1 = book.children[0].innerText;
        let b2 = nextBook.children[0].innerText;
        if (b1 > b2) {
          await moveBox(book);
        }
      }
    }
  }

  async function moveBox(box) {
    let topSide = parseInt(window.getComputedStyle(box).top);
    let leftSide = parseInt(window.getComputedStyle(box).left);

    return new Promise((resolve, reject) => {
      new Promise((resolve, reject) => {
        let timer = setInterval(function(){
          if (topSide >= -200) {
            topSide -= 20;
            box.style.top = topSide + "px";
          } else {
            resolve();
            clearInterval(timer);
          }
        }, 25);
      }).then(() => {
          swapWithNeighbour(box);
          new Promise((resolve, reject) => {
            let timer = setInterval(async function(){
              if (topSide < 0) {
                topSide += 20;
                box.style.top = topSide + "px";
              } else {
                resolve();
                clearInterval(timer);
              }
            }, 25);
          })
      }).then(resolve());
    })
  }

  async function moveBack(box) {
    let topSide = parseInt(window.getComputedStyle(box).top);
  }

  function swapWithNeighbour(box) {
    let next = box.nextSibling;

    if (next) {
      box.parentNode.insertBefore(next, box);
    }
  }

  /**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
  }


})();
