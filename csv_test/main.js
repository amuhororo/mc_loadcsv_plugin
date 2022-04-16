function mcLoadcsv(pm) {
	//メモ
	//csvファイル名 file 区切りを指定すんのもありかなー
	//保存先変数名 varname
	//保存形式  format = array/arrayA/arrayO/object/objectA/objectO/ とか・・・？
	//追記？ join かなああああ？※未実装
	//分割コード split ※指定無ければ改行コードで分割
	//改行を変換 br　※split指定しないと無意味

	//変数に値がある場合は読込スキップを入れたい。

	//必須項目チェック
	if(pm.file === undefined) alert("「file」に「csvファイル名」を指定してください。");
	else if(pm.varname === undefined) alert("「varname」に「ティラノスクリプト変数名」を指定してください。");

	//ティラノ変数チェック ※上書きしたい場合は変数空欄にしてください。
	if(!TYRANO.kag.embScript(pm.varname).length){
		$.ajax({
			type: "GET",
			url: "./data/others/plugin/csv_test/"+pm.file,
			dataType: "text"
		})
		.done(function(data) {
			getData(data,pm);
		})
		.fail(function(data) {
			alert("ファイル 「 "+pm.file+" 」 がみつかりません。");
		});
	}else{
		console.log("実行しません！！！");
	}
};

//ファイル呼び出し
function getData(data,pm){
	pm.br = pm.br || "";
	let br = !pm.br ? '\n' : pm.br;  //改行
	const split = pm.split ? pm.split : br;  //分割キー
	const format = pm.format ? pm.format.toLowerCase().replace(/^a|a$/ig,'A').replace(/^o|o$/ig,'O') : 'ArrayA'; //フォーマット
	const xbr = "_&&&_";  //改行代替え用
	//console.log(format,pm.format);

	//データの下準備
	data = data.replace(/\r?\n/g, br).replace(/\\n/g,xbr);  //改行を置換/改行記号を適当な文字列に置換 &&&&&使う人いたら困る。
	data = data.replace(new RegExp(xbr+br,'g'),xbr);  //代替え文字列に隣接した改行を削除
	if(pm.split){
		data = data.replace(new RegExp(','+pm.split+br,'g'), pm.split);  //分割キー前のコンマと後の改行はいらない
		if(pm.br == '') data = data.replace(/\n/g, '');  //改行削除
	}
	data = data.split(split);   //分割して配列にする
	data = $.grep(data, function(e){return e;});    //空行削除
	//改行の代替え記号を改行コードに戻す。他にやりようないのか・・・。
	br = pm.split ? pm.br : "";
	data = data.map(elem => elem.replace(new RegExp(xbr+br,'g'), '\n'));

	//データを変換
	const newData = mcfn['csv'+format](data);

	//ティラノの変数に格納
	const f = TYRANO.kag.stat.f;
	const sf = TYRANO.kag.variable.sf;
	const tf = TYRANO.kag.variable.tf;
	eval(pm.varname+'=newData');

	//console.log(format+'：'+pm.varname,TYRANO.kag.embScript(pm.varname));

};


var mcfn = new Array();
//配列
mcfn.csvArray = function(data){
	let newArray = data.join(","); //配列を文字列に戻す
	newArray = newArray.split(","); //再分割
	return newArray;
};

//配列-配列
mcfn.csvArrayA = function(data){
	let newArray = new Array();
	for(let i=0; i<data.length; i++){
		const a_line = data[i].split(",");　//1行分を分ける
		newArray.push(a_line);　//追加
	}
	return newArray;
};

//配列-連想配列
mcfn.csvArrayO = function(data){
	let newArray = new Array();
	const items = data[0].split(",");   //「項目名」の配列を作る
	for(let i=1; i<data.length; i++){
		const a_line = new Object();
		const csvArrayD = data[i].split(",");　//1行分を分ける
		for (let j=0; j<items.length; j++) {
			a_line[items[j]] = csvArrayD[j];  //keyにvalueいれてく
		}
		newArray.push(a_line);　//追加
	}
	return newArray;
};

//連想配列 *key/value意外は無視
mcfn.csvObject = function(data){
	let newArray = new Object();
	const items = data[0].split(",");   //「項目名」の配列を作る
	const k = items.indexOf('key');     //keyの配列順
	const v = items.indexOf('value');   //valueの配列順
	for(let i=1; i<data.length; i++){
		const csvArrayD = data[i].split(",");
		newArray[csvArrayD[k]] = csvArrayD[v];
	}
	return newArray;
};

//連想配列-配列
mcfn.csvObjectA = function(data){
	let newArray = new Object();
	const items = data[0].split(",");   //「項目名」の配列を作る
	const k = items.indexOf('key');     //keyの配列順
	for(let i=1; i<data.length; i++){
		const csvArrayD = data[i].split(",");   //1件分のデータを分割
		newArray[csvArrayD[k]] = csvArrayD;
		newArray[csvArrayD[k]].splice( k , 1 );  //key分削除
	}
	return newArray;
};

//連想配列-連想配列
mcfn.csvObjectO = function(data){
	let newArray = new Object();
	const items = data[0].split(",");   //「項目名」の配列を作る
	const k = items.indexOf('key');     //keyの配列順
	for(let i=1; i<data.length; i++){
		const csvArrayD = data[i].split(",");   //1件分のデータを分割
		newArray[csvArrayD[k]] = new Object();
		for(let j=0; j<items.length; j++){
			if(j != k) newArray[csvArrayD[k]][items[j]] = csvArrayD[j];
		}
	}
	return newArray;
};
