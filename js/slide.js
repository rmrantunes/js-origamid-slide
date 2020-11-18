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

  onStart(event) {
    event.preventDefault();
    this.distance.start = event.clientX;
  }

  onMove(event, slide) {
    this.distance.movement = this.updatePosition(event.clientX);
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
    this.updatePosition = new UpdatePosition()
  }
  
  onStart(event) {
    this.updatePosition.onStart(event)
    this.wrapper.addEventListener("mousemove", this.onMove);
  }
  
  onMove(event) {
    this.updatePosition.onMove(event, this.slide)
  }

  onEnd() {
    this.updatePosition.onEnd()
    this.wrapper.removeEventListener("mousemove", this.onMove);
  }
  
  addSlideEvents() {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
  }
  
  bindEventCallbacks() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }
  
  init() {
    this.bindEventCallbacks();
    this.addSlideEvents();
    return this;
  }
};
