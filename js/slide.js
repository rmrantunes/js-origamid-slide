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

  onEnd() {
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
    this.wrapper.addEventListener("touchmove", this.onMove);
  }

  onStart(event) {
    event.preventDefault();
    this.updatePosition.onStart(event);
    this.wrapper.addEventListener("mousemove", this.onMove);
  }

  onMove(event) {
    // refatorar esse método e dar um somente para o Touch
    const eventType = event.clientX ? event : event.changedTouches[0];
    this.updatePosition.onMove(eventType, this.slide);
  }

  onEnd() {
    this.updatePosition.onEnd();
    this.wrapper.removeEventListener("mousemove", this.onMove);
  }

  addSlideEvents() {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
    this.wrapper.addEventListener("touchstart", this.onTouchStart);
    this.wrapper.addEventListener("touchend", this.onEnd);
  }

  bindEventCallbacks() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
  }

  init() {
    this.bindEventCallbacks();
    this.addSlideEvents();
    return this;
  }
}
