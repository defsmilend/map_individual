<template>
  <div class="layered-list-wrapper scroll-area custom-scroll">
    <h2 class="weight-700 fs20 m0">
      {{ $t('Rules for the provision of the Shopping light service') }}
    </h2>
    <p class="m0 mb50 fs18">
      ({{ $t('hereinafter referred to as the Rules') }})
    </p>
    <ol class="layered-list pl8 pr15 p0">
      <li
        v-for="(item, index) in list"
        :key="index"
        class="weight-700 fs20 lh25"
      >
        <p
          class="m0"
          v-html="item.paragraph"
        />
        <template v-if="item.subparagraphs && item.subparagraphs.length">
          <ol class="subparagraph-wrapper">
            <template v-for="(value, indexPoint) in item.subparagraphs">
              <template v-if="value.paragraph">
                <li
                  :key="indexPoint"
                  class="weight-400 fs18 subparagraph"
                  v-html="value.paragraph"
                />
              </template>
              <template v-if="value.nestedParagraph && value.nestedParagraph.subparagraphs.length">
                <li
                  :key="indexPoint"
                  class="subparagraph"
                >
                  <p
                    class="m0 weight-400"
                    v-html="value.nestedParagraph.paragraph"
                  />
                  <ol class="nested-paragraph-wrapper">
                    <li
                      v-for="(newtedSubParagraph, indexNestedSubParagraph) in value.nestedParagraph.subparagraphs"
                      :key="indexNestedSubParagraph"
                      class="weight-400 fs18 nested-paragraph"
                      v-html="newtedSubParagraph.paragraph"
                    />
                  </ol>
                </li>
              </template>
            </template>
          </ol>
        </template>
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  name: 'Content',
  props: {
    list: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~theme/css/variables/colors';
  @import '~theme/css/helpers/functions/color';
  $tollens: color(tollens);
  $white: color(white);
  .layered-list-wrapper {
    max-height: 700px;
    max-width: 1050px;
  }
  .layered-list {
    counter-reset: layered-list;
    li {
      list-style: none;
      margin: 0 0 65px 44px;
      position: relative;
    }
    &  > li::before {
      border-radius: 50%;
      content: counter(layered-list);
      counter-increment: layered-list;
      height: 27px;
      width: 27px;
      left: -52px;
      top: -6px;
      line-height: 25px;
      padding: 5px;
      position: absolute;
      text-align: center;
      background: $tollens ;
      color: $white;
    }
    .subparagraph-wrapper {
      display: block;
      counter-reset: wslists;
      padding-left: 4px;
      .subparagraph {
        margin: 22px 0 0 50px;
        &::before {
          content: counter(layered-list) "." counter(wslists) "";
          counter-increment: wslists;
          font-weight: 400;
          left: -55px;
          position: absolute;
        }
        .nested-paragraph-wrapper {
          display: block;
          counter-reset: nestedParagraph;
          padding-left: 4px;
          .nested-paragraph {
            margin: 22px 0 0 64px;
            &::before {
              content: counter(layered-list) "." counter(wslists) "." counter(nestedParagraph) "";
              counter-increment: nestedParagraph;
              left: -70px;
              position: absolute;
            }
          }
        }
      }
    }
  }
  .custom-scroll::-webkit-scrollbar-track-piece {
    margin-bottom: 21px;
  }
</style>
