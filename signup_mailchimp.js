$(document).foundation();
$(window).load(function () {
	var popup = $('#NewsletterSignupModal');

	if(popup.length) {

		var newsletterModalCookie = $.cookie('newsletterModal');

		if (newsletterModalCookie != "dontShow") {

			var modal = new Foundation.Reveal($('#NewsletterSignupModal'));

			setTimeout(function () {
				modal.open();
		    }, 7000);
		}

		$('.reveal').click(function(event) {
			event.stopPropagation();
		});

	    $('.reveal .close, .reveal-overlay').click(function() {
	    	modal.close();
	    	var optOuts = $.cookie('newsletterOptOuts');

	        if (!optOuts || optOuts == 3) {
	            optOuts = 1
	        } else {
	            optOuts++;
	        }

	        if (optOuts == 1) {
	            $.cookie('newsletterOptOuts', 1, { expires: 99999, path: '/' });
	            $.cookie('newsletterModal', 'dontShow', { expires: 7, path: '/' });
	        } else if (optOuts == 2) {
	            $.cookie('newsletterOptOuts', 2, { expires: 99999, path: '/' });
	            $.cookie('newsletterModal', 'dontShow', { expires: 30, path: '/' });
	        } else if (optOuts == 3) {
	            $.cookie('newsletterOptOuts', 3, { expires: 99999, path: '/' });
	            $.cookie('newsletterModal', 'dontShow', { expires: 1095, path: '/' });
	        }

	    });
	}

	var button = $('button[name="subscribe"]');
	var input = $('input[name="EMAIL"]');

	input.on('keyup', function() {
		var el = $(this);

		if(el.hasClass('error')) {
			var email = el.val();
			var form = el.parent('.input-container').parent('form');
			var message = form.find('.mc-message');
			var valid = validateEmail(email);

			if(valid) {
				el.removeClass('error');
				message.empty().removeClass('error');
			}
		}
	});

	button.click(function(event) {
		event.preventDefault();
		
		var el = $(this);
		var buttonText = el.html();
		var subscribe = el.parent('form').parent('.subscribe');
		var thisInput = subscribe.find('input[name="EMAIL"]');
		var email = thisInput.val();
		var header = subscribe.find('h3');
		var text = subscribe.find('p');
		var message = subscribe.find('.mc-message');
		var valid = validateEmail(email);
		var source = (el.parent('#NewsletterSignupModal .subscribe form').length > 0) ? 'Popup' : 'Sidebar';

		thisInput.removeClass('error');
		message.empty().removeClass('error');
		el.empty().append('<img src="' + templateUrl + '/images/toolbox/loading-dots.gif" alt="Loading" class="loader">');

		if(valid) {
			var check = mailchimp(email, 'mc_check_subscription_status');

			check.success(function(data) {
				data = JSON.parse(data);

				if (data.status == 404) {
					var success = mailchimp(email, 'mc_subscribe_user', source);
					success.success(function(data) {
						data = JSON.parse(data);

						if(data.status == 400) {
							thisInput.empty().addClass('error');
							message.empty().append('Please enter a valid email address').addClass('error');
							el.empty().append(buttonText);
						} else {
							header.empty().append('Subscribed!');
							text.hide();
							thisInput.hide();

							if(!header)
								message.empty().append('Subscribed! We\'ll be in touch soon.').addClass('success');
							else
								message.empty().append('We\'ll be in touch soon.').addClass('success');
							el.hide();
							$.cookie('newsletterModal', 'dontShow', { expires: 99999, path: '/' });
						}
					});
				} else if (data.status == 'cleaned') {
					thisInput.empty().addClass('error');
					message.empty().append('Please enter a valid email address.').addClass('error');
					el.empty().append(buttonText);
				} else if (data.status == 'pending' || data.status == 'unsubscribed') {
					mailchimp(email, 'mc_update_user', source);
					header.empty().append('Subscribed!');
					text.hide();
					thisInput.hide();
					message.empty().append('Your email status has been updated to subscribed.').addClass('success');
					el.hide();
					$.cookie('newsletterModal', 'dontShow', { expires: 99999, path: '/' });
				} else if (data.status == 'subscribed') {
					thisInput.empty().addClass('error');
					message.empty().append('You are already subscribed to this newsletter.').addClass('error');
					el.empty().append(buttonText);
				}
			});
		} else {
			thisInput.empty().addClass('error');
			message.empty().append('Please enter a valid email address.').addClass('error');
			el.empty().append(buttonText);
		}
	});

	function validateEmail(email) {
		var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return regex.test(email);
	}

	function mailchimp(email, mc_function, source) {
		return jQuery.ajax({
			url : postmc.ajax_url,
			type : 'post',
			data : {
				action : mc_function,
				email : email,
				source: source
			}
		});
	}
});
