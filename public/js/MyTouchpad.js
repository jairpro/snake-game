class MyTouchpad {
  constructor(element, options, events) {
		const { onPan, onTap } = events;

    var myElement = element || document.getElementById("container");
    var myOptions = options || {};
		
		var hammertime = new Hammer(myElement, myOptions);

		if (onPan) {
			hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL });
			hammertime.on('pan', function(ev) {
				// console.log(ev);
				if (onPan) {
					onPan(ev);
				}

			});
		}
		
		if (onTap) {
			// hammertime.add( new Hammer.Tap({ event: 'tap', taps: 1 }) );
			hammertime.on("tap", function(ev){
				if (onTap) {
					onTap(ev);
				}
			});
		}
  }
}
