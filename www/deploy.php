<?php

$secret = getenv('GITHUB_DEPLOY_SECRET');
$headers = getallheaders();

// Don't accept anything unless the environment is properly configured
if(empty($secret)) {
	header('HTTP/1.0 500 Server Error');
	return;
}
// Accept only POST JSON requests
if($_SERVER['REQUEST_METHOD'] !== 'POST') {
	header('HTTP/1.0 405 Method Not Supported');
	return;
} else if(empty($headers['content-type']) || $headers['content-type'] !== 'application/json') {
	header('HTTP/1.0 406 Not Acceptable');
	return;
}

// Check signature
$signature = !empty($headers['X-Hub-Signature']) ? $headers['X-Hub-Signature'] : null;
if(empty($signature)) {
	header('HTTP/1.0 400 Bad Request: Missing Signature');
	return;
}

$payload = file_get_contents('php://input');
list($algo, $givenSignature) = explode('=', $signature, 2);
if(!in_array($algo, hash_algos(), true)) {
	header('HTTP/1.0 500 Algorithm unsupported');
	return;
}
$expectedSig = hash_hmac($algo, $payload, $secret);

if($givenSignature !== $expectedSig) {
	header('HTTP/1.0 400 Bad Request: Invalid Signature');
	return;
}

$json = json_decode($payload, true);

// Only listen for master pushes
if($json['ref'] !== 'refs/heads/master') {
    print_r(array(
        'message' => 'skipped',
        'success' => false,
    ));
    return;
}

// Run the update
$command = '../environment/scripts/deploy.sh';

print_r(array(
	'message' => 'ok',
	'success' => shell_exec($command) !== null,
));
