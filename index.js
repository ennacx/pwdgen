// 文字列長まわり
const $slider = $('input[name="pwd_len_slider"]');
const $lenBox = $('input[name="pwd_len_input"]');

// 文字種チェックボックス
const $alUpperChk = $('input#alpha_u');
const $alLowerChk = $('input#alpha_l');
const $numChk  = $('input#num');
const $symChk  = $('input#symbol');
const $hexChk  = $('input#hex');
const $uuidChk  = $('input#uuid');

// オプションチェックボックス
const $unqChk  = $('input#unique');
const $misChk  = $('input#mislead');

// 指定文字種が16進数かUUIDか、またはそれ以外かを判定するhiddenタグ
const $useTypeBox = $('input[name="use_type"]');
// 使用したくない記号入力
const $ignoreSymbolBox = $('input[name="ignore_symbols"]');

// アルゴリズムチェックボックス
const $algoRadio = $('input[name="algorithm"]');

// ボタン類
const $generateBtn = $('button[name="gen"]');
const $bulkGenerateBtn = $('button.bulk-gen');

// 記号サンプル
const $symbolInfo = $('#symbol-info');

// Crypt未実装ブラウザを知らせるメッセージエリア
const $algoErr = $('.algo-err-msg');
// 生成バリデーションエラーメッセージエリア
const $validationError = $('div#validation-error');

// 単一文字列生成結果表示エリア
const $generateResult = $('div#generate-result');
// 単一文字列生成結果コピーボタン
const $passwordCopyBtn = $('button[name="password_copy"]');

// 複数文字列の個数表示エリア
const $bulkValueLabel = $('#bulk-generate-result-modal span#bulk_value');
// 複数文字列の生成結果表示エリア
const $bulkGenerateResult = $('#bulk-generate-result-modal div#bulk-generate-result');
// 複数文字列の格納テキストボックス
const $bulkTextarea = $bulkGenerateResult.find('textarea[name="bulk_password"]');
// 複数文字列のダウンロードボタン
const $bulkDownload = $('#bulk-generate-result-modal a#bulk-generate-download');

// コンテンツ表示のアニメーション速度
const ANIM_DURATION_MS = 100;

// Crypt実装フラグ
let cryptReady = true;

// 文字列長の最低値/最大値を設定
$slider.attr('min', PWD_LEN_MIN);
$slider.attr('max', PWD_LEN_MAX);
$lenBox.attr('min', PWD_LEN_MIN);
$lenBox.attr('max', PWD_LEN_MAX);

// Crypt実装チェック
if(!window.crypto || typeof window.crypto.getRandomValues !== 'function' || typeof window.crypto.randomUUID !== 'function'){
    // フラグ更新
    cryptReady = false;

    // UUIDの生成無効化
    $uuidChk.prop('disabled', true);

    // アルゴリズム選択ラジオボタン無効化 (Mathを選択状態にする)
    $algoRadio.prop('checked', false);
    $('input[name="algorithm"][value="crypt"]').prop('disabled', true);
    $('input[name="algorithm"][value="math"]').prop('checked', true);

    // 警告メッセージ表示
    $algoErr.show(ANIM_DURATION_MS);
}

// サブタイトル表記変更
$('div#subheader').html(
    `<p>${(cryptReady) ? "Cryptアルゴリズムならパスワードに使える！😀" : "Mathはパスワードにはオススメできない🤔"}</p>`
);

// 登録済み記号一覧と、紛らわしい文字種一覧の表示
$('#symbol-samples').text(SYMBOL);
$('#mislead-samples').text(MISLEAD_SYMBOLS);

// 選択文字種タイプのデフォルト値を設定
$useTypeBox.val(OPTION.use_type);

/**
 * Displays a validation error message within the designated HTML element.
 *
 * @param {string} message - The validation error message to be displayed.
 * @return {void} This method does not return a value.
 */
function showValidationError(message){
    $validationError
        .html(`<div class="alert alert-danger">${message}</div>`)
        .show(ANIM_DURATION_MS);
}

/**
 * 文字種"記号"チェックボックス制御
 */
const changeSymbolCheck = () => {

    if($symChk.prop('checked'))
        $symbolInfo.show(ANIM_DURATION_MS);
    else
        $symbolInfo.hide(ANIM_DURATION_MS);
};
$symChk.change(changeSymbolCheck);

