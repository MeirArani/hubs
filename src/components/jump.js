/**
 * Allows players to jump.
 * @component jump
 */

AFRAME.registerComponent("jump", {
  schema: {
    jumpEnabled: { default: false }
  },
  init: function () {
    console.log("Init Jump component");
  },

  tick: function () {}
});
