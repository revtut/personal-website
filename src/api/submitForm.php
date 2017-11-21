<?php
$response = array();

// Validate parameters
if(
    empty($_POST["name"]) ||
    empty($_POST["email"]) ||
    empty($_POST["ext"]) ||
    empty($_POST["phone"]) ||
    empty($_POST["message"]) ||
    empty($_POST["g-recaptcha-response"])
) {
    $response["success"] = "false";
    $response["message"] = "Missing fields!";
    echo json_encode($response);
    die();
}

// Validate reCAPTCHA
$privateKey = "6LehZxMUAAAAADKinTsGbsBLaEWie9kG7V09Qfdx";
$captchaResponse=file_get_contents(
    "https://www.google.com/recaptcha/api/siteverify?secret="
    .$privateKey
    ."&response="
    .$$_POST["g-recaptcha-response"]
    ."&remoteip="
    .$_SERVER["REMOTE_ADDR"]);
if (!empty($captchaResponse["success"]) || $captchaResponse["success"] === "false") {
    $response["success"] = "false";
    $response["message"] = "The reCAPTCHA wasn't entered correctly.";
    echo json_encode($response);
    die();
}

// Send email
$to = "hello@joaosilva.co";
$from = $_POST["email"];
$subject = "New contact request from " . $_POST["name"];
$message =
"Name: " . $_POST["name"] .
" | Email: " . $_POST["email"] .
" | Phone: " . $_POST["ext"] . " " . $_POST["phone"] .
" | Message: " . $_POST["message"];
$headers = "From: $from"; 

if(mail($to, $subject, $message, $headers, "-f " . $from)) {
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