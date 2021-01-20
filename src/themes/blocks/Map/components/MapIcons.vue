<template>
  <div
    v-show="false"
    v-once
    class="icons"
  >
    <div id="terminal-icon" />
    <div id="floorChangeTags" />
  </div>
</template>

<script>
export default {
  name: 'MapIcons'
}
</script>

<style lang="scss" scoped>
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";
$red: color(red);

#terminal-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background : {
    color: $red;
    image: url('/assets/icons/terminal_point.svg');
    position: center 40%;
    size: 65%;
    repeat: no-repeat;
    }
  transform: rotate(90deg);
}
</style>
