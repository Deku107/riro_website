<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// Suppress errors for production
// error_reporting(0);
// ini_set('display_errors', 0);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Simple in-memory cache
$cache = [];
$cache_ttl = 300; // 5 minutes

function getCacheKey($key) {
    return $key;
}

function getCached($key, $ttl = 300) {
    global $cache;
    $cacheKey = getCacheKey($key);
    if (isset($cache[$cacheKey]) && (time() - $cache[$cacheKey]['timestamp']) < $ttl) {
        return $cache[$cacheKey]['data'];
    }
    return null;
}

function setCache($key, $data) {
    global $cache;
    $cacheKey = getCacheKey($key);
    $cache[$cacheKey] = [
        'data' => $data,
        'timestamp' => time()
    ];
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
        header("Content-Type: application/json");

        $conn = new mysqli("162.222.225.87", "riro", "Riro@2025@", "rirotpyt_");

        if ($conn->connect_error) {
            http_response_code(500);
            echo json_encode(["error" => "Database connection failed"]);
            break;
        }

        // Query team data
        $sql = "SELECT * FROM team";
        $result = $conn->query($sql);

        if ($result && $result->num_rows > 0) {
            $team = [];

            while ($row = $result->fetch_assoc()) {
                $team[] = $row;
            }

            echo json_encode($team);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "No team data found"]);
        }

        $conn->close();
        break;
    
    case "/api/team/save":
        header("Content-Type: application/json");

        if ($method !== "POST") {
            http_response_code(405);
            echo json_encode(["error" => "Method not allowed"]);
            break;
        }

        try {
            require_once __DIR__ . "/db.php";

            $input = file_get_contents("php://input");
            $data = json_decode($input, true);

            if (!is_array($data)) {
                throw new Exception("Invalid JSON payload");
            }

            $pdo->beginTransaction();

            $stmt = $pdo->prepare("
                INSERT INTO team
                (id, name, role, description, imageAlt, bgColor, type, image,
                imageZoom, image_position_x, image_position_y)
                VALUES
                (:id, :name, :role, :description, :imageAlt, :bgColor, :type, :image,
                :imageZoom, :image_position_x, :image_position_y)
                ON DUPLICATE KEY UPDATE
                    name = VALUES(name),
                    role = VALUES(role),
                    description = VALUES(description),
                    imageAlt = VALUES(imageAlt),
                    bgColor = VALUES(bgColor),
                    type = VALUES(type),
                    image = VALUES(image),
                    imageZoom = VALUES(imageZoom),
                    image_position_x = VALUES(image_position_x),
                    image_position_y = VALUES(image_position_y)
            ");

            foreach ($data as $member) {
                $stmt->execute([
                    ":id" => $member["id"],
                    ":name" => $member["name"] ?? null,
                    ":role" => $member["role"] ?? null,
                    ":description" => $member["description"] ?? null,
                    ":imageAlt" => $member["imageAlt"] ?? null,
                    ":bgColor" => $member["bgColor"] ?? null,
                    ":type" => $member["type"] ?? null,
                    ":image" => $member["image"] ?? null,
                    ":imageZoom" => $member["imageZoom"] ?? null,
                    ":image_position_x" => $member["image_position_x"] ?? null,
                    ":image_position_y" => $member["image_position_y"] ?? null
                ]);
            }

            $pdo->commit();

            echo json_encode([
                "success" => true,
                "count" => count($data)
            ]);

        } catch (Throwable $e) {
            if (isset($pdo) && $pdo->inTransaction()) {
                $pdo->rollBack();
            }

            http_response_code(500);
            echo json_encode([
                "error" => $e->getMessage()
            ]);
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

    case "/api/team/delete":
        if ($method !== "DELETE") break;
        require_once __DIR__ . "/db.php";
        $id = $_GET['id'];

        $stmt = $pdo->prepare("DELETE FROM team WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode(["success" => true]);
        break;

    case "/api/projects":
        require_once __DIR__ . "/db.php"; // adjust path if needed

        $response = [
            "s1" => [],
            "s2" => [],
            "s3" => [],
            "s4" => [],
            "s5" => []
        ];

        try {
            $sql = "SELECT * FROM films ORDER BY created_at ASC";
            $stmt = $pdo->query($sql);

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {

                $film = [
                    "id" => $row["id"],
                    "title" => $row["title"],
                    "director" => $row["director"],
                    "year" => (string) $row["year"],
                    "description" => $row["description"],
                    "thumbnailUrl" => $row["thumbnail_url"],
                    "youtubeEmbedUrl" => $row["youtube_embed_url"],
                    "youtubeUrl" => $row["youtube_url"],
                    "cast" => json_decode($row["cast"], true) ?? [],
                    "crew" => json_decode($row["crew"], true) ?? []
                ];

                if (isset($response[$row["section"]])) {
                    $response[$row["section"]][] = $film;
                }
            }

            echo json_encode(
                $response,
                JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
            );

        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to fetch projects"]);
        }

        break;

        
    case "/api/projects/save":
        if ($method !== "POST") {
            http_response_code(405);
            echo json_encode(["error" => "Method not allowed"]);
            break;
        }

        require_once __DIR__ . "/db.php";

        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid JSON"]);
            break;
        }

        $sql = "
            INSERT INTO films
            (id, section, title, director, year, description,
            thumbnail_url, youtube_embed_url, youtube_url, cast, crew)
            VALUES
            (:id, :section, :title, :director, :year, :description,
            :thumbnail_url, :youtube_embed_url, :youtube_url, :cast, :crew)
            ON DUPLICATE KEY UPDATE
                section = VALUES(section),
                title = VALUES(title),
                director = VALUES(director),
                year = VALUES(year),
                description = VALUES(description),
                thumbnail_url = VALUES(thumbnail_url),
                youtube_embed_url = VALUES(youtube_embed_url),
                youtube_url = VALUES(youtube_url),
                cast = VALUES(cast),
                crew = VALUES(crew)
        ";

        $stmt = $pdo->prepare($sql);

        foreach ($data as $section => $films) {
            foreach ($films as $film) {
                $stmt->execute([
                    ":id" => $film["id"],
                    ":section" => $section,
                    ":title" => $film["title"] ?? "",
                    ":director" => $film["director"] ?? "",
                    ":year" => (int)$film["year"],
                    ":description" => $film["description"] ?? "",
                    ":thumbnail_url" => $film["thumbnailUrl"] ?? "",
                    ":youtube_embed_url" => $film["youtubeEmbedUrl"] ?? "",
                    ":youtube_url" => $film["youtubeUrl"] ?? "",
                    ":cast" => json_encode($film["cast"] ?? []),
                    ":crew" => json_encode($film["crew"] ?? [])
                ]);
            }
        }

        echo json_encode(["success" => true]);
        break;

    case "/api/projects/delete":
        if ($method !== "DELETE") break;

        require_once __DIR__ . "/db.php";

        $id = $_GET["id"] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(["error" => "Missing ID"]);
            break;
        }

        $stmt = $pdo->prepare("DELETE FROM films WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode(["success" => true]);
        break;

        
    case (preg_match("#^/api/projects/(.+)$#", $path, $matches) ? true : false):
        $season = $matches[1];
        $projectsFile = __DIR__ . "/data/projectsData.json";
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
        



    case "/api/galleries":

        // Check cache first
        $cached = getCached('galleries');
        if ($cached) {
            echo json_encode($cached);
            break;
        }

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
                CURLOPT_TIMEOUT => 10,
            ]);

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpCode !== 200) {
                throw new Exception("Folder fetch failed: HTTP {$httpCode} - {$response}");
            }

            $result = json_decode($response, true);
            $galleries = [];

            // 2. For each folder, search for its thumbnail
            foreach ($result['folders'] ?? [] as $folder) {
                $thumbnail = null;
                
                // Search for thumbnail in this specific folder
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
                    CURLOPT_TIMEOUT => 5,
                ]);

                $searchResponse = curl_exec($ch);
                $searchCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                curl_close($ch);

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

            // Cache the result
            setCache('galleries', $galleries);
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
                CURLOPT_TIMEOUT => 15,
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

  

        
    case "/api/services":
        // Check cache first
        $cached = getCached('services');
        if ($cached) {
            echo json_encode($cached);
            break;
        }
        
        $servicesFile = __DIR__ . "/data/servicesData.json";
        if (file_exists($servicesFile)) {
            $servicesData = json_decode(file_get_contents($servicesFile), true);
            setCache('services', $servicesData);
            echo json_encode($servicesData);
        } else {
            $defaultServices = [
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
            ];
            setCache('services', $defaultServices);
            echo json_encode($defaultServices);
        }
        break;
        
    case "/api/services/save":
        if ($method === "POST") {
            $input = file_get_contents('php://input');
            $data = json_decode($input, true);
            if ($data) {
                $servicesFile = __DIR__ . "/data/servicesData.json";
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
        
    
        
    default:
        http_response_code(404);
        echo json_encode(["error" => "Endpoint not found"]);
        break;
}
?>
