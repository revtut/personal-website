<?php
require_once("recaptchalib.php");

$response = array();

// Validate parameters
if(
    empty($_POST["name"]) ||
    empty($_POST["email"]) ||
    empty($_POST["ext"]) ||
    empty($_POST["phone"]) ||
    empty($_POST["message"]) ||
    empty($_POST["recaptcha_challenge_field"] ||
    empty($_POST["recaptcha_response_field"]
    )
) {
    $response["success"] = "false";
    $response["message"] = "Missing fields!";
    echo json_encode($response);
    die();
}

// Validate reCAPTCHA
$privateKey = "6LehZxMUAAAAADKinTsGbsBLaEWie9kG7V09Qfdx";
$captchaResponse = recaptcha_check_answer($privateKey,
                            $_SERVER["REMOTE_ADDR"],
                            $_POST["recaptcha_challenge_field"],
                            $_POST["recaptcha_response_field"]);
if (!$captchaResponse->is_valid) {
    $response["success"] = "false";
    $response["message"] = "The reCAPTCHA wasn't entered correctly.";
    echo json_encode($response);
    die();
}

// Send email
$to = "hello@joaosilva.co";
$from = $_POST["email"];
$subject = "New contact request from " . $_POST["name"];
$message = $_POST["message"];

if(mail($to, $subject, $message)) {
    $response["success"] = "true";
    $response["message"] = "Your message has been sent!";
    echo json_encode($response);
    die();
} else {
    $response["success"] = "false";
    $response["message"] = "Your message could not be sent. Please try again!";
    echo json_encode($response);
    die();
}