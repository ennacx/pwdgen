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

// 乱数マッピングアドレス選出用のランダム配列の要素数
const CRYPT_GENERATE_COUNT= 10;

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
 * @typedef {Object} OPTION
 * @property {number} length - Specifies the minimum length of the password.
 * @property {string} use_type - Indicates the usage type for the password generation. Default is 'default'.
 * @property {boolean} alpha_u - Determines if uppercase alphabetical characters are allowed.
 * @property {boolean} alpha_l - Determines if lowercase alphabetical characters are allowed.
 * @property {boolean} numeric - Indicates whether numeric characters are included.
 * @property {boolean} symbol - Specifies if symbols will be included in the password.
 * @property {boolean} hex - Denotes whether the password should use hexadecimal characters.
 * @property {boolean} uuid - Indicates if the output should follow a UUID structure.
 * @property {boolean} unique - Enforces all characters in the password to be unique.
 * @property {boolean} mislead - Allows misleading characters (e.g., 'O' vs '0') if set to true.
 * @property {string} algorithm - Defines the algorithm to use for password operations. Default is 'math'.
 * @property {string} ignore_symbols - A string containing characters to exclude from use as symbols.
 * @property {boolean} validate - Determines if validation is required for the generated password.
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
 * @typedef {Object} RESULT
 * @property {string} password                The generated password string.
 * @property {number|undefined} length        The length of the generated password.
 * @property {number|undefined} entropy       The entropy of the generated password, indicating its randomness and strength.
 * @property {number|undefined} charset_size  The size of the character set used for generating the password.
 * @property {string|undefined} algorithm     The algorithm used for password generation.
 * @property {number|undefined} generate_time The time taken to generate the password, typically in milliseconds.
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
 * - `get_bar_class(v)`: Returns the CSS class associated with the entropy level of `v`.
 *   @param {number} v - The entropy value to check against defined thresholds.
 *   @returns {string} The CSS class for the corresponding entropy level.
 *
 * - `get_label(v)`: Returns the label associated with the entropy level of `v`.
 *   @param {number} v - The entropy value to check against defined thresholds.
 *   @returns {string} The label for the corresponding entropy level.
 *
 * - `get_emoji(v)`: Returns the emoji associated with the entropy level of `v`.
 *   @param {number} v - The entropy value to check against defined thresholds.
 *   @returns {string} The emoji for the corresponding entropy level.
 */
