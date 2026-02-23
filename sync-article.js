#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// コマンドライン引数からファイル名を取得
const filename = process.argv[2];

if (!filename) {
  console.error('エラー: ファイル名を指定してください');
  console.log('使用方法: node sync-article.js <ファイル名>');
  console.log('例: node sync-article.js article001');
  process.exit(1);
}

// .md拡張子がなければ追加
const filenameWithExt = filename.endsWith('.md') ? filename : `${filename}.md`;

// 各ディレクトリのパス
const baseDir = path.join(__dirname, 'base');
const articlesDir = path.join(__dirname, 'articles');
const publicDir = path.join(__dirname, 'public');

const baseFilePath = path.join(baseDir, filenameWithExt);
const articlesFilePath = path.join(articlesDir, filenameWithExt);
const publicFilePath = path.join(publicDir, filenameWithExt);

// baseディレクトリにファイルが存在するか確認
if (!fs.existsSync(baseFilePath)) {
  console.error(`エラー: base/${filenameWithExt} が見つかりません`);
  process.exit(1);
}

console.log(`✅ base/${filenameWithExt} を確認しました`);

// baseファイルの内容を読み込む
const baseContent = fs.readFileSync(baseFilePath, 'utf8');

// フロントマターと本文を分離
const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
const match = baseContent.match(frontmatterRegex);

if (!match) {
  console.error('エラー: フロントマターの形式が正しくありません');
  process.exit(1);
}

const baseFrontmatter = match[1];
const body = match[2];

// フロントマターをパース
function parseFrontmatter(frontmatter) {
  const lines = frontmatter.split('\n');
  const result = {};
  let currentKey = null;
  let currentArray = null;

  for (const line of lines) {
    const keyMatch = line.match(/^(\w+):\s*(.*)$/);
    if (keyMatch) {
      const [, key, value] = keyMatch;
      currentKey = key;
      
      if (value === '') {
        // 配列の開始
        currentArray = [];
        result[key] = currentArray;
      } else {
        result[key] = value.replace(/^["']|["']$/g, '');
        currentArray = null;
      }
    } else if (line.match(/^\s+-\s+(.+)$/) && currentArray !== null) {
      // 配列の要素
      const arrayValue = line.match(/^\s+-\s+(.+)$/)[1].replace(/^["']|["']$/g, '');
      currentArray.push(arrayValue);
    }
  }

  return result;
}

const baseData = parseFrontmatter(baseFrontmatter);

// Zenn用のフロントマターを生成
function generateZennFrontmatter(data) {
  let frontmatter = '---\n';
  
  if (data.title) {
    frontmatter += `title: "${data.title}"\n`;
  }
  
  // emojiとtypeはZenn固有（baseにあれば使用）
  if (data.emoji) {
    frontmatter += `emoji: "${data.emoji}"\n`;
  } else {
    frontmatter += `emoji: "📝"\n`;
  }
  
  if (data.type) {
    frontmatter += `type: "${data.type}"\n`;
  } else {
    frontmatter += `type: "tech"\n`;
  }
  
  // topicsはbaseのtagsから取得（小文字化して引用符付き）
  const tags = data.tags || [];
  if (tags.length > 0) {
    frontmatter += 'topics:\n';
    tags.forEach(tag => {
      // 小文字化して引用符付きで出力
      frontmatter += `  - "${tag.toLowerCase()}"\n`;
    });
  }
  
  // publishedはbaseのprivateの逆
  const published = data.private === 'true' || data.private === true ? false : true;
  frontmatter += `published: ${published}\n`;
  
  frontmatter += '---';
  return frontmatter;
}

// Qiita用のフロントマターを生成
function generateQiitaFrontmatter(data) {
  let frontmatter = '---\n';
  
  if (data.title) {
    frontmatter += `title: ${data.title}\n`;
  }
  
  // tagsはbaseのtagsから取得（大文字小文字そのまま、引用符なし）
  const tags = data.tags || [];
  if (tags.length > 0) {
    frontmatter += 'tags:\n';
    tags.forEach(tag => {
      frontmatter += `  - ${tag}\n`;
    });
  }
  
  // privateはbaseのprivate
  const isPrivate = data.private === 'true' || data.private === true;
  frontmatter += `private: ${isPrivate}\n`;
  
  // Qiita固有のフィールド
  frontmatter += `updated_at: ''\n`;
  frontmatter += `id: null\n`;
  frontmatter += `organization_url_name: null\n`;
  frontmatter += `slide: false\n`;
  frontmatter += `ignorePublish: false\n`;
  
  frontmatter += '---';
  return frontmatter;
}

// articlesディレクトリの処理（Zenn）
const articlesExists = fs.existsSync(articlesFilePath);
if (!articlesExists) {
  console.log(`📝 articles/${filenameWithExt} が存在しないため、新規作成します`);
  
  // Zenn CLIで新規作成
  try {
    const slug = filenameWithExt.replace('.md', '');
    execSync(`npx zenn new:article --slug ${slug}`, { 
      cwd: __dirname,
      stdio: 'pipe'
    });
    console.log(`✅ Zenn CLIで articles/${filenameWithExt} を作成しました`);
  } catch (error) {
    console.error('警告: Zenn CLIでの作成に失敗しました。手動で作成します');
    // ディレクトリが存在しない場合は作成
    if (!fs.existsSync(articlesDir)) {
      fs.mkdirSync(articlesDir, { recursive: true });
    }
  }
}

// Zenn記事を同期
const zennContent = generateZennFrontmatter(baseData) + '\n' + body;
fs.writeFileSync(articlesFilePath, zennContent, 'utf8');
console.log(`✅ articles/${filenameWithExt} を同期しました`);

// publicディレクトリの処理（Qiita）
const publicExists = fs.existsSync(publicFilePath);
if (!publicExists) {
  console.log(`📝 public/${filenameWithExt} が存在しないため、新規作成します`);
  
  // Qiita CLIで新規作成を試みる
  try {
    execSync(`npx qiita new ${filenameWithExt}`, { 
      cwd: __dirname,
      stdio: 'pipe'
    });
    console.log(`✅ Qiita CLIで public/${filenameWithExt} を作成しました`);
  } catch (error) {
    console.error('警告: Qiita CLIでの作成に失敗しました。手動で作成します');
    // ディレクトリが存在しない場合は作成
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
  }
}

// Qiita記事を同期
const qiitaContent = generateQiitaFrontmatter(baseData) + '\n' + body;
fs.writeFileSync(publicFilePath, qiitaContent, 'utf8');
console.log(`✅ public/${filenameWithExt} を同期しました`);

console.log('\n🎉 同期が完了しました！');
