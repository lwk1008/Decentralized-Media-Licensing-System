<template>
  <page-container :showBreadcrumb="true">
    <div>
      <a-row>
        <a-col>
          <template v-if="context.dataSource?.length">
            <a-card :loading="context.loading">
              <a-card-grid :key="item.id" v-for="item in context.dataSource">
                <a :href="'/media/' + item.mediaId">
                  <a-card :bordered="false">
                    <template #cover>
                      <img :src="item.image" />
                    </template>
                    <br>
                    <a-card-meta :title="item.name">
                      <template #description>
                        <template :key="license" v-for="license in item.dml?.license">
                          <a-tag color="blue">{{ license.name }}</a-tag>
                        </template>
                      </template>
                    </a-card-meta>
                  </a-card>
                </a>
              </a-card-grid>
            </a-card>
          </template>
        </a-col>
      </a-row>
    </div>
  </page-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useFetchData } from '@/utils/hooks/useFetchData';
import request from '@/utils/request';

async function getData(): Promise<any> {
  return request.get('/media/allinfo');
}

export default defineComponent({
  setup() {
    const { reload, context } = useFetchData(() => {
      return getData().then(res => {
        return {
          data: res.data.mediaBody,
          total: 100,
        };
      });
    });

    return {
      context,
      reload,
    };
  },
  components: {},
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
