import globals from './global/en-US';
import routes from './routes/en-US';
import pages from './pages/en-US';
import antd from 'ant-design-vue/es/locale/en_US';
import moment from 'moment/locale/eu';

const locales = {
  localeName: 'enUS',
  momentLocaleName: 'eu',
  antd,
  moment,

  ...globals,
  ...routes,
  ...pages,
};

export default locales;
