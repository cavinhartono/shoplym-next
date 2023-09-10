document.querySelectorAll(".slider").forEach((container) => {
  // Setup variables
  const items = container.querySelectorAll(".slide"),
    itemsMax = items.length - 1;
  const next = container.querySelector(".next"),
    prev = container.querySelector(".prev"),
    dots = container.querySelector(".dots");
  let index = 0;
  const move = 100;
  const timer = 1500;
  const duration = 0.5;
  let autoplay;
  //--------------------------------//
  // 💾 Inital setup
  //--------------------------------//
  function init() {
    // Create 🟣 Dots
    items.forEach((item, index) => {
      const dot = document.createElement("li");
      if (index === 0) dot.classList.add("active"); // Set the first dot to active
      // Allow clicking the dots
      dot.addEventListener("click", () => {
        slideLogic(false, index);
      });

      if (dots) dots.appendChild(dot);
    });
    // Animate the first element in
    gsap.set(items, { autoAlpha: 0 });
    gsap.set([".slider", items[index]], { autoAlpha: 1 });
    gsap.from(items[index], { autoAlpha: 0, x: move });
    autoplay = window.setTimeout(slideLogic, timer);
  }
  // Run inital setup
  init();
  // END 💾 Inital setup --------------//

  //--------------------------------//
  // ☝️ Touch
  //--------------------------------//
  if (window.Draggable) {
    Draggable.create(items, {
      type: "x", // Drag only on the X axis
      zIndexBoost: false,
      onDragStart: function () {
        window.clearTimeout(autoplay); // disable autoplay
        slideLogic(this.getDirection() === "right" ? true : false);
      },
    });
  }
  // END ☝️ Touch  --------------//

  //--------------------------------//
  // Set active 🟣 dot
  //--------------------------------//
  function dotActive(index) {
    const dotsAll = dots.querySelectorAll("li");
    dotsAll.forEach((dot) => {
      dot.classList.remove("active");
    });
    dotsAll[index].classList.add("active");
  }
  // END Set active 🟣 dot --------------//

  //--------------------------------//
  // 🖼️ Slide animation
  //--------------------------------//
  function slideAnimation(index, moveIn, outIn) {
    // Reset the properties you are animating below
    // Ohter wise they animate from that positon (probalby not visable)
    gsap.set(items, { xPercent: 0, scale: 1 });
    gsap.set(items[moveIn], { autoAlpha: 1 });

    const text = new SplitText(items[moveIn].querySelector("h1"), {
      type: "chars",
    });
    const textOut = new SplitText(items[index].querySelector("h1"), {
      type: "chars",
    });

    // The animation
    const tl = gsap.timeline({
      defaults: {
        duration: duration,
      },
      onStart: animationStart,
      onComplete: animationDone,
    });
    // Move out slide
    // tl.fromTo('h1', {y:0, autoAlpha: 1}, {y: -50, autoAlpha: 0}); // THIS HERE should be staggered
    tl.to(textOut.chars, {
      y: 100,
      // autoAlpha: 0,
      stagger: 0.05,
    });

    tl.to(items[index], { scale: 0.4, autoAlpha: 0 });
    tl.set(items[index], { autoAlpha: 0 }); // Hide moved out slide
    tl.set("h1", { y: 0, autoAlpha: 1 }); // reset
    // move in slide
    tl.from(items[moveIn], { scale: 0.4, autoAlpha: 0 });
    // Animate text
    tl.from(text.chars, {
      y: 100,
      // autoAlpha: 0,
      stagger: 0.05,
    });
  }
  function animationStart() {
    container.classList.add("running");
  }
  function animationDone() {
    toggleButtons();
    autoplay = window.setTimeout(slideLogic, timer);
    container.classList.remove("running");
    gsap.set(items, { x: 0 });
  }
  // END 🖼️ Slide animation --------------//

  //--------------------------------//
  // Slider 🎛️ logic
  //--------------------------------//
  function slideLogic(prev, customMoveIn) {
    toggleButtons(); // Disable buttons
    window.clearTimeout(autoplay); // disable autoplay
    let outIn = [-move, move];
    if (prev) outIn.reverse();
    let moveIn;
    // Check if moveIn is passed with the function
    if (typeof customMoveIn === "undefined") {
      if (prev) {
        moveIn = index === 0 ? itemsMax : index - 1;
      } else {
        moveIn = index === itemsMax ? 0 : index + 1;
      }
    } else {
      moveIn = customMoveIn;
    }
    if (dots) dotActive(moveIn); // Set active dot
    slideAnimation(index, moveIn, outIn); // Animation function
    // Changing the next index
    if (typeof customMoveIn === "undefined") {
      if (prev) {
        index === 0 ? (index = itemsMax) : index--;
      } else {
        index === itemsMax ? (index = 0) : index++;
      }
    } else {
      index === itemsMax ? (index = 0) : (index = customMoveIn++);
    }
  }
  // END Slider 🎛️ logic --------------//

  //--------------------------------//
  // Button 🎛️ control
  //--------------------------------//
  function toggleButtons() {
    if (next) next.disabled = !next.disabled;
    if (prev) prev.disabled = !prev.disabled;
  }
  if (next) next.addEventListener("click", () => slideLogic());
  if (prev) prev.addEventListener("click", () => slideLogic(true));
  // END Button 🎛️ control --------------//
});
