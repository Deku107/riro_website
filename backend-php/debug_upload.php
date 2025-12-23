<?php
// Test the exact upload workflow
$pngData = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
$tempFile = tempnam(sys_get_temp_dir(), 'test_upload_');
file_put_contents($tempFile, $pngData);

// Create cURL request to test the upload endpoint
$ch = curl_init();
$file = new CURLFile($tempFile, 'image/png', 'test.png');

$data = [
    'image' => $file
];

curl_setopt($ch, CURLOPT_URL, 'http://localhost:8000/api/team/upload');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: multipart/form-data'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);

echo "HTTP Code: $httpCode\n";
echo "Response: $response\n";
if ($error) {
    echo "cURL Error: $error\n";
}

curl_close($ch);
unlink($tempFile);
?>
