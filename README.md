# Shopfly 组件库

本项目提供了一些 Shopfly 需要付费的组件的仿照版本，帮助商家在不购买付费组件的情况下实现类似的功能。

## 组件列表

1. 底部加购栏 (Bottom Add Cart)
2. 视频列表 (Video List)

## 安装说明

### 文件安装目录

在 Shopfly 模板后台，需要将文件放置在以下目录：

1. Liquid 文件：
   - 路径：`sections/`
   - 例如：`sections/bottom-add-cart.liquid`

2. CSS 文件：
   - 路径：`assets/`
   - 例如：`assets/xd-video-list.css`

3. JavaScript 文件：
   - 路径：`assets/`
   - 例如：`assets/xd-video-list.js`

### 安装步骤

1. 将组件对应的 liquid 文件复制到模板的 `sections` 目录下
2. 将 CSS 和 JavaScript 文件复制到模板的 `assets` 目录下
3. 在需要使用的模板文件中添加组件代码

## 组件使用说明

### 底部加购栏

在商品页面模板中添加以下代码：

```liquid
{% section 'bottom-add-cart' %}
```

### 视频列表

在需要显示视频列表的页面模板中添加以下代码：

```liquid
{% section 'xd-video-list' %}
```

## 注意事项

1. 这些组件是仿照版本，可能与原版功能有所差异
2. 建议在使用前进行充分测试
3. 如遇到问题，请参考各个组件目录下的具体说明文档

## 文件结构

```
├── bottom-add-cart/
│   └── bottom-add-cart.liquid
├── video-list/
│   ├── xd-video-list.liquid
│   ├── xd-video-list.css
│   ├── xd-video-list.js
│   └── README.md
└── README.md
```
