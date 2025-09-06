<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Get the requested full path after proxy.php/
$script_name = $_SERVER['SCRIPT_NAME']; // /proxy.php
$request_uri = $_SERVER['REQUEST_URI']; // /proxy.php/discover/tv?page=...

// Remove script_name from request_uri to get TMDB endpoint
$tmdb_endpoint = substr($request_uri, strlen($script_name));

// Construct full TMDB URL
$tmdb_base = 'https://api.themoviedb.org/3';
$tmdb_url = $tmdb_base . $tmdb_endpoint;

// If query string present, add it
if (!empty($_SERVER['QUERY_STRING'])) {
    $tmdb_url .= (strpos($tmdb_url, '?') === false ? '?' : '&') . $_SERVER['QUERY_STRING'];
}

// Curl request to TMDB
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $tmdb_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Output response
http_response_code($httpCode);
header('Content-Type: application/json');
echo $response;
?>
