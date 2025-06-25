<?php
header('Content-Type: application/json');

$dataFile = 'data/sessions.json';

if (!file_exists($dataFile)) {
    echo json_encode([]);
    exit;
}

$sessions = json_decode(file_get_contents($dataFile), true);
if (!is_array($sessions)) {
    $sessions = [];
}

// Add formatted date strings for display and ensure tag field exists
foreach ($sessions as &$session) {
    $session['formatted_date'] = date('Y-m-d H:i:s', strtotime($session['timestamp']));
    
    // Ensure tag field exists (for backward compatibility with older records)
    if (!isset($session['tag'])) {
        $session['tag'] = 'Untagged';
    }
}

echo json_encode($sessions);
