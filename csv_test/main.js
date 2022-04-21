function mcLoadcsv(pm) {
	//メモ
	//csvファイル名 file 区切りを指定すんのもありかなー
	//保存先変数名 varname
	//保存形式  format = array/arrayA/arrayO/object/objectA/objectO/ とか・・・？
	//追記？ join かなああああ？※未実装
	//分割コード split ※指定無ければ改行コードで分割
	//改行を変換 br　※split指定しないと無意味

	//変数に値がある場合は読込スキップを入れたい。※済

	//必須項目チェック
	if(pm.file === undefined) alert("「file」に「csvファイル名」を指定してください。");
	else if(pm.varname === undefined) alert("「varname」に「ティラノスクリプト変数名」を指定してください。");

	//フォーマットの初期値と大文字小文字調整
	pm.format = pm.format || 'ArrayA';
	if(pm.format.match(/arraya|arrayo|array|objecta|objecto|object/i) != null){
		pm.format = pm.format.toLowerCase().replace(/^a|a$/gi,'A').replace(/^o|o$/gi,'O');
	}
	
	//ティラノ変数チェック ※上書きしたい場合は変数を空欄にしてください。
	let check = TYRANO.kag.embScript(pm.varname);
	if($.isArray(check)) check = check.length;
	if( !check ){
		$.ajax({
			type: "GET",
			url: "./data/others/plugin/csv_test/"+pm.file,
			dataType: "text"
		})
		.done(function(data) {
			//関数チェック
			if (typeof mcfn['csv'+pm.format] == 'function') {
				getData(data,pm);
			} else {
				alert('フォーマット名 「 '+pm.format+' 」 がみつかりません。');
			}
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
	//pm.br = pm.br || '';
	//let br = !pm.br ? '\n' : pm.br;  //改行
	const split = pm.split ? pm.split : '\n';  //分割キー
	//const format = pm.format ? pm.format.toLowerCase().replace(/^a|a$/ig,'A').replace(/^o|o$/ig,'O') : 'ArrayA'; //フォーマット
	//const xbr = "_&&&_";  //改行代替え文字列

	//データの下準備
	//data = data.replace(/\r?\n/g, br).replace(/\\n/g,xbr);  //改行を置換/改行記号を適当な文字列に置換 &&&&&使う人いたら困る。
	//data = data.replace(new RegExp(xbr+br,'g'),xbr);  //代替え文字列に隣接した改行を削除
	data = data.replace(/\r?\n/g,'\n').replace(/\\n\n/g,'\\n');  //改行を\nに統一
	if(pm.split){
		data = data.replace(new RegExp(','+pm.split+'\n','g'), pm.split);  //分割キー前のコンマと後の改行はいらない
		//if(pm.br == '') data = data.replace(/\n/g, '');  //改行削除
		if(pm.br) data = data.replace(/\n/g, pm.br);  //改行置換
	}
	data = data.split(split);   //分割して配列にする
	data = $.grep(data, function(e){return e;});    //空行削除
	//改行文字列を改行コードに戻す。
	//br = pm.split ? pm.br : "";
	//data = data.map(elem => elem.replace(new RegExp(xbr+br,'g'), '\n'));
	data = data.map(elem => elem.replace(/\\n/g, '\n'));


	//データを変換
	const newData = mcfn['csv'+pm.format](data);

	//ティラノの変数に格納
	const f = TYRANO.kag.stat.f;
	const sf = TYRANO.kag.variable.sf;
	const tf = TYRANO.kag.variable.tf;
	eval(pm.varname+'=newData');
	TYRANO.kag.saveSystemVariable();  //sf変数セーブ

	//console.log(pm.format+'：'+pm.varname,TYRANO.kag.embScript(pm.varname));

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