const ENTROPY_STRENGTH = {
	deadly: { threshold: 60, bar_class: 'danger', label: "危", emoji: "🐣" },
	weakly: { threshold: 90, bar_class: 'warning', label: "弱", emoji: "💪" },
	cautious: { threshold: 128, bar_class: 'success', label: "中", emoji: "🦾" },
	safety: { threshold: 65536, bar_class: 'primary', label: "強", emoji: "🛡️" },
	get_bar_class: function(v){
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
	get_label: function(v){
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
	get_emoji: function(v){
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
function crypto_random_bytes(bytes){

	const a = new Uint8Array(bytes);
	crypto.getRandomValues(a);

	return a;
}

/**
 * `crypto.getRandomUint32()`相当 (単一の32bit非負整数) を取得
 *
 * @returns {number} 0..2^32-1
 */
function crypto_random_uint32(){

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
function crypto_random_index(n){

	if(!Number.isInteger(n))
		throw new Error('crypto_random_index: invalid range');
	if(n <= 0 || n > 0xFFFFFFFF)
		throw new Error('Argument `n` is out of range');

	const range = 0x100000000; // 2^32
	const limit = Math.floor(range / n) * n; // accept値

	while(true){
		const r = crypto_random_uint32();
		if(r < limit){
			return r % n;
		}
	}
}

/**
 * 配列の重複要素を削除
 *
 * @param   {*[]} array
 * @returns {*[]}
 */
function array_unique(array){

	const unique_array = [];
	const known_elements = {};

	for(let i = 0, maxi = array.length; i < maxi; i++){
		// 重複時
		if(array[i] in known_elements){
			continue;
		}

		unique_array.push(array[i]);
		known_elements[array[i]] = true;
	}

	return unique_array;
}

/**
 * 配列要素の順番をシャッフル
 *
 * @param   {*[]} array
 * @param   {boolean} [crypt = true]
 * @returns {*[]}
 */
function array_shuffle(array, crypt = true){

	const cloneArray = [...array];
	const buf = new Uint32Array(1);

	let rnd;

	for(let i = cloneArray.length - 1; i >= 0; i--){
		const tmpStorage = cloneArray[i];
		if(crypt){
			// crypto_random_index()を使用せず速度向上と最適化を図る
			crypto.getRandomValues(buf);
			rnd = buf[0] % (i + 1);
		} else{
			rnd = Math.floor(Math.random() * (i + 1));
		}

		cloneArray[i] = cloneArray[rnd];
		cloneArray[rnd] = tmpStorage;
	}

	return cloneArray;
}

/**
 * Calculates the entropy (in bits) for a given length and character set size.
 *
 * The entropy is computed as the product of the length and the base-2 logarithm of the character set size.
 *
 * @param {number} length - The length of the string for which entropy is being calculated.
 * @param {number} charsetSize - The size of the character set being used.
 * @return {string} The calculated entropy, rounded to two decimal places.
 */
function calc_entropy(length, charsetSize){

	// L * log2(N)
	const bits = length * Math.log2(charsetSize);

	return bits.toFixed(2);
}

/**
 * 設定のバリデーション
 *
 * @param {OPTION} opt
 */
function validation(opt){

	if(!opt.alpha_u && !opt.alpha_l && !opt.numeric && !opt.symbol && !opt.hex && !opt.uuid)
		return "文字種を選択して下さい。";
	if(opt.length < PWD_LEN_MIN || opt.length > PWD_LEN_MAX)
		return `文字数は${PWD_LEN_MIN}以上${PWD_LEN_MAX}以下の制限があります。`;
	if(opt.use_type !== 'default' && opt.use_type !== 'hex' && opt.use_type !== 'uuid')
		return "形式が不正です。文字種を再選択してください。";
	if(opt.algorithm !== 'crypt' && opt.algorithm !== 'math')
		return "アルゴリズムが不正です。";

	if(opt.unique){
		let max_length = 0;
		if(opt.use_type === 'default'){
			if(opt.alpha_u)
				max_length += 26;
			if(opt.alpha_l)
				max_length += 26;
			if(opt.numeric)
				max_length += 10;
			if(opt.symbol){
				let temp = SYMBOL;
				if(opt.ignore_symbols !== ''){
					for(let ignore_symbol of opt.ignore_symbols){
						temp = temp.replace(ignore_symbol, '');
					}
				}
				max_length += temp.length;
			}
		} else if(opt.use_type === 'hex' || opt.use_type === 'uuid'){
			if(opt.hex || opt.uuid){
				max_length += 16;
			}
		}

		if(opt.mislead){
			max_length -= filter_mislead_symbols(opt).length;
		}

		if(max_length <= 0)
			return "文字種を再選択してください。";
		if(opt.length > max_length)
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
function filter_mislead_symbols(opt){

	let mislead_symbols = '';

	if(opt.mislead){
		if(opt.use_type === 'default'){
			if(opt.alpha_u)
				mislead_symbols += MISLEAD_SYMBOLS.replace(/[^A-Z]/g, '');
			if(opt.alpha_l)
				mislead_symbols += MISLEAD_SYMBOLS.replace(/[^a-z]/g, '');
			if(opt.numeric)
				mislead_symbols += MISLEAD_SYMBOLS.replace(/[^0-9]/g, '');
		} else if(opt.use_type === 'hex'){
			if(opt.hex)
				mislead_symbols += MISLEAD_SYMBOLS.replace(/[^0-9a-fA-F]/g, '');
		} else if(opt.use_type === 'uuid'){
			if(opt.uuid)
				mislead_symbols += MISLEAD_SYMBOLS.replace(/[^0-9a-fA-F]/g, '');
		}
	}

	return mislead_symbols;
}

/**
 * 使用可能文字種の配列を生成
 *
 * @param {OPTION} opt
 * @returns {string[]}
 */
function filter_use_characters(opt){

	let use_chars = '';
	if(opt.use_type === 'default'){
		if(opt.alpha_u)
			use_chars += ALPHA_U;
		if(opt.alpha_l)
			use_chars += ALPHA_L;
		if(opt.numeric)
			use_chars += NUMERIC;
		if(opt.symbol){
			let temp = SYMBOL;

			if(opt.ignore_symbols !== ''){
				for(let ignore_symbol of opt.ignore_symbols){
					temp = temp.replace(ignore_symbol, '');
				}
			}

			use_chars += temp;
		}
	} else if(opt.use_type === 'hex' || opt.use_type === 'uuid'){
		if(opt.hex || opt.uuid){
			use_chars += HEXADECIMAL;
		}
	}

	const mislead_symbols = filter_mislead_symbols(opt);
	for(let mislead_symbol of mislead_symbols){
		use_chars = use_chars.replace(mislead_symbol, '');
	}

	return array_shuffle(use_chars.split(''), opt.algorithm === 'crypt');
}

/**
 * Generates a password string based on the specified algorithm and parameters.
 *
 * @param {string} algo - The algorithm to use for password generation. Valid options are 'crypt' or 'math'.
 * @param {number} len - The desired length of the password.
 * @param {string[]|string} use_chars - A string containing the characters that can be used in the password.
 * @param {boolean} is_unique - Whether the password should contain unique characters only (true) or allow duplicates (false).
 * @return {string} The generated password based on the given parameters.
 * @throws {Error} If an unsupported algorithm is specified.
 */
function generate(algo, len, use_chars, is_unique){

	const ret = RESULT;

	const chars = (Array.isArray(use_chars)) ? use_chars : use_chars.split('');

	const password = [];
	const used_chars = new Set();
	const chars_len = chars.length;

	// cryptoベースの安全な生成
	if(algo === 'crypt'){
		while(password.length < len){
			const idx = crypto_random_index(chars_len);
			const char = chars[idx];

			if(!is_unique || !used_chars.has(char)){
				password.push(char);
				used_chars.add(char);
			}
		}
	}
	// mathベース (互換のため残すが暗号強度は皆無)
	else if(algo === 'math'){
		while(password.length < len){
			const char = chars[Math.floor(Math.random() * chars_len)];

			if(!is_unique || !used_chars.has(char)){
				password.push(char);
				used_chars.add(char);
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
function password_generate(opt){

	if(!opt.validate)
		return null;

	const temp = bulk_password_generate(opt, PWD_GENERATE_COUNT);

	return (temp !== null) ? temp[Math.floor(Math.random() * temp.length)] : null;
}

/**
 * 複数の文字列生成
 *
 * @param {OPTION} opt
 * @param {Number} count
 * @returns {RESULT[]|null}
 */
function bulk_password_generate(opt, count){

	if(!opt.validate || count < 1)
		return null;

	// 生成数調整
	if(count < PWD_BULK_MIN)
		count = PWD_BULK_MIN;
	else if(count > PWD_BULK_MAX)
		count = PWD_BULK_MAX;

	let use_chars = filter_use_characters(opt);

	const passwordResults = [];
	for(let i = 0; i < count; i++){
		// 文字種配列の順番を20%の確率で入れ替え
		if(Math.floor(Math.random() * 100) < 20){
			use_chars = array_shuffle(use_chars);
		}

		const st_time = performance.now();
		const password = generate(opt.algorithm, opt.length, use_chars, opt.unique);
		const ed_time = performance.now();

		const result = { ...RESULT };
		result.password = password;
		result.length = opt.length;
		result.entropy = calc_entropy(opt.length, use_chars.length);
		result.charset_size = use_chars.length;
		result.algorithm = opt.algorithm;
		result.generate_time = ed_time - st_time;

		passwordResults.push(result);
	}

	return passwordResults;
}

/**
 * 単一のUUID生成
 *
 * @returns {RESULT}
 */
function uuid_generate(){

	const st_time = performance.now();
	const password = crypto.randomUUID();
	const ed_time = performance.now();

	const result = { ...RESULT };
	result.password = password;
	result.length = 36;
	result.entropy = 122;
	result.charset_size = 16;
	result.algorithm = 'crypt';
	result.generate_time = ed_time - st_time;

	return result;
}

/**
 * 複数ののUUID生成
 *
 * @param {Number} count
 * @returns {string[]}
 */
function bulk_uuid_generate(count){

	const uuids = [];

	for(let i = 0; i < count; i++){
		uuids.push(uuid_generate());
	}

	return uuids;
}
