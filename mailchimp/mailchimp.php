
<?php 
/**
 * Plugin Name: MailChimp Newsletter Sign Up
 * Description: This is a plugin that allows us to sign up users to the CraftJack Newsletter
 * Version: 1.0.0
 * Author: Matthew Wallace
 */
$GLOBALS['key'] = 'xxxxxxxxxx';
$GLOBALS['list_id'] = 'xxxxxxxxxx';
$GLOBALS['server'] = 'us2';

add_action( 'wp_enqueue_scripts', 'mailchimp_scripts' );

function mailchimp_scripts() {
	
	wp_enqueue_script( 'mc_ajax',get_stylesheet_directory_uri() . '/js/mailchimp.js' , array('jquery'), '1.0', true );

	wp_localize_script( 'mc_ajax', 'postmc', array(
		'ajax_url' => admin_url( 'admin-ajax.php' )
	));
}

add_action( 'wp_ajax_nopriv_mc_check_subscription_status', 'mc_check_subscription_status' );
add_action( 'wp_ajax_mc_check_subscription_status', 'mc_check_subscription_status' );

function mc_check_subscription_status() {
	$email = $_REQUEST['email'];
	$user_id = md5($email);
	$auth = base64_encode( 'user:'. $GLOBALS['key'] );
	$data = array(
		'email_address' => $email
    );

    $json_data = json_encode($data);

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, 'https://' . $GLOBALS['server'] . '.api.mailchimp.com/3.0/lists/' . $GLOBALS['list_id'] . '/members/' . $user_id);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'Authorization: Basic ' . $auth));
    curl_setopt($ch, CURLOPT_USERAGENT, 'PHP-MCAPI/2.0');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);

    $result = curl_exec($ch);

    curl_close($ch);

	die();
}

add_action( 'wp_ajax_nopriv_mc_subscribe_user', 'mc_subscribe_user' );
add_action( 'wp_ajax_mc_subscribe_user', 'mc_subscribe_user' );

function mc_subscribe_user() {
	$email = $_REQUEST['email'];
	$source = $_REQUEST['source'];
	$auth = base64_encode( 'user:' . $GLOBALS['key'] );
	$data = array(
		'email_address' => $email,
		'status'        => 'subscribed',
		'merge_fields'  => array(
			'FNAME' => '',
			'LNAME' => '',
			'SOURCE' => $source
		)
	);

	$json_data = json_encode($data);

	$ch = curl_init();
	
	curl_setopt($ch, CURLOPT_URL, 'https://' . $GLOBALS['server'] . '.api.mailchimp.com/3.0/lists/' . $GLOBALS['list_id'] . '/members/');
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'Authorization: Basic ' . $auth));
	curl_setopt($ch, CURLOPT_USERAGENT, 'PHP-MCAPI/2.0');
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, false);
	curl_setopt($ch, CURLOPT_TIMEOUT, 10);
	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);

	$result = curl_exec($ch);

	curl_close($ch);

	die();
}

add_action( 'wp_ajax_nopriv_mc_update_user', 'mc_update_user' );
add_action( 'wp_ajax_mc_update_user', 'mc_update_user' );

function mc_update_user() {
	$email = $_REQUEST['email'];
	$source = $_REQUEST['source'];
	$userid = md5($email);
	$auth = base64_encode( 'user:' . $GLOBALS['key'] );
	$data = array(
		'email_address' => $email,
		'status'        => 'subscribed',
		'merge_fields'  => array(
			'FNAME' => '',
			'LNAME' => '',
			'SOURCE' => $source
		)
	);

	$json_data = json_encode($data);
	
	$ch = curl_init();
	
	curl_setopt($ch, CURLOPT_URL, 'https://' . $GLOBALS['server'] . '.api.mailchimp.com/3.0/lists/' . $GLOBALS['list_id'] . '/members/' . $userid);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'Authorization: Basic ' . $auth));
	curl_setopt($ch, CURLOPT_USERAGENT, 'PHP-MCAPI/2.0');
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, false);
	curl_setopt($ch, CURLOPT_TIMEOUT, 10);
	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PATCH");
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);

	$result = curl_exec($ch);

	die();
}
