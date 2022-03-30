# ティラノスクリプト用「CSV読込プラグイン」

csvファイルを任意のティラノ変数へ格納するプラグインです。
β版 2020/3/30

## 使い方
① csv_test フォルダを data/other/pluin/ へ入れる
② [plugin name="csv_test"]
③ [mc_loadcsv file=sample.csv varname="tf.s.test" overwrite=yes format=ObjectO spilit="_EOF" br=""]

## パラメーター
※変更の可能性あり

file = csvファイル名
varname = 保存先変数名（f.hofe など）
format = 配列パターン（array/arrayA/arrayO/object/objectA/objectO)
split = 分割キーを指定　※指定が無ければ改行コードで分割
br = 改行コードを任意の文字列へ変換　※split指定必須

## format について
### array
配列
行に関係なくだらだらと単純に配列にします。

### arrayA
配列-配列
行ごとに入れ子の配列になります。
[[a-1,a-2,a-3],[b-1,b-2,b-3],...]

### arrayO
配列-連想配列
行ごとに、連想配列を入れて行きます。1行目がkeyになります（TIPプラグインと同じ）
[{a-1:b-1,a-2:b-2,a-3:b-3},{a-1:c-1,a-2:c-2,a-3:c-3},...]

### object
連想配列
1行目に key と value が必須になります。その他の項目は、あっても無視されます。
{b-1:b-2,c-1:c-2,d-1:d-2,...}

### objectA
連想配列-配列
1行目に key 必須。これ、どやって使うのかわからんです・・・
※a-1=key の場合
{b-1:[b-2,b-3,b-4....],c-1:[c-2,c-3,c-4,...],...}

### objectO
連想配列-連想配列
{{a-1:b-1,a-2:b-2,a-3:b-3,...},{a-1:c-1,a-2:c-2,a-3:c-3,...},...}

## セル内で改行コードを使いたい場合
① csvファイルの最後のセルに分割用のキー（何でもいいけど被らないように）を入れる。
② mc_loadcsv タグに split属性で、分割用キーを指定する

## 改行コードを一部変更、一部残したい場合
残したい改行の前に改行コード \n を記述しておいてください。
