<template>
  <div class="zoom-visioglobe flex column">
    <v-btn
      v-show="currentExploreMode !== 'building'"
      v-press="startZoomingIn"
      class="mb10 zoom-in"
      :ripple="false"
      small
      @click.stop="zoomInSome"
    />
    <v-btn
      v-show="currentExploreMode !== 'building'"
      v-press="startZoomingOut"
      class="zoom-out"
      :ripple="false"
      small
      @click.stop="zoomOutSome"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Vue from 'vue'

Vue.directive('press', {
  bind: function (el, binding) {
    let pressTimer = null
    let zoomAnimation = null
    const start = (e) => {
      if (e.type === 'click' && e.button !== 0) {
        return
      }
      if (pressTimer === null && zoomAnimation === null) {
        pressTimer = setTimeout(() => {
          zoomAnimation = binding.value()
        }, 250)
      }
    }
    el.addEventListener('mousedown', start)
    el.addEventListener('touchstart', start)

    const cancel = () => {
      if (pressTimer !== null) {
        clearTimeout(pressTimer)
        pressTimer = null
      }
      if (zoomAnimation !== null) {
        zoomAnimation.stop()
        zoomAnimation = null
      }
    }
    el.addEventListener('click', cancel)
    el.addEventListener('mouseout', cancel)
    el.addEventListener('touchend', cancel)
    el.addEventListener('touchcancel', cancel)
  }
})

export default {
  name: 'Zoom',
  data () {
    return {
      zoomingIn: false,
      zoomingOut: false,
      zoomCoeff: 0.3,
      zoomAnimation: null,
      zoomSpeed: 200 // meters/second
    }
  },
  computed: {
    ...mapState('visioglobe', ['mapviewer']),
    ...mapState('visioglobe/venue', ['currentExploreMode'])
  },
  methods: {
    startZoomingIn: function () {
      this.zoomingIn = true
      const camera = this.mapviewer.camera
      const startRadius = camera.position.radius
      const maxDistance = startRadius - camera.minRadius
      this.zoomAnimation = this.mapviewer.animateValue(0, 1, {
        duration: 1000 * maxDistance / this.zoomSpeed,
        step: function (value) {
          const newRadius = startRadius - value * maxDistance
          if (newRadius > camera.minRadius) {
            camera.position = {
              x: camera.position.x,
              y: camera.position.y,
              radius: newRadius
            }
          } else {
            camera.position = {
              x: camera.position.x,
              y: camera.position.y,
              radius: camera.minRadius
            }
            this.zoomAnimation.stop()
          }
        }.bind(this),
        complete: function () {
          this.zoomingIn = false
        }.bind(this)
      })
      return this.zoomAnimation
    },
    startZoomingOut: function () {
      this.zoomingOut = true
      const camera = this.mapviewer.camera
      const startRadius = camera.position.radius
      const maxDistance = camera.maxRadius - startRadius
      this.zoomAnimation = this.mapviewer.animateValue(0, 1, {
        duration: 1000 * maxDistance / this.zoomSpeed,
        step: function (value) {
          const newRadius = startRadius + value * maxDistance
          if (newRadius < camera.maxRadius) {
            camera.position = {
              x: camera.position.x,
              y: camera.position.y,
              radius: newRadius
            }
          } else {
            camera.position = {
              x: camera.position.x,
              y: camera.position.y,
              radius: camera.maxRadius
            }
            this.zoomAnimation.stop()
          }
        }.bind(this),
        complete: function () {
          this.zoomingOut = false
        }.bind(this)
      })
      return this.zoomAnimation
    },
    zoomInSome: function () {
      if (!this.zoomingIn) {
        this.zoomingIn = true
        const camera = this.mapviewer.camera
        const startRadius = camera.position.radius
        this.mapviewer.animateValue(0, 1, {
          duration: 200,
          step: function (value) {
            const newRadius = startRadius * (1 - value * this.zoomCoeff)
            if (newRadius > camera.minRadius) {
              camera.position = {
                x: camera.position.x,
                y: camera.position.y,
                radius: newRadius
              }
            } else {
              camera.position = {
                x: camera.position.x,
                y: camera.position.y,
                radius: camera.minRadius
              }
            }
          }.bind(this),
          complete: function () {
            this.zoomingIn = false
          }.bind(this)
        })
      } else {
        this.zoomAnimation.stop()
        this.zoomingIn = false
      }
    },
    zoomOutSome: function () {
      if (!this.zoomingOut) {
        this.zoomingOut = true
        const camera = this.mapviewer.camera
        const startRadius = camera.position.radius
        this.mapviewer.animateValue(0, 1, {
          duration: 200,
          step: function (value) {
            const newRadius = startRadius * (1 + value * this.zoomCoeff)
            if (newRadius < camera.maxRadius) {
              camera.position = {
                x: camera.position.x,
                y: camera.position.y,
                radius: newRadius
              }
            } else {
              camera.position = {
                x: camera.position.x,
                y: camera.position.y,
                radius: camera.maxRadius
              }
            }
          }.bind(this),
          complete: function () {
            this.zoomingOut = false
          }.bind(this)
        })
      } else {
        this.zoomAnimation.stop()
        this.zoomingOut = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
nav.bottom + div {
  bottom: 80px;
}

div {
  position: absolute;
  bottom: 55px;
  right: 23px;
  z-index: 1;
}

div >>> button {
  display: block;
  padding: 0;
  width: 28px;
  min-width: 0;
}

.zoom-visioglobe {
  margin-bottom: 260px;
  & /deep/ {
    .v-btn {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: none;
      background: white;
      position: relative;
      box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.3);
      &::before, &.zoom-in::after {
        content: '';
        position: absolute;
        display: block;
        width: 20px;
        height: 2px;
        top: 24px;
        left: 15px;
        border-radius: 2px;
        border: 1px solid transparent;
        background-color: #000;
      }
      &.zoom-in::after {
        transform: rotate(90deg);
      }
    }
  }
}

@media screen and (max-width: 680px) {
  div {
    position: fixed;
    bottom: 20px;
    right: 10px;
  }
}
</style>
