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

$safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$safeEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$safePhone = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
$safeMessage = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));
$subject = 'New Contact Form Submission';
$body = "
    <h2>New Contact Message</h2>
    <p><strong>Name:</strong> {$safeName}</p>
    <p><strong>Email:</strong> {$safeEmail}</p>
    <p><strong>Phone:</strong> {$safePhone}</p>
    <p><strong>Message:</strong><br>{$safeMessage}</p>
";

function log_mail_error($msg) {
    @file_put_contents(__DIR__ . '/form-errors.log', '[' . date('Y-m-d H:i:s') . '] ' . $msg . PHP_EOL, FILE_APPEND);
}

// Try SSL 465 first (Hostinger recommended), then STARTTLS 587
$smtpConfigs = [
    ['port' => 465, 'secure' => PHPMailer::ENCRYPTION_SMTPS],
    ['port' => 587, 'secure' => PHPMailer::ENCRYPTION_STARTTLS],
];

foreach ($smtpConfigs as $cfg) {
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.hostinger.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'info@adamsglobalpublishers.com';
        $mail->Password = 'Atta@1100';
        $mail->SMTPSecure = $cfg['secure'];
        $mail->Port = $cfg['port'];
        $mail->Timeout = 15;
        $mail->CharSet = 'UTF-8';

        $mail->setFrom('info@adamsglobalpublishers.com', 'Website Form');
        $mail->addAddress('info@adamsglobalpublishers.com');
        $mail->addReplyTo($email, $name);

        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $body;
        $mail->AltBody = strip_tags(str_replace('<br />', "\n", $body));

        $mail->send();
        respond(true, 'Message sent successfully.', $isAjax);
    } catch (Exception $e) {
        log_mail_error('SMTP ' . $cfg['port'] . ' failed: ' . $mail->ErrorInfo);
    }
}

// Last resort: server's built-in mail()
try {
    $mail = new PHPMailer(true);
    $mail->isMail();
    $mail->CharSet = 'UTF-8';
    $mail->setFrom('info@adamsglobalpublishers.com', 'Website Form');
    $mail->addAddress('info@adamsglobalpublishers.com');
    $mail->addReplyTo($email, $name);
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body = $body;
    $mail->send();
    respond(true, 'Message sent successfully.', $isAjax);
} catch (Exception $e) {
    log_mail_error('mail() fallback failed: ' . $mail->ErrorInfo);
}

respond(false, 'Unable to send right now. Please try again.', $isAjax);
