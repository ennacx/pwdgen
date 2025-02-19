const $slider = $('input[name="pwd_len_slider"]');
const $len_box = $('input[name="pwd_len_input"]');
const $use_type_box = $('input[name="use_type"]');
const $ignore_symbol_box = $('input[name="ignore_symbols"]');

const $al_u_chk = $('input#alpha_u');
const $al_l_chk = $('input#alpha_l');
const $num_chk  = $('input#num');
const $sym_chk  = $('input#symbol');
const $hex_chk  = $('input#hex');

const $unq_chk  = $('input#unique');
const $mis_chk  = $('input#mislead');

const $symbol_info = $('#symbol-info');

const $algo_err = $('.algo-err-msg');

const $generate_btn = $('button[name="gen"]');
const $bulk_generate_btn = $('button.bulk-gen');

const $validation_error = $('div#validation-error');
const $generate_result = $('div#generate-result');
const $bulk_generate_result = $('div#bulk-generate-result');
const $bulk_textarea = $bulk_generate_result.find('textarea[name="bulk_password"]');

const $password_copy_btn = $('button[name="password_copy"]');

const anim_duration = 100;

$slider.attr('min', PWD_LEN_MIN);
$slider.attr('max', PWD_LEN_MAX);
$len_box.attr('min', PWD_LEN_MIN);
$len_box.attr('max', PWD_LEN_MAX);

if(!window.crypto || typeof window.crypto.getRandomValues !== 'function'){
	$('input[name="algorithm"]').prop('checked', false);
	$('input[name="algorithm"][value="crypt"]').prop('disabled', true);
	$('input[name="algorithm"][value="math"]').prop('checked', true);

	$algo_err.show(anim_duration);
}

$('#symbol-samples').text(SYMBOL);
$('#mislead-samples').text(MISLEAD_SYMBOLS);

$use_type_box.val(OPTION.use_type);

const changeSymbolCheck = () => {
	if($sym_chk.prop('checked')){
		$symbol_info.show(anim_duration);
	} else{
		$symbol_info.hide(anim_duration);
	}
};
$sym_chk.change(changeSymbolCheck);

$('.default-check').change(function(){
	if($(this).prop('checked')){
		$('.hex-check').prop('checked', false);

		$use_type_box.val('default');
	}
});
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

let password;
$generate_btn.click(() => {
	$validation_error.hide().empty();

	$bulk_generate_result.hide();
	$bulk_textarea.text('');
	$bulk_textarea.val('');

	const opt = set_option();

	const validate = validation(opt);
	if(validate !== null){
		$generate_result.hide().empty();

		$validation_error
			.append(`<div class="alert alert-danger">${validate}</div>`)
			.show(anim_duration);
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

$bulk_generate_btn.click(function(){
	$validation_error.hide().empty();
	$generate_result.hide();

	const opt = set_option();

	const validate = validation(opt);
	if(validate !== null){
		$generate_result.hide().empty();

		$validation_error
			.append(`<div class="alert alert-danger">${validate}</div>`)
			.show(anim_duration);
	} else{
		const passwords = bulk_password_generate(opt, parseInt($(this).val()));
		const temp = (passwords !== null) ? passwords.join("\n") : '';

		$bulk_textarea.text(temp);
		$bulk_textarea.val(temp);

		$bulk_generate_result.show(anim_duration);
	}
});

if(!navigator.clipboard){
	$password_copy_btn.hide();
}
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

const symbols     = SYMBOL.split('');
const symbols_zen = SYMBOL_ZEN.split('');

const ignore_symbol_regexp_pattern = `[^${SYMBOL.replace('-', '\\-').replace(']', '\\]')}]`;
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

const updateInterestRate = () => {
	$len_box.val($slider.val());
};

const initializeSlider = () => {
	updateInterestRate();
	$slider.on('input', updateInterestRate)
};

initializeSlider();
