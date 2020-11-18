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

  onStart({ clientX }) {
    this.distance.start = clientX;
  }

  onMove({ clientX }, slide) {
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
    this.updatePosition.onStart(event.changedTouches[0]);
    this.addEventsToWapper({ type: "touchmove", callback: this.onMove });
  }

  onStart(event) {
    event.preventDefault();
    this.updatePosition.onStart(event);
    this.addEventsToWapper({ type: "mousemove", callback: this.onMove });
  }

  onMove(event) {
    // refatorar esse método e dar um somente para o Touch
    const eventType = event.clientX ? event : event.changedTouches[0];
    this.updatePosition.onMove(eventType, this.slide);
  }

  onEnd() {
    this.updatePosition.saveLastPosition();
    this.removeEventsInWapper({ type: "mousemove", callback: this.onMove });
    this.removeEventsInWapper({ type: "touchmove", callback: this.onMove });
  }

  addEventsToWapper = ({ type, callback }) => {
    this.wrapper.addEventListener(type, callback);
  };

  removeEventsInWapper = ({ type, callback }) => {
    this.wrapper.removeEventListener(type, callback);
  };

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
    this.bindingTheThis("onStart", "onMove", "onEnd", "onTouchStart");
    this.addInitialSlideEvents();
    return this;
  }
}
