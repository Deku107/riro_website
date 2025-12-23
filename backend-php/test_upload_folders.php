<?php
// Test upload to different gallery folders
echo "Testing upload with 'chitthi' in filename...\n";

// Create test image content
$testContent = "test image data for chitthi";
$testFile = tempnam(sys_get_temp_dir(), 'upload_test_');
file_put_contents($testFile, $testContent);

// Create multipart data for upload
$boundary = uniqid();
$postData = "--{$boundary}\r\n";
$postData .= "Content-Disposition: form-data; name=\"image\"; filename=\"chitthi_thumbnail.jpg\"\r\n";
$postData .= "Content-Type: image/jpeg\r\n\r\n";
$postData .= $testContent . "\r\n";
$postData .= "--{$boundary}--\r\n";

// Create context
$context = stream_context_create([
    "http" => [
        "method" => "POST",
        "header" => "Content-Type: multipart/form-data; boundary={$boundary}\r\nContent-Length: " . strlen($postData),
        "content" => $postData,
    ]
]);

// Make request
$url = "http://localhost:8000/api/team/upload";
$response = file_get_contents($url, false, $context);

echo "Upload response: " . $response . "\n\n";

// Clean up
unlink($testFile);
?>
