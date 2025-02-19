// 文字列長まわり
const $slider = $('input[name="pwd_len_slider"]');
const $len_box = $('input[name="pwd_len_input"]');

// 文字種チェックボックス
const $al_u_chk = $('input#alpha_u');
const $al_l_chk = $('input#alpha_l');
const $num_chk  = $('input#num');
const $sym_chk  = $('input#symbol');
const $hex_chk  = $('input#hex');

// オプションチェックボックス
const $unq_chk  = $('input#unique');
const $mis_chk  = $('input#mislead');

// 指定文字種が16進数かそれ以外かを判定するhiddenタグ
const $use_type_box = $('input[name="use_type"]');
// 使用したくない記号入力
const $ignore_symbol_box = $('input[name="ignore_symbols"]');

// ボタン類
const $generate_btn = $('button[name="gen"]');
const $bulk_generate_btn = $('button.bulk-gen');

// 記号サンプル
const $symbol_info = $('#symbol-info');

// Crypt未実装ブラウザを知らせるメッセージエリア
const $algo_err = $('.algo-err-msg');
// 生成バリデーションエラーメッセージエリア
const $validation_error = $('div#validation-error');

// 単一パスワード生成結果表示エリア
const $generate_result = $('div#generate-result');
// 単一パスワード生成結果コピーボタン
const $password_copy_btn = $('button[name="password_copy"]');

// 複数パスワードの個数表示エリア
const $bulk_value_label = $('#staticBulkPassword span#blk_value');
// 複数パスワード生成結果表示エリア
const $bulk_generate_result = $('div#bulk-generate-result');
// 複数パスワード格納テキストボックス
const $bulk_textarea = $bulk_generate_result.find('textarea[name="bulk_password"]');

// コンテンツ表示のアニメーション速度
const anim_duration = 100;

// 文字列長の最低値/最大値を設定
$slider.attr('min', PWD_LEN_MIN);
$slider.attr('max', PWD_LEN_MAX);
$len_box.attr('min', PWD_LEN_MIN);
$len_box.attr('max', PWD_LEN_MAX);

// Crypt実装チェック
if(!window.crypto || typeof window.crypto.getRandomValues !== 'function'){
	$('input[name="algorithm"]').prop('checked', false);
	$('input[name="algorithm"][value="crypt"]').prop('disabled', true);
	$('input[name="algorithm"][value="math"]').prop('checked', true);

	$algo_err.show(anim_duration);
}

// 登録済み記号一覧と、紛らわしい文字種一覧の表示
$('#symbol-samples').text(SYMBOL);
$('#mislead-samples').text(MISLEAD_SYMBOLS);

// 選択文字種タイプのデフォルト値を設定
$use_type_box.val(OPTION.use_type);

/**
 * 文字種"記号"チェックボックス制御
 */
const changeSymbolCheck = () => {
	if($sym_chk.prop('checked')){
		$symbol_info.show(anim_duration);
	} else{
		$symbol_info.hide(anim_duration);
	}
};
$sym_chk.change(changeSymbolCheck);

/**
 * "16進数以外"の文字種チェックボックス制御
 */
$('.default-check').change(function(){
	if($(this).prop('checked')){
		$('.hex-check').prop('checked', false);

		$use_type_box.val('default');
	}
});
/**
 * "16進数"のチェックボックス制御
 */
$('.hex-check').change(function(){
	if($(this).prop('checked')){
		$('.default-check').prop('checked', false);
		$symbol_info.hide();

		$mis_chk.prop('checked', false).prop('disabled', true);

		$use_type_box.val('hex');
	} else{
		$al_u_chk.prop('checked', true);
		$al_l_chk.prop('checked', true);
		$num_chk.prop('checked', true);

		$mis_chk.prop('disabled', false);

		$use_type_box.val('default');
	}
});

/**
 * 設定値をオブジェクトに反映
 *
 * @returns {{
 *      length: number,
 *
 *      use_type: string,
 *
 *      alpha_u: boolean,
 *      alpha_l: boolean,
 *      numeric: boolean,
 *      symbol: boolean,
 *      hex: boolean,
 *
 *      unique: boolean,
 *      mislead: boolean,
 *      algorithm: string,
 *
 *      ignore_symbols: string,
 *
 *      validate: boolean
 * }}
 */
