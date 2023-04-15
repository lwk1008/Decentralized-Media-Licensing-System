import less from 'less';
import { getThemeVariables } from 'ant-design-vue/dist/theme';
const themeConfig = [
  {
    theme: 'dark',
    htmlThemeAttr: 'antdv-pro-theme-dark',
    modifyVars: { ...getThemeVariables({ dark: true }), 'text-color': 'fade(@white, 65%)' },
  },
];
const additionalData = async (content: string, filename: string) => {
  const themePromises = themeConfig.map(async t => {
    const { htmlThemeAttr, modifyVars = {} } = t;
    const options = {
      javascriptEnabled: true,
      modifyVars,
      relativeUrls: true,
      filename,
    };
    try {
      const { css } = await less.render(content, options);
      let res = '';
      if (htmlThemeAttr && css) {
        res = `
        [data-pro-theme=${htmlThemeAttr}] {
          ${css}
        }
        `;
      }
      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(content);
    }
  });
  let res = content;
  for (const themePromise of themePromises) {
    const theme = await themePromise;
    res += theme;
  }
  return res;
};

export default themeConfig;
export { themeConfig, additionalData };
