<template>
  <page-container :showBreadcrumb="true">
    <a-table
      :loading="context.loading"
      :dataSource="context.dataSource"
      :scroll="{ x: 1000, y: 800 }"
    >
      <a-table-column key="mediaId" title="Media ID" data-index="mediaId" />
      <!-- <a-table-column key="mediaName" title="Media Name" data-index="mediaName" /> -->
      <a-table-column key="license" title="License" data-index="license">
        <template #default="{ record }">
          {{ record.licenseName ? record.licenseName : record.license }}
        </template>
      </a-table-column>
      <!-- <a-table-column key="applicant" title="Applicant" data-index="applicant" /> -->
      <a-table-column key="usage" title="Usage" data-index="usage" />
      <a-table-column key="dateOfUse" title="Date of Use" data-index="dateOfUse" />
      <!-- <a-table-column key="applicantAddress" title="Applicant Address" data-index="applicantAddress" /> -->
      <a-table-column key="hash" title="RAF Hash" data-index="hash">
        <template #default="{ text: hash }">
          <a :href="'/viewer/' + hash">{{ hash }}</a>
        </template>
      </a-table-column>
      <a-table-column key="status" title="Status" data-index="status">
        <template #default="{ text: status }">
          <span>
            <a-tag v-if="status === 0" color="blue">Pending</a-tag>
            <a-tag v-else-if="status === 1" color="green">Approved</a-tag>
            <a-tag v-else-if="status === 2" color="red">Decline</a-tag>
          </span>
        </template>
      </a-table-column>
    </a-table>
  </page-container>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useFetchData } from '@/utils/hooks/useFetchData';
import request from '@/utils/request';

async function getData(): Promise<any> {
  return request.get('/raf/rafbyaddress');
}

export default defineComponent({
  setup() {
    const { reload, context } = useFetchData(() => {
      return getData().then(res => {
        return {
          data: res.data.doc,
          total: 100,
        };
      });
    });
    return {
      context,
      reload,
    };
  },
});
</script>
