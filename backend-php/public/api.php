<?php
// Set headers
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit(0);
}

// Get the request
$path = isset($_GET["path"]) ? $_GET["path"] : "";
$method = $_SERVER["REQUEST_METHOD"];

// Handle different endpoints
switch ($path) {
    case "health":
        echo json_encode(["status" => "OK", "timestamp" => date("c")]);
        break;
        
    case "team":
        $teamFile = __DIR__ . "/../data/teamData.json";
        if (file_exists($teamFile)) {
            echo file_get_contents($teamFile);
        } else {
            echo json_encode(["coreTeam" => [], "collaborators" => ["directors" => [], "dop" => []]]);
        }
        break;
        
    case "projects":
        $projectsFile = __DIR__ . "/../data/projectsData.json";
        if (file_exists($projectsFile)) {
            echo file_get_contents($projectsFile);
        } else {
            echo json_encode(["s1" => [], "s2" => [], "s3" => [], "s4" => [], "s5" => []]);
        }
        break;
        
    default:
        if (strpos($path, "projects/") === 0) {
            $season = substr($path, 9);
            $projectsFile = __DIR__ . "/../data/projectsData.json";
            if (file_exists($projectsFile)) {
                $data = json_decode(file_get_contents($projectsFile), true);
                if (isset($data[$season])) {
                    echo json_encode($data[$season]);
                } else {
                    http_response_code(404);
                    echo json_encode(["error" => "Season not found"]);
                }
            } else {
                echo json_encode([]);
            }
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Route not found"]);
        }
        break;
}
?>