/**
 * "16進数以外"の文字種チェックボックス制御
 */
$('.default-check').change(function(){

    // チェック
    if($(this).prop('checked')){
        $slider.prop('disabled', false);
        $lenBox.prop('readonly', false);

        $hexChk.prop('checked', false);
        $uuidChk.prop('checked', false);

        $unqChk.prop('disabled', false);
        $misChk.prop('disabled', false);

        $algoRadio.prop('disabled', false);

        $useTypeBox.val('default');
    }
});

/**
 * "16進数"のチェックボックス制御
 */
$('.hex-check').change(function(){

    // チェック
    if($(this).prop('checked')){
        $slider.prop('disabled', false);
        $lenBox.prop('readonly', false);

        $('.default-check').prop('checked', false);
        $uuidChk.prop('checked', false);
        $symbolInfo.hide(ANIM_DURATION_MS);

        $unqChk.prop('disabled', false);
        $misChk.prop('checked', false).prop('disabled', true);

        $algoRadio.prop('disabled', false);

        $useTypeBox.val('hex');
    }
    // チェック解除
    else{
        $alUpperChk.prop('checked', true);
        $alLowerChk.prop('checked', true);
        $numChk.prop('checked', true);

        $misChk.prop('disabled', false);

        $algoRadio.prop('disabled', false);

        $useTypeBox.val('default');
    }
});

/**
 * "UUID"のチェックボックス制御
 */
