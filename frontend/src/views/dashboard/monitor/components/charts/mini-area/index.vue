<template>
  <div class="miniChart" :style="{ height: `${height}px` }">
    <div class="chartContent">
      <chart :option="chartOption" :style="{ height: chartHeight }" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import '../index.less';

export default defineComponent({
  name: 'MiniArea',
  props: {
    data: {
      default: () => [],
    },
    color: {
      type: String,
      default: 'rgba(24, 144, 255, 0.2)',
    },
    borderColor: {
      type: String,
      default: '#1089ff',
    },
    height: {
      type: Number,
      default: 0,
    },
    line: Boolean,
  },
  setup(props) {
    const chartHeight = computed(() => `${props.height + 54}px`);
    const chartOption = ref({
      color: [props.color],
      grid: {
        left: '-5%',
        top: '30%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [] as string[],
        show: false,
      },
      yAxis: {
        type: 'value',
        show: false,
      },
      series: {
        data: [] as string[],
        type: 'line',
        smooth: true,
        areaStyle: {},
        lineStyle: {
          color: props.line ? props.borderColor : 'none',
        },
        showSymbol: false,
      },
    });

    return {
      chartHeight,
      chartOption,
    };
  },
});
</script>
