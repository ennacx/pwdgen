// アルファベット大文字一覧
const ALPHA_U = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
// アルファベット小文字一覧
const ALPHA_L = 'abcdefghijklmnopqrstuvwxyz';
// 数字一覧
const NUMERIC = '1234567890';
// 記号一覧
const SYMBOL  = '!"#$%&\'()+*-^@=~|[]{}`:;,.<>/?\\_';
const SYMBOL_ZEN  = "！”＃＄％＆’（）＋＊－＾＠＝～｜「」｛｝｀：；，．＜＞／？￥＿";
// 16進数一覧
const HEXADECIMAL = '1234567890abcdef';
// 紛らわしい文字種一覧
const MISLEAD_SYMBOLS = '0OcoIl1vyQq9';

// 単一文字列選出用の文字列生成個数 (この中からランダムで一つ選んで返却する)
const PWD_GENERATE_COUNT = 10;

// 生成文字列長 最小値/最大値
const PWD_LEN_MIN = 4;
const PWD_LEN_MAX = 256;

// 複数文字列の生成個数 最小値/最大値
const PWD_BULK_MIN = 1;
const PWD_BULK_MAX = 10000;

/**
 * Configuration object representing the options for generating or validating passwords.
 *
 * @var {Object} OPTION
 * @property {number} OPTION.length - Specifies the minimum length of the password.
 * @property {string} OPTION.use_type - Indicates the usage type for the password generation. Default is 'default'.
 * @property {boolean} OPTION.alpha_u - Determines if uppercase alphabetical characters are allowed.
 * @property {boolean} OPTION.alpha_l - Determines if lowercase alphabetical characters are allowed.
 * @property {boolean} OPTION.numeric - Indicates whether numeric characters are included.
 * @property {boolean} OPTION.symbol - Specifies if symbols will be included in the password.
 * @property {boolean} OPTION.hex - Denotes whether the password should use hexadecimal characters.
 * @property {boolean} OPTION.uuid - Indicates if the output should follow a UUID structure.
 * @property {boolean} OPTION.unique - Enforces all characters in the password to be unique.
 * @property {boolean} OPTION.mislead - Allows misleading characters (e.g., 'O' vs '0') if set to true.
 * @property {string} OPTION.algorithm - Defines the algorithm to use for password operations. Default is 'math'.
 * @property {string} OPTION.ignore_symbols - A string containing characters to exclude from use as symbols.
 * @property {boolean} OPTION.validate - Determines if validation is required for the generated password.
 */
const OPTION = {
    length: PWD_LEN_MIN,

    use_type: 'default',

    alpha_u: true,
    alpha_l: true,
    numeric: true,
    symbol: false,
    hex: false,
    uuid: false,

    unique: false,
    mislead: false,

    algorithm: 'math',

    ignore_symbols: '',

    validate: false
};

/**
 * Represents the result of a password generation process.
 *
 * @var {Object} RESULT
 * @property {string} RESULT.password                The generated password string.
 * @property {number|undefined} RESULT.length        The length of the generated password.
 * @property {number|undefined} RESULT.entropy       The entropy of the generated password, indicating its randomness and strength.
 * @property {number|undefined} RESULT.charset_size  The size of the character set used for generating the password.
 * @property {string|undefined} RESULT.algorithm     The algorithm used for password generation.
 * @property {number|undefined} RESULT.generate_time The time taken to generate the password, typically in milliseconds.
 */
const RESULT = {
    password: '',
    length: undefined,
    entropy: undefined,
    charset_size: undefined,
    algorithm: undefined,
    generate_time: undefined
};

