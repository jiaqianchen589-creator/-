# 陈佳茜个人 Profile 网站

本目录是 Cloudflare Pages 和 GitHub Pages 的共同发布源。`index.html` 必须位于站点根目录。

网站按 HR 扫读路径组织：个人定位与代表成果 → 网易有道销转诊断及独立撰写的周会底稿 → 已交付的在线工具 → 五条开营成片及 AIGC 视频 → 原始作品页 → 商业与英文研究 → 跨场景经历 → 两个可用邮箱。

页面使用 78 万与 17.6 万两张作品的截图时播放量。舞蹈作品由陈佳茜策划、拍摄、剪辑及发布。网易有道工具及四份周会底稿按陈佳茜本人制作与撰写呈现。

发布前运行 `python work/check_site.py outputs/profile-site-v3`，使用 `python work/build_public_zip.py` 生成 Cloudflare Pages 直接上传包。GitHub Pages 从 `main` 分支根目录部署。
