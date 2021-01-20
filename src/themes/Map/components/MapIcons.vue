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
//~theme/css/variables/colors
//~theme/css/helpers/functions/color
@import "../../css/variables/colors";
@import "../../css/helpers/functions/color";
$red: color(red);

#terminal-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background : {
    color: $red;
  ///assets/icons/terminal_point.svg
    image: url('./src/assets/icons/terminal_point.svg');
    position: center 40%;
    size: 65%;
    repeat: no-repeat;
    }
  transform: rotate(90deg);
}
</style>
