<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

$isAjax = (
    (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) &&
        strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') ||
    (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false)
);

function respond($ok, $message = '', $isAjax = false) {
    if ($isAjax) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => (bool) $ok, 'message' => $message]);
        exit;
    }

    $redirect = $_SERVER['HTTP_REFERER'] ?? '/';
    $sep = (strpos($redirect, '?') === false) ? '?' : '&';
    header('Location: ' . $redirect . $sep . 'sent=' . ($ok ? '1' : '0'));
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    if ($isAjax) {
        respond(false, 'Invalid request method.', true);
    }
    header('Location: /');
    exit;
}

$name = trim($_POST['cn'] ?? '');
$email = trim($_POST['em'] ?? '');
$phone = trim($_POST['pn'] ?? '');
$message = trim($_POST['msg'] ?? '');

if ($name === '' || $email === '' || $phone === '' || $message === '') {
    respond(false, 'Please fill in all required fields.', $isAjax);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Please enter a valid email address.', $isAjax);
}

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = 'smtp.hostinger.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'info@adamsglobalpublishers.com';
    $mail->Password = 'Atta@110';
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    $mail->setFrom('info@adamsglobalpublishers.com', 'Website Form');
    $mail->addAddress('info@adamsglobalpublishers.com');
    $mail->addReplyTo($email, $name);

    $safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    $safeEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
    $safePhone = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
    $safeMessage = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));

    $mail->isHTML(true);
    $mail->Subject = 'New Contact Form Submission';
    $mail->Body = "
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> {$safeName}</p>
        <p><strong>Email:</strong> {$safeEmail}</p>
        <p><strong>Phone:</strong> {$safePhone}</p>
        <p><strong>Message:</strong><br>{$safeMessage}</p>
    ";

    $mail->send();
    respond(true, 'Message sent successfully.', $isAjax);
} catch (Exception $e) {
    respond(false, 'Unable to send right now. Please try again.', $isAjax);
}
