<?php
// Create test image
$testFile = __DIR__ . '/test.jpg';
file_put_contents($testFile, 'fake image content');

// Simulate POST request
$_FILES = [
    'image' => [
        'name' => 'test.jpg',
        'tmp_name' => $testFile,
        'type' => 'image/jpeg',
        'size' => strlen('fake image content'),
        'error' => UPLOAD_ERR_OK
    ]
];

$_SERVER['REQUEST_METHOD'] = 'POST';
$_SERVER['REQUEST_URI'] = '/api/team/upload';

// Include the main index file
include __DIR__ . '/public/index.php';

// Clean up
unlink($testFile);
?>
