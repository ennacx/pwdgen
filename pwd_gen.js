const ALPHA_U = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ALPHA_L = 'abcdefghijklmnopqrstuvwxyz';
const NUMERIC = '1234567890';
const SYMBOL  = '!"#$%&\'()+*-^@=~|[]{}`:;,.<>/?\\_';
const SYMBOL_ZEN  = "！”＃＄％＆’（）＋＊－＾＠＝～｜「」｛｝｀：；，．＜＞／？￥＿";
const HEXADECIMAL = '1234567890abcdef';
const MISLEAD_SYMBOLS = '0OcoIl1vyQq9';

const CRYPT_GENERATE_COUNT= 10;

const PWD_LEN_MIN = 4;
const PWD_LEN_MAX = 256;

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
		} else{
			return "形式が不正です。文字種を再選択してください。";
		}

		if(opt.mislead){
			max_length -= filter_mislead_symbols(opt).length;
		}

		if(max_length <= 0){
			return "形式が不正です。文字種を再選択してください。";
		}

		if(opt.length > max_length){
			return `指定の条件では${opt.length}文字のパスワードを生成できません。`;
		}
	}

	opt.validate = true;

	return null;
}

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
 *
 * @param {OPTION} opt
 * @returns String|null
 */
function password_generate(opt){

	if(!opt.validate){
		return null;
	}

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

	const use_chars = array_shuffle(use_chars_str.split(''));
	const use_chars_len = use_chars.length;

	let password = '';
	while(password.length < opt.length){
		let char;
		if(opt.algorithm === 'crypt'){
			const arr = Array.from(crypto.getRandomValues(new BigUint64Array(CRYPT_GENERATE_COUNT)));
			const bigint = arr[Math.floor(Math.random() * CRYPT_GENERATE_COUNT)];

			char = use_chars[Number(bigint % BigInt(use_chars_len))];
		} else if(opt.algorithm === 'math'){
			char = use_chars[Math.floor(Math.random() * use_chars_len)];
		}

		if(char !== undefined){
			if(opt.unique){
				if(password.indexOf(char) === -1)
					password += char;
			} else{
				password += char;
			}
		}
	}

	return password;
}
