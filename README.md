# my-article

## 新規記事の作成

新規記事を`base/`ディレクトリに作成するには：

```console
npm run create
```

または

```console
node create-article.js
```

ファイル名は自動生成されます（タイムスタンプベース）：
- フォーマット: `article-YYYY-MM-DD-HHMMSS`
- 例: `article-2024-02-23-195830.md`
- Zennの命名規則（12-50文字）を自動的に満たします

これにより自動生成されたファイル名で `base/article-YYYY-MM-DD-HHMMSS.md` が作成されます：

```markdown
---
title: ""
tags:
  - 
private: true
---

# 

```

## 両方に記事を投稿する（Zenn + Qiita同期）

`base/` ディレクトリに記事を作成し、以下のコマンドで ZennとQiita の両方に同期できます：

```console
npm run sync <ファイル名>
```

または

```console
node sync-article.js <ファイル名>
```

例：
```console
npm run sync article-2024-02-23-195830
```

これにより：
- `articles/article-2024-02-23-195830.md` （Zenn用）
- `public/article-2024-02-23-195830.md` （Qiita用）

が自動的に作成または更新されます。

## 記事のリネーム

`base/`、`articles/`、`public/` の3つのディレクトリにある記事ファイルを一括でリネームできます：

```console
npm run rename <変更前のファイル名> <変更後のファイル名>
```

または

```console
node rename-article.js <変更前のファイル名> <変更後のファイル名>
```

例：
```console
npm run rename my-old-article my-new-article-2024
```

これにより：
- `base/my-old-article.md` → `base/my-new-article-2024.md`
- `articles/my-old-article.md` → `articles/my-new-article-2024.md`
- `public/my-old-article.md` → `public/my-new-article-2024.md`

が一括でリネームされます。

### base/ディレクトリの記事フォーマット

```markdown
---
title: "記事のタイトル"
tags:
  - Go
  - GitHub
  - CI
private: true
---

# 記事の本文

内容...
```

### フィールドの対応関係

#### 共通フィールド
- `title`: 記事タイトル（Zenn、Qiita両方で使用）
- 本文: Markdown形式の内容（そのまま両方に反映）

#### 変換されるフィールド
| base | Zenn | Qiita | 説明 |
|------|------|-------|------|
| `tags` | `topics` | `tags` | タグ/トピック（配列） |
| `tags: [Go, GitHub]` | `topics: ["go", "github"]` | `tags: [Go, GitHub]` | **Zennは小文字化＋引用符付き、Qiitaは大文字小文字そのまま** |
| `private: true` | `published: false` | `private: true` | 非公開設定 |
| `private: false` | `published: true` | `private: false` | 公開設定 |

#### Zenn固有のフィールド（自動追加）
- `emoji`: baseにない場合は "📝" がデフォルト
- `type`: baseにない場合は "tech" がデフォルト

#### Qiita固有のフィールド（自動追加）
- `updated_at`, `id`, `organization_url_name`, `slide`, `ignorePublish`

---

## zenn
  👇  新しい記事を作成する
  $ npx zenn new:article

  👇  新しい本を作成する
  $ npx zenn new:book

  👇  投稿をプレビューする
  $ npx zenn preview

---

## qiita
### 作成
npx qiita new 記事のファイルのベース名

### preview
npx qiita preview

### 記事の投稿・更新

Qiita Preview 上の「記事を投稿する」ボタン、または以下のコマンドで投稿・更新ができます。

```console
npx qiita publish 記事のファイルのベース名
```

以下のコマンドで全ての記事を反映させることができます。

```console
npx qiita publish --all
```

`--force`オプションを用いることで、強制的に記事ファイルの内容を Qiita に反映させます。

```console
npx qiita publish 記事ファイルのベース名 --force
# -f は --force のエイリアスとして使用できます。
npx qiita publish 記事ファイルのベース名 -f
```

### 記事の削除

Qiita CLI、Qiita Preview から記事の削除はできません。
`public`ディレクトリから markdown ファイルを削除しても Qiita 上では削除はされません。

[Qiita](https://qiita.com)上で記事の削除を行なえます。

### help

簡単なヘルプが見れます。

```console
npx qiita help
```

### pull

記事ファイルを Qiita と同期します。
Qiita 上で更新を行い、手元で変更を行っていない記事ファイルのみ同期されます。

```console
npx qiita pull
```

`--force`オプションを用いることで、強制的に Qiita 上の内容を記事ファイルに反映させます。

```console
npx qiita pull --force
# -f は --force のエイリアスとして使用できます。
npx qiita pull -f
```
