<template>
  <div class="miniChart">
    <div class="chartContent">
      <chart :option="chartOption" :style="{ height: chartHeight }" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import '../../index.less';

export default defineComponent({
  props: {
    data: {
      default: () => [],
    },
    height: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const chartOption = ref({
      color: ['#3aa1ff'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '-5%',
        top: '30%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        show: false,
        data: [] as string[],
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        show: false,
      },
      series: {
        name: 'y',
        type: 'bar',
        barWidth: '50%',
        data: [] as string[],
      },
    });

    const chartHeight = computed(() => `${props.height + 100}px`);

    return {
      chartHeight,
      chartOption,
    };
  },
});
</script>
