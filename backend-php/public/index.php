<?php
// Suppress errors for production
error_reporting(0);
ini_set('display_errors', 0);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Parse request
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Cloudinary configuration (same as Node.js)
$cloudName = 'dow6mrkpm';
$apiKey = '186329281539576';
$apiSecret = 'USUgBE_52uDSEDJFpTcyu3zmcAg';

// Handle different endpoints exactly like Node.js
switch ($path) {
    case "/api/health":
        echo json_encode(["status" => "OK", "timestamp" => date("c")]);
        break;
        
    case "/api/team":
        $teamFile = __DIR__ . "/../data/teamData.json";
        if (file_exists($teamFile)) {
            echo file_get_contents($teamFile);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Team data not found"]);
        }
        break;
        
    case "/api/projects":
        $projectsFile = __DIR__ . "/../data/projectsData.json";
        if (file_exists($projectsFile)) {
            echo file_get_contents($projectsFile);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Projects data not found"]);
        }
        break;
        
    case "/api/projects/save":
        if ($method === "POST") {
            $input = file_get_contents('php://input');
            $data = json_decode($input, true);
            if ($data) {
                $projectsFile = __DIR__ . "/../data/projectsData.json";
                $projectsDir = dirname($projectsFile);
                if (!file_exists($projectsDir)) {
                    mkdir($projectsDir, 0755, true);
                }
                file_put_contents($projectsFile, json_encode($data, JSON_PRETTY_PRINT));
                echo json_encode(["success" => true]);
            } else {
                http_response_code(400);
                echo json_encode(["error" => "Invalid JSON data"]);
            }
        } else {
            http_response_code(405);
            echo json_encode(["error" => "Method not allowed"]);
        }
        break;
        
    case (preg_match("#^/api/projects/(.+)$#", $path, $matches) ? true : false):
        $season = $matches[1];
        $projectsFile = __DIR__ . "/../data/projectsData.json";
        if (file_exists($projectsFile)) {
            $projectsData = json_decode(file_get_contents($projectsFile), true);
            if (isset($projectsData[$season])) {
                echo json_encode($projectsData[$season]);
            } else {
                http_response_code(404);
                echo json_encode(["error" => "Season not found"]);
            }
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Projects data not found"]);
        }
        break;
        
    // case "/api/galleries":
    //     $galleries = [
    //         [
    //             'id' => 'chitthi',
    //             'title' => 'Chitthi',
    //             'folder' => 'riro/chitthi',
    //             'thumbnail' => 'https://res.cloudinary.com/dow6mrkpm/image/upload/riro/chitthi/thumbnail',
    //             'description' => 'Behind the scenes of our latest film productions',
    //             'imageCount' => 4
    //         ],
    //         [
    //             'id' => 'kali',
    //             'title' => 'Kali',
    //             'folder' => 'riro/kali',
    //             'thumbnail' => 'https://res.cloudinary.com/dow6mrkpm/image/upload/riro/kali/thumbnail',
    //             'description' => 'Behind the scenes of our latest film productions',
    //             'imageCount' => 3
    //         ],
    //         [
    //             'id' => 'dot',
    //             'title' => 'Dot',
    //             'folder' => 'riro/dot',
    //             'thumbnail' => 'https://res.cloudinary.com/dow6mrkpm/image/upload/riro/dot/thumbnail',
    //             'description' => 'Behind the scenes of our latest film productions',
    //             'imageCount' => 5
    //         ]
    //     ];
    //     echo json_encode($galleries);
    //     break;
        
    // case (preg_match("#^/api/gallery/(.+)$#", $path, $matches) ? true : false):
    //     require_once __DIR__ . '/../src/Services/CloudinaryGalleryService.php';
        
    //     $folderName = $matches[1];
    //     $cloudinaryService = new CloudinaryGalleryService();
        
    //     try {
    //         $images = $cloudinaryService->getFolderImages($folderName);
    //         $filteredImages = $cloudinaryService->filterThumbnails($images);
            
    //         echo json_encode(array_values($filteredImages));
    //     } catch (Exception $e) {
    //         error_log("Gallery API error: " . $e->getMessage());
    //         http_response_code(500);
    //         echo json_encode(["error" => "Failed to fetch gallery images"]);
    //     }
    //     break;


  case "/api/galleries":

    try {
        // 1. Get subfolders
        $url = "https://api.cloudinary.com/v1_1/{$cloudName}/folders/riro";
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
            CURLOPT_USERPWD => "{$apiKey}:{$apiSecret}",
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            throw new Exception("Folder fetch failed: HTTP {$httpCode} - {$response}");
        }

        $result = json_decode($response, true);
        $galleries = [];

        foreach ($result['folders'] ?? [] as $folder) {

            // 2. Search for thumbnail
            $searchPayload = json_encode([
                'expression'  => 'folder="' . $folder['path'] . '" AND public_id:thumbnail*',
                'max_results' => 1
            ]);

            $ch = curl_init("https://api.cloudinary.com/v1_1/{$cloudName}/resources/search");
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
                CURLOPT_USERPWD => "{$apiKey}:{$apiSecret}",
                CURLOPT_POST => true,
                CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
                CURLOPT_POSTFIELDS => $searchPayload,
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => false,
                CURLOPT_TIMEOUT => 5, // Add timeout to prevent hanging
            ]);

            $searchResponse = curl_exec($ch);
            $searchCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            $thumbnail = null;

            if ($searchCode === 200) {
                $searchResult = json_decode($searchResponse, true);
                if (!empty($searchResult['resources'][0]['public_id'])) {
                    $thumbnail = $searchResult['resources'][0]['public_id'];
                }
            }

            $galleries[] = [
                'id'          => $folder['name'],
                'title'       => $folder['name'],
                'folder'      => $folder['path'],
                'thumbnail'   => $thumbnail,
                'description' => 'Behind the scenes of our latest film productions',
            ];
        }

        echo json_encode($galleries);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
    break;


    case (preg_match("#^/api/gallery/(.+)$#", $path, $matches) ? true : false):

    $folderPath = 'riro/' . $matches[1];

    try {
        $payload = json_encode([
            'expression'  => 'folder="' . $folderPath . '"',
            'sort_by'     => [['created_at' => 'asc']],
            'max_results' => 100
        ]);

        $ch = curl_init("https://api.cloudinary.com/v1_1/{$cloudName}/resources/search");
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
            CURLOPT_USERPWD => "{$apiKey}:{$apiSecret}",
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            throw new Exception("Search failed: {$response}");
        }

        $result = json_decode($response, true);
        echo json_encode($result['resources'] ?? []);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
    break;





    case "/api/team/save":
        if ($method === "POST") {
            $input = file_get_contents('php://input');
            $data = json_decode($input, true);
            if ($data) {
                $teamFile = __DIR__ . "/../data/teamData.json";
                $teamDir = dirname($teamFile);
                if (!file_exists($teamDir)) {
                    mkdir($teamDir, 0755, true);
                }
                file_put_contents($teamFile, json_encode($data, JSON_PRETTY_PRINT));
                echo json_encode(["success" => true]);
            } else {
                http_response_code(400);
                echo json_encode(["error" => "Invalid JSON data"]);
            }
        } else {
            http_response_code(405);
            echo json_encode(["error" => "Method not allowed"]);
        }
        break;
        
    case "/api/services":
        $servicesFile = __DIR__ . "/../data/servicesData.json";
        if (file_exists($servicesFile)) {
            echo file_get_contents($servicesFile);
        } else {
            echo json_encode([
                'services' => [
                    [
                        'id' => 's1',
                        'number' => '01',
                        'title' => 'SHORT FILM',
                        'details' => ['Director', 'Writer', 'DOP', 'Costume Designer'],
                        'crew' => ['Producer', 'Editor', 'Sound Designer', 'Production Manager'],
                        'cast' => ['Lead Actor', 'Supporting Actor', 'Background Artists', 'Voice Artists']
                    ],
                    [
                        'id' => 's2',
                        'number' => '02',
                        'title' => 'DIGITAL COMMERCIALS',
                        'details' => ['Creative Director', 'Copywriter', 'Art Director', 'Brand Strategist'],
                        'crew' => ['Producer', 'Cinematographer', 'Editor', 'Motion Graphics Artist'],
                        'cast' => ['Brand Ambassador', 'Actors', 'Models', 'Voice Over Artist']
                    ]
                ],
                'projects' => []
            ]);
        }
        break;
        
    case "/api/services/save":
        if ($method === "POST") {
            $input = file_get_contents('php://input');
            $data = json_decode($input, true);
            if ($data) {
                $servicesFile = __DIR__ . "/../data/servicesData.json";
                $servicesDir = dirname($servicesFile);
                if (!file_exists($servicesDir)) {
                    mkdir($servicesDir, 0755, true);
                }
                file_put_contents($servicesFile, json_encode($data, JSON_PRETTY_PRINT));
                echo json_encode(["success" => true]);
            } else {
                http_response_code(400);
                echo json_encode(["error" => "Invalid JSON data"]);
            }
        } else {
            http_response_code(405);
            echo json_encode(["error" => "Method not allowed"]);
        }
        break;
        
    case "/api/team/upload":
        if ($method === "POST") {
            if (!isset($_FILES["image"]) || $_FILES["image"]["error"] !== UPLOAD_ERR_OK) {
                http_response_code(400);
                echo json_encode(["error" => "No image file provided"]);
                break;
            }
            
            $file = $_FILES["image"];
            $fileName = $file["name"];
            $tmpName = $file["tmp_name"];
            $mimeType = $file["type"];
            $fileSize = $file["size"];
            
            if (!str_starts_with($mimeType, "image/")) {
                http_response_code(400);
                echo json_encode(["error" => "Only image files are allowed"]);
                break;
            }
            
            if ($fileSize > 5 * 1024 * 1024) {
                http_response_code(400);
                echo json_encode(["error" => "File size exceeds 5MB limit"]);
                break;
            }
            
            try {
                $timestamp = time();
                $publicId = "team-{$timestamp}";
                
                $fileContent = file_get_contents($tmpName);
                if ($fileContent === false) {
                    throw new Exception("Failed to read uploaded file");
                }
                
                // Determine folder based on filename or use team as default
                $uploadFolder = 'team';
                if (strpos($fileName, 'chitthi') !== false) {
                    $uploadFolder = 'riro/chitthi';
                } elseif (strpos($fileName, 'kali') !== false) {
                    $uploadFolder = 'riro/kali';
                } elseif (strpos($fileName, 'dot') !== false) {
                    $uploadFolder = 'riro/dot';
                }
                
                $boundary = uniqid();
                $data = "--{$boundary}\r\n";
                $data .= "Content-Disposition: form-data; name=\"file\"; filename=\"{$fileName}\"\r\n";
                $data .= "Content-Type: {$mimeType}\r\n\r\n";
                $data .= $fileContent . "\r\n";
                $data .= "--{$boundary}\r\n";
                $data .= "Content-Disposition: form-data; name=\"folder\"\r\n\r\n";
                $data .= "{$uploadFolder}\r\n";
                $data .= "--{$boundary}\r\n";
                $data .= "Content-Disposition: form-data; name=\"public_id\"\r\n\r\n";
                $data .= "{$publicId}\r\n";
                $data .= "--{$boundary}\r\n";
                $data .= "Content-Disposition: form-data; name=\"timestamp\"\r\n\r\n";
                $data .= "{$timestamp}\r\n";
                $data .= "--{$boundary}\r\n";
                $data .= "Content-Disposition: form-data; name=\"api_key\"\r\n\r\n";
                $data .= "{$apiKey}\r\n";
                $data .= "--{$boundary}\r\n";
                $data .= "Content-Disposition: form-data; name=\"resource_type\"\r\n\r\n";
                $data .= "image\r\n";
                $data .= "--{$boundary}\r\n";
                $data .= "Content-Disposition: form-data; name=\"overwrite\"\r\n\r\n";
                $data .= "true\r\n";
                $data .= "--{$boundary}\r\n";
                $data .= "Content-Disposition: form-data; name=\"invalidate\"\r\n\r\n";
                $data .= "true\r\n";
                $data .= "--{$boundary}\r\n";
                $data .= "Content-Disposition: form-data; name=\"signature\"\r\n\r\n";
                
                $toSign = "folder={$uploadFolder}&invalidate=true&overwrite=true&public_id={$publicId}&timestamp={$timestamp}";
                $signature = sha1($toSign . $apiSecret);
                $data .= "{$signature}\r\n";
                $data .= "--{$boundary}--\r\n";
                
                $url = "http://api.cloudinary.com/v1_1/{$cloudName}/image/upload";
                
                $context = stream_context_create([
                    "http" => [
                        "method" => "POST",
                        "header" => "Content-Type: multipart/form-data; boundary={$boundary}\r\n" .
                                   "Content-Length: " . strlen($data) . "\r\n",
                        "content" => $data,
                        "ignore_errors" => true,
                        "timeout" => 30
                    ],
                    "ssl" => [
                        "verify_peer" => false,
                        "verify_peer_name" => false,
                        "allow_self_signed" => true
                    ]
                ]);
                
                $response = file_get_contents($url, false, $context);
                
                if ($response !== false) {
                    if (isset($http_response_header)) {
                        $statusLine = $http_response_header[0];
                        $httpCode = (int)preg_split('/\s/', $statusLine)[1];
                        
                        if ($httpCode !== 200) {
                            throw new Exception("Cloudinary API error: " . $response);
                        }
                    }
                    
                    $result = json_decode($response, true);
                    if (!$result || !isset($result["secure_url"])) {
                        throw new Exception("Invalid Cloudinary response");
                    }
                    
                    unlink($tmpName);
                    
                    $cacheBustingUrl = $result["secure_url"] . "?t={$timestamp}";
                    
                    echo json_encode([
                        "success" => true,
                        "imageUrl" => $cacheBustingUrl,
                        "publicId" => $result["public_id"],
                        "timestamp" => $timestamp
                    ]);
                    
                } else {
                    throw new Exception("Failed to make Cloudinary request");
                }
                
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(["error" => "Failed to upload image: " . $e->getMessage()]);
            }
        } else {
            http_response_code(405);
            echo json_encode(["error" => "Method not allowed"]);
        }
        break;
        
    default:
        http_response_code(404);
        echo json_encode(["error" => "Endpoint not found"]);
        break;
}
?>