const set_option = () => {

	const opt = OPTION;

	opt.length   = parseInt($len_box.val());
	opt.use_type = $use_type_box.val();

	opt.alpha_u = $al_u_chk.prop('checked');
	opt.alpha_l = $al_l_chk.prop('checked');
	opt.numeric = $num_chk.prop('checked');
	opt.symbol  = $sym_chk.prop('checked');
	opt.hex     = $hex_chk.prop('checked');

	opt.unique  = $unq_chk.prop('checked');
	opt.mislead = $mis_chk.prop('checked');

	opt.algorithm = $('input[name="algorithm"]:checked').val();

	opt.ignore_symbols = $ignore_symbol_box.val();

	return opt;
};

// 生成パスワード格納
let password;

/**
 * 単一パスワードの生成ボタンクリック
 */
$generate_btn.click(() => {
	$validation_error.hide();
	$validation_error.empty();

	$bulk_textarea.text('');
	$bulk_textarea.val('');

	const opt = set_option();

	const validate = validation(opt);
	if(validate !== null){
		$generate_result.hide();

		$validation_error.append(`<div class="alert alert-danger">${validate}</div>`);
		$validation_error.show(anim_duration);
	} else{
		password = password_generate(opt);
		if(password !== null){
			$generate_result.find('div#generate-password').text(password);
			$generate_result.show(anim_duration);
		} else{
			$generate_result.hide();
		}
	}
});

/**
 * 複数パスワードの生成ボタンクリック
 */
$bulk_generate_btn.click(function(){
	new Promise((resolve) => {
		$bulk_generate_btn.prop('disabled', true);
		resolve();
	}).then(() => {
		$validation_error.hide();
		$validation_error.empty();
		$generate_result.hide();

		const opt = set_option();

		const validate = validation(opt);
		if(validate !== null){
			$bulk_textarea.text('');
			$bulk_textarea.val('');

			$validation_error.append(`<div class="alert alert-danger">${validate}</div>`);
			$validation_error.show(anim_duration);
		} else{
			const val = parseInt($(this).val());
			const passwords = bulk_password_generate(opt, val);
			const temp = (passwords !== null) ? passwords.join("\n") : '';

			$bulk_textarea.text(temp);
			$bulk_textarea.val(temp);

			$bulk_value_label.text(val.toLocaleString());
			(new bootstrap.Modal('#staticBulkPassword')).show();
		}
	}).then(() => {
		$bulk_generate_btn.prop('disabled', false);
	}).catch(() => {
		$bulk_generate_btn.prop('disabled', false);
	});
});

/**
 * クリップボードコピーボタンクリック
 */
$password_copy_btn.click(function(){
	const $label = $(this).find('i');

	navigator.clipboard.writeText(password).then(
		() => {
			$label.removeClass('bi-copy').addClass('bi-check2');
			setTimeout(() => {
				$label.removeClass('bi-check2').addClass('bi-copy');
			}, 3000);
		},
		() => {
			alert("コピーに失敗しました。");
		});
});

// クリップボードコピー非対応ブラウザーの場合はコピーボタンを非表示にする
if(!navigator.clipboard){
	$password_copy_btn.hide();
}

/**
 * 文字列長入力フォームの入力
 */
$len_box.on('keyup change', function(e){
	const val = $(this).val();
	let newval = (val === '' || isNaN(val)) ? PWD_LEN_MIN : parseInt(val);
	if(newval < PWD_LEN_MIN)
		newval = PWD_LEN_MIN;
	else if(newval > PWD_LEN_MAX)
		newval = PWD_LEN_MAX;

	$slider.val(newval);
	$len_box.val(newval);
});

/**
 * スライダーの結果を文字列長入力フォームに即時反映
 */
const updateInterestRate = () => {
	$len_box.val($slider.val());
};

/**
 * スライダーと文字列長入力フォームの連携初期化
 */
const initializeSlider = () => {
	updateInterestRate();
	$slider.on('input', updateInterestRate)
};
initializeSlider();

// 登録記号一覧の配列
const symbols     = SYMBOL.split('');
// 登録記号(全角)一覧の配列
const symbols_zen = SYMBOL_ZEN.split('');

// 登録記号以外を排除する際に使用する正規表現
const ignore_symbol_regexp_pattern = `[^${SYMBOL.replace('-', '\\-').replace(']', '\\]')}]`;

/**
 * 含ませたくない記号入力フォームの内容変更
 */
$ignore_symbol_box.on('change', function(e){
	const val = $(this).val();
	const temp = [];
	for(let i in val){
		const char = val[i];
		const index = symbols_zen.indexOf(char);

		temp.push((index >= 0) ? symbols[index] : char);
	}

	$(this).val((temp.length > 0) ? array_unique(temp).join('').replace(new RegExp(ignore_symbol_regexp_pattern, 'g'), '') : '');
});
