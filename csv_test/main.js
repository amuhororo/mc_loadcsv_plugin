function mcLoadcsv(pm) {
	//メモ
	//csvファイル名 file 区切りを指定すんのもありかなー
	//保存先変数名 varname
	//保存形式  format = array/arrayA/arrayO/object/objectA/objectO/ とか・・・？
	//追記？ join かなああああ？※未実装
	//分割コード split ※指定無ければ改行コードで分割
	//改行を変換 br　※split指定しないと無意味

	//ティラノ変数名チェック
	if(pm.varname === undefined) alert("保存先の「ティラノスクリプト変数名」を指定してください。");

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

}

function getData(data,pm){
	const br = !pm.br ? '\n' : pm.br;  //改行
	const split = pm.split ? pm.split : br;  //分割キー
	//フォーマット
	const format = pm.format ? pm.format.replace(/array/i, 'Array').replace(/object/i, 'Object') : 'ArrayA';

	//データの下準備
	data = data.replace(/\r?\n/g, br).replace(/\\n/g,'&&&&&');  //改行を置換/改行記号を適当な文字列に置換
	data = data.replace(new RegExp('&&&&&'+br,'g'),'&&&&&');  //代替え文字列に隣接した改行を削除
	if(pm.split){
		data = data.replace(new RegExp(','+pm.split+br,'g'), pm.split);  //分割キー前のコンマと後の改行はいらない
		if(pm.br == '') data = data.replace(/\n/g, '');  //改行削除
	}
	data = data.split(split);   //分割して配列にする
	data = $.grep(data, function(e){return e;});    //空行削除
	//改行の代替え記号を改行コードに戻す。他にやりようないのか・・・。
	data = data.map(elem => elem.replace(new RegExp('&&&&&'+pm.br,'g'), '\n'));

	//データを変換
	const newData = mcfn['csv'+format](data);
	//ティラノの変数に格納
	const f = TYRANO.kag.stat.f;
	const sf = TYRANO.kag.variable.sf;
	const tf = TYRANO.kag.variable.tf;
	eval(pm.varname+'=newData');

	//console.log(pm.format+'＋'+pm.varname,TYRANO.kag.embScript(pm.varname));

}
//ファイル呼び出し
function getData2(pm){
	$.ajax({
		type: "GET",
		url: "./data/others/plugin/csv_test/"+pm.file,
		dataType: "text"
	})
	.done(function(data) {
		const br = !pm.br ? '\n' : pm.br;  //改行
		const split = pm.split ? pm.split : br;  //分割キー

		//フォーマット
		const format = pm.format ? pm.format.replace(/array/i, "Array").replace(/object/i, "Object") : "ArrayA";

		//データの下準備
		data = data.replace(/\r\n|\n|\r/g, br);  //改行を置換
		if(pm.split){
			data = data.replace(new RegExp(","+pm.split+br,"g"), pm.split);  //分割キー前のコンマと後の改行はいらない
			if(pm.br == "") data = data.replace(/\n/g, "");  //改行削除
		}
		data = data.split(split);   //分割して配列にする
		data = $.grep(data, function(e){return e;});    //空行削除

		//データを変換
		const newData = mcfn['csv'+format](data);
		//ティラノの変数に格納
		const f = TYRANO.kag.stat.f;
		const sf = TYRANO.kag.variable.sf;
		const tf = TYRANO.kag.variable.tf;
		eval(pm.varname+"=newData");

		//console.log(pm.format+"＋"+pm.varname,TYRANO.kag.embScript(pm.varname));

	})
	.fail(function(data) {
		alert("ファイル 「 "+pm.file+" 」 がみつかりません。");
	});
}

function csvjson(data){
	alert("csvjson を実行しました。");
}

var mcfn = new Array();
//配列
mcfn.csvArray = function(data){
	let newArray = data.join(","); //配列を文字列に戻す
	newArray = newArray.split(","); //再分割
	return newArray;
}

//配列-配列
mcfn.csvArrayA = function(data){
	let newArray = new Array();
	for(let i=0; i<data.length; i++){
		const a_line = data[i].split(",");　//1行分を分ける
		newArray.push(a_line);　//追加
	}
	return newArray;
}
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
}
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
}
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
}

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
}
