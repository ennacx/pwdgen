// 文字列長まわり
const $slider = $('input[name="pwd_len_slider"]');
const $len_box = $('input[name="pwd_len_input"]');

// 文字種チェックボックス
const $al_u_chk = $('input#alpha_u');
const $al_l_chk = $('input#alpha_l');
const $num_chk  = $('input#num');
const $sym_chk  = $('input#symbol');
const $hex_chk  = $('input#hex');
const $uuid_chk  = $('input#uuid');

// オプションチェックボックス
const $unq_chk  = $('input#unique');
const $mis_chk  = $('input#mislead');

// 指定文字種が16進数かUUIDか、またはそれ以外かを判定するhiddenタグ
const $use_type_box = $('input[name="use_type"]');
// 使用したくない記号入力
const $ignore_symbol_box = $('input[name="ignore_symbols"]');

// アルゴリズムチェックボックス
const $algo_radio = $('input[name="algorithm"]');

// ボタン類
const $generate_btn = $('button[name="gen"]');
const $bulk_generate_btn = $('button.bulk-gen');

// 記号サンプル
const $symbol_info = $('#symbol-info');

// Crypt未実装ブラウザを知らせるメッセージエリア
const $algo_err = $('.algo-err-msg');
// 生成バリデーションエラーメッセージエリア
const $validation_error = $('div#validation-error');

// 単一文字列生成結果表示エリア
const $generate_result = $('div#generate-result');
// 単一文字列生成結果コピーボタン
const $password_copy_btn = $('button[name="password_copy"]');

// 複数文字列の個数表示エリア
const $bulk_value_label = $('#bulk-generate-result-modal span#blk_value');
// 複数文字列の生成結果表示エリア
const $bulk_generate_result = $('#bulk-generate-result-modal div#bulk-generate-result');
// 複数文字列の格納テキストボックス
const $bulk_textarea = $bulk_generate_result.find('textarea[name="bulk_password"]');
// 複数文字列のダウンロードボタン
const $bulk_download = $('#bulk-generate-result-modal a#bulk-generate-download');

// コンテンツ表示のアニメーション速度
const ANIM_DURATION_MS = 100;

// Crypt実装フラグ
let cryptReady = true;

// 文字列長の最低値/最大値を設定
$slider.attr('min', PWD_LEN_MIN);
$slider.attr('max', PWD_LEN_MAX);
$len_box.attr('min', PWD_LEN_MIN);
$len_box.attr('max', PWD_LEN_MAX);

// Crypt実装チェック
if(!window.crypto || typeof window.crypto.getRandomValues !== 'function' || typeof window.crypto.randomUUID !== 'function'){
    // フラグ更新
    cryptReady = false;

    // UUIDの生成無効化
    $uuid_chk.prop('disabled', true);

    // アルゴリズム選択ラジオボタン無効化 (Mathを選択状態にする)
    $algo_radio.prop('checked', false);
    $('input[name="algorithm"][value="crypt"]').prop('disabled', true);
    $('input[name="algorithm"][value="math"]').prop('checked', true);

    // 警告メッセージ表示
    $algo_err.show(ANIM_DURATION_MS);
}

// サブタイトル表記変更
$('div#subheader').html(
    `<p>${(cryptReady) ? "Cryptアルゴリズムならパスワードに使える！😀" : "Mathはパスワードにはオススメできない🤔"}</p>`
);

// 登録済み記号一覧と、紛らわしい文字種一覧の表示
$('#symbol-samples').text(SYMBOL);
$('#mislead-samples').text(MISLEAD_SYMBOLS);

// 選択文字種タイプのデフォルト値を設定
$use_type_box.val(OPTION.use_type);

/**
 * Displays a validation error message within the designated HTML element.
 *
 * @param {string} message - The validation error message to be displayed.
 * @return {void} This method does not return a value.
 */
function showValidationError(message){
    $validation_error
        .html(`<div class="alert alert-danger">${message}</div>`)
        .show(ANIM_DURATION_MS);
}

/**
 * 文字種"記号"チェックボックス制御
 */
const changeSymbolCheck = () => {

    if($sym_chk.prop('checked'))
        $symbol_info.show(ANIM_DURATION_MS);
    else
        $symbol_info.hide(ANIM_DURATION_MS);
};
$sym_chk.change(changeSymbolCheck);

/**
 * "16進数以外"の文字種チェックボックス制御
 */
$('.default-check').change(function(){

    // チェック
    if($(this).prop('checked')){
        $slider.prop('disabled', false);
        $len_box.prop('readonly', false);

        $hex_chk.prop('checked', false);
        $uuid_chk.prop('checked', false);

        $unq_chk.prop('disabled', false);
        $mis_chk.prop('disabled', false);

        $algo_radio.prop('disabled', false);

        $use_type_box.val('default');
    }
});

/**
 * "16進数"のチェックボックス制御
 */
