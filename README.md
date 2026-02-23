# my-article
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
