<template>
  <notice-dropdown class="action" :count="userInfo && userInfo.unreadCount" :loading="loading">
    <a-tabs v-model:activeKey="activeKey">
      <template v-for="{ key, title, emptyText, showViewMore } in noticesConfig" :key="key">
        <a-tab-pane v-if="key" :key="key" :tab="title">
          <notice-list
            :title="title"
            :count="unreadMsgs[key]"
            :list="noticeData[key]"
            :emptyText="emptyText"
            :showViewMore="showViewMore"
            @itemClick="changeReadState"
            clearText="Empty"
            viewMoreText="See more"
            @clear="handleNoticeClear(title, key)"
            @viewMore="handleViewMore(key)"
            showClear
          >
            <template #extra="notice">
              <a-tag
                v-if="notice.extra && notice.status"
                style="margin-right: 0"
                :color="color[notice.status]"
              >
                {{ notice.extra }}
              </a-tag>
              <template v-else>
                {{ notice.extra }}
              </template>
            </template>
          </notice-list>
        </a-tab-pane>
      </template>
    </a-tabs>
  </notice-dropdown>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import NoticeDropdown from './notice-dropdown.vue';
import NoticeList from './notice-list.vue';
import { message } from 'ant-design-vue';
import { useStore } from 'vuex';

// 如需要实时更新提醒通知，可以配置 realtime 为 true 打开该轮询，或者自行尝试配置 websocket 功能
// 注意：目前未读数量是通过 currentUSer 接口取回的，如果更改成实时，未读数量也建议更改成独立接口 或者 合并到 getNoticeData 中


export default defineComponent({
  name: 'NoticeIcon',
  // props: {},
  components: {
    NoticeDropdown,
    NoticeList,
  },
  emits: [],
  setup() {
    const store = useStore();
    const userInfo = computed(() => store.getters['user/info']);
    const loading = ref(true);
    const activeKey = ref('notification');
    const color = {
      todo: '',
      processing: 'blue',
      urgent: 'red',
      doing: 'gold',
    };
    const noticesConfig = ref([
      {
        key: 'notification',
        title: 'Notification',
        emptyText: 'You have viewed all notifications',
        showViewMore: true,
      },
      {
        key: 'message',
        title: 'Message',
        emptyText: 'You have read all messages',
        showViewMore: true,
      },
      {
        key: 'event',
        title: 'To do',
        emptyText: 'You have completed all to-dos',
        showViewMore: false,
      },
    ]);
  

    const unreadMsgs = computed(() => {
      const unreadMsg: Record<string, number> = {};
      return unreadMsg;
    });

    const handleViewMore = (key: string) => {
      message.info(`Click on view more ${key}`);
    };
    return {
      noticesConfig,
      activeKey,
      loading,
      color,
      unreadMsgs,
      handleViewMore,
      userInfo,
    };
  },
});
</script>

<style lang="less"></style>
