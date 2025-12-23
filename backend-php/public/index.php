<?php
// Suppress all PHP errors/warnings to ensure clean JSON output
error_reporting(0);
ini_set('display_errors', 0);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

function log_debug($label, $data = null) {
    error_log(
        '[GALLERY DEBUG] ' . $label . 
        ($data !== null ? ' => ' . print_r($data, true) : '')
    );
}

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
    error_log("API HIT: /api/galleries");

    try {
        error_log("Fetching subfolders from Cloudinary: riro");
        $result = $cloudinary->adminApi()->subFolders('riro');

        error_log("Folders found: " . json_encode($result['folders']));

        $galleries = [];

        foreach ($result['folders'] as $folder) {
            error_log("Processing folder: " . $folder['path']);

            try {
                $searchResult = $cloudinary->searchApi()
                    ->expression("folder:{$folder['path']} AND public_id:thumbnail*")
                    ->maxResults(1)
                    ->execute();

                error_log("Search result: " . json_encode($searchResult));

                $thumbnail =
                    $searchResult['resources'][0]['public_id']
                    ?? "{$folder['path']}/thumbnail_a2m8vf";

                error_log("Thumbnail selected: " . $thumbnail);

                $galleries[] = [
                    'id'          => $folder['name'],
                    'title'       => $folder['name'],
                    'folder'      => $folder['path'],
                    'thumbnail'   => $thumbnail,
                    'description' => 'Behind the scenes of our latest film productions',
                ];
            } catch (Exception $e) {
                error_log("Folder error ({$folder['name']}): " . $e->getMessage());

                $galleries[] = [
                    'id'          => $folder['name'],
                    'title'       => $folder['name'],
                    'folder'      => $folder['path'],
                    'thumbnail'   => "{$folder['path']}/thumbnail_a2m8vf",
                    'description' => 'Behind the scenes of our latest film productions',
                ];
            }
        }

        error_log("Final galleries payload: " . json_encode($galleries));

        echo json_encode($galleries);
    } catch (Exception $e) {
        error_log("API ERROR /api/galleries: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    break;



    case (preg_match("#^/api/gallery/(.+)$#", $path, $matches) ? true : false):
    $folder = $matches[1];
    $folderPath = "riro/{$folder}";

    try {
        log_debug('Fetching gallery images', $folderPath);

        $result = $cloudinary->searchApi()
            ->expression("folder:{$folderPath}")
            ->sortBy('created_at', 'asc')
            ->maxResults(100)
            ->execute();

        log_debug('Gallery search result', $result);

        echo json_encode($result['resources']);
    } catch (Exception $e) {
        log_debug('Gallery fetch error', $e->getMessage());
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
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
