import type { App } from 'vue';
import {
  HeartOutlined,
  HistoryOutlined,
  FormOutlined,
  TableOutlined,
  AppstoreAddOutlined,
  UnorderedListOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  HomeOutlined,
  LinkOutlined,
  EyeOutlined,
  FileTextOutlined,
  HourglassOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons-vue';

export const useIcons = (app: App) => {
  app.component(HeartOutlined.displayName, HeartOutlined);
  app.component(HistoryOutlined.displayName, HistoryOutlined);
  app.component(FormOutlined.displayName, FormOutlined);
  app.component(TableOutlined.displayName, TableOutlined);
  app.component(AppstoreAddOutlined.displayName, AppstoreAddOutlined);
  app.component(UnorderedListOutlined.displayName, UnorderedListOutlined);
  app.component(WarningOutlined.displayName, WarningOutlined);
  app.component(CheckCircleOutlined.displayName, CheckCircleOutlined);
  app.component(HomeOutlined.displayName, HomeOutlined);
  app.component(LinkOutlined.displayName, LinkOutlined);
  app.component(EyeOutlined.displayName, EyeOutlined);
  app.component(FileTextOutlined.displayName, FileTextOutlined);
  app.component(HourglassOutlined.displayName, HourglassOutlined);
  app.component(CloudUploadOutlined.displayName, CloudUploadOutlined);
};
