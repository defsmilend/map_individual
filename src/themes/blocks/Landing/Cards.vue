<template>
  <div>
    <div class="flex mt10 cards-wrapper">
      <div
        v-for="(card, index) in list"
        :key="index"
        class="card mr10 bg-cl-white brdr-r-10"
        :class="{
          'bg-cl-glidden': card.bgColor === 'glidden',
          'bg-cl-peintures': card.bgColor === 'peintures',
          'bg-cl-pantone': card.bgColor === 'pantone'
        }"
        @click="goById(card)"
      >
        <div class="relative image-wrapper">
          <img :src="image(card)">
          <div class="image-logo absolute">
            <img
              class="w-100"
              :src="imageLogo(card)"
            >
          </div>
        </div>
        <div class="px25 pb20">
          <h3 class="m0 mt10 fs20 weight-700">
            {{ title(card) }}
          </h3>
          <p class="fs14 lh17 mt0">
            {{ description(card) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getImageLink, generateItemLink } from 'theme/helpers'

export default {
  name: 'Cards',
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  methods: {
    title (card) {
      const title = card.title || card.name || ''
      return title && title.length > 30 ? `${title.substring(0, 30)}...` : title
    },
    description (card) {
      let description = card.description || card.content
      if (!description) {
        description = (card.company && card.company.description) || ''
      }
      return description.length > 80 ? `${description.substring(0, 80)}...` : description
    },
    image (card) {
      if (card.image) {
        return card.image
      }
      return getImageLink(this.imageId(card.images))
    },
    imageId (imageArr) {
      let imageObj = imageArr.find(image => image.id)
      return imageObj ? imageObj.id : null
    },
    imageLogo (card) {
      if (card.logo) {
        return card.logo
      }
      const images = card.company && card.company.images
      return images ? getImageLink(this.imageId(images)) : ''
    },
    goById (card) {
      let link = card.mall_id ? generateItemLink({ item: card }) : ''
      link = card.link ? `${card.link}?id=${card.id}` : link
      if (link) {
        this.$router.push(link)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .card {
    overflow: hidden;
    width: 312px;
    &:last-child {
      margin-right: 0;
    }
    .image-logo {
      height: 60px;
      bottom: -10px;
      width: 60px;
      left: 19px;
    }
  }
</style>
