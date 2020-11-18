class UpdatePosition {
  constructor() {
    this.distance = {
      start: 0,
      movement: 0,
      finalPosition: 0,
    };
  }

  updatePosition(clientX) {
    return this.distance.finalPosition - (this.distance.start - clientX) * 1.25;
  }

  moveSlide(movement, slide) {
    slide.style.transform = `translateX(${movement}px)`;
  }

  saveInitialPosition({ clientX }) {
    this.distance.start = clientX;
  }

  updateWhileMoving({ clientX }, slide) {
    this.distance.movement = this.updatePosition(clientX);
    this.moveSlide(this.distance.movement, slide);
  }

  saveLastPosition() {
    this.distance.finalPosition = this.distance.movement;
  }
}

export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.updatePosition = new UpdatePosition();
  }

  onTouchStart(event) {
    this.updatePosition.saveInitialPosition(event.changedTouches[0]);
    this.addEventsToWapper({ type: "touchmove", callback: this.onTouchMove });
  }

  onStart(event) {
    event.preventDefault();
    this.updatePosition.saveInitialPosition(event);
    this.addEventsToWapper({ type: "mousemove", callback: this.onMouseMove });
  }

  onTouchMove(event) {
    this.updatePosition.updateWhileMoving(event.changedTouches[0], this.slide);
  }

  onMouseMove(event) {
    this.updatePosition.updateWhileMoving(event, this.slide);
  }

  onEnd() {
    this.updatePosition.saveLastPosition();
    this.removeEventsInWapper({
      type: "mousemove",
      callback: this.onMouseMove,
    });
    this.removeEventsInWapper({
      type: "touchmove",
      callback: this.onTouchMove,
    });
  }

  addEventsToWapper({ type, callback }) {
    this.wrapper.addEventListener(type, callback);
  }

  removeEventsInWapper({ type, callback }) {
    this.wrapper.removeEventListener(type, callback);
  }

  addInitialSlideEvents() {
    const initalEvents = [
      {
        type: "mousedown",
        callback: this.onStart,
      },
      {
        type: "mouseup",
        callback: this.onEnd,
      },
      {
        type: "touchstart",
        callback: this.onTouchStart,
      },
      {
        type: "touchend",
        callback: this.onEnd,
      },
    ];

    initalEvents.forEach(this.addEventsToWapper);
  }

  bindingTheThis(...methodsToBind) {
    methodsToBind.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  init() {
    this.bindingTheThis(
      "onStart",
      "onMouseMove",
      "onEnd",
      "onTouchStart",
      "onTouchMove",
    );
    this.addInitialSlideEvents();
    return this;
  }
}
