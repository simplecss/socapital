;(function(){
	
	'use strict';

	var maxHeight = 800;
	var maxWidth = 1024;

	var isMobile = (function detectmob() { 
		if( navigator.userAgent.match(/Android/i)
		|| navigator.userAgent.match(/webOS/i)
		|| navigator.userAgent.match(/iPhone/i)
		|| navigator.userAgent.match(/iPad/i)
		|| navigator.userAgent.match(/iPod/i)
		|| navigator.userAgent.match(/BlackBerry/i)
		|| navigator.userAgent.match(/Windows Phone/i)
		){
			return true;
		} else {
			return false;
		}
	})();

	var isNativeScrollEnabled = true;

	var sliderIds = {};

	function scrollMeTo(){
		
		$('.js-goto').on('click', function(e){
			var $target = $(this.href.replace( /^.*\#/, '#' ) );
			
			if ($target.length === 1) {
				e.preventDefault();

				$('body,html').animate({ 
					scrollTop: $target.offset().top,
					easing: 'ease-in'
				}, 500);
			};
		});

	};

	function scroll(){
		var isScrolling = false;
		var $html = $('html');
		var $sections = $('.section');
		
		var scrollDirection;
		var winHeight;

		function scrollMeTo(e, index){

			var $target = $sections.eq(index);

			if ($target.length === 1) {

				e.preventDefault();

				isScrolling = true;

				$sections.addClass('section--scrolling');

				var scrollTop = $target.offset().top;

				if (scrollDirection == 'up'){
					scrollTop += ($target.outerHeight() - winHeight);
				}

				$('body,html').animate({ 
					scrollTop: scrollTop,
					easing: 'ease-in'
				}, 900, function(){
					isScrolling = false;
					$sections.removeClass('section--scrolling');
				});
			};
		}

		function smoothScroll(e){

			if (isScrolling){
				e.preventDefault();
				return;
			}		

			if (e.keyCode){
				
				if(e.keyCode === 38) {
					scrollDirection = 'up';
				}
				else if (e.keyCode === 40){
					scrollDirection = 'down';
				}

			}else{

				if(e.deltaY > 0) {
					scrollDirection = 'up';
				}
				else{
					scrollDirection = 'down';
				}

			}

			$sections.each(function(index, section){
				
				var rect = this.getBoundingClientRect();

				var rectTop = Math.round(rect.top);
				var rectBottom = Math.round(rect.bottom);

				if (
					rectTop >= -(winHeight / 2)
					&& rectTop <= winHeight / 2
					&& rectBottom <= winHeight * 1.5
					){
					
					if ( scrollDirection  == 'up' && index > 0 ){
						
						if ( rectTop < 0 && rectBottom < winHeight ){
							
							scrollMeTo(e, index);
						
						}else if( rectTop >= 0 ){
							
							scrollMeTo(e, index - 1);
						}

					}else if ( scrollDirection  == 'down' && index < $sections.length ){ 

						if( rectBottom <= winHeight ){
							
							scrollMeTo(e, index + 1);
						
						}else if( rectTop > 0 ){	
						
							scrollMeTo(e, index);
						}

					}
				}

			});
		}

		function enableScroll(e){
			if (!isNativeScrollEnabled && !$html.hasClass('fancybox-lock')){
				smoothScroll(e);
			}	
		}

		function resize(){
			winHeight = ( window.innerHeight || document.documentElement.clientHeight );
			
			if ( winHeight > maxHeight && $(window).width() > maxWidth ){
				isNativeScrollEnabled = false;
			}else{
				isNativeScrollEnabled = true;
			}
		}
		resize();

		$(window).on('resize', function(e){
			resize();
		});		

		$(window).on('mousewheel', function(e){
			enableScroll(e);
		});		

		$(document).keydown(function(e){
			if (e.keyCode === 38 || e.keyCode === 40){
				enableScroll(e);			
			}
		});		
	}

	function header(){

		var $header = $('#header');

		$header.addClass('header--fixed');

		function resize(){
			if ( $(window).scrollTop() > 100 && $(window).width() > maxWidth ){
				$header.addClass('header--small');
			}else{
				$header.removeClass('header--small');
			}
		}

		resize();

		$(window).on('scroll resize', function(e){
			resize();
		});
	}

	function sections(){
		var $sections = $('.section');

		function resize(){
			
			var winHeight = $(window).height();

			$sections.each(function(){
				var $section = $(this);
				var height = winHeight;

				if (($section).data('scroll') !== 'enable'){
					return;
				}
				
				if (winHeight > maxHeight){
					$(this).css('height', height);
				}else{
					$(this).css('height', '');
				}
				
			});
		}

		resize();

		$(window).on('resize', function(e){
			resize();
		});
	}

	function modal(){

		$('.js-fancybox').fancybox({
			padding: 0,
			scrolling: 'no',
			autoCenter : false,
			fitToView: false,
			helpers: {
				overlay: {
					//locked: false // if true (default), the content will be locked into overlay
				}
			},
			afterShow: function(){
				var $content = $(this.content);
				var $slider = $content.find('.project-images__list');
				
				if ($slider.length === 1 && $slider.children().length > 1){
					
					this.imagesSlider = $slider.bxSlider({
						pager: false
					});
				}
			},
			afterClose: function(){
				if (this.imagesSlider){
					this.imagesSlider.destroySlider();
					this.imagesSlider = false;
				}
			}
		});
	 

	}


	function projects(){
		var $projectsLists = $('.projects__list').not(':first');
		var $projectsMore = $('.projects__more');

		$projectsLists.hide();
		$projectsMore.show();

		$projectsMore.on('click', function(e){
			e.preventDefault();

			$projectsLists.each(function(index){
				var $this = $(this);
				if (!$this.is(':visible')){
					$this.slideDown();

					if (index === $projectsLists.length - 1){
						$projectsMore.hide();
					}

					return false;
				}
			});
		});
	}


	function form(){		

		$.extend($.validator.messages, {
			required: 'Это поле обязательно для заполнения.',
			remote: 'Please fix this field.',
			email: 'Введите корректный e-mail адрес.',
			url: 'Please enter a valid URL.',
			date: 'Please enter a valid date.',
			dateISO: 'Please enter a valid date (ISO).',
			number: 'Введите число.',
			digits: 'Допустимо вводить только цифры.',
			creditcard: 'Please enter a valid credit card number.',
			equalTo: 'Please enter the same value again.',
			accept: 'Please enter a value with a valid extension.',
			maxlength: jQuery.validator.format('Please enter no more than {0} characters.'),
			minlength: jQuery.validator.format('Please enter at least {0} characters.'),
			rangelength: jQuery.validator.format('Please enter a value between {0} and {1} characters long.'),
			range: jQuery.validator.format('Please enter a value between {0} and {1}.'),
			max: jQuery.validator.format('Please enter a value less than or equal to {0}.'),
			min: jQuery.validator.format('Please enter a value greater than or equal to {0}.')
		});

		$('form').each( function(){

			$(this).validate({

			});

			$(this).on('submit', function(e){

				e.preventDefault();

				var form = e.target;

				if ( !$(form).valid() ){
					return false;
				}

				//submit form
				$(form).ajaxSubmit({
					timeout: 3000,
					datatype: 'json',
				    success: function showResponse(responseText, statusText, xhr, $form)  { 
				        $('.js-success-modal').click();
				    }       
				});
			});
		});

	}

	function fileInput(){

		var $file = $('.file');

		$file.each(function(){

			var $file = $(this);
			var $input = $file.find('.file__input');
			var $text = $file.find('.file__text');
			var $clickable = $file.find('.file__button, .file__text');

			$clickable.on('click', function(e){			
				e.preventDefault();
				$input.click();
			});

			$input.on('change', function(){
				var text = $input.val().replace('C:\\fakepath\\', '') || $text.data('placeholder');
				$text.text(text);
			});

		});

	}

	function menu(){
		var $menuHrefs = $('.menu__href');
		var $sections = $('.section');

		var winHeight = ( window.innerHeight || document.documentElement.clientHeight );

		function setActive(){
						
			$sections.each(function(index, section){
				
				var sectionId = $(this).attr('id');
				var rect = this.getBoundingClientRect();
				var rectTop = Math.round(rect.top);
				var rectBottom = Math.round(rect.bottom);

				if (rectTop <= 50 && rectBottom / 2 <= winHeight ){
					$menuHrefs.removeClass('active');
					$menuHrefs.filter('[href="#' + sectionId + '"]').addClass('active');
				}

			});
		}

		setActive();

		$(window).on('scroll', function(e){
			setActive();
		});

		$(window).on('resize', function(e){
			winHeight = ( window.innerHeight || document.documentElement.clientHeight );
			
			setActive();
		});

	}


	function init(){
		if (!isMobile){
			header();
			sections();
			scroll();
		}

		scrollMeTo();		
		projects();		
		modal();			
		form();		
		fileInput();		
		menu();		
	}

	$(document).ready(function(){
		init();
	});	

})();
