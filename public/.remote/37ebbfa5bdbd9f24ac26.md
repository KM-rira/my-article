---
title: 自分だけのcursorのカスタム指示書を作成しよう！
tags:
  - AI
  - cursor
private: false
updated_at: '2026-02-25T01:05:10+09:00'
id: 37ebbfa5bdbd9f24ac26
organization_url_name: null
slide: false
ignorePublish: false
---

こんちくわ

AIってすごい進化していますよね〜

NVIDIA、microsoft、AMAZON、Googleなどの企業もAI事業にめっちゃ投資しているみたいですね！

どこまで進化するのか…！

そこで、我々エンジニアももうAIなしでは仕事ができないというほど使う人もいるのではないでしょうか？

私は無理ですね笑

そこで便利だったナレッジを共有したいと思います！

cursorへのrules(カスタム指示書)についてです！

## 今回やること

cursor rulesを設定し、そこからcursorに指示をしよう

## cursor rulesとは

cursorへのルールを事前にmdcファイルに書き込むことで、毎回プロンプトに記載したり、説明する必要がないので、事前に書いておくと便利なもの。

AIへの事前学習みたいなものですね。

詳細は公式参照：
https://cursor.com/ja/docs/context/rules


一応cursorの基本設定からもcursorの独自ルール設定ができすが、テキストファイルで管理した方が良い面も多いので、このようなやり方をしています。

## 実装
### .gitignoreを作成

.gitignore に/.cursor/rules/personal-*.mdcと記載する
- personal-task.mdc
- personal-fmt.mdc
のように独自のルール設定ができるでおすすめです。
```bash
echo '/.cursor/rules/personal-*.mdc' > .gitignore
```

ファイルはここにおきます
```bash
<repo-root>/
  .cursor/
    rules/
      personal-fmt.mdc
```

rule fileを作成！！
```bash
mkdir -p '/.cursor/rules'
touch '/.cursor/rules/personal-fmt.mdc'
```

中身はこんなかんじで
```text:personal-fmt.mdc
---
description: "gofmt rules for go files"
alwaysApply: true
---
このファイルを読み込んだら、「ruleを読み込みました！」と出力してください。
gofmt -s -w . を実行し、フォーマットをしてください
フォーマット完了したら、「フォーマット完了！」と出力してください。
```
※ `alwaysApply` が true の場合、そのルールはすべてのチャットセッションに適用されます。false の場合はそのルールの説明が Cursor Agent に渡され、適用するかどうかが判断されます。

## 動作検証
編集後にテストしましょう

適当にリポジトリ作成し、このようにmain.goを作成してください

```
touch main.go
```

main.goにこのように記載してください。
```go:main.go
package main
import "fmt"
func main() {
fmt.Println("hello")
}
```

```
main.goをhello cursorと出力するように編集してください。
編集時はインデントなしでお願いします。
```
このようにcursorに指示します

動作しますでしょうか？

![Screenshot from 2026-02-25 00-40-22.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3830923/d8b4a294-1aef-4470-8ff0-175117483786.png)


ちゃんと`ruleを読みました！`, `フォーマット完了！`と出力されていますね！

main.goの方はフォーマットされているでしょうか？

```go:main.go
package main

import "fmt"

func main() {
	fmt.Println("hello cursor")
}

```

フォーマットされていますね！

```sh
$ go run main.go
hello cursor
```
main.goを実行したところ、`hello cursor`ができましたね！

## その他活用術
他の活用方法としては、下記の内容でPRを作成し、ghコマンドでPR作成してください！とpersonal-pr-create.mdcとか作成したりしました。

```txt:personal-pr-create.mdc
# 概要

# 実装内容

# テスト内容

```

下記のようにファイルを作成し、レビュー依頼文言を作成するまでしていました！
```txt:personal-pr-review-request.mdc
このブランチで実装した内容をmainブランチとのdiffを確認して、レビュー依頼を作成してください。
PRのURLはこちらで取得してください。gh pr view --json url --jq .url

例：
main.goに"hello cursor"と出力するように編集しました！
レビューお願いします！
PR URL
```

# まとめ
このように定形作業はこのようにしてAIの力を活用してサクッと仕事を終えてしまいましょう！

華金の飲み会があるときなどは遅刻できませんですしね！！

他にもアイディアはたくさんあると思いますので色々活用してみてください！

良いアイディアがあれば教えてほしいです！

ではまた〜

