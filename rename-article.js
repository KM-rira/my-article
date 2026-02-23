#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// コマンドライン引数からファイル名を取得
const beforeName = process.argv[2];
const afterName = process.argv[3];

if (!beforeName || !afterName) {
  console.error('エラー: 変更前と変更後のファイル名を指定してください');
  console.log('使用方法: node rename-article.js <変更前のファイル名> <変更後のファイル名>');
  console.log('例: node rename-article.js article001 article002');
  process.exit(1);
}

// .md拡張子がなければ追加
const beforeNameWithExt = beforeName.endsWith('.md') ? beforeName : `${beforeName}.md`;
const afterNameWithExt = afterName.endsWith('.md') ? afterName : `${afterName}.md`;

// 各ディレクトリのパス
const directories = ['base', 'articles', 'public'];
const results = [];

// 同じファイル名の場合はエラー
if (beforeNameWithExt === afterNameWithExt) {
  console.error('エラー: 変更前と変更後のファイル名が同じです');
  process.exit(1);
}

// 各ディレクトリでファイルの存在確認
console.log(`📝 ファイルのリネーム: ${beforeNameWithExt} → ${afterNameWithExt}`);
console.log('');

for (const dir of directories) {
  const dirPath = path.join(__dirname, dir);
  const beforePath = path.join(dirPath, beforeNameWithExt);
  const afterPath = path.join(dirPath, afterNameWithExt);

  // ディレクトリが存在しない場合はスキップ
  if (!fs.existsSync(dirPath)) {
    results.push({
      dir,
      status: 'skip',
      message: 'ディレクトリが存在しません'
    });
    continue;
  }

  // 変更前のファイルが存在しない場合
  if (!fs.existsSync(beforePath)) {
    results.push({
      dir,
      status: 'skip',
      message: '変更前のファイルが存在しません'
    });
    continue;
  }

  // 変更後のファイルが既に存在する場合
  if (fs.existsSync(afterPath)) {
    results.push({
      dir,
      status: 'error',
      message: '変更後のファイル名が既に存在します'
    });
    continue;
  }

  // リネーム実行
  try {
    fs.renameSync(beforePath, afterPath);
    results.push({
      dir,
      status: 'success',
      message: 'リネーム成功'
    });
  } catch (error) {
    results.push({
      dir,
      status: 'error',
      message: `リネーム失敗: ${error.message}`
    });
  }
}

// 結果を表示
console.log('📊 リネーム結果:');
console.log('');

let hasError = false;
let successCount = 0;

for (const result of results) {
  let icon = '';
  if (result.status === 'success') {
    icon = '✅';
    successCount++;
  } else if (result.status === 'error') {
    icon = '❌';
    hasError = true;
  } else {
    icon = '⏭️ ';
  }

  console.log(`${icon} ${result.dir}/ - ${result.message}`);
}

console.log('');

if (hasError) {
  console.error('⚠️  一部のファイルでエラーが発生しました');
  process.exit(1);
} else if (successCount === 0) {
  console.error('⚠️  リネームできるファイルが見つかりませんでした');
  process.exit(1);
} else {
  console.log(`🎉 ${successCount}個のファイルを正常にリネームしました！`);
}
