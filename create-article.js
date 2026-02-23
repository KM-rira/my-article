#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// タイムスタンプベースでファイル名を自動生成
function generateFilename() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  // フォーマット: article-YYYY-MM-DD-HHMMSS (24文字)
  return `article-${year}-${month}-${day}-${hours}${minutes}${seconds}`;
}

const filename = generateFilename();
const filenameWithExt = `${filename}.md`;

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
private: false
---

# 

`;

// ファイルを作成
try {
  fs.writeFileSync(filePath, template, 'utf8');
  console.log(`✅ ファイルを作成しました: ${filePath}`);
  console.log(`📝 ファイル名: ${filename}`);
  console.log('');
  console.log('次のステップ:');
  console.log(`1. base/${filenameWithExt} を編集して記事を書く`);
  console.log(`2. npm run sync ${filename} で同期する`);
} catch (error) {
  console.error(`エラー: ファイルの作成に失敗しました: ${error.message}`);
  process.exit(1);
}
