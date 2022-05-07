# ティラノスクリプト用「CSV読込プラグイン」

## 概要

csvファイルを任意のティラノ変数へ格納するプラグインです。  
CSVのデータを、配列または連想配列へ変更します。  
任意の f、sf、tf 変数を指定できます。  


## 使い方

1. 「mc_loadcsv」フォルダを、「data/other/plugin/」へ入れてください。
2. csvファイルは、「data/other/plugin/mc_loadcsv/」へ保存してください。
3. first.ks 等に下記コードを記述しプラグインを読み込みます。※パラメータはありません。  
   ```
   [plugin name="mc_loadcsv"]
   ```
4. `[mc_loadcsv]`タグでcsvファイルを読み込みます。  
   ```
   [mc_loadcsv file=sample.csv var="f.test" format=ObjectO split="_EOF" br="\<br\>"]
   ```

## パラメーター

|パラメータ | 必須 | 解説 |
|----|:----:|----|
| file | 〇 | csvファイル名（拡張子必要）<br>※csvファイルは「mc_loadcsv」フォルダ内に保存してください。<br>※http～のURLでも指定できます。 |
| var | 〇 | 保存先変数名（f.hoge など） f、sf、tf 対応。|
| format | × | 配列パターンを指定します（Array/ArrayA/ArrayO/Object/ObjectA/ObjectO) <br> ※指定が無ければ ArrayA（多次元配列）になります。<br>※formatは自分で作る事も可能です（後述） |
| split | × | 分割用文字列を指定します（文字列： \_eof など）<br> ※指定が無ければ改行コードで分割します |
| br | × | 改行コードを指定の文字列に置換します。（文字列：\<br\> など）<br> ※split指定必須 |
| join | × | csvを追記する場合は true。デフォルトは false。<br>※連想配列は同じkeyの値は上書きになります。 |
| wait | × | 完了を待つ場合は true。デフォルトは false。 |

## format パラメータについて

プラグインで用意してあるパターンの場合は、大文字小文字は気にしなくても大丈夫です。  
ご自分で用意した関数の場合は、大文字小文字は区別します。

<details open="false">
<summary>折り畳み</summary>

### Array

**配列**  
行に関係なくだらだらと単純に配列にします。
```
f.hoge = [A1,A2,A3,...,B1,B2,B3,...,C1,C2,C3,...]
```

### ArrayA

**配列-配列（多次元配列）**  
行ごとに配列になります。（デフォルト）
```
f.hoge = [
	[A1,B1,C1],
	[A2,B2,C3],
	...
]
```

### ArrayO

**配列-連想配列**  
行ごとに、連想配列を入れて行きます。  
1行目がkeyになります（TIPプラグインと同じ）
```
f.hoge = [
	{A1:A2,B1:B2,C1:C2},
	{A1:A3,B1:B3,C1:C3},
	...
]
```

### Object

**連想配列**  
1行目に key と value が必須になります。
その他の項目は、あっても無視されます。  
※A1=key、B1=value の場合
```
f.hoge = {
	A2:B2,
	A3:B3,
	...
}
```

### ObjectA

**連想配列-配列**  
1行目に key 必須です。 ※A1=key の場合
```
f.hoge = {
	A2:[B2,C2,D2....],
	A3:[B3,C3,D3,...],
	...
}
```
これ、どやって使うのかわからんです・・・

### ObjectO

**連想配列-連想配列**  
1行目に key 必須です。※A1=key の場合
```
f.hoge = {
	A2:{B1:B2,C1:C2,D1:D2,...},
	A3:{B1:B3,C1:C3,D1:D3,...},
	...
}
```
</details>

## CSVファイルについて

 - 文字コードは UTF-8 にしてください。
 - csvの値は、全て「文字列」になります。
 - ゲームに組み込む時は「mc_loadcsv」フォルダ内に保存してください。  
 フォルダ管理する場合は「file=フォルダ名/ファイル名」のように記述してください。

## 改行コードについて

### セル内で改行コードを使いたい場合
1. csvファイルの最後のセルに分割用のキー（本文に含まない文字）を記入します。
2. `[mc_loadcsv]` タグに `split` パラメータで分割用のキーを指定します。

※`format=Object` 以外の場合、分割用キーの後にあるデータは次の最初のデータとして扱われますのでご注意ください。

### 改行コードを一部置換、一部残したい場合
1. 残したい改行の前に改行コード `\n` を記述してください。
2. `[mc_loadcsv]` タグに `br` パラメータで置換文字を指定します。

## format を自作する方法
<details>
<summary>折り畳み</summary>

1. 関数名を `mc_loadcsv.hoge` と連想配列関数にします。（`hoge` 部分は任意）  
引数1 は csvデータ、引数2 はjoin時の元データが入ります。
2. 変換後のデータを `return` で返します。
3. 適当な名前のjsファイルにして「data/others」に保存します。
4. `[plugin name=mc_loadcsv]` の後に `[loadjs]`タグで呼び出します。
5. `[mc_loadcsv]` タグの `format` パラメータに `hoge` を指定します。  
※大文字小文字は正確に指定してください。

```js
mc_loadcsv.hoge = function(data,oridata){
	let newArray;
	（何らかの処理）
	return newArray;
};
```
```
[plugin name=mc_loadcsv]
[loadjs file=hoge.js]
[mc_loadcsv 略 format=hoge]
```
</details>

## 動作確認

ティラノスクリプト v513c

## 免責

このプラグインを使用したことにより生じた損害・損失に対して制作者は一切責任を負いません。

## 利用規約

 - 改造・再配布は自由です。ただし、有償での再配布は禁止します。  
 改造後データの配布も同様にお願いします。
 - 利用報告・クレジット表記は任意です。
 - このプラグインはドネーションウェア（カンパウェア）です。  
 もしよろしければ寄付をお願いいたします。（強制ではありません）

## 制作者

name ： hororo  
site ： めも調 [https://memocho.no-tenki.me/](https://memocho.no-tenki.me/)  
mail ： ruru.amu@gmail.com  
twitter ： @hororo_memocho  

## 更新履歴

|更新日|Ver| 詳細 |
|--|--|-----|
|2022/5/8|v1.00| 配布開始。 |
