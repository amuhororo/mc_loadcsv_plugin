(function(){

	tyrano.plugin.kag.tag.mc_loadcsv = {
		vital : ["file","varname"],
		pm : {
			format : 'ArrayA',
			wait : 'false'
		},
		log_join:"true",
		start : function(pm) {

			//フォーマットの初期値と大文字小文字調整
			if(pm.format.match(/^(array(a|o|)|object(a|o|))$/i) != null){
				pm.format = pm.format.toLowerCase().replace(/^a|a$/gi,'A').replace(/^o|o$/gi,'O');
			}

			//ティラノ変数空チェック ※上書きしたい場合は変数を空欄にしてください。
			let check = TYRANO.kag.embScript(pm.varname);
			if($.isArray(check)) check = check.length;

			if(pm.join || !check ){
				//ファイル名
				const file_url = $.isHTTP(pm.file) ? pm.file : "./data/others/plugin/csv_test/"+pm.file;

				$.when(
					$.ajax({
						type: "GET",
						url: file_url,
						dataType: "text"
					})
					.done(function(data) {
						//関数チェック
						if (typeof mcfn['csv'+pm.format] == 'function') {
							if(pm.join) pm.oridata = TYRANO.kag.embScript(pm.varname);  //joinの時は元データを一時保存
							if(!pm.split || data.search(pm.split)>0) getData(data,pm);
							else alert('split 「 '+pm.split+' 」 がみつかりません。');  //csvに指定のsplitがなかったらアラート
						} else {
							alert('フォーマット名 「 '+pm.format+' 」 がみつかりません。');  //format間違ってたらアラート
						}
					})
					.fail(function() {
						alert("ファイル 「 "+pm.file+" 」 がみつかりません。");
					})
				)
				.done(function(){
					if(pm.wait == "true") TYRANO.kag.ftag.nextOrder();
				});

			}else{ //後で削除
				console.log("実行しません！！！"); //後で削除
			};

			if(pm.wait == "false") TYRANO.kag.ftag.nextOrder();
		}
	};

	TYRANO.kag.ftag.master_tag.mc_loadcsv = object(tyrano.plugin.kag.tag.mc_loadcsv);
	TYRANO.kag.ftag.master_tag.mc_loadcsv.kag = TYRANO.kag;

}());