$('.uuid-check').change(function(){

    // チェック
    if($(this).prop('checked')){
        $lenBox.val('36').prop('readonly', true).change(); // スライダーより前に設定して連動させてから無効化
        $slider.prop('disabled', true);

        $('.default-check').prop('checked', false);
        $hexChk.prop('checked', false);
        $symbolInfo.hide(ANIM_DURATION_MS);

        $unqChk.prop('checked', false).prop('disabled', true);
        $misChk.prop('checked', false).prop('disabled', true);

        $('input[name="algorithm"][value="crypt"]').prop('checked', true);
        $algoRadio.prop('disabled', true);

        $useTypeBox.val('uuid');
    }
    // チェック解除
    else{
        $slider.prop('disabled', false);
        $lenBox.prop('readonly', false);

        $alUpperChk.prop('checked', true);
        $alLowerChk.prop('checked', true);
        $numChk.prop('checked', true);

        $algoRadio.prop('disabled', false);

        $unqChk.prop('disabled', false);
        $misChk.prop('disabled', false);

        $useTypeBox.val('default');
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

    opt.length   = parseInt($lenBox.val());
    opt.use_type = $useTypeBox.val();

    opt.alpha_u = $alUpperChk.prop('checked');
    opt.alpha_l = $alLowerChk.prop('checked');
    opt.numeric = $numChk.prop('checked');
    opt.symbol  = $symChk.prop('checked');
    opt.hex     = $hexChk.prop('checked');
    opt.uuid    = $uuidChk.prop('checked');

    opt.unique  = $unqChk.prop('checked');
    opt.mislead = $misChk.prop('checked');

    opt.algorithm = $('input[name="algorithm"]:checked').val();
    if(opt.algorithm === 'crypt' && !cryptReady){
        opt.algorithm = 'math';
    }

    opt.ignore_symbols = $ignoreSymbolBox.val();

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
        $passwordCopyBtn.find('i').removeClass('bi-check2').addClass('bi-copy');
        $passwordCopyBtn.prop('disabled', false);

        // タイムアウトを無効化
        clearTimeout(copyBtnTimeoutId);

        // IDを初期化
        copyBtnTimeoutId = null;
    }
}

// 直前の単一生成結果のエントロピー強度ラベル
let lastEntropyStrengthLabel = '';

/**
 * 単一文字列の生成ボタンクリック
 */
$generateBtn.click(() => {

    $validationError.hide();
    $validationError.empty();

    $bulkTextarea.text('');
    $bulkTextarea.val('');

    const opt = setOption();

    // バリデーション
    const validate = validation(opt);

    // バリデーションエラーあり
    if(validate !== null){
        $generateResult.hide();

        // メッセージ表示
        showValidationError(validate);
    }
    // バリデーションエラー無し
    else{
        const result = (!opt.uuid) ? passwordGenerate(opt) : uuidGenerate();
        if(result !== null){
            password = result.password;

            const entropy = result.entropy;
            const emoji = ENTROPY_STRENGTH.getEmoji(entropy);
            const label = ENTROPY_STRENGTH.getLabel(entropy);
            const barClass = ENTROPY_STRENGTH.getBarClass(entropy);

            $generateResult.find('div#generate-password').text(password); // パスワード
            $generateResult.find('span#entropy-value').html(`<span class="strength-emoji">${emoji}</span> ${entropy.toLocaleString()}`); // エントロピー
            $generateResult.find('div#entropy-info').attr('aria-label', `パスワード強度: ${label}`);
            $generateResult.find("#entropy-bar").css('width', `${Math.min(entropy / 128, 1) * 100}%`); // エントロピーバー | 128bitを最大強度とみなす
            $generateResult.find("#entropy-bar").removeClass().addClass('progress-bar').addClass(`bg-${barClass}`); // エントロピーバーの色
            $generateResult.find('span#gen-ms-value').text(result.generate_time.toLocaleString()); // 生成速度
            $generateResult.show(ANIM_DURATION_MS);

            // エントロピーアイコンの演出
            if(label !== lastEntropyStrengthLabel){
                const $strengthEmoji = $('span.strength-emoji');

                $strengthEmoji.addClass('bump');
                setTimeout(() => $strengthEmoji.removeClass('bump'), 250);
            }
            lastEntropyStrengthLabel = label;

            // コピーボタン有効化
            enableCopyBtn();
        } else{
            $generateResult.hide();
        }
    }
});

/**
 * 複数文字列の生成ボタンクリック
 */
$bulkGenerateBtn.click(async function(){

    try{
        $bulkGenerateBtn.prop('disabled', true);

        // エラー表示エリアの非表示化
        $validationError.hide();
        $validationError.empty();

        // 単一表示エリアの非表示化
        $generateResult.hide();
        lastEntropyStrengthLabel = '';

        const opt = setOption();

        // バリデーション
        const validate = validation(opt);

        // バリデーションエラーあり
        if(validate !== null){
            $bulkTextarea.text('');
            $bulkTextarea.val('');

            // メッセージ表示
            showValidationError(validate);

            $bulkGenerateBtn.prop('disabled', false);

            return;
        }
        // バリデーションエラー無し
        else{
            const count = parseInt($(this).val());
            const results = (!opt.uuid) ? bulkPasswordGenerate(opt, count) : bulkUuidGenerate(count);

            if(results !== null){
                const passwords = results.map((v) => v.password).join("\n");
                const genMsSum = results.map((v) => v.generate_time).reduce((a, b) => a + b, 0);

                const entropy = results[0].entropy;

                $bulkTextarea.text(passwords);
                $bulkTextarea.val(passwords);
                $bulkGenerateResult.find('span#bulk-entropy-value').html(`<span class="strength-emoji">${ENTROPY_STRENGTH.getEmoji(entropy)}</span> ${entropy.toLocaleString()}`); // エントロピー
                $bulkGenerateResult.find('div#bulk-entropy-info').attr('aria-label', `パスワード強度: ${ENTROPY_STRENGTH.getLabel(entropy)}`);
                $bulkGenerateResult.find("#bulk-entropy-bar").css('width', `${Math.min(entropy / 128, 1) * 100}%`); // エントロピーバー | 128bitを最大強度とみなす
                $bulkGenerateResult.find("#bulk-entropy-bar").removeClass().addClass('progress-bar').addClass(`bg-${ENTROPY_STRENGTH.getBarClass(entropy)}`); // エントロピーバーの色
                $bulkGenerateResult.find('span#bulk-gen-ms-value').text(genMsSum.toLocaleString()); // 生成速度計
            } else{
                $bulkTextarea.text('');
                $bulkTextarea.val('');
            }

            $bulkValueLabel.text(count.toLocaleString());
        }

        const modal = new bootstrap.Modal('#bulk-generate-result-modal');
        modal.show();

        $bulkGenerateBtn.prop('disabled', false);
    } catch(e){
        $bulkGenerateBtn.prop('disabled', false);

        window.alert("複数文字列の生成に失敗しました。");
    }
});

/**
 * クリップボードコピーボタンクリック
 */
$passwordCopyBtn.click(function(){

    const copyToClipboard = (text) => {
        if(navigator.clipboard && window.isSecureContext){
            return navigator.clipboard.writeText(text);
        } else{
            // フォールバック処理
            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.style.position = "fixed"; // iOS対策
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();

            try{
                document.execCommand('copy');
            } catch(err){
                console.error("クリップボードコピー失敗:", err);
                alert("コピーできませんでした。手動で選択してください。");
            } finally{
                document.body.removeChild(textarea);
            }

            return Promise.resolve();
        }
    };

    const $label = $(this).find('i');

    // 再度ボタンが有効化になるまでの時間 (ms)
    const enableDuration = 3000;

    copyToClipboard(password)
        .then(() => {
            $(this).prop('disabled', true);
            $label.removeClass('bi-copy').addClass('bi-check2').addClass('btn-fade');

            // 1秒後にフェードアウト開始
            setTimeout(() => {
                $label.addClass('fade-out');
            }, enableDuration - 300); // 残り0.5秒でフェード開始

            // 完全に消えたらリセット
            copyBtnTimeoutId = setTimeout(() => {
                $label.removeClass('fade-out btn-fade bi-check2').addClass('bi-copy');
                $(this).prop('disabled', false);
                copyBtnTimeoutId = null;
            }, enableDuration);
        })
        .catch((err) => {
            console.log(err);
            window.alert("コピーに失敗しました。");
        })
    ;
});

// クリップボードコピー非対応ブラウザーの場合はコピーボタンを非表示にする
if(!navigator.clipboard){
    $passwordCopyBtn.hide();
}

/**
 * 文字列長入力フォームの入力
 */
$lenBox.on('keyup change', function(e){

    const val = $(this).val();

    // 入力数調整
    let newVal = (val === '' || isNaN(val)) ? PWD_LEN_MIN : parseInt(val);
    if(newVal < PWD_LEN_MIN)
        newVal = PWD_LEN_MIN;
    else if(newVal > PWD_LEN_MAX)
        newVal = PWD_LEN_MAX;

    $slider.val(newVal);
    $lenBox.val(newVal);
});

/**
 * スライダーと文字列長入力フォームの連携（双方向・ループ防止付き）
 */
let isPwdLengthSyncing = false;
const syncSliderAndInput = () => {

    // 初期値を合わせる
    $lenBox.val($slider.val());

    // スライダー操作から入力フォーム更新
    $slider.on('input change', function() {
        // スライダーと文字列長入力フォームの連動ループ防止
        if(isPwdLengthSyncing)
            return;

        isPwdLengthSyncing = true;
        $lenBox.val($(this).val());
        isPwdLengthSyncing = false;
    });

    // 入力フォームからスライダー更新
    $lenBox.on('input change', function() {
        // スライダーと文字列長入力フォームの連動ループ防止
        if(isPwdLengthSyncing)
            return;

        isPwdLengthSyncing = true;
        $slider.val($(this).val());
        isPwdLengthSyncing = false;
    });
};
syncSliderAndInput();

// 登録記号一覧の配列
const symbols = SYMBOL.split('');
// 登録記号(全角)一覧の配列
const symbolsZen = SYMBOL_ZEN.split('');

// 登録記号以外を排除する際に使用する正規表現
const ignoreSymbolRegexp = new RegExp(`[^${SYMBOL.replace(/[-\\\]]/g, '\\$&')}]`, 'g');

/**
 * 含ませたくない記号入力フォームの内容変更
 */
$ignoreSymbolBox.on('change', function(e){

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
$bulkDownload.click(function(){

    $(this).prop('disabled', true);

    const val = $bulkTextarea.val();
    const len = val.split("\n").length;

    // 再度ボタンが有効化になるまでの時間 (ms)
    const enableDuration = 1000;

    $(this).prop({
        download: `bulk-strings_${len}.txt`,
        href: `data:text/plain;charset=utf-8,${encodeURIComponent(val)}`
    });

    setTimeout(
        () => {
            $(this).prop('disabled', false);
        },
        enableDuration
    );

    return true;
});
