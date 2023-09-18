import { defineUserConfig } from "vuepress";
import recoTheme from "vuepress-theme-reco";

export default defineUserConfig({
  title: "亡类霜天竟自幼",
  description: "A lovely beauty's record.",
  theme: recoTheme({
    style: "@vuepress-reco/style-default",
    logo: "/logo.jpg",
    author: "lgm-广广",
    authorAvatar: "/head.png",
    docsRepo: "https://github.com/gg-guang",
    docsBranch: "main",
    docsDir: "blogs",
    lastUpdated: true,
    lastUpdatedText: "",
    // series 为原 sidebar
    series: {
      "/docs/theme-reco/": [
        {
          text: "module one",
          children: ["home", "theme"],
        },
        {
          text: "module two",
          children: ["api", "plugin"],
        },
      ],
    },
    navbar: [
      { text: "前端", link: "/categories/web/1/" },
      { text: "生活", link: "/categories/life/1/" },
      { text: "标签", link: "/tags/js/1/" },
      { text: "关于", link: "/blogs/me/" },
      // { text: "留言板", link: "/message/", icon: 'Chat' },
    ],
    // commentConfig: {
    //   type: 'valie',
    //   // options 与 1.x 的 valineConfig 配置一致
    //   options: {
    //     // appId: 'xxx',
    //     // appKey: 'xxx',
    //     // placeholder: '填写邮箱可以收到回复提醒哦！',
    //     // verify: true, // 验证码服务
    //     // notify: true,
    //     // recordIP: true,
    //     // hideComments: true // 隐藏评论
    //   },
    // },
  }),
});