/**
 * An object representing entropy strength levels, along with their associated
 * thresholds, styling classes, labels, and emojis. Provides methods to obtain
 * corresponding values based on a given entropy level.
 *
 * Properties:
 * - `deadly`: Represents the lowest entropy level.
 *   - `threshold`: Maximum entropy value for the "deadly" level.
 *   - `bar_class`: CSS class used for visual representation.
 *   - `label`: Label for the "deadly" level.
 *   - `emoji`: Emoji associated with the "deadly" level.
 * - `weakly`: Represents the weak entropy level.
 *   - `threshold`: Maximum entropy value for the "weakly" level.
 *   - `bar_class`: CSS class used for visual representation.
 *   - `label`: Label for the "weakly" level.
 *   - `emoji`: Emoji associated with the "weakly" level.
 * - `cautious`: Represents the medium entropy level.
 *   - `threshold`: Maximum entropy value for the "cautious" level.
 *   - `bar_class`: CSS class used for visual representation.
 *   - `label`: Label for the "cautious" level.
 *   - `emoji`: Emoji associated with the "cautious" level.
 * - `safety`: Represents the highest entropy level.
 *   - `threshold`: Maximum entropy value for the "safety" level.
 *   - `bar_class`: CSS class used for visual representation.
 *   - `label`: Label for the "safety" level.
 *   - `emoji`: Emoji associated with the "safety" level.
 *
 * Methods:
 * - `getBarClass(v)`: Returns the CSS class associated with the entropy level of `v`.
 *   @param {number} v - The entropy value to check against defined thresholds.
 *   @returns {string} The CSS class for the corresponding entropy level.
 *
 * - `getLabel(v)`: Returns the label associated with the entropy level of `v`.
 *   @param {number} v - The entropy value to check against defined thresholds.
 *   @returns {string} The label for the corresponding entropy level.
 *
 * - `getEmoji(v)`: Returns the emoji associated with the entropy level of `v`.
 *   @param {number} v - The entropy value to check against defined thresholds.
 *   @returns {string} The emoji for the corresponding entropy level.
 */
const ENTROPY_STRENGTH = {
    /**
     * Represents a configuration object for a "deadly" status.
     *
     * @property {number} threshold - The numerical value representing the limit to be considered deadly.
     * @property {string} bar_class - CSS class name associated with the deadly status for styling a progress bar or similar UI element.
     * @property {string} label - A label or short descriptor for the deadly status.
     * @property {string} emoji - An emoji representing or associated with the deadly status.
     */
    deadly: { threshold: 60, bar_class: 'danger', label: "危", emoji: "🐣" },

    /**
     * Represents a configuration object for a "weakly" status.
     *
     * @property {number} threshold - The numerical value representing the limit to be considered weakly.
     * @property {string} bar_class - CSS class name associated with the weakly status for styling a progress bar or similar UI element.
     * @property {string} label - A label or short descriptor for the weakly status.
     * @property {string} emoji - An emoji representing or associated with the weakly status.
     */
    weakly: { threshold: 90, bar_class: 'warning', label: "弱", emoji: "💪" },

    /**
     * Represents a configuration object for a "cautious" status.
     *
     * @property {number} threshold - The numerical value representing the limit to be considered cautious.
     * @property {string} bar_class - CSS class name associated with the cautious status for styling a progress bar or similar UI element.
     * @property {string} label - A label or short descriptor for the cautious status.
     * @property {string} emoji - An emoji representing or associated with the cautious status.
     */
    cautious: { threshold: 128, bar_class: 'success', label: "中", emoji: "🦾" },

    /**
     * Represents a configuration object for a "safety" status.
     *
     * @property {number} threshold - The numerical value representing the limit to be considered safety.
     * @property {string} bar_class - CSS class name associated with the safety status for styling a progress bar or similar UI element.
     * @property {string} label - A label or short descriptor for the safety status.
     * @property {string} emoji - An emoji representing or associated with the safety status.
     */
    safety: { threshold: 65536, bar_class: 'primary', label: "強", emoji: "🛡️" },

    /**
     * Determines the CSS class for a bar based on the provided value and predefined thresholds.
     *
     * This function evaluates the provided value against multiple thresholds (`deadly`, `weakly`,
     * `cautious`, and `safety`) and returns the respective CSS class associated with the matching threshold.
     * If the value does not meet any of the conditions, a default CSS class of 'dark' is returned.
     *
     * @param {number} v - The numeric value to evaluate.
     * @returns {string} The CSS class name corresponding to the evaluated threshold or 'dark' as the default.
     */
    getBarClass: function(v){
        if(v < this.deadly.threshold)
            return this.deadly.bar_class;
        else if(v < this.weakly.threshold)
            return this.weakly.bar_class;
        else if(v < this.cautious.threshold)
            return this.cautious.bar_class;
        else if(v < this.safety.threshold)
            return this.safety.bar_class;
        else
            return 'dark';
    },

    /**
     * Determines and returns the appropriate label based on the given value compared to predefined thresholds.
     *
     * If the value is less than the `deadly.threshold`, it returns `deadly.label`.
     * If the value is less than the `weakly.threshold` but greater than or equal to `deadly.threshold`, it returns `weakly.label`.
     * If the value is less than the `cautious.threshold` but greater than or equal to `weakly.threshold`, it returns `cautious.label`.
     * If the value is less than the `safety.threshold` but greater than or equal to `cautious.threshold`, it returns `safety.label`.
     * Otherwise, it returns an empty string.
     *
     * @param {number} v - The value to be compared against the thresholds.
     * @returns {string} The corresponding label based on the thresholds, or an empty string if no thresholds are met.
     */
    getLabel: function(v){
        if(v < this.deadly.threshold)
            return this.deadly.label;
        else if(v < this.weakly.threshold)
            return this.weakly.label;
        else if(v < this.cautious.threshold)
            return this.cautious.label;
        else if(v < this.safety.threshold)
            return this.safety.label;
        else
            return '';
    },

    /**
     * Determines and returns the appropriate emoji based on the input value and defined thresholds.
     *
     * Compares the input value against predefined thresholds (`deadly`, `weakly`, `cautious`, `safety`)
     * and returns the corresponding emoji for the range in which the value falls.
     *
     * @param {number} v - The value to evaluate and compare against the thresholds.
     * @returns {string} The emoji associated with the range of the given value, or an empty string if no range matches.
     */
    getEmoji: function(v){
        if(v < this.deadly.threshold)
            return this.deadly.emoji;
        else if(v < this.weakly.threshold)
            return this.weakly.emoji;
        else if(v < this.cautious.threshold)
            return this.cautious.emoji;
        else if(v < this.safety.threshold)
            return this.safety.emoji;
        else
            return '';
    }
};

