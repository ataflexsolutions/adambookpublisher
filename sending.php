<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Match with your form field names
    $name = $_POST['cn'] ?? 'No Name';
    $email = $_POST['em'] ?? 'No Email';
    $phone = $_POST['pn'] ?? 'No Phone';
    $message = $_POST['msg'] ?? 'No Message';

    $mail = new PHPMailer(true);

    try {
        // SMTP configuration
        $mail->isSMTP();
        $mail->Host = 'smtp.hostinger.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'info@adamsglobalpublishers.com';
        $mail->Password = 'Atta@110';
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        // Sender and recipient
        $mail->setFrom('info@adamsglobalpublishers.com', 'Website Form');
        $mail->addAddress('info@adamsglobalpublishers.com');

        // Email content
        $mail->isHTML(true);
        $mail->Subject = 'New Contact Form Submission';
        $mail->Body = "
            <h2>New Contact Message</h2>
            <p><strong>Name:</strong> {$name}</p>
            <p><strong>Email:</strong> {$email}</p>
            <p><strong>Phone:</strong> {$phone}</p>
            <p><strong>Message:</strong><br>{$message}</p>
        ";

        $mail->send();

        // ✅ Redirect back to same page with success flag
        $redirect = $_SERVER['HTTP_REFERER'] ?? '/';
        header("Location: $redirect?sent=1");
        exit;

    } catch (Exception $e) {

        // Redirect back with error flag
        $redirect = $_SERVER['HTTP_REFERER'] ?? '/';
        header("Location: $redirect?sent=0");
        exit;
    }

} else {
    header("Location: /");
    exit;
}