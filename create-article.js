#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// コマンドライン引数からファイル名を取得
const filename = process.argv[2];

if (!filename) {
  console.error('エラー: ファイル名を指定してください');
  console.log('使用方法: node create-article.js <ファイル名>');
  console.log('例: node create-article.js article001');
  process.exit(1);
}

// .md拡張子がなければ追加
const filenameWithExt = filename.endsWith('.md') ? filename : `${filename}.md`;

// baseディレクトリのパス
const baseDir = path.join(__dirname, 'base');
const filePath = path.join(baseDir, filenameWithExt);

// baseディレクトリが存在しない場合は作成
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}

// ファイルが既に存在する場合は警告
if (fs.existsSync(filePath)) {
  console.error(`エラー: ファイル "${filenameWithExt}" は既に存在します`);
  process.exit(1);
}

// テンプレートの内容
const template = `---
title: ""
tags:
  - 
private: true
---

# 

`;

// ファイルを作成
try {
  fs.writeFileSync(filePath, template, 'utf8');
  console.log(`✅ ファイルを作成しました: ${filePath}`);
} catch (error) {
  console.error(`エラー: ファイルの作成に失敗しました: ${error.message}`);
  process.exit(1);
}