/**
 * 指定バイト数の乱数バッファを返す (Uint8Array)
 *
 * @param {number} bytes
 * @returns {Uint8Array}
 */
function cryptoRandomBytes(bytes){

    const a = new Uint8Array(bytes);
    crypto.getRandomValues(a);

    return a;
}

/**
 * `crypto.getRandomUint32()`相当 (単一の32bit非負整数) を取得
 *
 * @returns {number} 0..2^32-1
 */
function cryptoRandomUint32(){

    const a = new Uint32Array(1);
    crypto.getRandomValues(a);

    return a[0] >>> 0;
}

/**
 * 指定された上界 `n` (1 <= n <= 2^32) の一様インデックスを返す (棄却サンプリング)
 *
 * @param {number} n
 * @returns {number} 0..n-1
 */
function cryptoRandomIndex(n){

    if(!Number.isInteger(n))
        throw new Error('cryptoRandomIndex: invalid range');
    if(n <= 0 || n > 0xFFFFFFFF)
        throw new Error('Argument `n` is out of range');

    const range = 0x100000000; // 2^32
    const limit = Math.floor(range / n) * n; // accept値

    while(true){
        const r = cryptoRandomUint32();
        if(r < limit){
            return r % n;
        }
    }
}

/**
 * Removes duplicate values from an array and returns a new array with unique values.
 *
 * @param {Array} array - The array to process and filter for unique values.
 * @return {Array} A new array containing only unique values from the input array.
 */
function arrayUnique(array){

    return [...new Set(array)];
}

/**
 * Shuffles the elements of an array in random order.
 * Optionally, uses a cryptographically secure random number generator for randomness.
 *
 * @param {Array} array The array to shuffle.
 * @param {boolean} [crypt=true] Whether to use a cryptographically secure random number generator. Defaults to true.
 * @return {Array} A new array containing the shuffled elements of the input array.
 */
function arrayShuffle(array, crypt = true){

    const cloneArray = [...array];
    const buf = new Uint32Array(1);

    let rnd;

    for(let i = cloneArray.length - 1; i >= 0; i--){
        if(crypt){
            // crypto未実装環境下で処理された場合のフォールバック
            try{
                // cryptoRandomIndex()を使用せず速度向上と最適化を図る
                crypto.getRandomValues(buf);
                rnd = buf[0] % (i + 1);
            } catch(e){
                // fallback to Math.random() if crypto is unavailable or blocked
                console.warn("Crypto unavailable, falling back to `Math.random()`.", e);

                rnd = Math.floor(Math.random() * (i + 1));
            }
        } else{
            rnd = Math.floor(Math.random() * (i + 1));
        }

        // ループ中のインデックスとランダム選出されたインデックスの要素を入れ替え
        const tempChar = cloneArray[i];
        cloneArray[i] = cloneArray[rnd];
        cloneArray[rnd] = tempChar;
    }

    return cloneArray;
}

