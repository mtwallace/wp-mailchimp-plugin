$(document).ready(function () {
	var form = $('#your-form-here');
    
    form.on('submit', function(event) {
        var check = mailchimp(email, 'mc_check_subscription_status');
		check.success(function(data) {
		data = JSON.parse(data);

		if (data.status == 404) {
			var success = mailchimp(email, 'mc_subscribe_user');
			success.success(function(data) {
				data = JSON.parse(data);

				if(data.status == 400) {
					console.log('Please enter a valid email address');
				} else {
					console.log('Subscribed! We\'ll be in touch soon.');
				}
			});
		} else if (data.status == 'cleaned') {
			console.log('Please enter a valid email address.');
		} else if (data.status == 'pending' || data.status == 'unsubscribed') {
			mailchimp(email, 'mc_update_user');
			console.log('Your email status has been updated to subscribed.');
		} else if (data.status == 'subscribed') {
			console.log('You are already subscribed to this newsletter.').addClass('error');
		}
	});

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
