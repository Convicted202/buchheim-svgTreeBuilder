define([], function() {

    'use strict'
    var Animator = {
        /**
          * @desc runs render() on each frame reflow until render returns false
          * @param function render - callback to call each frame reflow
          * @param object element - optinally provided element to make accessible in animation loop
          * @return void
        */
        animate: function( render, element ) {
            var running, lastFrame = +new Date;

            // main cycle
            function loop( now ) {
                // stop the loop if render returned false
                if ( running !== false ) {
                    requestAnimationFrame( loop, element );
                    var deltaT = now - lastFrame;
                    // do not render frame when deltaT is too high
                    if ( deltaT < 160 ) {
                        running = render( deltaT );
                    }
                    lastFrame = now;
                }
            }

            loop( lastFrame );
        }
    }

    return Animator;
});