/**
 * Calculates the entropy based on the length of the input and the number of possible characters.
 *
 * @param {number} length - The length of the input for which entropy is being calculated.
 * @param {number} useCharacterCount - The number of possible unique characters used.
 * @return {number} The calculated entropy value, rounded to two decimal places.
 */
function calcEntropy(length, useCharacterCount){

    // L * log2(N)
    return Number((length * Math.log2(useCharacterCount)).toFixed(2));
}

/**
 * 設定のバリデーション
 *
 * @param {OPTION} opt
 */
function validation(opt){

    if(!(opt.alpha_u || opt.alpha_l || opt.numeric || opt.symbol || opt.hex || opt.uuid))
        return "文字種を選択して下さい。";
    if(opt.length < PWD_LEN_MIN || opt.length > PWD_LEN_MAX)
        return `文字数は${PWD_LEN_MIN}以上${PWD_LEN_MAX}以下の制限があります。`;
    if(opt.use_type !== 'default' && opt.use_type !== 'hex' && opt.use_type !== 'uuid')
        return "形式が不正です。文字種を再選択してください。";
    if(opt.algorithm !== 'crypt' && opt.algorithm !== 'math')
        return "アルゴリズムが不正です。";

    if(opt.unique){
        let maxLength = 0;
        if(opt.use_type === 'default'){
            if(opt.alpha_u)
                maxLength += 26;
            if(opt.alpha_l)
                maxLength += 26;
            if(opt.numeric)
                maxLength += 10;
            if(opt.symbol){
                let temp = SYMBOL;
                if(opt.ignore_symbols !== ''){
                    for(let ignore_symbol of opt.ignore_symbols){
                        temp = temp.replace(ignore_symbol, '');
                    }
                }
                maxLength += temp.length;
            }
        } else if(opt.use_type === 'hex' || opt.use_type === 'uuid'){
            if(opt.hex || opt.uuid){
                maxLength += 16;
            }
        }

        if(opt.mislead){
            maxLength -= filterMisleadSymbols(opt).length;
        }

        if(maxLength <= 0)
            return "文字種を再選択してください。";
        if(opt.length > maxLength)
            return `指定の条件では${opt.length}文字の文字列を生成できません。`;
    }

    opt.validate = true;

    return null;
}

/**
 * 紛らわしい文字種のフィルタリング
 *
 * @param {OPTION} opt
 * @returns {string}
 */
function filterMisleadSymbols(opt){

    let misleadSymbols = '';

    if(opt.mislead){
        if(opt.use_type === 'default'){
            if(opt.alpha_u)
                misleadSymbols += MISLEAD_SYMBOLS.replace(/[^A-Z]/g, '');
            if(opt.alpha_l)
                misleadSymbols += MISLEAD_SYMBOLS.replace(/[^a-z]/g, '');
            if(opt.numeric)
                misleadSymbols += MISLEAD_SYMBOLS.replace(/[^0-9]/g, '');
        } else if(opt.use_type === 'hex'){
            if(opt.hex)
                misleadSymbols += MISLEAD_SYMBOLS.replace(/[^0-9a-fA-F]/g, '');
        } else if(opt.use_type === 'uuid'){
            if(opt.uuid)
                misleadSymbols += MISLEAD_SYMBOLS.replace(/[^0-9a-fA-F]/g, '');
        }
    }

    return misleadSymbols;
}

/**
 * 使用可能文字種の配列を生成
 *
 * @param {OPTION} opt
 * @returns {string[]}
 */
function filterUseCharacters(opt){

    let useChars = '';
    if(opt.use_type === 'default'){
        if(opt.alpha_u)
            useChars += ALPHA_U;
        if(opt.alpha_l)
            useChars += ALPHA_L;
        if(opt.numeric)
            useChars += NUMERIC;
        if(opt.symbol){
            let temp = SYMBOL;

            if(opt.ignore_symbols !== ''){
                for(let ignore_symbol of opt.ignore_symbols){
                    temp = temp.replace(ignore_symbol, '');
                }
            }

            useChars += temp;
        }
    } else if(opt.use_type === 'hex' || opt.use_type === 'uuid'){
        if(opt.hex || opt.uuid)
            useChars += HEXADECIMAL;
    }

    const misleadSymbols = filterMisleadSymbols(opt);
    for(let misleadSymbol of misleadSymbols){
        useChars = useChars.replace(misleadSymbol, '');
    }

    return arrayShuffle([...useChars], opt.algorithm === 'crypt');
}

