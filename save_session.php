<?php
header('Content-Type: application/json');

// Create data directory if it doesn't exist
if (!file_exists('data')) {
    mkdir('data', 0755, true);
}

// Get the raw POST data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validate input
if (!isset($data['duration']) || !isset($data['notes']) || !isset($data['timestamp']) || !isset($data['tag'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid data format']);
    exit;
}

// Prepare session data
$session = [
    'duration' => (int)$data['duration'],
    'notes' => $data['notes'],
    'tag' => $data['tag'],
    'timestamp' => $data['timestamp'],
    'formatted_duration' => gmdate("H:i:s", $data['duration'])
];

// Load existing sessions or create new array
$sessions = [];
$dataFile = 'data/sessions.json';

if (file_exists($dataFile)) {
    $sessions = json_decode(file_get_contents($dataFile), true);
    if (!is_array($sessions)) {
        $sessions = [];
    }
}

// Add new session
$sessions[] = $session;

// Save to file
if (file_put_contents($dataFile, json_encode($sessions, JSON_PRETTY_PRINT))) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save data']);
}