$('.hex-check').change(function(){

    // チェック
    if($(this).prop('checked')){
        $slider.prop('disabled', false);
        $len_box.prop('readonly', false);

        $('.default-check').prop('checked', false);
        $uuid_chk.prop('checked', false);
        $symbol_info.hide(ANIM_DURATION_MS);

        $unq_chk.prop('disabled', false);
        $mis_chk.prop('checked', false).prop('disabled', true);

        $algo_radio.prop('disabled', false);

        $use_type_box.val('hex');
    }
    // チェック解除
    else{
        $al_u_chk.prop('checked', true);
        $al_l_chk.prop('checked', true);
        $num_chk.prop('checked', true);

        $mis_chk.prop('disabled', false);

        $algo_radio.prop('disabled', false);

        $use_type_box.val('default');
    }
});

/**
 * "UUID"のチェックボックス制御
 */
$('.uuid-check').change(function(){

    // チェック
    if($(this).prop('checked')){
        $len_box.val('36').prop('readonly', true).change(); // スライダーより前に設定して連動させてから無効化
        $slider.prop('disabled', true);

        $('.default-check').prop('checked', false);
        $hex_chk.prop('checked', false);
        $symbol_info.hide(ANIM_DURATION_MS);

        $unq_chk.prop('checked', false).prop('disabled', true);
        $mis_chk.prop('checked', false).prop('disabled', true);

        $('input[name="algorithm"][value="crypt"]').prop('checked', true);
        $algo_radio.prop('disabled', true);

        $use_type_box.val('uuid');
    }
    // チェック解除
    else{
        $slider.prop('disabled', false);
        $len_box.prop('readonly', false);

        $al_u_chk.prop('checked', true);
        $al_l_chk.prop('checked', true);
        $num_chk.prop('checked', true);

        $algo_radio.prop('disabled', false);

        $unq_chk.prop('disabled', false);
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
 *      uuid: boolean,
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
const setOption = () => {

    const opt = { ...OPTION };

    opt.length   = parseInt($len_box.val());
    opt.use_type = $use_type_box.val();

    opt.alpha_u = $al_u_chk.prop('checked');
    opt.alpha_l = $al_l_chk.prop('checked');
    opt.numeric = $num_chk.prop('checked');
    opt.symbol  = $sym_chk.prop('checked');
    opt.hex     = $hex_chk.prop('checked');
    opt.uuid    = $uuid_chk.prop('checked');

    opt.unique  = $unq_chk.prop('checked');
    opt.mislead = $mis_chk.prop('checked');

    opt.algorithm = $('input[name="algorithm"]:checked').val();
    if(opt.algorithm === 'crypt' && !cryptReady){
        opt.algorithm = 'math';
    }

    opt.ignore_symbols = $ignore_symbol_box.val();

    return opt;
};

// 生成文字列の格納変数
let password;

// コピーボタン無効化タイムアウトIDの格納変数
let copyBtnTimeoutId = null;

/**
 * コピーボタンの有効化
 */
const enableCopyBtn = () => {

    // タイムアウト処理中の場合のみ処理
    if(copyBtnTimeoutId !== null){
        // コピーボタン有効化
        $password_copy_btn.find('i').removeClass('bi-check2').addClass('bi-copy');
        $password_copy_btn.prop('disabled', false);

        // タイムアウトを無効化
        clearTimeout(copyBtnTimeoutId);

        // IDを初期化
        copyBtnTimeoutId = null;
    }
}

/**
 * 単一文字列の生成ボタンクリック
 */
$generate_btn.click(() => {

    $validation_error.hide();
    $validation_error.empty();

    $bulk_textarea.text('');
    $bulk_textarea.val('');

    const opt = setOption();

    // バリデーション
    const validate = validation(opt);

    // バリデーションエラーあり
    if(validate !== null){
        $generate_result.hide();

        // メッセージ表示
        showValidationError(validate);
    }
    // バリデーションエラー無し
    else{
        const result = (!opt.uuid) ? passwordGenerate(opt) : uuidGenerate();
        if(result !== null){
            password = result.password;

            const entropy = result.entropy;

            $generate_result.find('div#generate-password').text(password); // パスワード
            $generate_result.find('span#entropy-value').html(`<span class="strength-emoji">${ENTROPY_STRENGTH.get_emoji(entropy)}</span> ${entropy.toLocaleString()}`); // エントロピー
            $generate_result.find('div#entropy-info').attr('aria-label', `パスワード強度: ${ENTROPY_STRENGTH.get_label(entropy)}`);
            $generate_result.find("#entropy-bar").css('width', `${Math.min(entropy / 128, 1) * 100}%`); // エントロピーバー | 128bitを最大強度とみなす
            $generate_result.find("#entropy-bar").removeClass().addClass('progress-bar').addClass(`bg-${ENTROPY_STRENGTH.get_bar_class(entropy)}`); // エントロピーバーの色
            $generate_result.find('span#gen-ms-value').text(result.generate_time.toLocaleString()); // 生成速度
            $generate_result.show(ANIM_DURATION_MS);

            enableCopyBtn();
        } else{
            $generate_result.hide();
        }
    }
});

/**
 * 複数文字列の生成ボタンクリック
 */
$bulk_generate_btn.click(async function(){

    try{
        $bulk_generate_btn.prop('disabled', true);

        $validation_error.hide();
        $validation_error.empty();
        $generate_result.hide();

        const opt = setOption();

        // バリデーション
        const validate = validation(opt);

        // バリデーションエラーあり
        if(validate !== null){
            $bulk_textarea.text('');
            $bulk_textarea.val('');

            // メッセージ表示
            showValidationError(validate);

            return;
        }
        // バリデーションエラー無し
        else{
            const count = parseInt($(this).val());
            const results = (!opt.uuid) ? bulkPasswordGenerate(opt, count) : bulkUuidGenerate(count);

            if(results !== null){
                const passwords = results.map((v) => v.password).join("\n");
                const gen_ms_sum = results.map((v) => v.generate_time).reduce((a, b) => a + b, 0);

                const entropy = results[0].entropy;

                $bulk_textarea.text(passwords);
                $bulk_textarea.val(passwords);
                $bulk_generate_result.find('span#bulk-entropy-value').html(`<span class="strength-emoji">${ENTROPY_STRENGTH.get_emoji(entropy)}</span> ${entropy.toLocaleString()}`); // エントロピー
                $bulk_generate_result.find('div#bulk-entropy-info').attr('aria-label', `パスワード強度: ${ENTROPY_STRENGTH.get_label(entropy)}`);
                $bulk_generate_result.find("#bulk-entropy-bar").css('width', `${Math.min(entropy / 128, 1) * 100}%`); // エントロピーバー | 128bitを最大強度とみなす
                $bulk_generate_result.find("#bulk-entropy-bar").removeClass().addClass('progress-bar').addClass(`bg-${ENTROPY_STRENGTH.get_bar_class(entropy)}`); // エントロピーバーの色
                $bulk_generate_result.find('span#bulk-gen-ms-value').text(gen_ms_sum.toLocaleString()); // 生成速度計
            } else{
                $bulk_textarea.text('');
                $bulk_textarea.val('');
            }

            $bulk_value_label.text(count.toLocaleString());
        }

        const modal = new bootstrap.Modal('#bulk-generate-result-modal');
        modal.show();

        $bulk_generate_btn.prop('disabled', false);
    } catch(e){
        $bulk_generate_btn.prop('disabled', false);

        window.alert("複数文字列の生成に失敗しました。");
    }
});

/**
 * クリップボードコピーボタンクリック
 */
$password_copy_btn.click(function(){

    const $label = $(this).find('i');

    // 再度ボタンが有効化になるまでの時間 (ms)
    const enable_duration = 3000;

    navigator.clipboard.writeText(password).then(
        () => {
            // コピーボタン無効化
            $(this).prop('disabled', true);
            $label.removeClass('bi-copy').addClass('bi-check2');

            // 時限で元に戻す処理
            copyBtnTimeoutId = setTimeout(() => {
                // コピーボタン有効化
                $label.removeClass('bi-check2').addClass('bi-copy');
                $(this).prop('disabled', false);

                // IDを初期化
                copyBtnTimeoutId = null;
            }, enable_duration);
        },
        () => {
            window.alert("コピーに失敗しました。");
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

    // 入力数調整
    let new_val = (val === '' || isNaN(val)) ? PWD_LEN_MIN : parseInt(val);
    if(new_val < PWD_LEN_MIN) {
        new_val = PWD_LEN_MIN;
    } else if(new_val > PWD_LEN_MAX){
        new_val = PWD_LEN_MAX;
    }

    $slider.val(new_val);
    $len_box.val(new_val);
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
const symbols = SYMBOL.split('');
// 登録記号(全角)一覧の配列
const symbolsZen = SYMBOL_ZEN.split('');

// 登録記号以外を排除する際に使用する正規表現
const ignoreSymbolRegexp = new RegExp(`[^${SYMBOL.replace(/[-\\\]]/g, '\\$&')}]`, 'g');

/**
 * 含ませたくない記号入力フォームの内容変更
 */
$ignore_symbol_box.on('change', function(e){

    const val = $(this).val();
    const temp = [];

    for(let char of val){
        const index = symbolsZen.indexOf(char);
        temp.push((index >= 0) ? symbols[index] : char);
    }

    $(this).val((temp.length > 0) ? arrayUnique(temp).join('').replace(ignoreSymbolRegexp, '') : '');
});

/**
 * 複数文字列のダウンロードボタンクリック
 */
$bulk_download.click(function(){

    $(this).prop('disabled', true);

    const val = $bulk_textarea.val();
    const len = val.split("\n").length;

    // 再度ボタンが有効化になるまでの時間 (ms)
    const enable_duration = 1000;

    $(this).prop({
        download: `bulk-strings_${len}.txt`,
        href: `data:text/plain;charset=utf-8,${encodeURIComponent(val)}`
    });

    setTimeout(
        () => {
            $(this).prop('disabled', false);
        },
        enable_duration
    );

    return true;
});
