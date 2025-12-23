<?php
// Simple test script to check upload functionality
echo "Testing upload endpoint...\n";

// Create a test image file
$testImage = __DIR__ . '/test_image.txt';
file_put_contents($testImage, "fake image content");

// Create cURL request
$ch = curl_init();
$file = new CURLFile($testImage, 'image/jpeg', 'test.jpg');

$data = [
    'image' => $file
];

curl_setopt($ch, CURLOPT_URL, 'http://localhost:8000/api/team/upload');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_VERBOSE, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);

echo "HTTP Code: $httpCode\n";
echo "Response: $response\n";
if ($error) {
    echo "cURL Error: $error\n";
}

curl_close($ch);
unlink($testImage);
?>