/**
 * Generates a password string based on the specified algorithm and parameters.
 *
 * @param {string} algo - The algorithm to use for password generation. Valid options are 'crypt' or 'math'.
 * @param {number} len - The desired length of the password.
 * @param {string[]|string} useChars - A string containing the characters that can be used in the password.
 * @param {boolean} isUnique - Whether the password should contain unique characters only (true) or allow duplicates (false).
 * @return {string} The generated password based on the given parameters.
 * @throws {Error} If an unsupported algorithm is specified.
 */
function generate(algo, len, useChars, isUnique){

    const password = [];
    const chars = (Array.isArray(useChars)) ? useChars : useChars.split('');
    const usedChars = new Set();
    const charsLen = chars.length;

    // cryptoベースの安全な生成
    if(algo === 'crypt'){
        const buf = new Uint32Array(1);
        while(password.length < len){
            crypto.getRandomValues(buf);
            const idx = buf[0] % charsLen;
            const char = chars[idx];

            if(!isUnique || !usedChars.has(char)){
                password.push(char);
                usedChars.add(char);
            }
        }
    }
    // mathベース (互換のため残すが暗号強度は皆無)
    else if(algo === 'math'){
        while(password.length < len){
            const char = chars[Math.floor(Math.random() * charsLen)];

            if(!isUnique || !usedChars.has(char)){
                password.push(char);
                usedChars.add(char);
            }
        }
    }
    // エラー
    else{
        throw new Error(`'${algo}' algorithm is not supported`);
    }

    return password.join('');
}

/**
 * 単一の文字列生成
 *
 * @param {OPTION} opt
 * @returns {RESULT|null}
 */
function passwordGenerate(opt){

    if(!opt.validate)
        return null;

    const temp = bulkPasswordGenerate(opt, PWD_GENERATE_COUNT);

    return (temp !== null) ? temp[Math.floor(Math.random() * temp.length)] : null;
}

/**
 * 複数の文字列生成
 *
 * @param {OPTION} opt
 * @param {Number} count
 * @returns {RESULT[]|null}
 */
function bulkPasswordGenerate(opt, count){

    if(!opt.validate || count < 1)
        return null;

    // 生成数調整
    if(count < PWD_BULK_MIN)
        count = PWD_BULK_MIN;
    else if(count > PWD_BULK_MAX)
        count = PWD_BULK_MAX;

    let useChars = filterUseCharacters(opt);
    let entropy = undefined;

    const passwordResults = [];
    for(let i = 0; i < count; i++){
        // 文字種配列の順番を20%の確率で入れ替え
        if(Math.floor(Math.random() * 100) < 20)
            useChars = arrayShuffle(useChars);

        // エントロピーの算出
        if(entropy === undefined)
            entropy = calcEntropy(opt.length, useChars.length);

        const stTime = performance.now();
        const password = generate(opt.algorithm, opt.length, useChars, opt.unique);
        const edTime = performance.now();

        const result = structuredClone(RESULT);
        result.password = password;
        result.length = opt.length;
        result.entropy = entropy;
        result.charset_size = useChars.length;
        result.algorithm = opt.algorithm;
        result.generate_time = edTime - stTime;

        passwordResults.push(result);
    }

    return passwordResults;
}

/**
 * 単一のUUID生成
 *
 * @returns {RESULT}
 */
function uuidGenerate(){

    const stTime = performance.now();
    const password = crypto.randomUUID();
    const edTime = performance.now();

    const result = structuredClone(RESULT);
    result.password = password;
    result.length = 36;
    result.entropy = 122;
    result.charset_size = 16;
    result.algorithm = 'crypt';
    result.generate_time = edTime - stTime;

    return result;
}

/**
 * 複数のUUID生成
 *
 * @param {Number} count
 * @returns {string[]}
 */
function bulkUuidGenerate(count){

    const uuids = [];

    for(let i = 0; i < count; i++){
        uuids.push(uuidGenerate());
    }

    return uuids;
}
