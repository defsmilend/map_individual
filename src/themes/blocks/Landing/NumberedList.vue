<template>
  <div>
    <div
      v-for="(paragraph, index) in list"
      :key="index"
      class="flex mb25"
    >
      <p class="weight-700 m0 mr18">
        {{ index + 1 }}
      </p>
      <p
        class="m0"
        v-html="paragraph.content"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'NumberedList',
  props: {
    list: {
      type: Array,
      required: true
    }
  }
}
</script>
