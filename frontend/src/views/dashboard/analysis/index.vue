<template>
  <grid-content>
    <a-row :gutter="24" type="flex" style="margin-top: 24px">
      <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
          <template #dropdownGroup>
            <span class="iconGroup">
              <a-dropdown placement="bottomRight">
                <template #overlay>
                  <a-menu>
                    <a-menu-item>操作一</a-menu-item>
                    <a-menu-item>操作二</a-menu-item>
                  </a-menu>
                </template>
                <ellipsis-outlined />
              </a-dropdown>
            </span>
          </template>
      </a-col>
      <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
          <template #dropdownGroup>
            <span class="iconGroup">
              <a-dropdown placement="bottomRight">
                <template #overlay>
                  <a-menu>
                    <a-menu-item>操作一</a-menu-item>
                    <a-menu-item>操作二</a-menu-item>
                  </a-menu>
                </template>
                <ellipsis-outlined />
              </a-dropdown>
            </span>
          </template>
      </a-col>
    </a-row>
  </grid-content>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { default as GridContent } from '@/components/base-layouts/grid-content/index.vue';
import { EllipsisOutlined } from '@ant-design/icons-vue';
import { getTimeDistance } from './util';

import IntroduceRow from './components/introduce-row.vue';
import SalesCard from './components/sales-card.vue';
import TopSearch from './components/top-search.vue';
import ProportionSales from './components/proportion-sales.vue';
import OfflineData from './components/offline-data.vue';

import type { Moment } from 'moment';

export default defineComponent({
  setup() {
    const state = reactive({
      loading: true,
      salesLoading: true,
      activeKey: 'Stores 0',
      salesType: 'all',
      rangePickerValue: getTimeDistance('year'),
    });


    const handleRangePickerChange = (rangePickerValue: [Moment, Moment]) => {
      state.rangePickerValue = rangePickerValue;
    };


    const isActive = (type: any) => {
      const value = getTimeDistance(type);
      if (!state.rangePickerValue[0] || !state.rangePickerValue[1]) {
        return '';
      }
      if (
        state.rangePickerValue[0].isSame(value[0], 'day') &&
        state.rangePickerValue[1].isSame(value[1], 'day')
      ) {
        return 'currentDate';
      }
      return '';
    };

    const handleChangeSalesType = (e: any | Event) => {
      state.salesType = e.target.value;
    };

    const handleTabChange = (key: string) => {
      state.activeKey = key;
    };


    return {
      state,

      isActive,
      handleRangePickerChange,
      handleTabChange,
      handleChangeSalesType,
    };
  },
  components: {
    GridContent,

    IntroduceRow,
    SalesCard,
    TopSearch,
    ProportionSales,
    OfflineData,

    // icons
    EllipsisOutlined,
  },
});
</script>
