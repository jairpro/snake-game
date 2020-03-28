class GameJoypad {
  constructor() {
    this.press = {
      "left": false,
      "up": false,
      "right": false,
    };
    
    this.beforeUpdate = null;
    this.afterUpdate = null;

    this.resetInfo();
    joypad.set({ axisMovementThreshold: 0.3 });
    joypad.on('connect', e => this.updateInfo(e));
    joypad.on('disconnect', e => this.resetInfo(e));
  
    joypad.on('axis_move', e => {
      return this.update(e, 'axis_move', this.beforeUpdate, this.afterUpdate);
    });
  
    joypad.on('button_press', e => {
      return this.update(e, 'button_press', this.beforeUpdate, this.afterUpdate);
    });
  }

  sendCustomKeyCode(customKeyCode, eventType) {
    eventType = eventType===undefined ? "keydown" : eventType;

    var keyboardEvent = document.createEvent("KeyboardEvent");
    var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";

    keyboardEvent[initMethod](
      eventType, // event type: keydown, keyup, keypress
      true,      // bubbles
      true,      // cancelable
      window,    // view: should be window
      false,   // ctrlKey
      false,    // altKey
      false,  // shiftKey
      false,     // metaKey
      0,   // keyCode: unsigned long - the virtual key code, else 0
      0          // charCode: unsigned long - the Unicode character associated with the depressed key, else 0
    );
    
    //keyboardEvent.keyCode = keyCode;
    keyboardEvent.customKeyCode = customKeyCode;
    document.dispatchEvent(keyboardEvent);
  }

  resetInfo(e) {
    //console.log('No controller connected!');
    //console.log('Please connect a controller and press any key to start.');
  };

  updateInfo(e) {
    const { gamepad } = e;
    
    //console.log('Controller connected!');
    //console.log(gamepad.id + '\n\n' + 'Use the left stick to move the ball.');
  };

  update(e, eventType, beforeUpdate, afterUpdate) {
    // console.log(e.detail);
    if (beforeUpdate) {
      beforeUpdate(this, e, eventType);
    }
    if (afterUpdate) {
      afterUpdate(this, e, eventType);
    }
  }
}
