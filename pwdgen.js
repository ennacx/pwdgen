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
 * 設定エンティティー
 *
 * @type {{
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
const OPTION = {
	length: PWD_LEN_MIN,

	use_type: 'default',

	alpha_u: true,
	alpha_l: true,
	numeric: true,
	symbol: false,
	hex: false,

	unique: false,
	mislead: false,

	algorithm: 'math',

	ignore_symbols: '',

	validate: false
};

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
 * @returns {*[]}
 */
function array_shuffle(array){

	const cloneArray = [...array];

	for(let i = cloneArray.length - 1; i >= 0; i--){
		const tmpStorage = cloneArray[i];
		const rnd = Math.floor(Math.random() * (i + 1));

		cloneArray[i] = cloneArray[rnd];
		cloneArray[rnd] = tmpStorage;
	}

	return cloneArray
}

/**
 * 設定のバリデーション
 *
 * @param {OPTION} opt
 */
function validation(opt){

	if(!opt.alpha_u && !opt.alpha_l && !opt.numeric && !opt.symbol && !opt.hex){
		return "文字種を選択して下さい。";
	}

	if(opt.length < PWD_LEN_MIN || opt.length > PWD_LEN_MAX){
		return `文字数は${PWD_LEN_MIN}以上${PWD_LEN_MAX}以下の制限があります。`;
	}

	if(opt.use_type !== 'default' && opt.use_type !== 'hex'){
		return "形式が不正です。文字種を再選択してください。";
	}

	if(opt.algorithm !== 'crypt' && opt.algorithm !== 'math'){
		return "アルゴリズムが不正です。";
	}

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
					for(let i = 0; i < opt.ignore_symbols.length; i++){
						temp = temp.replace(opt.ignore_symbols[i], '');
					}
				}
				max_length += temp.length;
			}
		} else if(opt.use_type === 'hex'){
			if(opt.hex)
				max_length += 16;
		}

		if(opt.mislead){
			max_length -= filter_mislead_symbols(opt).length;
		}

		if(max_length <= 0){
			return "文字種を再選択してください。";
		}

		if(opt.length > max_length){
			return `指定の条件では${opt.length}文字の文字列を生成できません。`;
		}
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

	let use_chars_str = '';
	if(opt.use_type === 'default'){
		if(opt.alpha_u)
			use_chars_str += ALPHA_U;
		if(opt.alpha_l)
			use_chars_str += ALPHA_L;
		if(opt.numeric)
			use_chars_str += NUMERIC;
		if(opt.symbol){
			let temp = SYMBOL;

			if(opt.ignore_symbols !== ''){
				for(let i = 0; i < opt.ignore_symbols.length; i++){
					temp = temp.replace(opt.ignore_symbols[i], '');
				}
			}

			use_chars_str += temp;
		}
	} else if(opt.use_type === 'hex'){
		if(opt.hex)
			use_chars_str += HEXADECIMAL;
	}

	const mislead_symbols = filter_mislead_symbols(opt);
	for(let i = 0; i < mislead_symbols.length; i++){
		use_chars_str = use_chars_str.replace(mislead_symbols[i], '');
	}

	return array_shuffle(use_chars_str.split(''));
}

/**
 * 文字列生成
 *
 * @param {string} algo
 * @param {Number} len
 * @param {string[]} use_chars
 * @param {boolean} is_unique
 * @returns {string}
 */
function generate(algo, len, use_chars, is_unique){

	const use_chars_len = use_chars.length;

	let password = '';
	while(password.length < len){
		let char;
		if(algo === 'crypt'){
			const arr = Array.from(crypto.getRandomValues(new BigUint64Array(CRYPT_GENERATE_COUNT)));
			const bigint = arr[Math.floor(Math.random() * CRYPT_GENERATE_COUNT)];

			char = use_chars[Number(bigint % BigInt(use_chars_len))];
		} else if(algo === 'math'){
			char = use_chars[Math.floor(Math.random() * use_chars_len)];
		}

		if(char !== undefined){
			if(is_unique){
				if(password.indexOf(char) === -1)
					password += char;
			} else{
				password += char;
			}
		}
	}

	return password;
}

/**
 * 単一の文字列生成
 *
 * @param {OPTION} opt
 * @returns {string|null}
 */
function password_generate(opt){

	if(!opt.validate){
		return null;
	}

	const use_chars = filter_use_characters(opt);

	const temp = bulk_password_generate(opt, PWD_GENERATE_COUNT);
	if(temp === null)
		return null;

	return temp[Math.floor(Math.random() * PWD_GENERATE_COUNT)];
}

/**
 * 複数の文字列生成
 *
 * @param {OPTION} opt
 * @param {Number} count
 * @returns {string[]|null}
 */
function bulk_password_generate(opt, count){

	if(!opt.validate || count < 1){
		return null;
	}

	if(count < PWD_BULK_MIN)
		count = PWD_BULK_MIN;
	else if(count > PWD_BULK_MAX)
		count = PWD_BULK_MAX;

	let use_chars = filter_use_characters(opt);

	const passwords = [];
	for(let i = 0; i < count; i++){
		// 文字種配列の順番を20%の確率で入れ替え
		if(Math.floor(Math.random() * 100) < 20)
			use_chars = array_shuffle(use_chars);

		passwords.push(generate(opt.algorithm, opt.length, use_chars, opt.unique));
	}

	return passwords;
}
