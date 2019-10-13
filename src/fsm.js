class FSM {
  /**
   * Creates new FSM instance.
   * @param config
   */
  constructor(config) {
    if (!config) {
      throw new Error('Config doesn\'t defined');
    }

    this.activeState = config.initial;
    this.config = config;
    this.undoHistory = [];
    this.redoHistory = [];
  }

  /**
   * Returns active state.
   * @returns {String}
   */
  getState() {
    return this.activeState;
  }

  /**
   * Goes to specified state.
   * @param state
   */
  changeState(state) {
    if (!Object.keys(this.config.states).includes(state)) {
      throw new Error('State doesn\'t in config');
    }

    this.undoHistory.push(this.activeState);
    this.activeState = state;
    this.redoHistory = [];
  }

  /**
   * Changes state according to event transition rules.
   * @param event
   */
  trigger(event) {
    const newState = this.config.states[this.activeState].transitions[event];

    if (!newState) {
      throw new Error('Events doesn\'t exist in current state');
    }

    this.changeState(newState);
  }

  /**
   * Resets FSM state to initial.
   */
  reset() {
    this.activeState = this.config.initial;
  }

  /**
   * Returns an array of states for which there are specified event transition rules.
   * Returns all states if argument is undefined.
   * @param event
   * @returns {Array}
   */
  getStates(event) {
    if (!event) {
      return Object.keys(this.config.states);
    }

    return Object.keys(this.config.states).filter(state => {
      const stateConfig = this.config.states[state].transitions;

      return !!stateConfig[event];
    });
  }

  /**
   * Goes back to previous state.
   * Returns false if undo is not available.
   * @returns {Boolean}
   */
  undo() {
    if (!this.undoHistory.length) {
      return false;
    }

    const previousState = this.undoHistory.pop();
    this.redoHistory.push(this.activeState);
    this.activeState = previousState;

    return true;
  }

  /**
   * Goes redo to state.
   * Returns false if redo is not available.
   * @returns {Boolean}
   */
  redo() {
    if (!this.redoHistory.length) {
      return false;
    }

    this.activeState = this.redoHistory.pop();

    return true;
  }

  /**
   * Clears transition history
   */
  clearHistory() {
    this.undoHistory = [];
    this.redoHistory = [];
  }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/