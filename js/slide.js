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

  updateAndMoveSlide({ clientX }, slide) {
    this.distance.movement = this.updatePosition(clientX);
    this.moveSlide(this.distance.movement, slide);
  }

  saveLastPosition(movement = this.distance.movement) {
    this.distance.finalPosition = movement;
  }
}

export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.updatePosition = new UpdatePosition();
  }

  addListenersToWapper({ type, callback }) {
    this.wrapper.addEventListener(type, callback);
  }

  removeListenersInWapper({ type, callback }) {
    this.wrapper.removeEventListener(type, callback);
  }

  onTouchStart(event) {
    this.updatePosition.saveInitialPosition(event.changedTouches[0]);
    this.addListenersToWapper({
      type: "touchmove",
      callback: this.onTouchMove,
    });
  }

  onMouseStart(event) {
    event.preventDefault();
    this.updatePosition.saveInitialPosition(event);
    this.addListenersToWapper({
      type: "mousemove",
      callback: this.onMouseMove,
    });
  }

  onTouchMove(event) {
    this.updatePosition.updateAndMoveSlide(event.changedTouches[0], this.slide);
  }

  onMouseMove(event) {
    this.updatePosition.updateAndMoveSlide(event, this.slide);
  }

  onTouchEnd() {
    this.updatePosition.saveLastPosition();
    this.removeListenersInWapper({
      type: "touchmove",
      callback: this.onTouchMove,
    });
  }

  onMouseEnd() {
    this.updatePosition.saveLastPosition();
    this.removeListenersInWapper({
      type: "mousemove",
      callback: this.onMouseMove,
    });
  }

  addInitialSlideListeners() {
    const initalListeners = [
      {
        type: "mousedown",
        callback: this.onMouseStart,
      },
      {
        type: "mouseup",
        callback: this.onMouseEnd,
      },
      {
        type: "touchstart",
        callback: this.onTouchStart,
      },
      {
        type: "touchend",
        callback: this.onMouseEnd,
      },
    ];

    initalListeners.forEach(this.addListenersToWapper);
  }

  bindingTheThis() {
    const methodsToBind = [
      "addListenersToWapper",
      "removeListenersInWapper",
      "onMouseStart",
      "onMouseMove",
      "onTouchEnd",
      "onMouseEnd",
      "onTouchStart",
      "onTouchMove",
    ];

    methodsToBind.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  slidePosition(element) {
    const margin = (this.wrapper.offsetWidth - element.offsetWidth) / 2;
    return -(element.offsetLeft - margin);
  }

  slideConfig() {
    this.slideArray = [...this.slide.children].map((element) => {
      return {
        element,
        position: this.slidePosition(element),
      };
    });
  }

  currentSlideIndexesInfo(index) {
    const lastElementIndex = this.slideArray.length - 1;
    this.indexes = {
      previous: index ? index - 1 : undefined,
      current: index,
      next: index >= lastElementIndex ? undefined : index + 1,
    };
  }

  changeSlide(index) {
    const currentSlidePosition = this.slideArray[index].position;
    this.currentSlideIndexesInfo(index);
    this.updatePosition.moveSlide(currentSlidePosition, this.slide);
    this.updatePosition.saveLastPosition(currentSlidePosition);
  }

  init() {
    this.bindingTheThis();
    this.addInitialSlideListeners();
    this.slideConfig();
    this.changeSlide(1);
    return this;
  }
}
