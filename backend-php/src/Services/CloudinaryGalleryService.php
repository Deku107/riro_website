<?php

class CloudinaryGalleryService {
    private $cloudName;
    private $apiKey;
    private $apiSecret;
    
    public function __construct() {
        $this->cloudName = 'dow6mrkpm';
        // Use the same credentials as in index.php
        $this->apiKey = '186329281539576';
        $this->apiSecret = 'USUgBE_52uDSEDJFpTcyu3zmcAg';
    }
    
    /**
     * Fetch images from a specific folder in Cloudinary
     */
    public function getFolderImages($folderName) {
        $url = "https://api.cloudinary.com/v1_1/{$this->cloudName}/resources/image/upload";
        
        // Parameters for the API request
        $params = [
            'prefix' => "riro/{$folderName}/",
            'type' => 'upload',
            'max_results' => 100
        ];
        
        $queryString = http_build_query($params);
        $fullUrl = $url . '?' . $queryString;
        
        // Initialize cURL
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $fullUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($ch, CURLOPT_USERPWD, $this->apiKey . ':' . $this->apiSecret);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode !== 200) {
            error_log("Cloudinary API error: HTTP {$httpCode} - {$response}");
            return [];
        }
        
        $data = json_decode($response, true);
        
        if (!isset($data['resources'])) {
            return [];
        }
        
        // Transform the data to match expected format
        $images = [];
        foreach ($data['resources'] as $resource) {
            $images[] = [
                'public_id' => $resource['public_id'],
                'secure_url' => $resource['secure_url'],
                'format' => $resource['format'],
                'created_at' => $resource['created_at']
            ];
        }
        
        return $images;
    }
    
    /**
     * Filter out thumbnail images
     */
    public function filterThumbnails($images) {
        return array_filter($images, function($img) {
            return !str_ends_with($img['public_id'], 'thumbnail');
        });
    }
}
